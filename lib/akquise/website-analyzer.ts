export interface WebsiteAnalysis {
  url: string
  isAccessible: boolean
  loadTimeMs?: number
  isHttps: boolean
  isMobileOptimized?: boolean
  hasMetaDescription: boolean
  metaDescription?: string
  title?: string
  h1Count: number
  imageCount: number
  imagesWithoutAlt: number
  wordCount: number
  hasContactForm: boolean
  hasSocialLinks: string[]
  technologies: string[]
  seoScore: number
  speedScore: number
  overallScore: number
  issues: string[]
  opportunities: string[]
}

function extractMetaContent(html: string, name: string): string | undefined {
  const pattern = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`,
    "i"
  )
  const match = html.match(pattern)
  return match?.[1] || match?.[2] || undefined
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match?.[1]?.trim() || undefined
}

function countH1(html: string): number {
  const matches = html.match(/<h1[\s>]/gi)
  return matches?.length || 0
}

function countImages(html: string): { total: number; withoutAlt: number } {
  const imgTags = html.match(/<img[^>]*>/gi) || []
  let withoutAlt = 0
  for (const img of imgTags) {
    if (!img.match(/alt=["'][^"']+["']/i)) {
      withoutAlt++
    }
  }
  return { total: imgTags.length, withoutAlt }
}

function countWords(html: string): number {
  const textOnly = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return textOnly.split(" ").filter((w) => w.length > 0).length
}

function hasForm(html: string): boolean {
  const formMatch = html.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || []
  for (const form of formMatch) {
    if (
      form.match(/type=["']email["']/i) ||
      form.match(/type=["']tel["']/i) ||
      form.match(/name=["'](?:email|message|kontakt|contact|name|telefon|phone)["']/i)
    ) {
      return true
    }
  }
  return false
}

function findSocialLinks(html: string): string[] {
  const platforms: { name: string; pattern: RegExp }[] = [
    { name: "instagram", pattern: /https?:\/\/(?:www\.)?instagram\.com\/[^\s"'<>]+/gi },
    { name: "facebook", pattern: /https?:\/\/(?:www\.)?facebook\.com\/[^\s"'<>]+/gi },
    { name: "linkedin", pattern: /https?:\/\/(?:www\.)?linkedin\.com\/[^\s"'<>]+/gi },
    { name: "tiktok", pattern: /https?:\/\/(?:www\.)?tiktok\.com\/[^\s"'<>]+/gi },
    { name: "youtube", pattern: /https?:\/\/(?:www\.)?youtube\.com\/[^\s"'<>]+/gi },
    { name: "twitter", pattern: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^\s"'<>]+/gi },
  ]
  const found: string[] = []
  for (const p of platforms) {
    if (p.pattern.test(html)) {
      found.push(p.name)
    }
  }
  return found
}

function detectTechnologies(html: string): string[] {
  const techs: string[] = []
  if (html.includes("wp-content") || html.includes("wordpress")) techs.push("WordPress")
  if (html.includes("shopify") || html.includes("Shopify")) techs.push("Shopify")
  if (html.includes("wix.com")) techs.push("Wix")
  if (html.includes("squarespace")) techs.push("Squarespace")
  if (html.includes("__next")) techs.push("Next.js")
  if (html.includes("react")) techs.push("React")
  if (html.includes("angular")) techs.push("Angular")
  if (html.includes("vue")) techs.push("Vue.js")
  if (html.includes("jquery") || html.includes("jQuery")) techs.push("jQuery")
  if (html.includes("bootstrap")) techs.push("Bootstrap")
  if (html.includes("tailwind")) techs.push("Tailwind CSS")
  if (html.includes("google-analytics") || html.includes("gtag")) techs.push("Google Analytics")
  if (html.includes("googletagmanager")) techs.push("Google Tag Manager")
  if (html.includes("fb-pixel") || html.includes("fbq(")) techs.push("Facebook Pixel")
  return techs
}

async function fetchPageSpeedScore(url: string): Promise<{ speed: number; mobile: boolean } | null> {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) })
    if (!res.ok) return null

    const data = await res.json()
    const perfScore = data.lighthouseResult?.categories?.performance?.score
    const viewportMeta = data.lighthouseResult?.audits?.viewport?.score
    return {
      speed: perfScore != null ? Math.round(perfScore * 100) : 50,
      mobile: viewportMeta === 1,
    }
  } catch {
    return null
  }
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`
  const isHttps = normalizedUrl.startsWith("https://")

  const analysis: WebsiteAnalysis = {
    url: normalizedUrl,
    isAccessible: false,
    isHttps,
    hasMetaDescription: false,
    h1Count: 0,
    imageCount: 0,
    imagesWithoutAlt: 0,
    wordCount: 0,
    hasContactForm: false,
    hasSocialLinks: [],
    technologies: [],
    seoScore: 0,
    speedScore: 0,
    overallScore: 0,
    issues: [],
    opportunities: [],
  }

  let html = ""
  try {
    const start = Date.now()
    const res = await fetch(normalizedUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EmotionFrame-Analyzer/1.0)",
      },
    })
    analysis.loadTimeMs = Date.now() - start
    analysis.isAccessible = res.ok
    if (!res.ok) {
      analysis.issues.push("Website ist nicht erreichbar")
      return analysis
    }
    html = await res.text()
  } catch {
    analysis.issues.push("Website ist nicht erreichbar oder zu langsam")
    return analysis
  }

  analysis.title = extractTitle(html)
  analysis.metaDescription = extractMetaContent(html, "description")
  analysis.hasMetaDescription = !!analysis.metaDescription
  analysis.h1Count = countH1(html)

  const images = countImages(html)
  analysis.imageCount = images.total
  analysis.imagesWithoutAlt = images.withoutAlt

  analysis.wordCount = countWords(html)
  analysis.hasContactForm = hasForm(html)
  analysis.hasSocialLinks = findSocialLinks(html)
  analysis.technologies = detectTechnologies(html)

  const viewportMeta = extractMetaContent(html, "viewport")
  analysis.isMobileOptimized = !!viewportMeta

  const pageSpeed = await fetchPageSpeedScore(normalizedUrl)
  if (pageSpeed) {
    analysis.speedScore = pageSpeed.speed
    analysis.isMobileOptimized = pageSpeed.mobile
  }

  let seoScore = 0
  if (isHttps) seoScore += 10
  if (analysis.hasMetaDescription) seoScore += 15
  if (analysis.title) seoScore += 15
  if (analysis.h1Count > 0) seoScore += 10
  if (analysis.imageCount > 0 && analysis.imagesWithoutAlt === 0) seoScore += 10
  if (analysis.wordCount > 300) seoScore += 10
  if (analysis.isMobileOptimized) seoScore += 15
  if (analysis.loadTimeMs && analysis.loadTimeMs < 3000) seoScore += 15
  analysis.seoScore = seoScore

  if (!analysis.speedScore && analysis.loadTimeMs) {
    if (analysis.loadTimeMs < 1000) analysis.speedScore = 90
    else if (analysis.loadTimeMs < 2000) analysis.speedScore = 75
    else if (analysis.loadTimeMs < 3000) analysis.speedScore = 60
    else if (analysis.loadTimeMs < 5000) analysis.speedScore = 40
    else analysis.speedScore = 20
  }

  analysis.overallScore = Math.round((seoScore + analysis.speedScore) / 2)

  if (!isHttps) analysis.issues.push("Website verwendet kein HTTPS")
  if (!analysis.title) analysis.issues.push("Kein Title-Tag vorhanden")
  if (!analysis.hasMetaDescription) analysis.issues.push("Keine Meta-Description vorhanden")
  if (analysis.h1Count === 0) analysis.issues.push("Keine H1-Ueberschrift gefunden")
  if (analysis.h1Count > 1) analysis.issues.push("Mehrere H1-Ueberschriften gefunden")
  if (analysis.imagesWithoutAlt > 0) analysis.issues.push(`${analysis.imagesWithoutAlt} Bilder ohne Alt-Text`)
  if (analysis.wordCount < 300) analysis.issues.push("Zu wenig Textinhalt auf der Startseite")
  if (!analysis.isMobileOptimized) analysis.issues.push("Nicht fuer Mobile optimiert")
  if (analysis.loadTimeMs && analysis.loadTimeMs > 3000) analysis.issues.push("Ladezeit zu hoch")
  if (analysis.hasSocialLinks.length === 0) analysis.issues.push("Keine Social-Media-Links auf der Website")
  if (!analysis.hasContactForm) analysis.issues.push("Kein Kontaktformular gefunden")

  if (!isHttps) analysis.opportunities.push("HTTPS-Zertifikat einrichten fuer bessere Sicherheit und SEO")
  if (!analysis.hasMetaDescription) analysis.opportunities.push("Meta-Description hinzufuegen fuer bessere Klickraten in Google")
  if (analysis.imagesWithoutAlt > 0) analysis.opportunities.push("Alt-Texte fuer alle Bilder hinzufuegen")
  if (analysis.wordCount < 300) analysis.opportunities.push("Mehr relevanten Textinhalt auf der Startseite erstellen")
  if (!analysis.isMobileOptimized) analysis.opportunities.push("Mobile Optimierung durchfuehren")
  if (analysis.speedScore < 50) analysis.opportunities.push("Website-Geschwindigkeit optimieren")
  if (analysis.hasSocialLinks.length === 0) analysis.opportunities.push("Social-Media-Profile auf der Website verlinken")
  if (!analysis.hasContactForm) analysis.opportunities.push("Kontaktformular fuer Lead-Generierung einbauen")

  return analysis
}
