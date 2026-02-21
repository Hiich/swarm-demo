"use client"

import * as React from "react"
import { TenderCard } from "@/components/shared/TenderCard"
import { ConsultationsFilters } from "@/components/consultations/ConsultationsFilters"
import { ConsultationsTable } from "@/components/consultations/ConsultationsTable"
import {
  Consultation,
  FilterTab,
  ViewMode,
  getSampleConsultations,
  isUrgent,
} from "@/lib/consultation-types"
import { AnimatePresence, motion } from "framer-motion"

export default function ConsultationsPage() {
  const [consultations] = React.useState<Consultation[]>(getSampleConsultations)
  const [activeTab, setActiveTab] = React.useState<FilterTab>("tous")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<ViewMode>("cards")

  const filtered = React.useMemo(() => {
    let result = consultations

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.organisme.toLowerCase().includes(q) ||
          c.reference.toLowerCase().includes(q)
      )
    }

    // Tab filter
    switch (activeTab) {
      case "urgents":
        result = result.filter((c) => isUrgent(c.deadline))
        break
      case "nouveaux":
        result = result.filter((c) => c.status === "nouveau")
        break
      case "montant_eleve":
        result = result
          .filter((c) => c.budget !== null && c.budget >= 10_000_000)
          .sort((a, b) => (b.budget ?? 0) - (a.budget ?? 0))
        break
    }

    return result
  }, [consultations, searchQuery, activeTab])

  // Counts for filter badges (computed on search-filtered set only)
  const searchFiltered = React.useMemo(() => {
    if (!searchQuery) return consultations
    const q = searchQuery.toLowerCase()
    return consultations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.organisme.toLowerCase().includes(q) ||
        c.reference.toLowerCase().includes(q)
    )
  }, [consultations, searchQuery])

  const counts: Record<FilterTab, number> = React.useMemo(
    () => ({
      tous: searchFiltered.length,
      urgents: searchFiltered.filter((c) => isUrgent(c.deadline)).length,
      nouveaux: searchFiltered.filter((c) => c.status === "nouveau").length,
      montant_eleve: searchFiltered.filter(
        (c) => c.budget !== null && c.budget >= 10_000_000
      ).length,
    }),
    [searchFiltered]
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Consultations
          </h1>
          <p className="mt-1 text-muted-foreground">
            <span className="font-semibold text-foreground">{consultations.length}</span>{" "}
            appels d&apos;offres actifs
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ConsultationsFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            counts={counts}
          />
        </div>

        {/* Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Affichage de{" "}
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            résultat{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 text-6xl">📋</div>
            <h3 className="text-lg font-semibold">Aucune consultation trouvée</h3>
            <p className="mt-1 text-muted-foreground">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "cards" ? (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((c, i) => (
                  <TenderCard key={c.id} consultation={c} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ConsultationsTable consultations={filtered} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  )
}
