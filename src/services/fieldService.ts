import { validateFieldData } from "@/lib/validation"
import { FieldData } from "@/types"

export async function getField(id: string): Promise<FieldData> {
  return {
    id: id,
    label: "Sales region",
    type: "multi-select",
    required: false,
    default: "North America",
    choices: [
      "Asia",
      "Australia",
      "Western Europe",
      "North America",
      "Eastern Europe",
      "Latin America",
      "Middle East and Africa"
    ],
    displayAlpha: true,
  }
}

export async function saveField(fieldData: FieldData): Promise<{ errors?: Array<string>; success?: boolean }> {
  console.log("Saving field data:", fieldData)

  const { errors } = validateFieldData(fieldData)

  if (errors.length > 0) {
    return { errors: errors.map(e => e.message) }
  }

  // TODO: Add the code here to call the API.

  return { success: true }
}
