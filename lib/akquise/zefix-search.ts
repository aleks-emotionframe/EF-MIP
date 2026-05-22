export interface ZefixCompany {
  uid: string
  name: string
  legalForm: string
  status: string
  canton: string
  city: string
  address?: string
  purpose?: string
  registrationDate?: string
}

export async function searchZefix(query: string, canton?: string): Promise<ZefixCompany[]> {
  const apiUrl = "https://www.zefix.ch/ZefixREST/api/v1/company/search"

  try {
    const body: Record<string, any> = {
      name: query,
      maxEntries: 20,
      activeOnly: true,
    }
    if (canton) {
      body.registryOffices = [canton]
    }

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return []
    const data = await res.json()

    return (data ?? []).map((c: any) => ({
      uid: c.uid || "",
      name: c.name || "",
      legalForm: c.legalForm?.name?.de || c.legalForm?.shortName?.de || "",
      status: c.status || "",
      canton: c.canton?.abbreviation || "",
      city: c.address?.city || "",
      address: c.address ? `${c.address.street || ""} ${c.address.houseNumber || ""}, ${c.address.swissZipCode || ""} ${c.address.city || ""}`.trim() : undefined,
      purpose: c.purpose?.translations?.[0]?.text || undefined,
      registrationDate: c.registrationDate || undefined,
    }))
  } catch {
    return []
  }
}

export async function enrichWithZefix(companyName: string, canton?: string): Promise<ZefixCompany | null> {
  const results = await searchZefix(companyName, canton)
  if (results.length === 0) return null

  const exact = results.find(
    (r) => r.name.toLowerCase() === companyName.toLowerCase()
  )
  return exact || results[0]
}
