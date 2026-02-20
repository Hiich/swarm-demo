"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getProviderColor } from "@/lib/model-utils"

interface ProviderFilterProps {
  providers: { name: string; count: number }[]
  selected: Set<string>
  onToggle: (provider: string) => void
}

export function ProviderFilter({ providers, selected, onToggle }: ProviderFilterProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {providers.slice(0, 20).map(({ name, count }) => {
        const isActive = selected.has(name)
        return (
          <button
            key={name}
            onClick={() => onToggle(name)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            <span
              className={cn("h-2 w-2 rounded-full", getProviderColor(name))}
            />
            {name}
            <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[10px]">
              {count}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}
