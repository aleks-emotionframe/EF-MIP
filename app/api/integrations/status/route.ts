import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const VALID_PLATFORMS = [
  "GOOGLE_ANALYTICS", "SEARCH_CONSOLE", "INSTAGRAM",
  "FACEBOOK", "YOUTUBE", "LINKEDIN", "TIKTOK",
] as const

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const platform = request.nextUrl.searchParams.get("platform")
  if (!platform || !VALID_PLATFORMS.includes(platform as any)) {
    return Response.json({ error: "Invalid platform" }, { status: 400 })
  }

  const organizationId = session.user.activeOrganizationId
  if (!organizationId) {
    return Response.json({ connected: false })
  }

  // Check database for integration status
  if (prisma) {
    try {
      const integration = await prisma.integration.findFirst({
        where: {
          organizationId,
          platform: platform as any,
          status: "CONNECTED",
        },
        select: {
          id: true,
          status: true,
          lastSyncAt: true,
          externalName: true,
        },
      })

      if (integration) {
        return Response.json({
          connected: true,
          lastSyncAt: integration.lastSyncAt,
          externalName: integration.externalName,
        })
      }
    } catch {
      // Database not available, fall through
    }
  }

  return Response.json({ connected: false })
}
