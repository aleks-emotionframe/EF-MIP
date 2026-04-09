import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export const maxDuration = 30

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? ""

interface GenerateRequest {
  platform: string
  topic: string
  tone: string
  language: string
  includeHashtags: boolean
  includeEmoji: boolean
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  const body = (await request.json()) as GenerateRequest

  if (!body.topic?.trim()) {
    return Response.json({ error: "Thema ist erforderlich" }, { status: 400 })
  }

  // Try Claude API for real content generation
  if (ANTHROPIC_API_KEY) {
    try {
      const result = await generateWithClaude(body)
      return Response.json({ ...result, source: "claude" })
    } catch {
      // Fall through to template
    }
  }

  // Template-based generation (no API key needed, still useful)
  const result = generateWithTemplate(body)
  return Response.json({ ...result, source: "template" })
}

async function generateWithClaude(body: GenerateRequest) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk")
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

  const platformLimits: Record<string, string> = {
    instagram: "Max. 2200 Zeichen. Optimiere für Instagram: starker erster Satz, Absätze mit Leerzeilen, Call-to-Action am Ende.",
    facebook: "Optimale Länge 40-80 Wörter. Frage am Ende für Engagement.",
    linkedin: "Professioneller Ton. Hook in der ersten Zeile. 1300 Zeichen optimal. Absätze mit Leerzeilen.",
    tiktok: "Kurz und catchy. Max 150 Zeichen. Trendige Sprache. CTA für Kommentare.",
    youtube: "Video-Beschreibung: Zusammenfassung, Timestamps-Vorlage, Call-to-Action. 300-500 Wörter.",
  }

  const prompt = `Du bist ein erfahrener Social-Media-Manager. Erstelle einen ${body.platform}-Beitrag.

THEMA: ${body.topic}
PLATTFORM: ${body.platform}
TON: ${body.tone}
SPRACHE: ${body.language}

REGELN:
- ${platformLimits[body.platform.toLowerCase()] ?? "Optimiere für die Plattform."}
- ${body.includeHashtags ? "Füge 10-15 relevante Hashtags hinzu (nur existierende, populäre Hashtags verwenden)" : "Keine Hashtags."}
- ${body.includeEmoji ? "Verwende passende Emojis" : "Keine Emojis."}
- Schreibe authentisch, nicht werblich
- Der Content muss faktisch korrekt sein

Antworte als JSON:
{
  "content": "Der fertige Beitragstext",
  "hashtags": ["hashtag1", "hashtag2"],
  "bestTime": "Beste Posting-Zeit basierend auf allgemeinen Plattform-Daten",
  "bestDay": "Bester Wochentag",
  "tips": ["Tipp 1", "Tipp 2", "Tipp 3"],
  "charCount": 123
}`

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  })

  const text = message.content[0].type === "text" ? message.content[0].text : ""

  try {
    const start = text.indexOf("{")
    const end = text.lastIndexOf("}") + 1
    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end))
    }
  } catch {}

  return {
    content: text,
    hashtags: [],
    bestTime: "18:00–20:00",
    bestDay: "Dienstag oder Donnerstag",
    tips: [],
    charCount: text.length,
  }
}

function generateWithTemplate(body: GenerateRequest) {
  // Platform-specific best posting times (based on general industry data)
  const bestTimes: Record<string, { time: string; day: string }> = {
    instagram: { time: "11:00–13:00 oder 18:00–20:00", day: "Dienstag, Mittwoch oder Donnerstag" },
    facebook: { time: "09:00–11:00 oder 13:00–15:00", day: "Mittwoch oder Freitag" },
    linkedin: { time: "07:30–08:30 oder 12:00–13:00", day: "Dienstag oder Mittwoch" },
    tiktok: { time: "19:00–21:00", day: "Donnerstag oder Freitag" },
    youtube: { time: "14:00–16:00", day: "Freitag oder Samstag" },
  }

  const platformTips: Record<string, string[]> = {
    instagram: [
      "Erster Satz ist entscheidend – er wird im Feed als Vorschau angezeigt",
      "Nutze Absätze und Leerzeilen für bessere Lesbarkeit",
      "Stelle eine Frage am Ende um Kommentare zu fördern",
      "Speichere den Post als Reel oder Karussell für mehr Reichweite",
    ],
    facebook: [
      "Kurze Posts (unter 80 Wörter) erhalten mehr Engagement",
      "Fragen oder Umfragen erhöhen die Kommentarrate",
      "Videos werden vom Algorithmus bevorzugt",
    ],
    linkedin: [
      "Die erste Zeile muss zum Weiterlesen animieren (Hook)",
      "Persönliche Geschichten performen besser als reine Fakten",
      "Kommentare in den ersten 60 Minuten sind entscheidend",
    ],
    tiktok: [
      "Die ersten 0.5 Sekunden entscheiden ob weitergeschaut wird",
      "Trending Sounds erhöhen die Reichweite massiv",
      "CTA im Video und in der Beschreibung",
    ],
    youtube: [
      "Thumbnail und Titel sind 80% des Erfolgs",
      "Optimiere die ersten 30 Sekunden für die Retention",
      "Frage am Ende des Videos für Kommentare",
    ],
  }

  const platform = body.platform.toLowerCase()
  const timing = bestTimes[platform] ?? { time: "10:00–12:00", day: "Dienstag" }

  return {
    content: `[KI Content-Generator benötigt ANTHROPIC_API_KEY]\n\nThema: ${body.topic}\nPlattform: ${body.platform}\nTon: ${body.tone}\n\nTrage den ANTHROPIC_API_KEY in die Umgebungsvariablen ein, um KI-generierten Content zu erhalten. Ohne API-Key können wir dir trotzdem die besten Posting-Zeiten und Tipps geben.`,
    hashtags: [],
    bestTime: timing.time,
    bestDay: timing.day,
    tips: platformTips[platform] ?? ["Optimiere deinen Content für die gewählte Plattform"],
    charCount: 0,
    needsApiKey: true,
  }
}
