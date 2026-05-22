import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const entries = await prisma!.suppressionEntry.findMany({
      orderBy: { createdAt: "desc" },
    })
    return Response.json(entries)
  } catch {
    return Response.json([])
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { type, value, reason } = await request.json()
  if (!type || !value) {
    return Response.json({ error: "type and value required" }, { status: 400 })
  }

  try {
    const entry = await prisma!.suppressionEntry.create({
      data: { type, value, reason },
    })
    return Response.json(entry)
  } catch (err: any) {
    if (err?.code === "P2002") {
      return Response.json({ error: "Eintrag existiert bereits" }, { status: 409 })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await request.json()
  try {
    await prisma!.suppressionEntry.delete({ where: { id } })
    return Response.json({ success: true })
  } catch {
    return Response.json({ success: true })
  }
}
