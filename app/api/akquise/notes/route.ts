import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const leadId = request.nextUrl.searchParams.get("leadId")
  if (!leadId) {
    return Response.json({ error: "leadId required" }, { status: 400 })
  }

  try {
    const notes = await prisma!.leadNote.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    })
    return Response.json(notes)
  } catch {
    return Response.json([])
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { leadId, content } = await request.json()
  if (!leadId || !content) {
    return Response.json({ error: "leadId and content required" }, { status: 400 })
  }

  try {
    const note = await prisma!.leadNote.create({
      data: {
        leadId,
        content,
        authorId: session.user.id,
        authorName: session.user.name || session.user.email || "Admin",
      },
    })

    await prisma!.leadActivity.create({
      data: {
        leadId,
        type: "NOTE",
        message: `Notiz hinzugefügt`,
        authorId: session.user.id,
        authorName: session.user.name || session.user.email || "Admin",
      },
    })

    return Response.json(note)
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
