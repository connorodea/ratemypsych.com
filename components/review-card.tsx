"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { ThumbsUp, CheckCircle } from "lucide-react"
import type { ReviewItem } from "@/lib/types"
import { useState } from "react"

interface ReviewCardProps {
  review: ReviewItem
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount)
  const [hasVoted, setHasVoted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleHelpful = async () => {
    if (hasVoted || isSubmitting) return
    setIsSubmitting(true)
    setHelpfulCount((prev) => prev + 1)
    setHasVoted(true)
    try {
      await fetch("/api/reviews/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.id }),
      })
    } catch {
      setHelpfulCount((prev) => Math.max(prev - 1, 0))
      setHasVoted(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-foreground">
                {review.isAnonymous ? "Anonymous" : review.authorName || "Anonymous"}
              </span>
              {review.verified && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Patient
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(review.createdAt)}
            </p>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>

        <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {review.content}
        </p>

        {review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {review.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            disabled={hasVoted}
            className="text-muted-foreground"
          >
            <ThumbsUp className="h-4 w-4 mr-1.5" />
            Helpful ({helpfulCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
