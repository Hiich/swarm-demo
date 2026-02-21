"use client"

import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown, Clock, AlertTriangle } from "lucide-react"
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
import {
  Consultation,
  formatBudget,
  getBudgetMagnitude,
  getStatusLabel,
  getStatusColor,
  isUrgent,
} from "@/lib/consultation-types"
import { cn } from "@/lib/utils"

type SortField = "reference" | "organisme" | "budget" | "deadline" | "status"
type SortOrder = "asc" | "desc"

interface ConsultationsTableProps {
  consultations: Consultation[]
}

function getSortValue(c: Consultation, field: SortField): string | number {
  switch (field) {
    case "budget":
      return c.budget ?? -1
    case "deadline":
      return new Date(c.deadline).getTime()
    default:
      return c[field]
  }
}

export function ConsultationsTable({ consultations }: ConsultationsTableProps) {
  const [sortField, setSortField] = React.useState<SortField>("deadline")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder(field === "budget" ? "desc" : "asc")
    }
  }

  const sorted = React.useMemo(() => {
    return [...consultations].sort((a, b) => {
      const aVal = getSortValue(a, sortField)
      const bVal = getSortValue(b, sortField)
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [consultations, sortField, sortOrder])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
    )
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>
              <Button variant="ghost" size="xs" onClick={() => handleSort("reference")} className="h-auto p-0 hover:bg-transparent font-semibold">
                Réf <SortIcon field="reference" />
              </Button>
            </TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>
              <Button variant="ghost" size="xs" onClick={() => handleSort("organisme")} className="h-auto p-0 hover:bg-transparent font-semibold">
                Organisme <SortIcon field="organisme" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="xs" onClick={() => handleSort("budget")} className="h-auto p-0 hover:bg-transparent ml-auto flex font-semibold">
                Budget <SortIcon field="budget" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="xs" onClick={() => handleSort("deadline")} className="h-auto p-0 hover:bg-transparent font-semibold">
                Échéance <SortIcon field="deadline" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="xs" onClick={() => handleSort("status")} className="h-auto p-0 hover:bg-transparent font-semibold">
                Statut <SortIcon field="status" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((c) => {
            const magnitude = getBudgetMagnitude(c.budget)
            const urgent = isUrgent(c.deadline)
            return (
              <TableRow key={c.id} className="cursor-pointer transition-colors">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {c.reference}
                </TableCell>
                <TableCell className="max-w-xs">
                  <span className="font-medium text-sm line-clamp-1">{c.title}</span>
                </TableCell>
                <TableCell className="text-sm">{c.organisme}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-bold",
                      magnitude === "high" && "text-emerald-600 dark:text-emerald-400",
                      magnitude === "medium" && "text-blue-600 dark:text-blue-400",
                      magnitude === "undefined" && "text-muted-foreground italic text-xs"
                    )}
                  >
                    {formatBudget(c.budget)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs",
                      urgent && "text-red-500 font-semibold"
                    )}
                  >
                    {urgent && <AlertTriangle className="h-3 w-3" />}
                    {new Date(c.deadline).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn("text-white border-0 text-[10px]", getStatusColor(c.status))}
                  >
                    {getStatusLabel(c.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
