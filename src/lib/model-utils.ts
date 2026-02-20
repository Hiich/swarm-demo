import { Model, ProcessedModel } from "./types"

export function extractProvider(modelId: string): string {
  // Model IDs are typically in the format "provider/model-name"
  const parts = modelId.split("/")
  if (parts.length >= 2) {
    return parts[0]
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  return "Unknown"
}

export function formatPrice(pricePerToken: string): number {
  // Convert price per token to price per 1M tokens
  const price = parseFloat(pricePerToken)
  return price * 1_000_000
}

export function formatPriceDisplay(price: number): string {
  return `$${price.toFixed(2)}`
}

export function processModel(model: Model): ProcessedModel {
  return {
    id: model.id,
    name: model.name,
    provider: extractProvider(model.id),
    inputPrice: formatPrice(model.pricing.prompt),
    outputPrice: formatPrice(model.pricing.completion),
    contextWindow: model.context_length,
    modality: model.architecture.modality,
  }
}

export function getProviderColor(provider: string): string {
  const colors: Record<string, string> = {
    "Anthropic": "bg-orange-500",
    "Openai": "bg-green-500",
    "Google": "bg-blue-500",
    "Meta": "bg-purple-500",
    "Mistral": "bg-yellow-500",
    "Cohere": "bg-pink-500",
    "X": "bg-gray-500",
    "Perplexity": "bg-indigo-500",
  }
  
  return colors[provider] || "bg-slate-500"
}
