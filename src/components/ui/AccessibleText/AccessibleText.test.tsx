import { render, screen } from "@testing-library/react"
import type { Mock } from "vitest"
import { useAltKeyActive } from "../../hooks/useAltKeyActive"
import { AccessibleText, Props } from "./AccessibleText"

vi.mock("../../hooks/useAltKeyActive", () => ({
  useAltKeyActive: vi.fn(() => false)
}))

describe(AccessibleText, () => {
  it("renders the component as expected", () => {
    const wrapper = renderComponent()

    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveTextContent("Testing...")
    expect(wrapper).toHaveClass("ui-accessible-text")
  })

  it("applies the provided className correctly", () => {
    const wrapper = renderComponent({ className: "custom-test-class" })

    expect(wrapper).toHaveClass("custom-test-class")
  })

  it("renders the provided text correctly", () => {
    renderComponent({ text: "Awesomely Accessible Text" })

    expect(screen.getByText("Awesomely Accessible Text")).toBeInTheDocument()
  })

  it("highlights the provided accessKey when ALT is pressed", () => {
    (useAltKeyActive as Mock).mockReturnValue(true)

    renderComponent({ text: "Accessible", accessKey: "a" })
    const char = screen.getByText("A")

    expect(char).toHaveClass("access-key")
  })

  it("does not highlight the accessKey when ALT is not pressed", () => {
    (useAltKeyActive as Mock).mockReturnValue(false)

    renderComponent({ text: "Accessible", accessKey: "a" })
    const char = screen.getByText("A")

    expect(char).not.toHaveClass("access-key")
  })

  it("does not highlight when the accessKey is not in text", () => {
    const wrapper = renderComponent({ text: "Phone", accessKey: "z" })

    expect(wrapper).toHaveTextContent("Phone")
    expect(wrapper.querySelector(".access-key")).toBeNull()
  })
})

function renderComponent(props?: Partial<Props>): HTMLSpanElement {
  return render(
    <AccessibleText text="Testing..." {...props} />
  ).container.firstElementChild as HTMLSpanElement
}
