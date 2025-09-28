import { render, screen } from "@testing-library/react"
import { LoadingOverlay, Props } from "./LoadingOverlay"

describe(LoadingOverlay, () => {
  it("renders the component as expected", () => {
    const wrapper = renderComponent()

    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("ui-loading-overlay")
    expect(wrapper).toHaveStyle({ "--overlay-z-index": "9999" })
    expect(wrapper).toContainElement(screen.getByRole("status"))
    expect(wrapper).toContainElement(screen.getByText("Loading, please wait..."))
  })

  it("does not render when 'visible' is false", () => {
    const wrapper = renderComponent({ visible: false })

    expect(wrapper).toBeNull()
  })

  it("renders the provided custom text", () => {
    const wrapper = renderComponent({ text: "It'll take only a moment..." })

    expect(wrapper).toContainElement(screen.getByText("It'll take only a moment..."))
  })

  it("renders the provided children", () => {
    const wrapper = renderComponent({ children: <span data-testid="custom-test-content" /> })

    expect(wrapper).toContainElement(screen.getByTestId("custom-test-content"))
  })

  it("applies the provided custom className", () => {
    const wrapper = renderComponent({ className: "custom-test-class" })

    expect(wrapper).toHaveClass("custom-test-class")
  })
})

function renderComponent(props?: Partial<Props>): HTMLDivElement {
  return render(
    <LoadingOverlay visible={true} {...props} />
  ).container.firstChild as HTMLDivElement
}
