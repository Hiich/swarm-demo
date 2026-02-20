import { ModelListClient } from "@/components/model-list-client"
import { Model } from "@/lib/types"
import { processModel } from "@/lib/model-utils"

async function getModels() {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    next: { revalidate: 3600 }, // Revalidate every hour (ISR)
  })

  if (!res.ok) {
    throw new Error("Failed to fetch models")
  }

  const data = await res.json()
  return data.data as Model[]
}

export default async function Home() {
  const models = await getModels()
  const processedModels = models.map(processModel)
  const lastUpdated = new Date().toISOString()

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <ModelListClient models={processedModels} lastUpdated={lastUpdated} />
      </div>
    </main>
  )
}
