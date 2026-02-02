import { mockAnalysisResults } from '@/components/results/mock-analysis-results'
import { ResultsByIdClient } from '@/components/results/results-by-id-client'
import type { ResultResponse } from '@/lib/api/result'

type OutputItem = {
  type: string
  ui_score?: number
  raw_score?: number
}

function formatType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function summaryFromOutput(output: OutputItem[] | undefined): string {
  if (!output?.length) return mockAnalysisResults.overallSummary
  const parts = output.map((item) => `${formatType(item.type)} ${item.ui_score ?? '—'}`)
  return `Analysis complete. ${parts.join(', ')}.`
}

type Props = { result: ResultResponse }

export function ResultsByIdView({ result }: Props) {
  const output = (result.results?.output ?? []) as OutputItem[]
  const summary = summaryFromOutput(output)

  return (
    <ResultsByIdClient
      result={result}
      summary={summary}
      recommendation={mockAnalysisResults.recommendation}
    />
  )
}
