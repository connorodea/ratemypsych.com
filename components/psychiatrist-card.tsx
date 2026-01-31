import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { MapPin, User } from "lucide-react"
import type { ProviderCard } from "@/lib/types"

interface PsychiatristCardProps {
  psychiatrist: ProviderCard
}

export function PsychiatristCard({ psychiatrist }: PsychiatristCardProps) {
  return (
    <Link href={`/psychiatrist/${psychiatrist.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg truncate">
                {psychiatrist.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {psychiatrist.credential || "Psychiatrist"}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={psychiatrist.rating} size="sm" showValue />
                <span className="text-sm text-muted-foreground">
                  ({psychiatrist.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {psychiatrist.location.city || "Unknown City"}, {psychiatrist.location.state || "US"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {psychiatrist.specialty.slice(0, 3).map((spec) => (
                  <Badge key={spec} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
              <div className="mt-3">
                {psychiatrist.acceptingNewPatients === true ? (
                  <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-xs">
                    Accepting New Patients
                  </Badge>
                ) : psychiatrist.acceptingNewPatients === false ? (
                  <Badge variant="outline" className="text-xs">
                    Not Accepting Patients
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Availability Unknown
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
