"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
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
import type { ProviderCard } from "@/lib/types"
import { SlidersHorizontal } from "lucide-react"

export function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const specialty = searchParams.get("specialty") || ""
  const state = searchParams.get("state") || ""
  
  const sortParam = searchParams.get("sort") || "rating"
  const acceptingParam = searchParams.get("acceptingOnly") === "true"
  const [sortBy, setSortBy] = useState(sortParam)
  const [acceptingOnly, setAcceptingOnly] = useState(acceptingParam)
  const [results, setResults] = useState<ProviderCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.push(`/search?${params.toString()}`)
  }

  useEffect(() => {
    setSortBy(sortParam)
  }, [sortParam])

  useEffect(() => {
    setAcceptingOnly(acceptingParam)
  }, [acceptingParam])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (specialty) params.set("specialty", specialty)
    if (state) params.set("state", state)
    params.set("sort", sortBy)
    if (acceptingOnly) params.set("acceptingOnly", "true")

    setIsLoading(true)
    setError(null)

    fetch(`/api/providers?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load providers.")
        }
        return response.json()
      })
      .then((payload) => {
        setResults(payload.providers || [])
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Unable to load providers.")
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
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
            {results.length} psychiatrist{results.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={acceptingOnly ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateParams({ acceptingOnly: acceptingOnly ? null : "true" })
            }
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Accepting Patients
          </Button>
          <Select
            value={sortBy}
            onValueChange={(value) => updateParams({ sort: value })}
          >
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
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-muted-foreground">{error}</div>
      ) : results.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((psychiatrist) => (
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
