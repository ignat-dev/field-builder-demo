import { db } from "@/lib/firebase"
import { validateFieldData } from "@/lib/validation"
import { FieldData } from "@/types"
import { ref, get, push, set } from "firebase/database"

const DB_NAME = "fields"

export async function getField(id: string): Promise<FieldData> {
  const snapshot = await get(ref(db, `${DB_NAME}/${id}`))

  if (!snapshot.exists()) {
    throw new Error(`Field with ID "${id}" not found.`)
  }

  return snapshot.val()
}

export async function saveField(fieldData: FieldData): Promise<{ errors?: Array<string>; success?: boolean }> {
  console.log("Saving field data:", fieldData)

  const { errors } = validateFieldData(fieldData)

  if (errors.length > 0) {
    return { errors: errors.map(e => e.message) }
  }

  const fieldRef = fieldData.id ? ref(db, `${DB_NAME}/${fieldData.id}`) : push(ref(db, DB_NAME))

  await set(fieldRef, fieldData)

  return { success: true }
}
