import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StarRating } from "@/components/star-rating"
import { ReviewCard } from "@/components/review-card"
import { ReviewForm } from "@/components/review-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from "@/lib/db"
import type { ReviewItem } from "@/lib/types"
import { 
  MapPin, 
  Phone, 
  Clock, 
  GraduationCap, 
  Languages, 
  Shield,
  User,
  CheckCircle2,
  XCircle
} from "lucide-react"

interface PageProps {
  params: { id: string }
}

function toReviewItem(review: {
  id: string
  rating: number
  title: string
  content: string
  createdAt: Date
  helpfulCount: number
  isAnonymous: boolean
  user: { name: string | null }
}): ReviewItem {
  return {
    id: review.id,
    rating: review.rating,
    title: review.title,
    content: review.content,
    createdAt: review.createdAt.toISOString(),
    helpfulCount: review.helpfulCount,
    isAnonymous: review.isAnonymous,
    authorName: review.user.name,
    verified: false,
    tags: [],
  }
}

export const revalidate = 60

export default async function PsychiatristPage({ params }: PageProps) {
  const psychiatrist = await prisma.provider.findUnique({
    where: { slug: params.id },
  })

  if (!psychiatrist) {
    notFound()
  }

  const psychiatristReviews = await prisma.review.findMany({
    where: { providerId: psychiatrist.id, status: "APPROVED" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  const reviewItems = psychiatristReviews.map(toReviewItem)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Avatar */}
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <User className="h-14 w-14 md:h-18 md:w-18 text-muted-foreground" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {psychiatrist.fullName}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {psychiatrist.credential || "Psychiatrist"}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <StarRating rating={psychiatrist.averageRating} size="md" showValue />
                  <span className="text-muted-foreground">
                    ({psychiatrist.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {psychiatrist.specialties.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2">
                  {psychiatrist.acceptingNewPatients === true ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Accepting New Patients
                    </Badge>
                  ) : psychiatrist.acceptingNewPatients === false ? (
                    <Badge variant="outline">
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Not Accepting New Patients
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Availability Unknown
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({reviewItems.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Biography</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {psychiatrist.bio || "No biography has been added yet."}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education & Training
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {psychiatrist.education.length > 0 ? (
                        <ul className="space-y-2">
                          {psychiatrist.education.map((edu, index) => (
                            <li key={index} className="text-muted-foreground">
                              {edu}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          Education details are not available yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        Languages Spoken
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {psychiatrist.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {psychiatrist.languages.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Language details are not available yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  {/* Review Summary */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="text-center md:text-left">
                          <p className="text-5xl font-bold text-foreground mb-2">
                            {psychiatrist.averageRating.toFixed(1)}
                          </p>
                          <StarRating rating={psychiatrist.averageRating} size="md" />
                          <p className="text-sm text-muted-foreground mt-2">
                            Based on {psychiatrist.reviewCount} reviews
                          </p>
                        </div>
                        <div className="flex-1">
                          <ReviewForm providerId={psychiatrist.id} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  {reviewItems.length > 0 ? (
                    <div className="space-y-4">
                      {reviewItems.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                          No reviews yet. Be the first to share your experience!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    {psychiatrist.practiceAddress1 || "Address not listed"}
                  </p>
                  <p className="text-muted-foreground">
                    {psychiatrist.practiceCity || "City"}, {psychiatrist.practiceState || "US"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {psychiatrist.practicePhone ? (
                    <p className="text-muted-foreground">
                      {psychiatrist.practicePhone}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Contact the office directly for appointments.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {psychiatrist.acceptingNewPatients === true ? (
                    <p className="text-emerald-600 font-medium">
                      Currently accepting new patients
                    </p>
                  ) : psychiatrist.acceptingNewPatients === false ? (
                    <p className="text-muted-foreground">
                      Not accepting new patients at this time
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Availability not listed
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance Accepted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {psychiatrist.insuranceAccepted.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {psychiatrist.insuranceAccepted.map((insurance) => (
                        <Badge key={insurance} variant="outline" className="text-xs">
                          {insurance}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Insurance information is not available yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
