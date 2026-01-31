import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim() || ""
  const specialty = searchParams.get("specialty")?.trim() || ""
  const state = searchParams.get("state")?.trim() || ""
  const acceptingOnly = searchParams.get("acceptingOnly") === "true"
  const sort = searchParams.get("sort") || "rating"
  const take = Math.min(parseInt(searchParams.get("take") || "50", 10), 100)
  const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10), 0)

  const where = {
    active: true,
    ...(state && state !== "all" ? { practiceState: state } : {}),
    ...(specialty && specialty !== "all" ? { specialties: { has: specialty } } : {}),
    ...(acceptingOnly ? { acceptingNewPatients: true } : {}),
    ...(query
      ? {
          OR: [
            { fullName: { contains: query, mode: "insensitive" as const } },
            { practiceCity: { contains: query, mode: "insensitive" as const } },
            { specialties: { has: query } },
          ],
        }
      : {}),
  }

  const orderBy =
    sort === "name"
      ? { fullName: "asc" as const }
      : sort === "reviews"
        ? { reviewCount: "desc" as const }
        : { averageRating: "desc" as const }

  const providers = await prisma.provider.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  return NextResponse.json({
    providers: providers.map((provider) => ({
      id: provider.id,
      slug: provider.slug,
      name: provider.fullName,
      credential: provider.credential,
      specialty: provider.specialties,
      location: {
        city: provider.practiceCity,
        state: provider.practiceState,
        address: provider.practiceAddress1,
      },
      rating: provider.averageRating,
      reviewCount: provider.reviewCount,
      acceptingNewPatients: provider.acceptingNewPatients,
    })),
  })
}
