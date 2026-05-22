export interface SocialProfile {
  platform: string
  url: string
  found: boolean
  handle?: string
  metrics?: {
    followers?: number
    posts?: number
    engagement?: string
  }
}

export interface SocialAnalysis {
  profiles: SocialProfile[]
  platformCount: number
  overallScore: number
  issues: string[]
  opportunities: string[]
}

const PLATFORMS = [
  { name: "Instagram", domain: "instagram.com", prefix: "https://www.instagram.com/" },
  { name: "Facebook", domain: "facebook.com", prefix: "https://www.facebook.com/" },
  { name: "LinkedIn", domain: "linkedin.com", prefix: "https://www.linkedin.com/company/" },
  { name: "TikTok", domain: "tiktok.com", prefix: "https://www.tiktok.com/@" },
  { name: "YouTube", domain: "youtube.com", prefix: "https://www.youtube.com/@" },
  { name: "Twitter", domain: "twitter.com", prefix: "https://twitter.com/" },
]

function extractSocialLinksFromHtml(html: string): Map<string, string> {
  const links = new Map<string, string>()
  for (const platform of PLATFORMS) {
    const pattern = new RegExp(
      `https?://(?:www\\.)?${platform.domain.replace(".", "\\.")}/([^\\s"'<>]+)`,
      "gi"
    )
    const match = pattern.exec(html)
    if (match) {
      links.set(platform.name, match[0])
    }
  }
  return links
}

function normalizeBusinessName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 30)
}

async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EmotionFrame-Analyzer/1.0)",
      },
      redirect: "follow",
    })
    return res.ok
  } catch {
    return false
  }
}

export async function analyzeSocialPresence(
  businessName: string,
  website?: string
): Promise<SocialAnalysis> {
  const profiles: SocialProfile[] = []
  let foundFromWebsite = new Map<string, string>()

  if (website) {
    try {
      const normalizedUrl = website.startsWith("http") ? website : `https://${website}`
      const res = await fetch(normalizedUrl, {
        signal: AbortSignal.timeout(10000),
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; EmotionFrame-Analyzer/1.0)",
        },
      })
      if (res.ok) {
        const html = await res.text()
        foundFromWebsite = extractSocialLinksFromHtml(html)
      }
    } catch {}
  }

  const slug = normalizeBusinessName(businessName)

  for (const platform of PLATFORMS) {
    const websiteLink = foundFromWebsite.get(platform.name)

    if (websiteLink) {
      const handleMatch = websiteLink.match(
        new RegExp(`${platform.domain.replace(".", "\\.")}/(@?[^/?#]+)`)
      )
      profiles.push({
        platform: platform.name,
        url: websiteLink,
        found: true,
        handle: handleMatch?.[1] || undefined,
      })
      continue
    }

    const guessUrl = `${platform.prefix}${slug}`
    const exists = await checkUrlExists(guessUrl)
    profiles.push({
      platform: platform.name,
      url: guessUrl,
      found: exists,
      handle: exists ? slug : undefined,
    })
  }

  const platformCount = profiles.filter((p) => p.found).length

  let overallScore = 0
  if (platformCount > 0) overallScore += 25
  overallScore += Math.min(platformCount, 5) * 15

  const issues: string[] = []
  const opportunities: string[] = []

  if (platformCount === 0) {
    issues.push("Keine Social-Media-Profile gefunden")
  }

  const hasWebsiteLinks = foundFromWebsite.size > 0
  if (!hasWebsiteLinks && website) {
    issues.push("Keine Social-Media-Links auf der Website")
  }

  for (const profile of profiles) {
    if (!profile.found) {
      issues.push(`Kein ${profile.platform}-Profil gefunden`)
    }
  }

  const instagram = profiles.find((p) => p.platform === "Instagram")
  if (!instagram?.found) {
    opportunities.push("Instagram fuer visuelle Inhalte nutzen")
  }

  const linkedin = profiles.find((p) => p.platform === "LinkedIn")
  if (!linkedin?.found) {
    opportunities.push("LinkedIn fuer B2B-Netzwerk aufbauen")
  }

  const facebook = profiles.find((p) => p.platform === "Facebook")
  if (!facebook?.found) {
    opportunities.push("Facebook-Seite fuer lokale Reichweite erstellen")
  }

  const tiktok = profiles.find((p) => p.platform === "TikTok")
  if (!tiktok?.found) {
    opportunities.push("TikTok fuer juengere Zielgruppen in Betracht ziehen")
  }

  const youtube = profiles.find((p) => p.platform === "YouTube")
  if (!youtube?.found) {
    opportunities.push("YouTube-Kanal fuer Video-Content erstellen")
  }

  if (platformCount > 0 && !hasWebsiteLinks && website) {
    opportunities.push("Social-Media-Profile auf der Website verlinken")
  }

  return {
    profiles,
    platformCount,
    overallScore: Math.min(overallScore, 100),
    issues,
    opportunities,
  }
}
