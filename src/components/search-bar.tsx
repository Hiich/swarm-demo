"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search models, providers, or IDs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl pl-10 pr-10 text-base shadow-sm"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => onChange("")}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
