import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"

const helpfulSchema = z.object({
  reviewId: z.string().min(1),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = helpfulSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  await prisma.review.update({
    where: { id: parsed.data.reviewId },
    data: { helpfulCount: { increment: 1 } },
  })

  return NextResponse.json({ ok: true })
}
