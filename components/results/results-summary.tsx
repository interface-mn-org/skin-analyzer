interface ResultsSummaryProps {
  summary: string
}

export function ResultsSummary({ summary }: ResultsSummaryProps) {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Summary
      </h2>
      <p className="text-foreground leading-relaxed">{summary}</p>
    </section>
  )
}
