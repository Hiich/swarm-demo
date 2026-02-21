"use client"

import * as React from "react"
import { ProcessedModel } from "@/lib/types"
import { formatPriceDisplay, getProviderColor } from "@/lib/model-utils"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

interface ModelGridProps {
  models: ProcessedModel[]
  selectedModels: ProcessedModel[]
  isSelected: (modelId: string) => boolean
  onToggleSelect: (model: ProcessedModel) => void
}

export function ModelGrid({ models, selectedModels, isSelected, onToggleSelect }: ModelGridProps) {
  // Find cheapest input/output across visible models
  const minInput = Math.min(...models.map((m) => m.inputPrice))
  const minOutput = Math.min(...models.map((m) => m.outputPrice))

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model, i) => {
        const selected = isSelected(model.id)
        return (
          <motion.div
            key={model.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
            onClick={() => onToggleSelect(model)}
            className={cn(
              "group relative cursor-pointer rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30",
              selected && "ring-2 ring-primary border-primary bg-primary/5 shadow-primary/10"
            )}
          >
            {/* Selection indicator */}
            <div
              className={cn(
                "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-md border transition-all",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 group-hover:border-muted-foreground/60"
              )}
            >
              {selected && <Check className="h-3 w-3" />}
            </div>

            {/* Model name + provider */}
            <div className="mb-4 pr-8">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                {model.name}
              </h3>
              <Badge
                className={cn("mt-1.5 text-white border-0 text-[10px]", getProviderColor(model.provider))}
              >
                {model.provider}
              </Badge>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Input / 1M
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-bold",
                    model.inputPrice === minInput && model.inputPrice > 0
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  )}
                >
                  {formatPriceDisplay(model.inputPrice)}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Output / 1M
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-bold",
                    model.outputPrice === minOutput && model.outputPrice > 0
                      ? "text-green-600 dark:text-green-400"
                      : ""
                  )}
                >
                  {formatPriceDisplay(model.outputPrice)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{model.contextWindow.toLocaleString()} ctx</span>
              <span className="truncate ml-2">{model.modality}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
