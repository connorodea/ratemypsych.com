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
import { PenLine, CheckCircle2 } from "lucide-react"

interface ReviewFormProps {
  psychiatristId: string
}

export function ReviewForm({ psychiatristId }: ReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, this would send the review to a database
    // All reviews are submitted anonymously to protect patient privacy
    console.log("Review submitted:", {
      psychiatristId,
      rating,
      title,
      content,
      authorName: "Anonymous",
    })

    setSubmitted(true)
    
    // Reset form after delay
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
      setRating(0)
      setTitle("")
      setContent("")
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

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid}>
                  Submit Review
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
