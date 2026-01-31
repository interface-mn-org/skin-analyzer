export interface AnalysisImage {
  id: string
  imageUrl: string
  title: string
  description: string
}

export interface AnalysisResults {
  overallSummary: string
  recommendation: string
  images: AnalysisImage[]
}
