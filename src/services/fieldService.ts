import { CHOICE_MAX_LENGTH, MAX_CHOICES_COUNT } from "@/common/constants"
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

export async function saveField(fieldData: FieldData) {
  console.log("Saving field data:", fieldData)

  if (!fieldData.label || fieldData.label.trim() === "") {
    return { error: "The Label field is required." }
  }

  if (!fieldData.type || fieldData.type.trim() === "") {
    return { error: "The field type is required." }
  }

  if (!fieldData.choices || fieldData.choices.length < 2) {
    return { error: "At least two choices are required." }
  }

  if (fieldData.choices.length > MAX_CHOICES_COUNT) {
    return { error: `There cannot be more than ${MAX_CHOICES_COUNT} choices total.` }
  }

  if (fieldData.choices.length !== new Set(fieldData.choices).size) {
    return { error: "Duplicate choices are not allowed." }
  }

  if (fieldData.choices.some(x => x.length > CHOICE_MAX_LENGTH)) {
    return { error: `Choice length must not exceed ${CHOICE_MAX_LENGTH} characters.` }
  }

  if (fieldData.default && !fieldData.choices.includes(fieldData.default)) {
    return { error: "The default value must be one of the choices." }
  }

  // TODO: Add the code here to call the API.

  return { success: true }
}
