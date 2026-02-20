import { ModelListClient } from "@/components/model-list-client"
import { Model } from "@/lib/types"
import { processModel } from "@/lib/model-utils"
import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/loading-skeleton"

async function getModels() {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    next: { revalidate: 3600 },
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
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <Suspense fallback={<LoadingSkeleton />}>
          <ModelListClient models={processedModels} lastUpdated={lastUpdated} />
        </Suspense>
      </div>
    </main>
  )
}
