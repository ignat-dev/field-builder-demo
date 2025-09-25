import { saveField } from "@/services/fieldService"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const data = await req.json()

  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid field data." }, { status: 400 })
  }

  try {
    const { errors, success } = await saveField(data)

    if (errors && errors.length > 0) {
      const error = ["Validation errors found:", ...errors.map((x) => `- ${x}`)].join("\n")

      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success })
  } catch {
    return NextResponse.json({ error: "Failed to save field data." }, { status: 500 })
  }
}
