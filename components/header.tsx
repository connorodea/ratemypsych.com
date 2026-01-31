"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RP</span>
            </div>
            <span className="font-semibold text-lg text-foreground">RateMyPsych</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/search" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Find a Psychiatrist
            </Link>
            <Link 
              href="/search" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Browse by Specialty
            </Link>
            <Link 
              href="/search" 
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Top Rated
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Link>
            </Button>
            <Button size="sm">Write a Review</Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/search" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find a Psychiatrist
              </Link>
              <Link 
                href="/search" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse by Specialty
              </Link>
              <Link 
                href="/search" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Top Rated
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/search">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Link>
                </Button>
                <Button size="sm">Write a Review</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
