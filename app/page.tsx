import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchForm } from "@/components/search-form"
import { PsychiatristCard } from "@/components/psychiatrist-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { psychiatrists, specialties } from "@/lib/data"
import { Shield, MessageSquare, Search, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const topRated = psychiatrists.slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Find the Right Psychiatrist for You
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Read honest reviews from real patients. Search thousands of psychiatrists across the United States.
              </p>
            </div>
            <SearchForm />
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <span className="text-sm text-muted-foreground">Popular searches:</span>
              {["Anxiety", "Depression", "ADHD", "Bipolar"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${term}`}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">10,000+</p>
                <p className="text-sm text-muted-foreground">Psychiatrists Listed</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">50,000+</p>
                <p className="text-sm text-muted-foreground">Patient Reviews</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">50</p>
                <p className="text-sm text-muted-foreground">States Covered</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">4.5</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Why Use RateMyPsych?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We make it easy to find trusted mental health professionals through verified patient feedback.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm bg-secondary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Easy Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Find psychiatrists by location, specialty, or insurance accepted.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-secondary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Real Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Read honest feedback from verified patients about their experiences.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-secondary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Anonymous & Safe</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your experience anonymously to help others find care.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-secondary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Join thousands helping each other find quality mental health care.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Top Rated Psychiatrists
                </h2>
                <p className="text-muted-foreground">
                  Highly recommended by patients across the country.
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex bg-transparent">
                <Link href="/search">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRated.map((psychiatrist) => (
                <PsychiatristCard key={psychiatrist.id} psychiatrist={psychiatrist} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/search">
                  View All Psychiatrists
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Browse by Specialty */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Browse by Specialty
              </h2>
              <p className="text-muted-foreground">
                Find psychiatrists who specialize in your specific needs.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {specialties.map((specialty) => (
                <Link
                  key={specialty}
                  href={`/search?specialty=${encodeURIComponent(specialty)}`}
                >
                  <Button variant="outline" className="rounded-full bg-transparent">
                    {specialty}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Share Your Experience
            </h2>
            <p className="text-primary-foreground/80 mb-8 leading-relaxed">
              Help others find the right care by sharing your experience with your psychiatrist. 
              All reviews are anonymous and help build a supportive community.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/search">
                Write a Review
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
