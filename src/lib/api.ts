import { FieldData } from "@/types"

export async function getField(id: string): Promise<FieldData> {
  return makeRequest<FieldData>(`/api/fields/${id}`)
}

export async function saveField(fieldData: FieldData): Promise<void> {
  return makeRequest("/api/fields", {
    method: "POST",
    body: JSON.stringify(fieldData),
  })
}

async function makeRequest<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
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
