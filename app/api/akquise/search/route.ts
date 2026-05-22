import { type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return Response.json({
      found: 0,
      analyzed: 0,
      errors: 0,
      message: "Google Places API Key benötigt",
    })
  }

  const body = await request.json()
  let branches: string[] = body.branches || []
  let regions: string[] = body.regions || []

  if ((!branches.length || !regions.length) && prisma) {
    try {
      const config = await prisma!.akquiseConfig.findFirst({
        orderBy: { updatedAt: "desc" },
      })
      if (config) {
        if (!branches.length) branches = config.branches as string[]
        if (!regions.length) regions = config.regions as string[]
      }
    } catch {
      // ignore
    }
  }

  if (!branches.length) {
    branches = ["Gastronomie", "Fitness", "Mode & Retail", "Immobilien", "Gesundheit"]
  }
  if (!regions.length) {
    regions = ["Zürich", "Bern", "Basel", "Luzern", "St. Gallen"]
  }

  try {
    const { runSearchPipeline } = await import("@/lib/akquise/lead-pipeline")
    const result = await runSearchPipeline(branches, regions)

    return Response.json({
      found: result.found ?? 0,
      analyzed: result.analyzed ?? 0,
      errors: result.errors ?? 0,
    })
  } catch {
    return Response.json({
      found: 0,
      analyzed: 0,
      errors: 0,
      message: "Such-Pipeline nicht verfügbar. Bitte Konfiguration prüfen.",
    })
  }
}
