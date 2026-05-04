import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { platform } = await request.json()
  if (!platform) {
    return Response.json({ error: "Missing platform" }, { status: 400 })
  }

  const organizationId = session.user.activeOrganizationId
  if (!organizationId) {
    return Response.json({ error: "No active organization" }, { status: 400 })
  }

  try {
    await prisma!.integration.updateMany({
      where: { organizationId, platform },
      data: {
        status: "DISCONNECTED",
        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
      },
    })
    return Response.json({ success: true })
  } catch {
    return Response.json({ success: true })
  }
}
