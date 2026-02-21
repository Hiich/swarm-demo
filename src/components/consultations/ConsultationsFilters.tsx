"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { FilterTab } from "@/lib/consultation-types"
import { Flame, Sparkles, TrendingUp, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConsultationsFiltersProps {
  activeTab: FilterTab
  onTabChange: (tab: FilterTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: "cards" | "table"
  onViewModeChange: (mode: "cards" | "table") => void
  counts: Record<FilterTab, number>
}

const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
  { key: "tous", label: "Tous", icon: null },
  { key: "urgents", label: "Urgents", icon: <Flame className="h-3.5 w-3.5" /> },
  { key: "nouveaux", label: "Nouveaux", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { key: "montant_eleve", label: "Montant élevé", icon: <TrendingUp className="h-3.5 w-3.5" /> },
]

export function ConsultationsFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  counts,
}: ConsultationsFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par titre, organisme, référence..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => onViewModeChange("cards")}
            aria-label="Vue cartes"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => onViewModeChange("table")}
            aria-label="Vue tableau"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, icon }) => {
          const isActive = activeTab === key
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {icon}
              {label}
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts[key]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
