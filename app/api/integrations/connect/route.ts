import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { getOAuthUrl, type PlatformType } from "@/lib/api/types"

const VALID_PLATFORMS: PlatformType[] = [
  "GOOGLE_ANALYTICS", "SEARCH_CONSOLE", "INSTAGRAM",
  "FACEBOOK", "YOUTUBE", "LINKEDIN", "TIKTOK",
]

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const platform = request.nextUrl.searchParams.get("platform") as PlatformType
  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return Response.json({ error: "Invalid platform" }, { status: 400 })
  }

  const organizationId = session.user.activeOrganizationId
  if (!organizationId) {
    return Response.json({ error: "No active organization" }, { status: 400 })
  }

  const state = Buffer.from(
    JSON.stringify({ organizationId, platform, userId: session.user.id })
  ).toString("base64url")

  const url = await getOAuthUrl(platform, state)
  return Response.json({ url })
}
