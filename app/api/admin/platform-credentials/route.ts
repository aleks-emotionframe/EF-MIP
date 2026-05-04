import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const credentials = await prisma!.platformCredential.findMany({
      select: { platform: true, createdAt: true, updatedAt: true },
    })
    const configured = credentials.reduce((acc, c) => {
      acc[c.platform] = { configured: true, updatedAt: c.updatedAt }
      return acc
    }, {} as Record<string, any>)
    return Response.json(configured)
  } catch {
    return Response.json({})
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { platform, clientId, clientSecret } = await request.json()
  if (!platform || !clientId || !clientSecret) {
    return Response.json({ error: "Missing fields" }, { status: 400 })
  }

  try {
    await prisma!.platformCredential.upsert({
      where: { platform },
      update: { clientId, clientSecret },
      create: { platform, clientId, clientSecret },
    })
    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { platform } = await request.json()
  try {
    await prisma!.platformCredential.delete({ where: { platform } })
    return Response.json({ success: true })
  } catch {
    return Response.json({ success: true })
  }
}
