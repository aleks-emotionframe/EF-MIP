import type { WebsiteAnalysis } from "./website-analyzer"
import type { SocialAnalysis } from "./social-analyzer"
import { loadLearningContext, buildLearningPrompt } from "./ai-learning-context"

export interface AIAnalysis {
  summary: string
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  recommendations: {
    title: string
    description: string
    impact: "hoch" | "mittel" | "niedrig"
    effort: "einfach" | "mittel" | "aufwändig"
    category: string
  }[]
  potentialValue: string
  competitorInsights: string
  quickWins: string[]
  longTermStrategy: string
}

function buildUserPrompt(data: {
  name: string
  industry: string
  website?: WebsiteAnalysis
  social?: SocialAnalysis
  googleRating?: number
  googleReviews?: number
  city?: string
}): string {
  let prompt = `Analysiere die Online-Praesenz von "${data.name}" (Branche: ${data.industry})`
  if (data.city) prompt += ` in ${data.city}`
  prompt += ".\n\n"

  if (data.googleRating != null || data.googleReviews != null) {
    prompt += "Google Bewertungen:\n"
    if (data.googleRating != null) prompt += `- Bewertung: ${data.googleRating}/5\n`
    if (data.googleReviews != null) prompt += `- Anzahl Bewertungen: ${data.googleReviews}\n`
    prompt += "\n"
  }

  if (data.website) {
    prompt += "Website-Analyse:\n"
    prompt += `- URL: ${data.website.url}\n`
    prompt += `- Erreichbar: ${data.website.isAccessible ? "Ja" : "Nein"}\n`
    prompt += `- HTTPS: ${data.website.isHttps ? "Ja" : "Nein"}\n`
    if (data.website.loadTimeMs) prompt += `- Ladezeit: ${data.website.loadTimeMs}ms\n`
    prompt += `- Mobile optimiert: ${data.website.isMobileOptimized ? "Ja" : "Nein"}\n`
    prompt += `- SEO Score: ${data.website.seoScore}/100\n`
    prompt += `- Speed Score: ${data.website.speedScore}/100\n`
    prompt += `- Gesamt Score: ${data.website.overallScore}/100\n`
    prompt += `- Meta Description: ${data.website.hasMetaDescription ? "Vorhanden" : "Fehlt"}\n`
    prompt += `- H1 Tags: ${data.website.h1Count}\n`
    prompt += `- Bilder: ${data.website.imageCount} (ohne Alt: ${data.website.imagesWithoutAlt})\n`
    prompt += `- Wortanzahl: ${data.website.wordCount}\n`
    prompt += `- Kontaktformular: ${data.website.hasContactForm ? "Ja" : "Nein"}\n`
    prompt += `- Social Links auf Website: ${data.website.hasSocialLinks.length > 0 ? data.website.hasSocialLinks.join(", ") : "Keine"}\n`
    prompt += `- Technologien: ${data.website.technologies.length > 0 ? data.website.technologies.join(", ") : "Nicht erkannt"}\n`
    if (data.website.issues.length > 0) {
      prompt += `- Probleme: ${data.website.issues.join("; ")}\n`
    }
    prompt += "\n"
  }

  if (data.social) {
    prompt += "Social-Media-Analyse:\n"
    prompt += `- Gefundene Plattformen: ${data.social.platformCount}\n`
    prompt += `- Social Score: ${data.social.overallScore}/100\n`
    for (const profile of data.social.profiles) {
      prompt += `- ${profile.platform}: ${profile.found ? "Gefunden" : "Nicht gefunden"}`
      if (profile.handle) prompt += ` (@${profile.handle})`
      prompt += "\n"
    }
    if (data.social.issues.length > 0) {
      prompt += `- Probleme: ${data.social.issues.join("; ")}\n`
    }
    prompt += "\n"
  }

  prompt += `Erstelle einen detaillierten Analysebericht im folgenden JSON-Format:
{
  "summary": "Zusammenfassung der Online-Praesenz in 2-3 Saetzen",
  "overallScore": <Gesamtbewertung 0-100>,
  "strengths": ["Staerke 1", "Staerke 2"],
  "weaknesses": ["Schwaeche 1", "Schwaeche 2"],
  "recommendations": [
    {
      "title": "Empfehlung",
      "description": "Detaillierte Beschreibung",
      "impact": "hoch|mittel|niedrig",
      "effort": "einfach|mittel|aufwändig",
      "category": "SEO|Social Media|Website|Content|Bewertungen"
    }
  ],
  "potentialValue": "Einschaetzung des Kundenpotentials fuer EmotionFrame",
  "competitorInsights": "Vergleich mit typischen Unternehmen der Branche",
  "quickWins": ["Schnell umsetzbare Massnahme 1", "Massnahme 2"],
  "longTermStrategy": "Langfristige Strategie-Empfehlung"
}

Antworte NUR mit dem JSON-Objekt, ohne Markdown-Codeblock oder sonstigen Text.`

  return prompt
}

function buildFallbackAnalysis(name: string): AIAnalysis {
  return {
    summary: `Analyse fuer "${name}" konnte nicht durchgefuehrt werden. Analyse benoetigt API-Schluessel.`,
    overallScore: 0,
    strengths: [],
    weaknesses: [],
    recommendations: [],
    potentialValue: "Nicht verfuegbar",
    competitorInsights: "Nicht verfuegbar",
    quickWins: [],
    longTermStrategy: "Nicht verfuegbar",
  }
}

export async function generateLeadAnalysis(data: {
  name: string
  industry: string
  website?: WebsiteAnalysis
  social?: SocialAnalysis
  googleRating?: number
  googleReviews?: number
  city?: string
}): Promise<AIAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return buildFallbackAnalysis(data.name)
  }

  const learningCtx = await loadLearningContext(data.industry)
  const learningPrompt = buildLearningPrompt(learningCtx)

  const systemPrompt = `Du bist ein Senior Marketing-Berater bei EmotionFrame, einer Schweizer Marketing-Agentur. Analysiere die Online-Praesenz dieses Unternehmens und erstelle einen detaillierten Bericht mit konkreten, umsetzbaren Empfehlungen.

WICHTIGE GRUNDSÄTZE:
- Sei ehrlich, direkt und professionell
- Keine leeren Phrasen - nur echte Insights die Mehrwert schaffen
- Empfehlungen müssen konkret und umsetzbar sein
- Nenne spezifische Tools, Zahlen und Zeitrahmen wo möglich
- Vergleiche mit der Branche und Region
- Berücksichtige Schweizer Markt-Besonderheiten

${learningPrompt}`

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: buildUserPrompt(data),
          },
        ],
      }),
    })

    if (!res.ok) {
      return buildFallbackAnalysis(data.name)
    }

    const responseData = await res.json()
    const textContent = responseData.content?.find((c: any) => c.type === "text")
    if (!textContent?.text) {
      return buildFallbackAnalysis(data.name)
    }

    const jsonText = textContent.text.trim()
    const parsed = JSON.parse(jsonText)

    return {
      summary: parsed.summary || "",
      overallScore: typeof parsed.overallScore === "number" ? parsed.overallScore : 0,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.map((r: any) => ({
            title: r.title || "",
            description: r.description || "",
            impact: ["hoch", "mittel", "niedrig"].includes(r.impact) ? r.impact : "mittel",
            effort: ["einfach", "mittel", "aufwändig"].includes(r.effort) ? r.effort : "mittel",
            category: r.category || "Allgemein",
          }))
        : [],
      potentialValue: parsed.potentialValue || "",
      competitorInsights: parsed.competitorInsights || "",
      quickWins: Array.isArray(parsed.quickWins) ? parsed.quickWins : [],
      longTermStrategy: parsed.longTermStrategy || "",
    }
  } catch {
    return buildFallbackAnalysis(data.name)
  }
}
