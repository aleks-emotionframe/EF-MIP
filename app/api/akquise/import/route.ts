import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (session?.user?.globalRole !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) {
      return Response.json({ error: "Keine Datei hochgeladen" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((l) => l.trim())
    if (lines.length < 2) {
      return Response.json({ error: "CSV muss mindestens eine Kopfzeile und eine Datenzeile haben" }, { status: 400 })
    }

    const headers = lines[0].split(";").map((h) => h.trim().toLowerCase().replace(/"/g, ""))
    const nameIdx = headers.findIndex((h) => h === "name" || h === "firma" || h === "firmenname" || h === "company")
    const industryIdx = headers.findIndex((h) => h === "branche" || h === "industry")
    const websiteIdx = headers.findIndex((h) => h === "website" || h === "url" || h === "webseite")
    const emailIdx = headers.findIndex((h) => h === "email" || h === "e-mail" || h === "mail")
    const phoneIdx = headers.findIndex((h) => h === "telefon" || h === "phone" || h === "tel")
    const cityIdx = headers.findIndex((h) => h === "stadt" || h === "city" || h === "ort")
    const addressIdx = headers.findIndex((h) => h === "adresse" || h === "address" || h === "strasse")
    const zipIdx = headers.findIndex((h) => h === "plz" || h === "zip")
    const cantonIdx = headers.findIndex((h) => h === "kanton" || h === "canton")

    if (nameIdx === -1) {
      return Response.json({ error: "Spalte 'Name' oder 'Firma' nicht gefunden. Erlaubte Spaltennamen: Name, Firma, Firmenname, Company" }, { status: 400 })
    }

    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(";").map((c) => c.trim().replace(/"/g, ""))
      const name = cols[nameIdx]
      if (!name) {
        skipped++
        continue
      }

      const leadData = {
        name,
        industry: industryIdx >= 0 ? cols[industryIdx] || "Unbekannt" : "Unbekannt",
        website: websiteIdx >= 0 ? cols[websiteIdx] || null : null,
        email: emailIdx >= 0 ? cols[emailIdx] || null : null,
        phone: phoneIdx >= 0 ? cols[phoneIdx] || null : null,
        city: cityIdx >= 0 ? cols[cityIdx] || null : null,
        address: addressIdx >= 0 ? cols[addressIdx] || null : null,
        zip: zipIdx >= 0 ? cols[zipIdx] || null : null,
        canton: cantonIdx >= 0 ? cols[cantonIdx] || null : null,
        status: "NEU" as const,
      }

      try {
        await prisma!.lead.create({ data: leadData })
        imported++
      } catch (err: any) {
        if (err?.code === "P2002") {
          skipped++
        } else {
          errors.push(`Zeile ${i + 1}: ${err.message}`)
        }
      }
    }

    return Response.json({ imported, skipped, errors, total: lines.length - 1 })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
