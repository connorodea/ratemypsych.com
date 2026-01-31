"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { specialties, states } from "@/lib/data"

interface SearchFormProps {
  variant?: "hero" | "compact"
  defaultValues?: {
    query?: string
    specialty?: string
    state?: string
  }
}

export function SearchForm({ variant = "hero", defaultValues }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValues?.query || "")
  const [specialty, setSpecialty] = useState(defaultValues?.specialty || "")
  const [state, setState] = useState(defaultValues?.state || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (specialty) params.set("specialty", specialty)
    if (state) params.set("state", state)
    router.push(`/search?${params.toString()}`)
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 items-center flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Search by name or condition..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10"
          />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger className="w-[100px] h-10">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" className="h-10">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-xl shadow-lg p-2 border border-border">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by name, condition, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 border-0 shadow-none text-base focus-visible:ring-0"
            />
          </div>
          <div className="flex gap-2">
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full md:w-[180px] h-12 border-0 shadow-none bg-secondary">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="w-[100px] h-12 border-0 shadow-none bg-secondary">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" size="lg" className="h-12 px-6">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
