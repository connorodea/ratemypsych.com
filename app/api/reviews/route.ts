import { NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const reviewSchema = z.object({
  providerId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120),
  content: z.string().min(20).max(2000),
  isAnonymous: z.boolean().optional(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review data." }, { status: 400 })
  }

  const provider = await prisma.provider.findUnique({
    where: { id: parsed.data.providerId },
  })

  if (!provider) {
    return NextResponse.json({ error: "Provider not found." }, { status: 404 })
  }

  const existingReview = await prisma.review.findFirst({
    where: { providerId: provider.id, userId: session.user.id },
  })

  if (existingReview) {
    return NextResponse.json(
      { error: "You have already reviewed this provider." },
      { status: 409 }
    )
  }

  const status = "APPROVED"
  const review = await prisma.review.create({
    data: {
      providerId: provider.id,
      userId: session.user.id,
      rating: parsed.data.rating,
      title: parsed.data.title,
      content: parsed.data.content,
      isAnonymous: parsed.data.isAnonymous ?? true,
      status,
    },
  })

  const newReviewCount = provider.reviewCount + 1
  const newAverage =
    (provider.averageRating * provider.reviewCount + parsed.data.rating) /
    newReviewCount

  await prisma.provider.update({
    where: { id: provider.id },
    data: {
      reviewCount: newReviewCount,
      averageRating: newAverage,
    },
  })

  return NextResponse.json({ id: review.id })
}
