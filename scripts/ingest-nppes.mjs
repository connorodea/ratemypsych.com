import fs from "node:fs"
import path from "node:path"
import { pipeline } from "node:stream/promises"
import { fileURLToPath } from "node:url"
import unzipper from "unzipper"
import { parse } from "csv-parse"
import { PrismaClient } from "@prisma/client"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.split("=")
    return [key.replace(/^--/, ""), value ?? true]
  })
)

const sourceUrl = args.get("url") || process.env.NPPES_SOURCE_URL
const zipPath =
  args.get("zip") ||
  path.join(__dirname, "..", "data", "nppes.zip")
const limit = args.get("limit") ? Number(args.get("limit")) : null

const prisma = new PrismaClient()

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

async function downloadZip() {
  const resolvedUrl = sourceUrl || (await resolveLatestUrl())
  if (!resolvedUrl) {
    throw new Error("NPPES source URL not provided.")
  }
  await fs.promises.mkdir(path.dirname(zipPath), { recursive: true })
  console.log(`Downloading NPPES data from ${resolvedUrl}`)
  const response = await fetch(resolvedUrl)
  if (!response.ok) {
    throw new Error(`Failed to download NPPES zip: ${response.status}`)
  }
  const fileStream = fs.createWriteStream(zipPath)
  await pipeline(response.body, fileStream)
}

function normalize(value) {
  return typeof value === "string" ? value.trim() : ""
}

async function loadTaxonomyMap(zip) {
  const taxonomyEntry = zip.files.find((file) =>
    /taxonom|code.*value/i.test(file.path)
  )
  if (!taxonomyEntry) return new Map()

  const map = new Map()
  const parser = parse({
    columns: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  })

  taxonomyEntry
    .stream()
    .pipe(parser)
    .on("data", (row) => {
      const code = normalize(row["Code"] || row["Healthcare Provider Taxonomy Code"])
      const classification = normalize(row["Classification"] || row["Classification Name"])
      const specialization = normalize(row["Specialization"] || row["Specialization Name"])
      if (code) {
        map.set(code, { classification, specialization })
      }
    })

  await new Promise((resolve, reject) => {
    parser.on("end", resolve)
    parser.on("error", reject)
  })

  return map
}

async function findMainDataEntry(zip) {
  const candidates = zip.files.filter(
    (file) =>
      file.type === "File" &&
      file.path.toLowerCase().endsWith(".csv") &&
      /npidata|nppes/i.test(file.path) &&
      !/header|code|value|endpoint|other/i.test(file.path)
  )
  if (candidates.length === 0) {
    throw new Error("Unable to locate NPPES data CSV in zip.")
  }
  return candidates.sort((a, b) => b.uncompressedSize - a.uncompressedSize)[0]
}

function isPsychiatryCode(code, taxonomyMap) {
  if (!taxonomyMap.size) {
    return code.startsWith("2084P")
  }
  const info = taxonomyMap.get(code)
  const classification = info?.classification?.toLowerCase() || ""
  const specialization = info?.specialization?.toLowerCase() || ""
  return classification.includes("psychiatry") || specialization.includes("psychiatry")
}

async function run() {
  if (!fs.existsSync(zipPath)) {
    await downloadZip()
  }

  const zip = await unzipper.Open.file(zipPath)
  const taxonomyMap = await loadTaxonomyMap(zip)
  const dataEntry = await findMainDataEntry(zip)

  const ingestion = await prisma.providerIngestion.create({
    data: {
      sourceUrl: sourceUrl || "auto",
      sourceFile: path.basename(zipPath),
    },
  })

  let processed = 0
  let created = 0
  let updated = 0
  let skipped = 0
  let errorCount = 0

  const parser = parse({
    columns: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  })

  const tasks = []
  const maxConcurrency = 25

  const flushTasks = async () => {
    if (tasks.length === 0) return
    await Promise.all(tasks.splice(0, tasks.length))
  }

  dataEntry
    .stream()
    .pipe(parser)
    .on("data", (row) => {
      if (limit && processed >= limit) return

      processed += 1
      const entityType = normalize(row["Entity Type Code"])
      if (entityType !== "1") {
        skipped += 1
        return
      }

      const npi = normalize(row["NPI"])
      if (!npi) {
        skipped += 1
        return
      }

      const taxonomyCodes = []
      for (let i = 1; i <= 15; i += 1) {
        const code = normalize(row[`Healthcare Provider Taxonomy Code_${i}`])
        if (code) taxonomyCodes.push(code)
      }

      const psychiatryCodes = taxonomyCodes.filter((code) =>
        isPsychiatryCode(code, taxonomyMap)
      )

      if (psychiatryCodes.length === 0) {
        skipped += 1
        return
      }

      const firstName = normalize(row["Provider First Name"])
      const lastName = normalize(row["Provider Last Name (Legal Name)"] || row["Provider Last Name"])
      if (!firstName || !lastName) {
        skipped += 1
        return
      }

      const middleName = normalize(row["Provider Middle Name"])
      const credential = normalize(row["Provider Credential Text"])
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ")

      const specialties = psychiatryCodes
        .map((code) => taxonomyMap.get(code)?.specialization || taxonomyMap.get(code)?.classification)
        .filter(Boolean)
      const uniqueSpecialties = [...new Set(specialties.length ? specialties : ["Psychiatry"])]

      const slug = slugify(`${fullName}-${npi}`)

      const data = {
        npi,
        slug,
        firstName,
        lastName,
        middleName: middleName || null,
        credential: credential || null,
        fullName,
        gender: normalize(row["Provider Gender Code"]) || null,
        taxonomyCodes,
        specialties: uniqueSpecialties,
        practiceAddress1: normalize(row["Provider Business Practice Location Address Line 1"]) || null,
        practiceAddress2: normalize(row["Provider Business Practice Location Address Line 2"]) || null,
        practiceCity: normalize(row["Provider Business Practice Location Address City Name"]) || null,
        practiceState: normalize(row["Provider Business Practice Location Address State Name"]) || null,
        practicePostalCode: normalize(row["Provider Business Practice Location Address Postal Code"]) || null,
        practicePhone: normalize(row["Provider Business Practice Location Address Telephone Number"]) || null,
        deactivationDate: normalize(row["NPI Deactivation Date"])
          ? new Date(row["NPI Deactivation Date"])
          : null,
        reactivationDate: normalize(row["NPI Reactivation Date"])
          ? new Date(row["NPI Reactivation Date"])
          : null,
        lastUpdated: normalize(row["Last Update Date"])
          ? new Date(row["Last Update Date"])
          : null,
        active: !normalize(row["NPI Deactivation Date"]),
      }

      tasks.push(
        prisma.provider
          .upsert({
            where: { npi },
            update: data,
            create: data,
          })
          .then(() => {
            updated += 1
          })
          .catch((error) => {
            errorCount += 1
            console.error(`Failed to upsert ${npi}:`, error.message)
          })
      )

      if (tasks.length >= maxConcurrency) {
        parser.pause()
        flushTasks()
          .catch((error) => {
            console.error("Batch flush failed:", error.message)
          })
          .finally(() => parser.resume())
      }
    })

  await new Promise((resolve, reject) => {
    parser.on("end", resolve)
    parser.on("error", reject)
  })

  await flushTasks()

  await prisma.providerIngestion.update({
    where: { id: ingestion.id },
    data: {
      completedAt: new Date(),
      processed,
      created,
      updated,
      skipped,
      errorCount,
    },
  })
}

run()
  .catch(async (error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
async function resolveLatestUrl() {
  const response = await fetch("https://download.cms.gov/nppes/NPI_Files.html")
  if (!response.ok) {
    throw new Error("Failed to load NPPES file index.")
  }

  const html = await response.text()
  const matches = [
    ...html.matchAll(/NPPES_Data_Dissemination_\\d+\\.zip/g),
  ]
  if (!matches.length) {
    throw new Error("Unable to locate NPPES zip URL in index.")
  }

  const urls = matches.map((match) => `https://download.cms.gov/nppes/${match[0]}`)
  urls.sort((a, b) => b.localeCompare(a))
  return urls[0]
}
