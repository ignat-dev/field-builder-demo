import { saveField } from "@/services/fieldService"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const data = await req.json()

  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid field data." }, { status: 400 })
  }

  try {
    const { error } = await saveField(data)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to save field data." }, { status: 500 })
  }
}
