import { render, screen } from "@testing-library/react"
import type { Mock } from "vitest"
import { useAltKeyActive } from "../../hooks/useAltKeyActive"
import { Label, Props } from "./Label"

vi.mock("../../hooks/useAltKeyActive", () => ({
  useAltKeyActive: vi.fn(() => false)
}))

describe(Label, () => {
  it("renders the component as expected", () => {
    const wrapper = renderComponent()

    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveTextContent("Test Label")
    expect(wrapper).toHaveClass("ui-label")
    expect(wrapper).not.toHaveAttribute("for")
    expect(wrapper).not.toHaveAttribute("accesskey")
  })

  it("applies the provided className correctly", () => {
    const wrapper = renderComponent({ className: "custom-test-class" })

    expect(wrapper).toHaveClass("custom-test-class")
  })

  it("renders the provided label text", () => {
    renderComponent({ text: "Awesomely Accessible Label" })

    expect(screen.getByText("Awesomely Accessible Label")).toBeInTheDocument()
  })

  it("sets provided target for the label", () => {
    const wrapper = renderComponent({ text: "Password", target: "inputPassword" })

    expect(wrapper).toHaveAttribute("for", "inputPassword")
  })

  it("highlights the provided accessKey when ALT is pressed", () => {
    (useAltKeyActive as Mock).mockReturnValue(true)

    renderComponent({ text: "Accessible", accessKey: "a" })
    const char = screen.getByText("A")

    expect(char).toHaveClass("ui-label__accesskey")
  })

  it("does not highlight the accessKey when ALT is not pressed", () => {
    (useAltKeyActive as Mock).mockReturnValue(false)

    renderComponent({ text: "Accessible", accessKey: "a" })
    const char = screen.getByText("A")

    expect(char).not.toHaveClass("ui-label__accesskey")
  })

  it("does not highlight when the accessKey is not in text", () => {
    const wrapper = renderComponent({ text: "Phone", accessKey: "z" })

    expect(wrapper).toHaveTextContent("Phone")
    expect(wrapper.querySelector(".ui-label__accesskey")).toBeNull()
  })
})

function renderComponent(props?: Partial<Props>): HTMLLabelElement {
  return render(
    <Label text="Test Label" {...props} />
  ).container.firstElementChild as HTMLLabelElement
}
