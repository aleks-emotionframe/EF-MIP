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
    const activities = await prisma!.leadActivity.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return Response.json(activities)
  } catch {
    return Response.json([])
  }
}
