"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/star-rating"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { signIn, useSession } from "next-auth/react"
import { PenLine, CheckCircle2 } from "lucide-react"

interface ReviewFormProps {
  providerId: string
}

export function ReviewForm({ providerId }: ReviewFormProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!session?.user) {
      await signIn()
      return
    }

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId,
        rating,
        title,
        content,
        isAnonymous,
      }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setError(payload?.error || "Unable to submit review.")
      return
    }

    setSubmitted(true)

    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setRating(0)
      setTitle("")
      setContent("")
      setIsAnonymous(true)
    }, 2000)
  }

  const isValid = rating > 0 && title.trim() && content.trim().length >= 20

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PenLine className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Thank You!
            </h3>
            <p className="text-muted-foreground">
              Your review has been submitted and will help others find the right care.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience to help others find the right psychiatrist.
                All reviews are submitted anonymously to protect your privacy.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {!session?.user && (
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                  Please sign in to submit a review.
                </div>
              )}
              {/* Rating */}
              <div className="space-y-2">
                <Label>Your Rating *</Label>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={rating}
                    size="lg"
                    interactive
                    onRatingChange={setRating}
                  />
                  {rating > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {rating} star{rating !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Review Title *</Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Your Review *</Label>
                <Textarea
                  id="content"
                  placeholder="Share details about your experience. What was helpful? How was the communication? Would you recommend this psychiatrist?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 20 characters. {content.length}/20
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <Label className="text-sm">Post anonymously</Label>
                  <p className="text-xs text-muted-foreground">
                    Your name will not be shown publicly.
                  </p>
                </div>
                <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || !session?.user}>
                  Submit Review
                </Button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
