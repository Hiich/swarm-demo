import { ModelTable } from '@/components/model-table';

interface Model {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    modality: string;
  };
}

async function getModels(): Promise<{ models: Model[]; timestamp: string }> {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch models');
  }

  const data = await res.json();
  return {
    models: data.data || [],
    timestamp: new Date().toISOString(),
  };
}

export default async function Home() {
  const { models, timestamp } = await getModels();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Model Price Comparison</h1>
          <p className="text-muted-foreground">
            Compare pricing across AI providers powered by OpenRouter
          </p>
        </div>
        <ModelTable models={models} timestamp={timestamp} />
      </div>
    </main>
  );
}
