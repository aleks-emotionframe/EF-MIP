import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  body.organization_id = session.user.activeOrganizationId || "demo-org-1"

  try {
    const res = await fetch(`${AI_ENGINE_URL}/api/insights/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) throw new Error("AI engine error")
    return Response.json(await res.json())
  } catch {
    // Return demo insights when AI engine is not running
    return Response.json(getDemoInsights())
  }
}

function getDemoInsights() {
  return {
    insights: [
      {
        id: "demo-1",
        type: "anomaly",
        priority: "critical",
        title: "Spike bei Instagram Impressions",
        description: "Am 07.04. wurde eine Erhöhung von 62.3% bei Impressions erkannt (Wert: 41,200, Durchschnitt: 25,380). Dies könnte auf einen viralen Post oder eine algorithmische Änderung zurückzuführen sein.",
        confidence: 0.94,
        platform: "INSTAGRAM",
        metric_name: "impressions",
        created_at: new Date().toISOString(),
        actions: ["Ursache untersuchen", "Content replizieren", "Monitoring verstärken"],
      },
      {
        id: "demo-2",
        type: "trend",
        priority: "high",
        title: "YouTube Subscribers: Aufwärtstrend (+18.5%)",
        description: "Subscribers zeigt einen positiven Trend von +18.5% in den letzten 7 Tagen (Ø 5,840 vs. Vorwoche Ø 4,930). Die neue Shorts-Strategie scheint aufzugehen.",
        confidence: 0.87,
        platform: "YOUTUBE",
        metric_name: "subscribers",
        created_at: new Date().toISOString(),
        actions: ["Shorts-Produktion erhöhen", "Trend beobachten", "Budget anpassen"],
      },
      {
        id: "demo-3",
        type: "recommendation",
        priority: "high",
        title: "Content-Strategie optimieren",
        description: "Basierend auf dem aktuellen Engagement-Trend empfehlen wir, mehr Video-Content zu produzieren. Reels und kurze Clips zeigen 3x höheres Engagement als statische Posts.",
        confidence: 0.88,
        created_at: new Date().toISOString(),
        actions: ["Content-Plan erstellen", "Video-Produktion starten", "A/B Test aufsetzen"],
      },
      {
        id: "demo-4",
        type: "anomaly",
        priority: "medium",
        title: "Drop bei Facebook Engagement",
        description: "Am 06.04. wurde ein Rückgang von -28.7% bei Engagement erkannt. Der organische Reach sinkt seit 3 Tagen - möglicherweise ein Algorithmus-Update.",
        confidence: 0.76,
        platform: "FACEBOOK",
        metric_name: "engagement",
        created_at: new Date().toISOString(),
        actions: ["Posting-Frequenz prüfen", "Paid Boost testen", "Content-Mix ändern"],
      },
      {
        id: "demo-5",
        type: "recommendation",
        priority: "medium",
        title: "Posting-Zeiten anpassen",
        description: "Die Analyse zeigt Peak-Engagement zwischen 18:00-20:00 Uhr. Aktuell werden Posts hauptsächlich morgens veröffentlicht. Eine Verschiebung könnte die Reichweite um 25% steigern.",
        confidence: 0.79,
        created_at: new Date().toISOString(),
        actions: ["Schedule anpassen", "Peak-Zeiten testen", "Automatisierung einrichten"],
      },
      {
        id: "demo-6",
        type: "forecast",
        priority: "medium",
        title: "Prognose: +12% Follower-Wachstum (30 Tage)",
        description: "Basierend auf dem aktuellen Wachstumstrend prognostizieren wir einen Anstieg der Instagram Followers um ca. 12% in den nächsten 30 Tagen (von 15,200 auf ~17,020).",
        confidence: 0.71,
        platform: "INSTAGRAM",
        metric_name: "followers",
        created_at: new Date().toISOString(),
        actions: ["Wachstum beobachten", "Kampagne planen", "Influencer-Kooperation prüfen"],
      },
      {
        id: "demo-7",
        type: "trend",
        priority: "low",
        title: "LinkedIn Clicks: Stabil (+2.1%)",
        description: "LinkedIn Clicks zeigen eine leichte Zunahme von 2.1% - ein stabiler, positiver Mikro-Trend. Die B2B-Content-Strategie funktioniert.",
        confidence: 0.65,
        platform: "LINKEDIN",
        metric_name: "clicks",
        created_at: new Date().toISOString(),
        actions: ["Strategie beibehalten", "Thought-Leadership ausbauen"],
      },
    ],
    generated_at: new Date().toISOString(),
  }
}
