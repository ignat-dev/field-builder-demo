import { getField } from "@/services/fieldService"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return NextResponse.json(await getField((await params).id))
}
