"use client"

import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
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

type SortField = keyof ProcessedModel
type SortOrder = "asc" | "desc"

interface ModelTableProps {
  models: ProcessedModel[]
}

export function ModelTable({ models }: ModelTableProps) {
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
      return sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })
  }, [models, sortField, sortOrder])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
  }

  // Find min and max prices for highlighting
  const inputPrices = models.map(m => m.inputPrice)
  const outputPrices = models.map(m => m.outputPrice)
  const minInput = Math.min(...inputPrices)
  const maxInput = Math.max(...inputPrices)
  const minOutput = Math.min(...outputPrices)
  const maxOutput = Math.max(...outputPrices)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="h-auto p-0 hover:bg-transparent"
              >
                Model Name
                <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("provider")}
                className="h-auto p-0 hover:bg-transparent"
              >
                Provider
                <SortIcon field="provider" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("inputPrice")}
                className="h-auto p-0 hover:bg-transparent ml-auto flex"
              >
                Input Price (1M tokens)
                <SortIcon field="inputPrice" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("outputPrice")}
                className="h-auto p-0 hover:bg-transparent ml-auto flex"
              >
                Output Price (1M tokens)
                <SortIcon field="outputPrice" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("contextWindow")}
                className="h-auto p-0 hover:bg-transparent ml-auto flex"
              >
                Context Window
                <SortIcon field="contextWindow" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("modality")}
                className="h-auto p-0 hover:bg-transparent"
              >
                Modality
                <SortIcon field="modality" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedModels.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>
                <Badge className={`${getProviderColor(model.provider)} text-white border-0`}>
                  {model.provider}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    model.inputPrice === minInput
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : model.inputPrice === maxInput
                      ? "text-red-600 dark:text-red-400"
                      : ""
                  }
                >
                  {formatPriceDisplay(model.inputPrice)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    model.outputPrice === minOutput
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : model.outputPrice === maxOutput
                      ? "text-red-600 dark:text-red-400"
                      : ""
                  }
                >
                  {formatPriceDisplay(model.outputPrice)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {model.contextWindow.toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {model.modality}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
