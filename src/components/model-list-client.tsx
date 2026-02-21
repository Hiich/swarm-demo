"use client"

import * as React from "react"
import { ModelGrid } from "@/components/model-grid"
import { ModelTable } from "@/components/model-table"
import { SearchBar } from "@/components/search-bar"
import { ProviderFilter } from "@/components/provider-filter"
import { ComparisonBar } from "@/components/comparison-bar"
import { ComparisonSheet } from "@/components/comparison-sheet"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProcessedModel } from "@/lib/types"
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQueryState } from "nuqs"
import { AnimatePresence, motion } from "framer-motion"

interface ModelListClientProps {
  models: ProcessedModel[]
  lastUpdated: string
}

export function ModelListClient({ models, lastUpdated }: ModelListClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedProviders, setSelectedProviders] = React.useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [selectedModels, setSelectedModels] = React.useState<ProcessedModel[]>([])
  const [comparisonOpen, setComparisonOpen] = React.useState(false)
  const [compareParam, setCompareParam] = useQueryState("compare")

  // Get unique providers sorted by count
  const providers = React.useMemo(() => {
    const counts = new Map<string, number>()
    models.forEach((m) => counts.set(m.provider, (counts.get(m.provider) || 0) + 1))
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  }, [models])

  // Initialize selection from URL params
  React.useEffect(() => {
    if (compareParam) {
      const ids = compareParam.split(",")
      const found = ids
        .map((id) => models.find((m) => m.id === id))
        .filter(Boolean) as ProcessedModel[]
      if (found.length > 0) {
        setSelectedModels(found.slice(0, 3))
      }
    }
  }, [compareParam, models])

  // Sync selection to URL
  React.useEffect(() => {
    if (selectedModels.length > 0) {
      setCompareParam(selectedModels.map((m) => m.id).join(","))
    } else {
      setCompareParam(null)
    }
  }, [selectedModels, setCompareParam])

  const filteredModels = React.useMemo(() => {
    let result = models

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query)
      )
    }

    if (selectedProviders.size > 0) {
      result = result.filter((model) => selectedProviders.has(model.provider))
    }

    return result
  }, [models, searchQuery, selectedProviders])

  const toggleProvider = (provider: string) => {
    setSelectedProviders((prev) => {
      const next = new Set(prev)
      if (next.has(provider)) {
        next.delete(provider)
      } else {
        next.add(provider)
      }
      return next
    })
  }

  const toggleModelSelection = (model: ProcessedModel) => {
    setSelectedModels((prev) => {
      const exists = prev.find((m) => m.id === model.id)
      if (exists) {
        return prev.filter((m) => m.id !== model.id)
      }
      if (prev.length >= 3) {
        toast.warning("Maximum 3 models", {
          description: "Deselect a model before adding another.",
        })
        return prev
      }
      return [...prev, model]
    })
  }

  const clearSelection = () => {
    setSelectedModels([])
  }

  const isSelected = (modelId: string) => selectedModels.some((m) => m.id === modelId)

  const formattedDate = new Date(lastUpdated).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-foreground/70 bg-clip-text text-transparent">
            AI Model Pricing
          </h1>
          <p className="mt-1 text-muted-foreground">
            Compare pricing across{" "}
            <span className="font-semibold text-foreground">{models.length}</span> models
            from multiple providers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-0 z-20 -mx-4 bg-background/80 px-4 pb-4 pt-2 backdrop-blur-lg md:-mx-8 md:px-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Provider filters */}
      <ProviderFilter
        providers={providers}
        selected={selectedProviders}
        onToggle={toggleProvider}
      />

      {/* Model count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredModels.length}</span> of{" "}
          {models.length} models
          {selectedProviders.size > 0 && (
            <span>
              {" "}
              ·{" "}
              <button
                onClick={() => setSelectedProviders(new Set())}
                className="text-primary hover:underline"
              >
                Clear filters
              </button>
            </span>
          )}
        </p>
      </div>

      {/* Empty state */}
      {filteredModels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="text-lg font-semibold">No models found</h3>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your search or filters
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("")
              setSelectedProviders(new Set())
            }}
          >
            Reset all filters
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ModelGrid
                models={filteredModels}
                selectedModels={selectedModels}
                isSelected={isSelected}
                onToggleSelect={toggleModelSelection}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ModelTable
                models={filteredModels}
                isSelected={isSelected}
                onToggleSelect={toggleModelSelection}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Comparison bar */}
      <ComparisonBar
        selectedModels={selectedModels}
        onClear={clearSelection}
        onCompare={() => setComparisonOpen(true)}
        onRemove={(id) => setSelectedModels((prev) => prev.filter((m) => m.id !== id))}
      />

      {/* Comparison sheet */}
      <ComparisonSheet
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        models={selectedModels}
      />

      {/* Scroll to top */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
        Last updated: {formattedDate} · Data from{" "}
        <a href="https://openrouter.ai" className="text-primary hover:underline" target="_blank" rel="noopener">
          OpenRouter
        </a>
      </footer>
    </>
  )
}
