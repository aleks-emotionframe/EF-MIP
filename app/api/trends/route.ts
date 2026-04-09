import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export const maxDuration = 30

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID ?? ""
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET ?? ""
const REDDIT_USERNAME = process.env.REDDIT_USERNAME ?? ""
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD ?? ""

const SUBREDDITS = [
  "socialmedia",
  "marketing",
  "digital_marketing",
  "content_marketing",
  "SEO",
  "PPC",
  "TikTokMarketing",
  "InstagramMarketing",
]

interface RedditPost {
  title: string
  selftext: string
  score: number
  num_comments: number
  subreddit: string
  permalink: string
  created_utc: number
  link_flair_text: string | null
  url: string
}

interface TrendItem {
  id: string
  title: string
  summary: string
  subreddit: string
  score: number
  comments: number
  url: string
  createdAt: string
  tags: string[]
}

interface TrendCategory {
  name: string
  icon: string
  trends: TrendItem[]
}

// ─── Reddit OAuth Token ─────────────────────────────────────────
async function getRedditToken(): Promise<string | null> {
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) return null

  const credentials = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64")

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "EmotionFrame/1.0",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: REDDIT_USERNAME,
      password: REDDIT_PASSWORD,
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.access_token ?? null
}

// ─── Fetch top posts from a subreddit ───────────────────────────
async function fetchSubreddit(
  token: string,
  subreddit: string,
  timeframe: string = "week",
  limit: number = 10
): Promise<RedditPost[]> {
  const res = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/top?t=${timeframe}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "EmotionFrame/1.0",
      },
    }
  )

  if (!res.ok) return []
  const data = await res.json()

  return (data.data?.children ?? []).map((child: any) => ({
    title: child.data.title,
    selftext: child.data.selftext?.slice(0, 500) ?? "",
    score: child.data.score,
    num_comments: child.data.num_comments,
    subreddit: child.data.subreddit,
    permalink: child.data.permalink,
    created_utc: child.data.created_utc,
    link_flair_text: child.data.link_flair_text,
    url: child.data.url,
  }))
}

// ─── Analyze posts into trend categories ────────────────────────
function categorizeTrends(posts: RedditPost[]): TrendCategory[] {
  const categories: Record<string, TrendItem[]> = {
    "Strategie & Planung": [],
    "Content & Formate": [],
    "Plattform-Updates": [],
    "Tools & Automation": [],
    "Wachstum & Engagement": [],
    "SEO & Ads": [],
  }

  for (const post of posts) {
    const titleLower = post.title.toLowerCase()
    const textLower = (post.selftext + " " + post.title).toLowerCase()

    const item: TrendItem = {
      id: `${post.subreddit}-${post.created_utc}`,
      title: post.title,
      summary: post.selftext
        ? post.selftext.slice(0, 200) + (post.selftext.length > 200 ? "..." : "")
        : "",
      subreddit: post.subreddit,
      score: post.score,
      comments: post.num_comments,
      url: `https://reddit.com${post.permalink}`,
      createdAt: new Date(post.created_utc * 1000).toLocaleDateString("de-CH"),
      tags: extractTags(textLower),
    }

    // Categorize
    if (/strateg|plan|budget|roi|kpi|goal/i.test(textLower)) {
      categories["Strategie & Planung"].push(item)
    } else if (/content|video|reel|short|story|carousel|post|hook|caption/i.test(textLower)) {
      categories["Content & Formate"].push(item)
    } else if (/algorithm|update|feature|new|launch|change|instagram|tiktok|linkedin|facebook|youtube|thread/i.test(textLower)) {
      categories["Plattform-Updates"].push(item)
    } else if (/tool|automat|schedule|ai|gpt|chatgpt|software|app|saas/i.test(textLower)) {
      categories["Tools & Automation"].push(item)
    } else if (/seo|google|search|rank|keyword|ppc|ads|advertising|paid/i.test(textLower)) {
      categories["SEO & Ads"].push(item)
    } else {
      categories["Wachstum & Engagement"].push(item)
    }
  }

  return Object.entries(categories)
    .filter(([_, items]) => items.length > 0)
    .map(([name, trends]) => ({
      name,
      icon: getCategoryIcon(name),
      trends: trends.sort((a, b) => b.score - a.score).slice(0, 8),
    }))
}

function extractTags(text: string): string[] {
  const tags: string[] = []
  if (/instagram|ig\b/i.test(text)) tags.push("Instagram")
  if (/tiktok/i.test(text)) tags.push("TikTok")
  if (/linkedin/i.test(text)) tags.push("LinkedIn")
  if (/facebook|fb\b|meta\b/i.test(text)) tags.push("Facebook")
  if (/youtube|yt\b/i.test(text)) tags.push("YouTube")
  if (/twitter|x\.com/i.test(text)) tags.push("X/Twitter")
  if (/thread/i.test(text)) tags.push("Threads")
  if (/reel|short/i.test(text)) tags.push("Kurzvideos")
  if (/ai\b|gpt|chatgpt|artificial/i.test(text)) tags.push("KI")
  if (/seo/i.test(text)) tags.push("SEO")
  if (/engagement/i.test(text)) tags.push("Engagement")
  if (/organic/i.test(text)) tags.push("Organisch")
  if (/paid|ads|advertising/i.test(text)) tags.push("Paid")
  return tags.slice(0, 4)
}

function getCategoryIcon(name: string): string {
  const map: Record<string, string> = {
    "Strategie & Planung": "target",
    "Content & Formate": "pen-tool",
    "Plattform-Updates": "bell",
    "Tools & Automation": "zap",
    "Wachstum & Engagement": "trending-up",
    "SEO & Ads": "search",
  }
  return map[name] ?? "sparkles"
}

// ─── API Handler ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  const body = await request.json()
  const timeframe = body.timeframe ?? "week"
  const customSubreddits = body.subreddits as string[] | undefined

  const subredditsToFetch = customSubreddits?.length ? customSubreddits : SUBREDDITS

  // Try real Reddit API
  const token = await getRedditToken()

  if (token) {
    try {
      const allPosts: RedditPost[] = []

      // Fetch from all subreddits in parallel
      const results = await Promise.allSettled(
        subredditsToFetch.map((sub) => fetchSubreddit(token, sub, timeframe, 15))
      )

      for (const result of results) {
        if (result.status === "fulfilled") {
          allPosts.push(...result.value)
        }
      }

      // Sort by score globally
      allPosts.sort((a, b) => b.score - a.score)

      const categories = categorizeTrends(allPosts)

      return Response.json({
        source: "reddit-live",
        fetchedAt: new Date().toISOString(),
        timeframe,
        totalPosts: allPosts.length,
        subreddits: subredditsToFetch,
        categories,
        topPosts: allPosts.slice(0, 20).map((p) => ({
          title: p.title,
          subreddit: p.subreddit,
          score: p.score,
          comments: p.num_comments,
          url: `https://reddit.com${p.permalink}`,
          createdAt: new Date(p.created_utc * 1000).toLocaleDateString("de-CH"),
          tags: extractTags((p.title + " " + p.selftext).toLowerCase()),
        })),
      })
    } catch {
      // Fall through to demo
    }
  }

  // Demo fallback
  return Response.json(getDemoTrends(timeframe))
}

function getDemoTrends(timeframe: string) {
  return {
    source: "demo",
    fetchedAt: new Date().toISOString(),
    timeframe,
    totalPosts: 0,
    subreddits: SUBREDDITS,
    categories: [
      {
        name: "Content & Formate",
        icon: "pen-tool",
        trends: [
          { id: "d1", title: "Carousel Posts outperform single images 3:1 on Instagram in 2026", summary: "Neue Daten zeigen, dass Karussell-Posts dreimal mehr Reichweite erzielen als einzelne Bilder. Besonders Educational Content performt gut.", subreddit: "InstagramMarketing", score: 847, comments: 124, url: "#", createdAt: "08.04.2026", tags: ["Instagram", "Engagement"] },
          { id: "d2", title: "The 3-second hook rule for TikTok and Reels is dead - here's what works now", summary: "Die Community diskutiert neue Erkenntnisse: Pattern Interrupts in den ersten 0.5 Sekunden sind wichtiger als ein 3-Sekunden-Hook.", subreddit: "TikTokMarketing", score: 623, comments: 89, url: "#", createdAt: "07.04.2026", tags: ["TikTok", "Kurzvideos"] },
        ],
      },
      {
        name: "Plattform-Updates",
        icon: "bell",
        trends: [
          { id: "d3", title: "Instagram testing 'Blend' feature - shared Reels feed with friends", summary: "Instagram testet ein neues Feature namens 'Blend', bei dem Freunde einen gemeinsamen Reels-Feed teilen können.", subreddit: "socialmedia", score: 1240, comments: 203, url: "#", createdAt: "09.04.2026", tags: ["Instagram", "Kurzvideos"] },
          { id: "d4", title: "LinkedIn just killed hashtags - what's replacing them?", summary: "LinkedIn hat die Sichtbarkeit von Hashtags drastisch reduziert. Keywords im Text sind jetzt wichtiger für die Auffindbarkeit.", subreddit: "linkedin", score: 534, comments: 67, url: "#", createdAt: "06.04.2026", tags: ["LinkedIn"] },
        ],
      },
      {
        name: "Tools & Automation",
        icon: "zap",
        trends: [
          { id: "d5", title: "AI-generated content now gets flagged by Instagram - here's how to stay safe", summary: "Instagram erkennt jetzt KI-generierten Content und markiert ihn. Die Community teilt Strategien, wie man KI als Unterstützung nutzt ohne geflaggt zu werden.", subreddit: "marketing", score: 956, comments: 178, url: "#", createdAt: "08.04.2026", tags: ["KI", "Instagram"] },
        ],
      },
      {
        name: "Wachstum & Engagement",
        icon: "trending-up",
        trends: [
          { id: "d6", title: "We grew from 0 to 50K followers in 90 days - complete breakdown", summary: "Ein detaillierter Erfahrungsbericht über organisches Wachstum auf TikTok mit einer Nischen-Strategie und täglichen Posts.", subreddit: "socialmedia", score: 2100, comments: 342, url: "#", createdAt: "05.04.2026", tags: ["TikTok", "Organisch"] },
          { id: "d7", title: "Comment sections are the new engagement hack - here's the data", summary: "Kommentare unter fremden Posts als Strategie: Wer täglich 30 Min. kommentiert, sieht 40% mehr Profilbesuche.", subreddit: "digital_marketing", score: 445, comments: 56, url: "#", createdAt: "07.04.2026", tags: ["Engagement", "Organisch"] },
        ],
      },
      {
        name: "SEO & Ads",
        icon: "search",
        trends: [
          { id: "d8", title: "Google SGE is changing SEO completely - what marketers need to know", summary: "Google's Search Generative Experience verändert die Klickraten massiv. Positionen 1-3 verlieren Traffic an KI-Zusammenfassungen.", subreddit: "SEO", score: 1560, comments: 234, url: "#", createdAt: "09.04.2026", tags: ["SEO", "KI"] },
        ],
      },
      {
        name: "Strategie & Planung",
        icon: "target",
        trends: [
          { id: "d9", title: "Stop posting daily - why 3x/week outperforms 7x/week", summary: "Mehrere Case Studies zeigen: Weniger posten mit höherer Qualität schlägt tägliches Posten. Der Algorithmus bevorzugt Engagement pro Post.", subreddit: "content_marketing", score: 780, comments: 112, url: "#", createdAt: "06.04.2026", tags: ["Engagement", "Organisch"] },
        ],
      },
    ],
    topPosts: [],
    isDemo: true,
  }
}
