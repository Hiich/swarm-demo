export interface Model {
  id: string
  name: string
  pricing: {
    prompt: string
    completion: string
  }
  context_length: number
  architecture: {
    modality: string
  }
  created?: number
}

export interface ProcessedModel {
  id: string
  name: string
  provider: string
  inputPrice: number
  outputPrice: number
  contextWindow: number
  modality: string
}
