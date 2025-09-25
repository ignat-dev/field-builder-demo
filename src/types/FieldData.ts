export interface FieldData {
  id?: string
  label: string
  type: "multi-select" | "single-select"
  required?: boolean
  default?: string
  choices: Array<string>
  displayAlpha?: boolean
}
