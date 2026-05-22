export interface PlaceResult {
  placeId: string
  name: string
  address: string
  city: string
  zip: string
  canton: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  types: string[]
  location: { lat: number; lng: number }
}

const API_KEY = () => process.env.GOOGLE_PLACES_API_KEY || ""

function extractAddressComponent(components: any[], type: string): string {
  const comp = components?.find((c: any) => c.types?.includes(type))
  return comp?.long_name || ""
}

function parsePlaceDetails(details: any): PlaceResult {
  const components = details.address_components || []
  return {
    placeId: details.place_id,
    name: details.name || "",
    address: details.formatted_address || "",
    city: extractAddressComponent(components, "locality") ||
      extractAddressComponent(components, "political"),
    zip: extractAddressComponent(components, "postal_code"),
    canton: extractAddressComponent(components, "administrative_area_level_1"),
    phone: details.formatted_phone_number || undefined,
    website: details.website || undefined,
    rating: details.rating || undefined,
    reviewCount: details.user_ratings_total || undefined,
    types: details.types || [],
    location: {
      lat: details.geometry?.location?.lat || 0,
      lng: details.geometry?.location?.lng || 0,
    },
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const apiKey = API_KEY()
  if (!apiKey) return null

  try {
    const fields = "name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry,address_components"
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${fields}&key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) return null

    const data = await res.json()
    if (data.status !== "OK" || !data.result) return null

    return parsePlaceDetails(data.result)
  } catch {
    return null
  }
}

export async function searchBusinesses(query: string, region: string): Promise<PlaceResult[]> {
  const apiKey = API_KEY()
  if (!apiKey) return []

  try {
    const searchQuery = `${query} in ${region}, Schweiz`
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) return []

    const data = await res.json()
    if (data.status !== "OK" || !data.results) return []

    const results = data.results.slice(0, 20)
    const places: PlaceResult[] = []

    for (const result of results) {
      const details = await getPlaceDetails(result.place_id)
      if (details) {
        places.push(details)
      }
    }

    return places
  } catch {
    return []
  }
}
