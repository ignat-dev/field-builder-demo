import { FieldData } from "@/types"

export const apiMockData: FieldData = {
  id: "123",
  label: "Sample Field",
  type: "multi-select",
  required: true,
  default: "Default X",
  choices: ["Option A", "Option B", "Option C"],
  displayAlpha: true,
  timestamp: Date.now() - 1000000,
}

export const createApiMock = (data?: Partial<FieldData>) => ({
  getField: vi.fn().mockResolvedValue({ ...apiMockData, ...data }),

  saveField: vi.fn().mockResolvedValue({ success: true }),
})
