import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const leadId = request.nextUrl.searchParams.get("leadId")
  const dueToday = request.nextUrl.searchParams.get("dueToday")

  try {
    if (dueToday === "true") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const reminders = await prisma!.leadReminder.findMany({
        where: {
          dueDate: { gte: today, lt: tomorrow },
          completed: false,
        },
        include: { lead: { select: { name: true, industry: true, city: true } } },
        orderBy: { dueDate: "asc" },
      })
      return Response.json(reminders)
    }

    if (leadId) {
      const reminders = await prisma!.leadReminder.findMany({
        where: { leadId },
        orderBy: { dueDate: "asc" },
      })
      return Response.json(reminders)
    }

    return Response.json([])
  } catch {
    return Response.json([])
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { leadId, title, dueDate } = await request.json()
  if (!leadId || !title || !dueDate) {
    return Response.json({ error: "leadId, title and dueDate required" }, { status: 400 })
  }

  try {
    const reminder = await prisma!.leadReminder.create({
      data: {
        leadId,
        title,
        dueDate: new Date(dueDate),
        authorId: session.user.id,
      },
    })

    await prisma!.leadActivity.create({
      data: {
        leadId,
        type: "REMINDER",
        message: `Wiedervorlage erstellt: ${title} (${new Date(dueDate).toLocaleDateString("de-CH")})`,
        authorId: session.user.id,
        authorName: session.user.name || "Admin",
      },
    })

    return Response.json(reminder)
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id, completed } = await request.json()
  if (!id) {
    return Response.json({ error: "id required" }, { status: 400 })
  }

  try {
    const reminder = await prisma!.leadReminder.update({
      where: { id },
      data: { completed: completed ?? true },
    })
    return Response.json(reminder)
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
