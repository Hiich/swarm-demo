"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Consultation,
  getBudgetMagnitude,
  getBudgetBorderColor,
  formatBudget,
  getStatusLabel,
  getStatusColor,
  isUrgent,
} from "@/lib/consultation-types"
import { Clock, Building2, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface TenderCardProps {
  consultation: Consultation
  index: number
}

const tagColors: Record<string, string> = {
  "Énergie": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Infrastructure": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "IT": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Santé": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "Construction": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Transport": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Environnement": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Éducation": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
}

function getTagColor(tag: string): string {
  return tagColors[tag] || "bg-muted text-muted-foreground"
}

function formatDeadline(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now()
  const days = Math.ceil(diff / 86400000)
  if (days < 0) return "Expiré"
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return "Demain"
  if (days <= 7) return `${days}j restants`
  return new Date(deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

export function TenderCard({ consultation, index }: TenderCardProps) {
  const magnitude = getBudgetMagnitude(consultation.budget)
  const urgent = isUrgent(consultation.deadline)
  const displayTags = consultation.tags.slice(0, 2)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
      className={cn(
        "group relative rounded-xl border-l-4 border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
        getBudgetBorderColor(magnitude),
        magnitude === "high" && "ring-1 ring-emerald-200 dark:ring-emerald-800/50"
      )}
    >
      {/* Urgent indicator */}
      {urgent && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
          <AlertTriangle className="h-3 w-3" />
          Urgent
        </div>
      )}

      {/* Budget — PROMINENT */}
      <div className="mb-3">
        <p
          className={cn(
            "text-2xl font-bold tracking-tight",
            magnitude === "high" && "text-emerald-600 dark:text-emerald-400",
            magnitude === "medium" && "text-blue-600 dark:text-blue-400",
            magnitude === "low" && "text-foreground",
            magnitude === "undefined" && "text-muted-foreground text-lg italic"
          )}
        >
          {formatBudget(consultation.budget)}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
          {consultation.reference}
        </p>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-3">
        {consultation.title}
      </h3>

      {/* Organisme */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Building2 className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{consultation.organisme}</span>
      </div>

      {/* Footer: Tags + Status + Deadline */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                getTagColor(tag)
              )}
            >
              {tag}
            </span>
          ))}
          <Badge
            className={cn("text-white border-0 text-[10px]", getStatusColor(consultation.status))}
          >
            {getStatusLabel(consultation.status)}
          </Badge>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs shrink-0",
            urgent ? "text-red-500 font-semibold" : "text-muted-foreground"
          )}
        >
          <Clock className="h-3.5 w-3.5" />
          {formatDeadline(consultation.deadline)}
        </div>
      </div>
    </motion.div>
  )
}
