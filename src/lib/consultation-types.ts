export interface Consultation {
  id: string
  reference: string
  title: string
  organisme: string
  budget: number | null
  deadline: string
  status: "nouveau" | "en_cours" | "cloture" | "attribue"
  tags: string[]
  createdAt: string
  category: string
}

export type BudgetMagnitude = "high" | "medium" | "low" | "undefined"
export type FilterTab = "tous" | "urgents" | "nouveaux" | "montant_eleve"
export type ViewMode = "cards" | "table"

export function getBudgetMagnitude(budget: number | null): BudgetMagnitude {
  if (budget === null) return "undefined"
  if (budget >= 10_000_000) return "high"
  if (budget >= 1_000_000) return "medium"
  return "low"
}

export function formatBudget(budget: number | null): string {
  if (budget === null) return "Budget à confirmer"
  if (budget >= 1_000_000) {
    return `${(budget / 1_000_000).toFixed(1).replace(/\.0$/, "")}M DH`
  }
  if (budget >= 1_000) {
    return `${(budget / 1_000).toFixed(0)}K DH`
  }
  return `${budget.toLocaleString()} DH`
}

export function getStatusLabel(status: Consultation["status"]): string {
  const labels: Record<Consultation["status"], string> = {
    nouveau: "Nouveau",
    en_cours: "En cours",
    cloture: "Clôturé",
    attribue: "Attribué",
  }
  return labels[status]
}

export function getStatusColor(status: Consultation["status"]): string {
  const colors: Record<Consultation["status"], string> = {
    nouveau: "bg-blue-500",
    en_cours: "bg-amber-500",
    cloture: "bg-gray-400",
    attribue: "bg-green-500",
  }
  return colors[status]
}

export function getBudgetBorderColor(magnitude: BudgetMagnitude): string {
  switch (magnitude) {
    case "high":
      return "border-l-emerald-500"
    case "medium":
      return "border-l-blue-500"
    case "low":
      return "border-l-slate-300 dark:border-l-slate-600"
    case "undefined":
      return "border-l-gray-300 dark:border-l-gray-600 border-dashed"
  }
}

export function isUrgent(deadline: string): boolean {
  const diff = new Date(deadline).getTime() - Date.now()
  return diff > 0 && diff < 72 * 60 * 60 * 1000 // < 72h
}

// Sample data for demonstration
export function getSampleConsultations(): Consultation[] {
  const now = Date.now()
  return [
    {
      id: "1",
      reference: "AO-2026-001",
      title: "Fourniture et installation de panneaux solaires pour les bâtiments administratifs",
      organisme: "Ministère de l'Énergie",
      budget: 48_000_000,
      deadline: new Date(now + 5 * 86400000).toISOString(),
      status: "nouveau",
      tags: ["Énergie", "Infrastructure", "Développement durable"],
      createdAt: new Date(now - 86400000).toISOString(),
      category: "Travaux",
    },
    {
      id: "2",
      reference: "AO-2026-002",
      title: "Audit et modernisation du système d'information RH",
      organisme: "ONEE",
      budget: 760_000,
      deadline: new Date(now + 48 * 3600000).toISOString(),
      status: "en_cours",
      tags: ["IT", "Audit"],
      createdAt: new Date(now - 3 * 86400000).toISOString(),
      category: "Services",
    },
    {
      id: "3",
      reference: "AO-2026-003",
      title: "Maintenance des équipements médicaux — CHU Hassan II",
      organisme: "CHU Hassan II",
      budget: null,
      deadline: new Date(now + 14 * 86400000).toISOString(),
      status: "nouveau",
      tags: ["Santé", "Maintenance"],
      createdAt: new Date(now - 2 * 86400000).toISOString(),
      category: "Services",
    },
    {
      id: "4",
      reference: "AO-2026-004",
      title: "Construction d'un centre de formation professionnelle à Tanger",
      organisme: "OFPPT",
      budget: 25_000_000,
      deadline: new Date(now + 30 * 86400000).toISOString(),
      status: "nouveau",
      tags: ["Construction", "Formation"],
      createdAt: new Date(now - 86400000).toISOString(),
      category: "Travaux",
    },
    {
      id: "5",
      reference: "AO-2026-005",
      title: "Acquisition de véhicules utilitaires pour la collecte des déchets",
      organisme: "Commune de Casablanca",
      budget: 3_200_000,
      deadline: new Date(now + 10 * 86400000).toISOString(),
      status: "en_cours",
      tags: ["Transport", "Environnement"],
      createdAt: new Date(now - 5 * 86400000).toISOString(),
      category: "Fournitures",
    },
    {
      id: "6",
      reference: "AO-2026-006",
      title: "Étude d'impact environnemental — Zone industrielle Kénitra",
      organisme: "Agence de Développement",
      budget: 450_000,
      deadline: new Date(now + 20 * 86400000).toISOString(),
      status: "nouveau",
      tags: ["Environnement"],
      createdAt: new Date(now - 86400000).toISOString(),
      category: "Services",
    },
    {
      id: "7",
      reference: "AO-2026-007",
      title: "Fourniture de matériel informatique pour les écoles rurales",
      organisme: "Ministère de l'Éducation",
      budget: 12_500_000,
      deadline: new Date(now + 2 * 86400000).toISOString(),
      status: "en_cours",
      tags: ["IT", "Éducation"],
      createdAt: new Date(now - 7 * 86400000).toISOString(),
      category: "Fournitures",
    },
    {
      id: "8",
      reference: "AO-2026-008",
      title: "Réhabilitation du réseau d'assainissement — Quartier Hay Mohammadi",
      organisme: "Lydec",
      budget: 8_700_000,
      deadline: new Date(now + 25 * 86400000).toISOString(),
      status: "nouveau",
      tags: ["Infrastructure"],
      createdAt: new Date(now - 4 * 86400000).toISOString(),
      category: "Travaux",
    },
  ]
}
