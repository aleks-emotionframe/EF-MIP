export interface LocalChResult {
  name: string
  address: string
  city: string
  zip: string
  phone?: string
  website?: string
  category?: string
}

export async function searchLocalCh(query: string, location: string): Promise<LocalChResult[]> {
  const searchUrl = `https://tel.search.ch/api/?was=${encodeURIComponent(query)}&wo=${encodeURIComponent(location)}&key=${process.env.LOCALCH_API_KEY || ""}&maxnum=20&lang=de`

  if (!process.env.LOCALCH_API_KEY) {
    return []
  }

  try {
    const res = await fetch(searchUrl, {
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []

    const data = await res.json()
    const entries = data?.entry || data?.feed?.entry || []

    return entries.map((e: any) => ({
      name: e.title || e.name || "",
      address: e.street || "",
      city: e.city || e.cityname || "",
      zip: e.zip || "",
      phone: e.phone || e.tel || undefined,
      website: e.url || e.website || undefined,
      category: e.category || e.type || undefined,
    }))
  } catch {
    return []
  }
}
