"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { SearchForm } from "@/components/search-form"
import { PsychiatristCard } from "@/components/psychiatrist-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { psychiatrists } from "@/lib/data"
import { SlidersHorizontal } from "lucide-react"

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const specialty = searchParams.get("specialty") || ""
  const state = searchParams.get("state") || ""
  
  const [sortBy, setSortBy] = useState("rating")
  const [acceptingOnly, setAcceptingOnly] = useState(false)

  const filteredResults = useMemo(() => {
    let results = [...psychiatrists]

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.specialty.some((s) => s.toLowerCase().includes(lowerQuery)) ||
          p.bio.toLowerCase().includes(lowerQuery)
      )
    }

    // Filter by specialty
    if (specialty && specialty !== "all") {
      results = results.filter((p) =>
        p.specialty.some((s) => s.toLowerCase() === specialty.toLowerCase())
      )
    }

    // Filter by state
    if (state && state !== "all") {
      results = results.filter((p) => p.location.state === state)
    }

    // Filter by accepting patients
    if (acceptingOnly) {
      results = results.filter((p) => p.acceptingPatients)
    }

    // Sort results
    if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "reviews") {
      results.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name))
    }

    return results
  }, [query, specialty, state, sortBy, acceptingOnly])

  const searchDescription = useMemo(() => {
    const parts: string[] = []
    if (specialty && specialty !== "all") parts.push(specialty)
    if (state && state !== "all") parts.push(state)
    if (query) parts.push(`"${query}"`)
    
    if (parts.length === 0) return "All Psychiatrists"
    return parts.join(" in ")
  }, [query, specialty, state])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Form */}
      <div className="mb-8">
        <SearchForm
          variant="compact"
          defaultValues={{ query, specialty, state }}
        />
      </div>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {searchDescription}
          </h1>
          <p className="text-muted-foreground">
            {filteredResults.length} psychiatrist{filteredResults.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={acceptingOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setAcceptingOnly(!acceptingOnly)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Accepting Patients
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Grid */}
      {filteredResults.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((psychiatrist) => (
            <PsychiatristCard key={psychiatrist.id} psychiatrist={psychiatrist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No psychiatrists found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try adjusting your search filters or broadening your search terms to find more results.
          </p>
        </div>
      )}
    </div>
  )
}
