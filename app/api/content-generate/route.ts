import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

interface ProfileData {
  connected: boolean
  followerCount?: number
  avgEngagement?: number
  topPostTimes?: string[]
  recentPostTypes?: string[]
  bestPerformingContent?: string[]
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

  // Fetch real profile data if platform is connected
  const profileData = await getProfileData(
    session.user.activeOrganizationId ?? "",
    body.platform
  )

  // Fetch current Reddit trends for context
  const trends = await getCurrentTrends()

  if (ANTHROPIC_API_KEY) {
    try {
      const result = await generateWithClaude(body, profileData, trends)
      return Response.json({ ...result, source: "claude", profileConnected: profileData.connected })
    } catch {
      // Fall through to template
    }
  }

  const result = generateWithTemplate(body, profileData)
  return Response.json({ ...result, source: "template", profileConnected: profileData.connected })
}

// ─── Fetch real profile data from connected platform ────────────
async function getProfileData(organizationId: string, platform: string): Promise<ProfileData> {
  if (!prisma || !organizationId) return { connected: false }

  const platformMap: Record<string, string> = {
    Instagram: "INSTAGRAM",
    Facebook: "FACEBOOK",
    LinkedIn: "LINKEDIN",
    TikTok: "TIKTOK",
    YouTube: "YOUTUBE",
  }

  try {
    const integration = await prisma.integration.findFirst({
      where: {
        organizationId,
        platform: platformMap[platform] as any,
        status: "CONNECTED",
      },
    })

    if (!integration) return { connected: false }

    // Fetch recent metrics for this integration
    const metrics = await prisma.metric.findMany({
      where: {
        integrationId: integration.id,
        collectedAt: { gte: new Date(Date.now() - 30 * 86400000) },
      },
      orderBy: { collectedAt: "desc" },
      take: 200,
    })

    if (metrics.length === 0) return { connected: true }

    // Extract real data
    const followerMetrics = metrics.filter((m) => m.metricName === "followers")
    const engagementMetrics = metrics.filter((m) => m.metricName === "engagement")

    return {
      connected: true,
      followerCount: followerMetrics[0]?.metricValue,
      avgEngagement: engagementMetrics.length > 0
        ? engagementMetrics.reduce((a, m) => a + m.metricValue, 0) / engagementMetrics.length
        : undefined,
    }
  } catch {
    return { connected: false }
  }
}

// ─── Fetch Reddit trends for context ────────────────────────────
async function getCurrentTrends(): Promise<string> {
  try {
    // Use internal trends API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/trends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timeframe: "week" }),
    }).catch(() => null)

    if (!res || !res.ok) return ""

    const data = await res.json()
    const topTrends = data.categories
      ?.flatMap((c: any) => c.trends)
      ?.slice(0, 5)
      ?.map((t: any) => t.title)
      ?.join("; ")

    return topTrends || ""
  } catch {
    return ""
  }
}

// ─── Claude API Generation ──────────────────────────────────────
async function generateWithClaude(
  body: GenerateRequest,
  profile: ProfileData,
  trends: string
) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk")
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

  const platformRules: Record<string, string> = {
    Instagram: "WICHTIG: Max 100-150 Wörter. Starker Hook in der ersten Zeile (wird als Vorschau gezeigt). Kurzform. Absätze. Call-to-Action am Ende. Keine langen Textblöcke.",
    Facebook: "Max 40-80 Wörter. Eine Frage am Ende. Kurz und direkt.",
    LinkedIn: "Max 100-120 Wörter. Professionell aber persönlich. Hook erste Zeile. Absätze mit Leerzeilen.",
    TikTok: "Max 2-3 Sätze (unter 150 Zeichen). Extrem catchy. CTA für Kommentare. Trendige Sprache.",
    YouTube: "Video-Beschreibung: Kurze Zusammenfassung (3 Sätze), dann Timestamps-Vorlage, CTA. Max 200 Wörter.",
  }

  // Build context from real data
  let profileContext = ""
  if (profile.connected) {
    profileContext = "\n\nECHTE PROFILDATEN DES KUNDEN:"
    if (profile.followerCount) profileContext += `\n- Aktuelle Follower: ${profile.followerCount.toLocaleString("de-CH")}`
    if (profile.avgEngagement) profileContext += `\n- Durchschnittliche Engagement-Rate: ${profile.avgEngagement.toFixed(1)}%`
    profileContext += "\nPasse den Content an diese Profilgrösse an (z.B. Tonalität, Reichweiten-Erwartung)."
  }

  let trendContext = ""
  if (trends) {
    trendContext = `\n\nAKTUELLE SOCIAL-MEDIA-TRENDS (diese Woche):\n${trends}\nBerücksichtige diese Trends wenn sie zum Thema passen.`
  }

  const prompt = `Du bist ein Top Social-Media-Manager im Jahr 2026. Schreibe kurzen, modernen Content.

THEMA: ${body.topic}
PLATTFORM: ${body.platform}
TON: ${body.tone}
SPRACHE: ${body.language}

REGELN:
- ${platformRules[body.platform] ?? "Kurz und knackig. Max 100 Wörter."}
- KURZ! Social Media 2026 = Kurzform, kein Textblock. Jeder Satz muss sitzen.
- ${body.includeHashtags ? "Füge 8-12 relevante, echte Hashtags hinzu" : "Keine Hashtags."}
- ${body.includeEmoji ? "Passende Emojis einbauen" : "Keine Emojis."}
- Kein Werbesprech, kein Clickbait. Authentisch und direkt.
- Faktisch korrekt, nichts erfinden.${profileContext}${trendContext}

Antworte als JSON:
{
  "content": "Der fertige Beitragstext (KURZ!)",
  "hashtags": ["tag1", "tag2"],
  "bestTime": "${profile.connected ? "Basierend auf dem Profil die beste Zeit nennen" : "Allgemeine beste Posting-Zeit für " + body.platform}",
  "bestDay": "Bester Wochentag",
  "tips": ["Tipp 1 (spezifisch zum Thema)", "Tipp 2", "Tipp 3"],
  "charCount": 123
}`

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1200,
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

// ─── Template fallback ──────────────────────────────────────────
function generateWithTemplate(body: GenerateRequest, profile: ProfileData) {
  const bestTimes: Record<string, { time: string; day: string }> = {
    instagram: { time: "11:00–13:00 oder 18:00–20:00", day: "Dienstag, Mittwoch oder Donnerstag" },
    facebook: { time: "09:00–11:00 oder 13:00–15:00", day: "Mittwoch oder Freitag" },
    linkedin: { time: "07:30–08:30 oder 12:00–13:00", day: "Dienstag oder Mittwoch" },
    tiktok: { time: "19:00–21:00", day: "Donnerstag oder Freitag" },
    youtube: { time: "14:00–16:00", day: "Freitag oder Samstag" },
  }

  const platformTips: Record<string, string[]> = {
    instagram: [
      "Kurzform ist King 2026 – max. 3-4 Sätze + starker Hook",
      "Karussell-Posts erzielen 3x mehr Reichweite als Einzelbilder",
      "Frage am Ende für Kommentare",
      "Reels werden vom Algorithmus bevorzugt",
    ],
    facebook: [
      "Kurze Posts (unter 40 Wörter) performen am besten",
      "Videos werden vom Algorithmus stark bevorzugt",
      "Fragen und Umfragen erhöhen die Kommentarrate",
    ],
    linkedin: [
      "Hook in der allerersten Zeile – entscheidet über Klick",
      "Persönliche Erfahrungen performen besser als Fakten",
      "Kommentare in den ersten 60 Min. sind entscheidend",
    ],
    tiktok: [
      "Erste 0.5 Sekunden entscheiden alles",
      "Trending Sounds = mehr Reichweite",
      "CTA im Video UND in der Beschreibung",
    ],
    youtube: [
      "Thumbnail und Titel = 80% des Erfolgs",
      "Erste 30 Sekunden optimieren für Retention",
      "Frage am Ende des Videos für Kommentare",
    ],
  }

  const platform = body.platform.toLowerCase()
  const timing = bestTimes[platform] ?? { time: "10:00–12:00", day: "Dienstag" }

  let content: string
  if (profile.connected) {
    content = `Dein ${body.platform}-Profil ist verbunden. Die KI-Content-Generierung wird gerade aktiviert.\n\nThema: "${body.topic}"\n\nSobald die KI verfügbar ist, analysiert sie dein echtes Profil und erstellt massgeschneiderten Content.`
  } else {
    content = `Verbinde dein ${body.platform}-Profil unter Einstellungen → Integrationen für personalisierten Content.\n\nThema: "${body.topic}"\n\nMit verbundenem Profil analysiert die KI deine echten Daten und erstellt optimierten Content.`
  }

  return {
    content,
    hashtags: [],
    bestTime: timing.time,
    bestDay: timing.day,
    tips: platformTips[platform] ?? ["Optimiere deinen Content für die Plattform"],
    charCount: content.length,
    needsApiKey: true,
  }
}
