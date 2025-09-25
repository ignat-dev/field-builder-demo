import { ValidationError } from "./ValidationError"

export interface ValidationResult {
  errors: Array<ValidationError>
  isValid: boolean
}
