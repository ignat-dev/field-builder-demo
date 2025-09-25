import { MAX_CHOICES_COUNT, CHOICE_MAX_LENGTH } from "@/common/constants"
import { FieldData, ValidationResult } from "@/types"

export function validateFieldData(fieldData: FieldData): ValidationResult {
  const errors = []

  if (!fieldData.label || fieldData.label.trim() === "") {
    errors.push({ field: "label", message: "The Label field is required." })
  }

  if (!fieldData.type || fieldData.type.trim() === "") {
    errors.push({ field: "type", message: "The field type is required." })
  }

  if (!fieldData.choices || fieldData.choices.length < 2) {
    errors.push({ field: "choices", message: "At least two choices are required." })
  }

  if (fieldData.choices.length > MAX_CHOICES_COUNT) {
    errors.push({ field: "choices", message: `There cannot be more than ${MAX_CHOICES_COUNT} choices total.` })
  }

  if (fieldData.choices.length !== new Set(fieldData.choices).size) {
    errors.push({ field: "choices", message: "Duplicate choices are not allowed." })
  }

  if (fieldData.choices.some(x => x.length > CHOICE_MAX_LENGTH)) {
    errors.push({ field: "choices", message: `Choice length must not exceed ${CHOICE_MAX_LENGTH} characters.` })
  }

  if (fieldData.default && !fieldData.choices.includes(fieldData.default)) {
    errors.push({ field: "choices", message: "The default value must be one of the choices." })
  }

  return { errors, isValid: errors.length === 0 }
}
