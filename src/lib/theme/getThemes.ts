export async function getThemes(): Promise<Record<string, string>> {
  const res = await fetch("/themes.json")

  if (!res.ok) {
    throw new Error("Failed to load UI themes!")
  }

  return await res.json()
}
