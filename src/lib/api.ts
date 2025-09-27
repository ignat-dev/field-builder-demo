import { FieldData } from "@/types"

export async function getField(id: string): Promise<FieldData | null> {
  return makeRequest<FieldData | null>(`/fields/${id}`)
}

export async function saveField(fieldData: FieldData): Promise<void> {
  return makeRequest("/fields", {
    method: "POST",
    body: JSON.stringify(fieldData),
  })
}

async function makeRequest<T = unknown>(endpointUrl: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(getFullApiRequestUrl(endpointUrl), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
  })

  if (!response.ok) {
    throw new Error(`API request failed: [STATUS ${response.status}] ${response.statusText}`)
  }

  return response.json()
}

function getFullApiRequestUrl(endpointUrl: string): string {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!baseApiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured - backend calls will fail!")
  }

  let result = [baseApiUrl, endpointUrl].map((x, i) => x.replace(i ? /^\/+|\/+$/g : /\/+$/, "")).join("/")

  // Use Firebase RTDB as a backend without additional server-side code -
  // this is an optimization for frontend-only deployment on Firebase Hosting.
  if (/\.firebasedatabase\.app\/?$/.test(baseApiUrl)) {
    // Append ".json" suffix for Firebase Realtime Database REST API calls.
    result += ".json"
  }

  return result
}
