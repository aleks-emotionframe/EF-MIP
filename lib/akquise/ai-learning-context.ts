export interface LearningContext {
  references: { name: string; url?: string; industry?: string; description?: string; score?: number }[]
  rules: { title: string; rule: string; industry?: string | null }[]
  successPatterns: { industry: string; winningFactors: any; outreachMethod?: string; monthlyValue?: string }[]
  feedbackSummary: { positiveCount: number; negativeCount: number; topIssues: string[] }
}

export async function loadLearningContext(industry?: string): Promise<LearningContext> {
  try {
    const { prisma } = await import("@/lib/prisma")
    if (!prisma) throw new Error("No DB")

    const references = await prisma.aiReference.findMany({
      where: industry ? { OR: [{ industry }, { industry: null }] } : {},
      orderBy: { score: "desc" },
      take: 10,
    })

    const rules = await prisma.aiRule.findMany({
      where: {
        isActive: true,
        ...(industry ? { OR: [{ industry }, { industry: null }] } : {}),
      },
      orderBy: { priority: "desc" },
    })

    const insights = await prisma.conversionInsight.findMany({
      where: industry ? { industry } : {},
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    const feedback = await prisma.aiFeedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    const positiveCount = feedback.filter((f) => f.rating > 0).length
    const negativeCount = feedback.filter((f) => f.rating < 0).length
    const negativeWithComment = feedback.filter((f) => f.rating < 0 && f.comment)
    const topIssues = negativeWithComment.slice(0, 5).map((f) => f.comment!)

    return {
      references: references.map((r) => ({
        name: r.name,
        url: r.url ?? undefined,
        industry: r.industry ?? undefined,
        description: r.description ?? undefined,
        score: r.score ?? undefined,
      })),
      rules: rules.map((r) => ({ title: r.title, rule: r.rule, industry: r.industry })),
      successPatterns: insights.map((i) => ({
        industry: i.industry,
        winningFactors: i.winningFactors,
        outreachMethod: i.outreachMethod ?? undefined,
        monthlyValue: i.monthlyValue ?? undefined,
      })),
      feedbackSummary: { positiveCount, negativeCount, topIssues },
    }
  } catch {
    return {
      references: [],
      rules: [
        { title: "Notfall-Nummer", rule: "Sanitär- und Haustechnik-Betriebe brauchen immer eine prominente Notfall-Nummer", industry: "Haustechnik" },
        { title: "Referenzprojekte", rule: "Jeder Betrieb sollte mindestens 5 Referenzprojekte mit Bildern zeigen", industry: null },
        { title: "Google Bewertungen", rule: "Bei unter 20 Google-Bewertungen immer empfehlen, aktiv Bewertungen zu sammeln", industry: null },
      ],
      successPatterns: [],
      feedbackSummary: { positiveCount: 0, negativeCount: 0, topIssues: [] },
    }
  }
}

export function buildLearningPrompt(ctx: LearningContext): string {
  const parts: string[] = []

  if (ctx.rules.length > 0) {
    parts.push("## Deine Regeln (IMMER beachten):")
    ctx.rules.forEach((r) => {
      parts.push(`- ${r.title}: ${r.rule}${r.industry ? ` [Branche: ${r.industry}]` : ""}`)
    })
  }

  if (ctx.references.length > 0) {
    parts.push("\n## Referenz-Beispiele (so sieht ein guter Auftritt aus):")
    ctx.references.forEach((r) => {
      parts.push(`- ${r.name}${r.url ? ` (${r.url})` : ""}${r.industry ? ` [${r.industry}]` : ""}: ${r.description || "Top-Beispiel"}${r.score ? ` (Score: ${r.score}/100)` : ""}`)
    })
  }

  if (ctx.successPatterns.length > 0) {
    parts.push("\n## Erfolgreiche Konversionen (was hat funktioniert):")
    ctx.successPatterns.slice(0, 5).forEach((s) => {
      const factors = typeof s.winningFactors === "object" ? JSON.stringify(s.winningFactors) : s.winningFactors
      parts.push(`- Branche: ${s.industry}, Erfolgsfaktoren: ${factors}${s.outreachMethod ? `, Methode: ${s.outreachMethod}` : ""}${s.monthlyValue ? `, Wert: ${s.monthlyValue}` : ""}`)
    })
  }

  if (ctx.feedbackSummary.negativeCount > 0 && ctx.feedbackSummary.topIssues.length > 0) {
    parts.push("\n## Feedback zu bisherigen Analysen:")
    parts.push(`${ctx.feedbackSummary.positiveCount} positive, ${ctx.feedbackSummary.negativeCount} negative Bewertungen.`)
    parts.push("Häufige Kritikpunkte:")
    ctx.feedbackSummary.topIssues.forEach((issue) => {
      parts.push(`- ${issue}`)
    })
    parts.push("Bitte diese Kritikpunkte in zukünftigen Analysen berücksichtigen und vermeiden.")
  }

  return parts.join("\n")
}
