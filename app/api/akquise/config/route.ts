import { type NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEFAULT_CONFIG = {
  id: "default",
  branches: ["Gastronomie", "Fitness", "Mode & Retail", "Immobilien", "Gesundheit"],
  regions: ["Zürich", "Bern", "Basel", "Luzern", "St. Gallen"],
  isActive: true,
  searchTime: "02:00",
  maxResults: 30,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export async function GET() {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  if (!prisma) {
    return Response.json(DEFAULT_CONFIG)
  }

  try {
    const config = await prisma!.akquiseConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    })

    if (!config) {
      return Response.json(DEFAULT_CONFIG)
    }

    return Response.json(config)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Nicht autorisiert" }, { status: 403 })
  }

  const body = await request.json()

  if (!prisma) {
    return Response.json({
      ...DEFAULT_CONFIG,
      branches: body.branches ?? DEFAULT_CONFIG.branches,
      regions: body.regions ?? DEFAULT_CONFIG.regions,
      isActive: body.isActive ?? DEFAULT_CONFIG.isActive,
      searchTime: body.searchTime ?? DEFAULT_CONFIG.searchTime,
      maxResults: body.maxResults ?? DEFAULT_CONFIG.maxResults,
      updatedAt: new Date().toISOString(),
    })
  }

  try {
    const existing = await prisma!.akquiseConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    })

    const data = {
      branches: body.branches ?? DEFAULT_CONFIG.branches,
      regions: body.regions ?? DEFAULT_CONFIG.regions,
      isActive: body.isActive ?? DEFAULT_CONFIG.isActive,
      searchTime: body.searchTime ?? DEFAULT_CONFIG.searchTime,
      maxResults: body.maxResults ?? DEFAULT_CONFIG.maxResults,
    }

    let config
    if (existing) {
      config = await prisma!.akquiseConfig.update({
        where: { id: existing.id },
        data,
      })
    } else {
      config = await prisma!.akquiseConfig.create({ data })
    }

    return Response.json(config)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler"
    return Response.json({ error: message }, { status: 500 })
  }
}
