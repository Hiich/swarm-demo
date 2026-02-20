"use client"

import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProcessedModel } from "@/lib/types"
import { formatPriceDisplay, getProviderColor } from "@/lib/model-utils"
import { cn } from "@/lib/utils"

type SortField = keyof ProcessedModel
type SortOrder = "asc" | "desc"

interface ModelTableProps {
  models: ProcessedModel[]
  isSelected: (modelId: string) => boolean
  onToggleSelect: (model: ProcessedModel) => void
}

export function ModelTable({ models, isSelected, onToggleSelect }: ModelTableProps) {
  const [sortField, setSortField] = React.useState<SortField>("name")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortedModels = React.useMemo(() => {
    return [...models].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [models, sortField, sortOrder])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
    )
  }

  const inputPrices = models.map((m) => m.inputPrice)
  const outputPrices = models.map((m) => m.outputPrice)
  const minInput = Math.min(...inputPrices)
  const minOutput = Math.min(...outputPrices)

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10" />
            <TableHead>
              <Button variant="ghost" size="xs" onClick={() => handleSort("name")} className="h-auto p-0 hover:bg-transparent font-semibold">
                Model <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="xs" onClick={() => handleSort("provider")} className="h-auto p-0 hover:bg-transparent font-semibold">
                Provider <SortIcon field="provider" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="xs" onClick={() => handleSort("inputPrice")} className="h-auto p-0 hover:bg-transparent ml-auto flex font-semibold">
                Input / 1M <SortIcon field="inputPrice" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="xs" onClick={() => handleSort("outputPrice")} className="h-auto p-0 hover:bg-transparent ml-auto flex font-semibold">
                Output / 1M <SortIcon field="outputPrice" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="xs" onClick={() => handleSort("contextWindow")} className="h-auto p-0 hover:bg-transparent ml-auto flex font-semibold">
                Context <SortIcon field="contextWindow" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="xs" onClick={() => handleSort("modality")} className="h-auto p-0 hover:bg-transparent font-semibold">
                Modality <SortIcon field="modality" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedModels.map((model) => {
            const selected = isSelected(model.id)
            return (
              <TableRow
                key={model.id}
                onClick={() => onToggleSelect(model)}
                className={cn(
                  "cursor-pointer transition-colors",
                  selected && "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <TableCell>
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-all",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>
                  <Badge className={cn("text-white border-0 text-[10px]", getProviderColor(model.provider))}>
                    {model.provider}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      model.inputPrice === minInput && model.inputPrice > 0
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : ""
                    )}
                  >
                    {formatPriceDisplay(model.inputPrice)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      model.outputPrice === minOutput && model.outputPrice > 0
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : ""
                    )}
                  >
                    {formatPriceDisplay(model.outputPrice)}
                  </span>
                </TableCell>
                <TableCell className="text-right">{model.contextWindow.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{model.modality}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
