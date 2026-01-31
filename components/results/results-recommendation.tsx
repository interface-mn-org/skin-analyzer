interface ResultsRecommendationProps {
  recommendation: string
}

export function ResultsRecommendation({ recommendation }: ResultsRecommendationProps) {
  return (
    <section className="mb-10 p-5 rounded-xl border border-border bg-muted/30">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Our Recommendation
      </h2>
      <p className="text-foreground leading-relaxed">{recommendation}</p>
    </section>
  )
}
