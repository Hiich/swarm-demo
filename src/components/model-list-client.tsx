"use client"

import * as React from "react"
import { ModelTable } from "@/components/model-table"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProcessedModel } from "@/lib/types"

interface ModelListClientProps {
  models: ProcessedModel[]
  lastUpdated: string
}

export function ModelListClient({ models, lastUpdated }: ModelListClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredModels = React.useMemo(() => {
    if (!searchQuery) return models

    const query = searchQuery.toLowerCase()
    return models.filter(
      (model) =>
        model.name.toLowerCase().includes(query) ||
        model.provider.toLowerCase().includes(query)
    )
  }, [models, searchQuery])

  const formattedDate = new Date(lastUpdated).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Model Price Comparison
          </h1>
          <p className="text-muted-foreground">
            Compare pricing across {models.length} AI models from multiple providers
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {filteredModels.length} of {models.length} models
          </p>
        )}
      </div>

      <ModelTable models={filteredModels} />

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Last updated: {formattedDate}
      </footer>
    </>
  )
}
