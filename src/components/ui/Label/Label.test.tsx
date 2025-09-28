import { render, screen } from "@testing-library/react"
import { Label, Props } from "./Label"

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
})

function renderComponent(props?: Partial<Props>): HTMLLabelElement {
  return render(
    <Label text="Test Label" {...props} />
  ).container.firstElementChild as HTMLLabelElement
}
