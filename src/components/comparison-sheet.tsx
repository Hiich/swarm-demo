"use client"

import { ProcessedModel } from "@/lib/types"
import { formatPriceDisplay, getProviderColor } from "@/lib/model-utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ComparisonSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  models: ProcessedModel[]
}

function gridCols(count: number): string {
  if (count === 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  return "grid-cols-3"
}

function PriceBar({ value, max, isCheapest }: { value: number; max: number; isCheapest: boolean }) {
  const width = max > 0 ? Math.max((value / max) * 100, 4) : 4
  return (
    <div className="mt-1 h-2 w-full rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          isCheapest ? "bg-green-500" : "bg-primary/60"
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export function ComparisonSheet({ open, onOpenChange, models }: ComparisonSheetProps) {
  if (models.length === 0) return null

  const maxInput = Math.max(...models.map((m) => m.inputPrice))
  const maxOutput = Math.max(...models.map((m) => m.outputPrice))
  const minInput = Math.min(...models.map((m) => m.inputPrice))
  const minOutput = Math.min(...models.map((m) => m.outputPrice))
  const maxContext = Math.max(...models.map((m) => m.contextWindow))

  function priceDiff(price: number, cheapest: number): string {
    if (price === cheapest || cheapest === 0) return ""
    const pct = ((price - cheapest) / cheapest) * 100
    return `+${pct.toFixed(0)}%`
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">Model Comparison</SheetTitle>
        </SheetHeader>

        <div className="space-y-8 pb-8">
          {/* Model names + providers */}
          <div className={cn("grid gap-4", gridCols(models.length))}>
            {models.map((model) => (
              <div key={model.id} className="text-center">
                <h3 className="font-bold text-base leading-tight">{model.name}</h3>
                <Badge className={cn("mt-1.5 text-white border-0 text-[10px]", getProviderColor(model.provider))}>
                  {model.provider}
                </Badge>
              </div>
            ))}
          </div>

          {/* Input Price */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Input Price (per 1M tokens)
            </h4>
            <div className={cn("grid gap-4", gridCols(models.length))}>
              {models.map((model) => {
                const isCheapest = model.inputPrice === minInput
                return (
                  <div key={model.id} className={cn("rounded-lg p-3", isCheapest ? "bg-green-500/10 ring-1 ring-green-500/30" : "bg-muted/50")}>
                    <div className="flex items-baseline justify-between">
                      <span className={cn("text-lg font-bold", isCheapest ? "text-green-600 dark:text-green-400" : "")}>
                        {formatPriceDisplay(model.inputPrice)}
                      </span>
                      {priceDiff(model.inputPrice, minInput) && (
                        <span className="text-xs text-red-500">{priceDiff(model.inputPrice, minInput)}</span>
                      )}
                    </div>
                    <PriceBar value={model.inputPrice} max={maxInput} isCheapest={isCheapest} />
                    {isCheapest && <span className="mt-1 inline-block text-[10px] font-medium text-green-600 dark:text-green-400">Cheapest</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Output Price */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Output Price (per 1M tokens)
            </h4>
            <div className={cn("grid gap-4", gridCols(models.length))}>
              {models.map((model) => {
                const isCheapest = model.outputPrice === minOutput
                return (
                  <div key={model.id} className={cn("rounded-lg p-3", isCheapest ? "bg-green-500/10 ring-1 ring-green-500/30" : "bg-muted/50")}>
                    <div className="flex items-baseline justify-between">
                      <span className={cn("text-lg font-bold", isCheapest ? "text-green-600 dark:text-green-400" : "")}>
                        {formatPriceDisplay(model.outputPrice)}
                      </span>
                      {priceDiff(model.outputPrice, minOutput) && (
                        <span className="text-xs text-red-500">{priceDiff(model.outputPrice, minOutput)}</span>
                      )}
                    </div>
                    <PriceBar value={model.outputPrice} max={maxOutput} isCheapest={isCheapest} />
                    {isCheapest && <span className="mt-1 inline-block text-[10px] font-medium text-green-600 dark:text-green-400">Cheapest</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Context Window */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Context Window
            </h4>
            <div className={cn("grid gap-4", gridCols(models.length))}>
              {models.map((model) => {
                const isLargest = model.contextWindow === maxContext
                return (
                  <div key={model.id} className={cn("rounded-lg p-3", isLargest ? "bg-blue-500/10 ring-1 ring-blue-500/30" : "bg-muted/50")}>
                    <span className={cn("text-lg font-bold", isLargest ? "text-blue-600 dark:text-blue-400" : "")}>
                      {model.contextWindow.toLocaleString()}
                    </span>
                    <p className="text-xs text-muted-foreground">tokens</p>
                    {isLargest && <span className="mt-1 inline-block text-[10px] font-medium text-blue-600 dark:text-blue-400">Largest</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Modality */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Modality
            </h4>
            <div className={cn("grid gap-4", gridCols(models.length))}>
              {models.map((model) => (
                <div key={model.id} className="rounded-lg bg-muted/50 p-3">
                  <span className="text-sm font-medium">{model.modality}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
