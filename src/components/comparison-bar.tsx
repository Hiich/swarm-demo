"use client"

import { ProcessedModel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { X, GitCompareArrows } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface ComparisonBarProps {
  selectedModels: ProcessedModel[]
  onClear: () => void
  onCompare: () => void
  onRemove: (id: string) => void
}

export function ComparisonBar({ selectedModels, onClear, onCompare, onRemove }: ComparisonBarProps) {
  if (selectedModels.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 bg-background/95 px-4 py-3 shadow-[0_-4px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="shrink-0 text-sm font-medium">
              {selectedModels.length}/3 selected
            </span>
            <div className="flex gap-2">
              {selectedModels.map((model) => (
                <motion.div
                  key={model.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
                >
                  <span className="max-w-[120px] truncate">{model.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(model.id)
                    }}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-background/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
            <Button size="sm" onClick={onCompare} className="gap-1.5">
              <GitCompareArrows className="h-4 w-4" />
              Compare
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
