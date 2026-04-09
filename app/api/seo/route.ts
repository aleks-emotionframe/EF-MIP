import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export const maxDuration = 30

interface SEOCheck {
  category: string
  name: string
  status: "pass" | "warn" | "fail"
  value: string
  recommendation: string
}

interface SEOResult {
  url: string
  analyzedAt: string
  loadTimeMs: number
  score: number
  checks: SEOCheck[]
  meta: {
    title: string | null
    titleLength: number
    description: string | null
    descriptionLength: number
    canonical: string | null
    robots: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    viewport: string | null
    charset: string | null
    language: string | null
  }
  headings: { tag: string; text: string }[]
  images: { src: string; alt: string | null; hasAlt: boolean }[]
  links: { internal: number; external: number; broken: number }
  performance: {
    htmlSizeKb: number
    loadTimeMs: number
    redirects: number
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  const body = await request.json()
  let url = body.url as string

  if (!url) {
    return Response.json({ error: "URL ist erforderlich" }, { status: 400 })
  }

  // Normalize URL
  if (!url.startsWith("http")) url = `https://${url}`

  try {
    const result = await analyzeWebsite(url)
    return Response.json(result)
  } catch (err: any) {
    return Response.json(
      { error: `Analyse fehlgeschlagen: ${err.message}` },
      { status: 422 }
    )
  }
}

async function analyzeWebsite(url: string): Promise<SEOResult> {
  const startTime = Date.now()

  // Fetch the actual page
  const response = await fetch(url, {
    headers: {
      "User-Agent": "EmotionFrame-SEO-Analyzer/1.0",
      Accept: "text/html",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  })

  const loadTimeMs = Date.now() - startTime
  const html = await response.text()
  const finalUrl = response.url
  const redirected = finalUrl !== url

  // Parse HTML
  const meta = extractMeta(html)
  const headings = extractHeadings(html)
  const images = extractImages(html, finalUrl)
  const links = extractLinks(html, finalUrl)

  // Run checks
  const checks = runSEOChecks(meta, headings, images, links, html, loadTimeMs, response)

  // Calculate score
  const passCount = checks.filter((c) => c.status === "pass").length
  const warnCount = checks.filter((c) => c.status === "warn").length
  const score = Math.round(
    ((passCount * 1 + warnCount * 0.5) / checks.length) * 100
  )

  return {
    url: finalUrl,
    analyzedAt: new Date().toISOString(),
    loadTimeMs,
    score,
    checks,
    meta,
    headings: headings.slice(0, 20),
    images: images.slice(0, 30),
    links,
    performance: {
      htmlSizeKb: Math.round(html.length / 1024),
      loadTimeMs,
      redirects: redirected ? 1 : 0,
    },
  }
}

function extractMeta(html: string) {
  const get = (pattern: RegExp): string | null => {
    const match = html.match(pattern)
    return match ? decodeEntities(match[1].trim()) : null
  }

  const title = get(/<title[^>]*>([^<]*)<\/title>/i)
  const description =
    get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ??
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)
  const canonical = get(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
  const robots =
    get(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ??
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i)
  const ogTitle = get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)
  const ogDescription = get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i)
  const ogImage = get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)
  const viewport =
    get(/<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']*)["']/i) ??
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']viewport["']/i)
  const charset = get(/<meta[^>]+charset=["']([^"']*)["']/i) ?? (html.includes("utf-8") || html.includes("UTF-8") ? "utf-8" : null)
  const language = get(/<html[^>]+lang=["']([^"']*)["']/i)

  return {
    title,
    titleLength: title?.length ?? 0,
    description,
    descriptionLength: description?.length ?? 0,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    viewport,
    charset,
    language,
  }
}

function extractHeadings(html: string): { tag: string; text: string }[] {
  const headings: { tag: string; text: string }[] = []
  const regex = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, "").trim()
    if (text) headings.push({ tag: match[1].toLowerCase(), text: text.slice(0, 120) })
  }
  return headings
}

function extractImages(html: string, baseUrl: string): { src: string; alt: string | null; hasAlt: boolean }[] {
  const images: { src: string; alt: string | null; hasAlt: boolean }[] = []
  const regex = /<img[^>]*>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const tag = match[0]
    const srcMatch = tag.match(/src=["']([^"']*?)["']/i)
    const altMatch = tag.match(/alt=["']([^"']*?)["']/i)
    const hasAltAttr = /\balt=/i.test(tag)
    if (srcMatch) {
      images.push({
        src: srcMatch[1].slice(0, 200),
        alt: altMatch ? altMatch[1] : null,
        hasAlt: hasAltAttr && (altMatch?.[1]?.length ?? 0) > 0,
      })
    }
  }
  return images
}

function extractLinks(html: string, baseUrl: string): { internal: number; external: number; broken: number } {
  let internal = 0
  let external = 0
  const regex = /<a[^>]+href=["']([^"'#]*)["']/gi
  let match
  const domain = new URL(baseUrl).hostname

  while ((match = regex.exec(html)) !== null) {
    const href = match[1]
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue
    try {
      const linkUrl = new URL(href, baseUrl)
      if (linkUrl.hostname === domain) {
        internal++
      } else {
        external++
      }
    } catch {
      internal++
    }
  }

  return { internal, external, broken: 0 }
}

function runSEOChecks(
  meta: SEOResult["meta"],
  headings: SEOResult["headings"],
  images: SEOResult["images"],
  links: SEOResult["links"],
  html: string,
  loadTimeMs: number,
  response: Response
): SEOCheck[] {
  const checks: SEOCheck[] = []

  // Title
  if (!meta.title) {
    checks.push({ category: "Meta", name: "Seitentitel", status: "fail", value: "Fehlt", recommendation: "Füge einen <title>-Tag hinzu. Der Titel ist einer der wichtigsten SEO-Faktoren." })
  } else if (meta.titleLength < 30) {
    checks.push({ category: "Meta", name: "Seitentitel", status: "warn", value: `${meta.titleLength} Zeichen (zu kurz)`, recommendation: `Dein Titel hat nur ${meta.titleLength} Zeichen. Ideal sind 50-60 Zeichen für optimale Darstellung in Suchresultaten.` })
  } else if (meta.titleLength > 60) {
    checks.push({ category: "Meta", name: "Seitentitel", status: "warn", value: `${meta.titleLength} Zeichen (zu lang)`, recommendation: `Dein Titel hat ${meta.titleLength} Zeichen und wird in Google abgeschnitten. Kürze ihn auf max. 60 Zeichen.` })
  } else {
    checks.push({ category: "Meta", name: "Seitentitel", status: "pass", value: `${meta.titleLength} Zeichen`, recommendation: "Titel hat eine optimale Länge." })
  }

  // Description
  if (!meta.description) {
    checks.push({ category: "Meta", name: "Meta-Beschreibung", status: "fail", value: "Fehlt", recommendation: "Füge eine Meta-Beschreibung hinzu. Sie erscheint als Snippet in den Suchresultaten und beeinflusst die Klickrate." })
  } else if (meta.descriptionLength < 120) {
    checks.push({ category: "Meta", name: "Meta-Beschreibung", status: "warn", value: `${meta.descriptionLength} Zeichen (zu kurz)`, recommendation: `Die Beschreibung hat nur ${meta.descriptionLength} Zeichen. Ideal sind 150-160 Zeichen.` })
  } else if (meta.descriptionLength > 160) {
    checks.push({ category: "Meta", name: "Meta-Beschreibung", status: "warn", value: `${meta.descriptionLength} Zeichen (zu lang)`, recommendation: `Die Beschreibung hat ${meta.descriptionLength} Zeichen und wird abgeschnitten. Kürze auf max. 160 Zeichen.` })
  } else {
    checks.push({ category: "Meta", name: "Meta-Beschreibung", status: "pass", value: `${meta.descriptionLength} Zeichen`, recommendation: "Beschreibung hat eine optimale Länge." })
  }

  // Canonical
  checks.push(meta.canonical
    ? { category: "Meta", name: "Canonical-Tag", status: "pass", value: "Vorhanden", recommendation: "Canonical-Tag ist gesetzt." }
    : { category: "Meta", name: "Canonical-Tag", status: "warn", value: "Fehlt", recommendation: "Setze einen Canonical-Tag um Duplicate Content zu vermeiden." }
  )

  // Robots
  const isIndexable = !meta.robots || (!meta.robots.includes("noindex"))
  checks.push({ category: "Meta", name: "Indexierbarkeit", status: isIndexable ? "pass" : "warn", value: meta.robots ?? "Kein robots-Tag (Standard: index,follow)", recommendation: isIndexable ? "Seite ist für Suchmaschinen indexierbar." : "Seite ist auf noindex gesetzt und wird nicht in Suchresultaten erscheinen." })

  // Language
  checks.push(meta.language
    ? { category: "Meta", name: "Sprach-Attribut", status: "pass", value: meta.language, recommendation: "HTML lang-Attribut ist gesetzt." }
    : { category: "Meta", name: "Sprach-Attribut", status: "warn", value: "Fehlt", recommendation: "Setze ein lang-Attribut auf dem <html>-Tag (z.B. lang=\"de\") für bessere Spracherkennung." }
  )

  // Viewport
  checks.push(meta.viewport
    ? { category: "Technik", name: "Viewport-Tag", status: "pass", value: "Vorhanden", recommendation: "Mobile-freundlicher Viewport ist gesetzt." }
    : { category: "Technik", name: "Viewport-Tag", status: "fail", value: "Fehlt", recommendation: "Ohne Viewport-Tag wird die Seite auf Mobilgeräten nicht korrekt dargestellt. Füge <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> hinzu." }
  )

  // HTTPS
  checks.push(response.url.startsWith("https")
    ? { category: "Technik", name: "HTTPS", status: "pass", value: "Aktiv", recommendation: "Seite nutzt HTTPS." }
    : { category: "Technik", name: "HTTPS", status: "fail", value: "Nicht aktiv", recommendation: "Deine Seite nutzt kein HTTPS. Google bevorzugt HTTPS-Seiten. Installiere ein SSL-Zertifikat." }
  )

  // Load time
  if (loadTimeMs < 1000) {
    checks.push({ category: "Performance", name: "Ladezeit", status: "pass", value: `${loadTimeMs}ms`, recommendation: "Sehr gute Ladezeit." })
  } else if (loadTimeMs < 3000) {
    checks.push({ category: "Performance", name: "Ladezeit", status: "warn", value: `${loadTimeMs}ms`, recommendation: `Die Ladezeit beträgt ${(loadTimeMs / 1000).toFixed(1)}s. Unter 1s ist ideal. Prüfe Bildkomprimierung und Server-Antwortzeit.` })
  } else {
    checks.push({ category: "Performance", name: "Ladezeit", status: "fail", value: `${loadTimeMs}ms`, recommendation: `Die Ladezeit ist mit ${(loadTimeMs / 1000).toFixed(1)}s zu langsam. Optimiere Bilder, aktiviere Caching und prüfe den Server.` })
  }

  // HTML size
  const sizeKb = Math.round(html.length / 1024)
  checks.push(sizeKb < 100
    ? { category: "Performance", name: "HTML-Grösse", status: "pass", value: `${sizeKb} KB`, recommendation: "HTML-Dateigrösse ist in Ordnung." }
    : { category: "Performance", name: "HTML-Grösse", status: "warn", value: `${sizeKb} KB`, recommendation: `Die HTML-Datei ist ${sizeKb} KB gross. Versuche unnötiges Inline-CSS/JS zu entfernen.` }
  )

  // H1
  const h1s = headings.filter((h) => h.tag === "h1")
  if (h1s.length === 0) {
    checks.push({ category: "Inhalt", name: "H1-Überschrift", status: "fail", value: "Fehlt", recommendation: "Jede Seite sollte genau eine H1-Überschrift haben. Sie teilt Suchmaschinen das Hauptthema der Seite mit." })
  } else if (h1s.length > 1) {
    checks.push({ category: "Inhalt", name: "H1-Überschrift", status: "warn", value: `${h1s.length} gefunden`, recommendation: `Es gibt ${h1s.length} H1-Überschriften. Ideal ist genau eine H1 pro Seite.` })
  } else {
    checks.push({ category: "Inhalt", name: "H1-Überschrift", status: "pass", value: h1s[0].text.slice(0, 60), recommendation: "Eine H1-Überschrift ist vorhanden." })
  }

  // Heading hierarchy
  const hasH2 = headings.some((h) => h.tag === "h2")
  checks.push(hasH2
    ? { category: "Inhalt", name: "Überschriften-Struktur", status: "pass", value: `${headings.length} Überschriften`, recommendation: "Überschriften-Hierarchie ist vorhanden." }
    : { category: "Inhalt", name: "Überschriften-Struktur", status: "warn", value: "Keine H2 gefunden", recommendation: "Verwende H2-Überschriften um deinen Inhalt zu strukturieren. Das hilft Suchmaschinen und Nutzern." }
  )

  // Images alt
  const imagesWithoutAlt = images.filter((i) => !i.hasAlt)
  if (images.length === 0) {
    checks.push({ category: "Inhalt", name: "Bilder Alt-Texte", status: "warn", value: "Keine Bilder", recommendation: "Die Seite enthält keine Bilder. Bilder können die Nutzererfahrung verbessern." })
  } else if (imagesWithoutAlt.length === 0) {
    checks.push({ category: "Inhalt", name: "Bilder Alt-Texte", status: "pass", value: `${images.length} Bilder, alle mit Alt-Text`, recommendation: "Alle Bilder haben Alt-Texte." })
  } else {
    checks.push({ category: "Inhalt", name: "Bilder Alt-Texte", status: "fail", value: `${imagesWithoutAlt.length} von ${images.length} ohne Alt-Text`, recommendation: `${imagesWithoutAlt.length} Bild(er) haben keinen Alt-Text. Alt-Texte sind wichtig für Barrierefreiheit und Bilder-SEO.` })
  }

  // OG Tags
  const hasOG = meta.ogTitle && meta.ogDescription
  checks.push(hasOG
    ? { category: "Social", name: "Open Graph Tags", status: "pass", value: "Vorhanden", recommendation: "Open Graph Tags sind gesetzt für optimale Social-Media-Vorschau." }
    : { category: "Social", name: "Open Graph Tags", status: "warn", value: meta.ogTitle ? "Teilweise vorhanden" : "Fehlt", recommendation: "Setze og:title, og:description und og:image Tags für bessere Vorschau beim Teilen auf Social Media." }
  )

  // OG Image
  checks.push(meta.ogImage
    ? { category: "Social", name: "OG-Bild", status: "pass", value: "Vorhanden", recommendation: "Ein Social-Sharing-Bild ist gesetzt." }
    : { category: "Social", name: "OG-Bild", status: "warn", value: "Fehlt", recommendation: "Setze ein og:image Tag. Beiträge mit Bild werden auf Social Media deutlich häufiger geklickt." }
  )

  // Internal links
  if (links.internal > 3) {
    checks.push({ category: "Links", name: "Interne Verlinkung", status: "pass", value: `${links.internal} interne Links`, recommendation: "Gute interne Verlinkung." })
  } else {
    checks.push({ category: "Links", name: "Interne Verlinkung", status: "warn", value: `${links.internal} interne Links`, recommendation: "Wenig interne Links. Verlinke mehr auf relevante eigene Seiten um die Link-Kraft zu verteilen." })
  }

  // Structured data
  const hasStructuredData = html.includes("application/ld+json") || html.includes("itemtype=")
  checks.push(hasStructuredData
    ? { category: "Technik", name: "Strukturierte Daten", status: "pass", value: "Vorhanden", recommendation: "Strukturierte Daten (Schema.org) sind implementiert." }
    : { category: "Technik", name: "Strukturierte Daten", status: "warn", value: "Fehlt", recommendation: "Füge strukturierte Daten (JSON-LD) hinzu für Rich Snippets in Suchresultaten (z.B. FAQ, Bewertungen, Breadcrumbs)." }
  )

  return checks
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
}
