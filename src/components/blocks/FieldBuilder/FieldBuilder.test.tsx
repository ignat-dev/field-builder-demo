import { FIELD_BUILDER_STATE_KEY } from "@/common/constants"
import { getField, saveField } from "@/lib/api"
import { storage } from "@/lib/storage"
import type { FieldData } from "@/types"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import type { Mock } from "vitest"
import FieldBuilder from "./FieldBuilder"

vi.mock("@/lib/api", () => ({
  getField: vi.fn().mockResolvedValue({
    id: "123",
    label: "Sample Field",
    type: "multi-select",
    required: true,
    default: "Def X",
    choices: ["Option A", "Option B", "Option C"],
    displayAlpha: true,
    timestamp: Date.now() - 1000000,
  }),

  saveField: vi.fn().mockResolvedValue({
    success: true,
  }),
}))

vi.mock("@/lib/storage", () => {
  const storage: Record<string, string> = {}

  return {
    storage: {
      get: vi.fn().mockImplementation((key: string) => {
        const item = storage[key] ?? ""

        return item ? JSON.parse(item) : null
      }),

      set: vi.fn().mockImplementation((key: string, value: unknown) => {
        storage[key] = JSON.stringify(value)
      }),

      remove: vi.fn().mockImplementation((key: string) => {
        delete storage[key]
      }),
    },
  }
})

const fieldId = "123"
const testData = {
  label: "Test Data Label",
  required: false,
  default: "Choice X",
  choices: ["Choice X", "Choice Y", "Choice Z"],
  displayAlpha: false,
}

describe(FieldBuilder, () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the component as expected", async () => {
    const wrapper = await renderComponent()
    const card = wrapper.querySelector(".form-wrapper")
    const form = wrapper.querySelector("fieldset")
    const buttons = wrapper.querySelector(".form__actions")?.querySelectorAll("button") ?? []

    expect(wrapper).toBeTruthy()
    expect(wrapper.className).toBe("field-builder")

    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent("Field Builder")

    expect(form).toBeInTheDocument()
    expect(form).toHaveClass("field-builder__content")
    expect(form).not.toHaveAttribute("disabled")

    const expectedActionProps = [
      { text: "Save changes", type: "submit" },
      { text: "Cancel", type: "button" }
    ]

    for (const [i, button] of buttons.entries()) {
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent(expectedActionProps[i].text)
      expect(button).not.toBeDisabled()
      expect(button).toHaveAttribute("type", expectedActionProps[i].type)
    }
  })

  it("renders the form fields correctly", async () => {
    await renderComponent()

    expect(screen.getByLabelText("Label")).toBeInTheDocument()
    expect(screen.getByLabelText("A Value is required")).toBeInTheDocument()
    expect(screen.getByLabelText("Default Value")).toBeInTheDocument()
    expect(screen.getByLabelText("Choices")).toBeInTheDocument()
    expect(screen.getByLabelText("Order")).toBeInTheDocument()
  })

  it.each([
    ["Save changes", "submit"],
    ["Cancel", "button"],
  ])("renders '%s' action button correctly", async (text, type) => {
    const wrapper = await renderComponent()
    const button = wrapper.querySelector(".form__actions")?.querySelector(`button[type=${type}]`)

    expect(button).toBeDefined()
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(text)
    expect(button).not.toBeDisabled()
    expect(button).toHaveAttribute("type", type)
  })

  it("renders initial loading state correctly", async () => {
    const renderPromise = renderComponent()

    expect(screen.getByText("Loading, please wait...")).toBeInTheDocument()

    await renderPromise

    expect(screen.queryByText("Loading, please wait...")).not.toBeInTheDocument()
  })

  it("loads and populates data correctly", async () => {
    const wrapper = await renderComponent()
    const form = wrapper.querySelector("fieldset")

    // Check if the API was called.
    expect(getField).toHaveBeenCalledTimes(1)

    // Check if the form was populated correctly.
    expect(form).toHaveFormValues({
      label: "Sample Field",
      required: true,
      default: "Def X",
      choices: "Option A",
      order: "alphabetical",
    })

    // Check if the choices were populated correctly.
    const options = Array.from(screen.getByLabelText("Choices").querySelectorAll("option"))
    const expected = ["Option A", "Option B", "Option C"]

    expect(options).toHaveLength(expected.length)
    expect(options.every((x, i) => x.text === expected[i])).toBe(true)
    expect(options.every((x, i) => x.value === expected[i])).toBe(true)
  })

  it("submits the form data correctly", async () => {
    await renderComponent()

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    populateFormFields(testData)
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }))
    await waitFor(() => { expect(saveField).toHaveBeenCalled() })

    expect(saveField).toHaveBeenCalledWith({ type: "multi-select", timestamp: expect.any(Number), ...testData })
  })

  it("clears the form data correctly", async () => {
    const wrapper = await renderComponent()
    const form = wrapper.querySelector("fieldset")

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(form).toHaveFormValues({ label: "", required: false, default: "", choices: undefined, order: "original" })
    expect(screen.getByLabelText("Choices").querySelectorAll("option")).toHaveLength(1)
  })

  it("saves the state to localStorage on change", async () => {
    await renderComponent()

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    populateFormFields(testData)

    const state = storage.get<FieldData>(`${FIELD_BUILDER_STATE_KEY}:${fieldId}`) ?? {} as FieldData

    expect(state.label).toEqual(testData.label)
    expect(state.required).toEqual(testData.required)
    expect(state.default).toEqual(testData.default)
    expect(state.choices).toEqual(testData.choices)
    expect(state.displayAlpha).toEqual(testData.displayAlpha)
  })

  it("loads the state from localStorage on mount", async () => {
    storage.set(`${FIELD_BUILDER_STATE_KEY}:${fieldId}`, { ...testData, timestamp: Date.now() + 1000000 })

    await renderComponent()

    expect(screen.getByLabelText("Label")).toHaveValue(testData.label)
    expect(screen.getByLabelText("Default Value")).toHaveValue(testData.default)
    expect(screen.getByLabelText("Order")).toHaveValue(testData.displayAlpha ? "alphabetical" : "original")

    const checkbox = screen.getByLabelText<HTMLInputElement>("A Value is required")
    const select = screen.getByLabelText<HTMLSelectElement>("Choices")

    expect(checkbox.attributes.getNamedItem("checked")).toEqual(testData.required || null)
    expect(Array.from(select.options).map((x) => x.value)).toEqual(testData.choices)
  })

  it("loads the state from API when newer", async () => {
    // Mock API to return newer state.
    (getField as Mock).mockResolvedValueOnce({
      ...testData,
      label: "New Field Label",
      default: "New Default Value",
      timestamp: Date.now(),
    })

    // Populate localStorage with older state.
    storage.set(`${FIELD_BUILDER_STATE_KEY}:${fieldId}`, {
      ...testData,
      timestamp: Date.now() - 1000000,
    })

    await renderComponent()

    // Verify that the form is populated with the newer state.
    expect(screen.getByLabelText("Label")).toHaveValue("New Field Label")
    expect(screen.getByLabelText("Default Value")).toHaveValue("New Default Value")
  })
})

async function renderComponent(): Promise<HTMLDivElement> {
  return waitFor(() => {
    const { container } = render(<FieldBuilder />)

    return container.firstChild as HTMLDivElement
  })
}

function populateFormFields(data: Partial<FieldData>) {
  if (data.label !== undefined) {
    fireEvent.change(screen.getByLabelText("Label"), { target: { value: data.label } })
  }

  if (data.required !== undefined) {
    const checkbox = screen.getByLabelText<HTMLInputElement>("A Value is required")

    if (checkbox.checked !== data.required) {
      fireEvent.click(checkbox)
    }
  }

  if (data.default !== undefined) {
    fireEvent.change(screen.getByLabelText("Default Value"), { target: { value: data.default } })
  }

  if (data.choices !== undefined) {
    const prompt = vi.spyOn(window, "prompt")

    for (const choice of data.choices) {
      prompt.mockImplementationOnce(() => choice)
      fireEvent.click(screen.getByText("Add"))
    }
  }

  if (data.displayAlpha !== undefined) {
    const order = data.displayAlpha ? "alphabetical" : "original"

    fireEvent.change(screen.getByLabelText("Order"), { target: { value: order } })
  }
}
