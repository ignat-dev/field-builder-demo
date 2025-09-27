import { render, screen, fireEvent } from "@testing-library/react"
import { Alert, Props } from "./Alert"

describe(Alert, () => {
  it("renders the component as expected", () => {
    renderComponent({ title: "This is Interesting" })

    expect(screen.getByText("This is Interesting")).toBeInTheDocument()
    expect(screen.getByText("OK")).toBeInTheDocument()
  })

  it("renders the provided slot content", () => {
    renderComponent({ children: <span data-testid="custom-content">Customized!</span> })

    expect(screen.getByTestId("custom-content")).toBeInTheDocument()
    expect(screen.getByTestId("custom-content")).toHaveTextContent("Customized!")
  })

  it("renders the provided text message", () => {
    renderComponent({ text: "Alert Text" })

    expect(screen.getByText("Alert Text")).toBeInTheDocument()
  })

  it("renders slot content when both slot and text are provided", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementationOnce(() => { })

    renderComponent({ children: <span data-testid="foo-bar" />, text: "Not rendered" })

    expect(screen.getByTestId("foo-bar")).toBeInTheDocument()
    expect(screen.queryByText("Not rendered")).toBeNull()
    expect(warnSpy).toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn()

    renderComponent({ title: "Alert", onClose })

    fireEvent.click(screen.getByLabelText("Close"))

    expect(onClose).toHaveBeenCalled()
  })

  it("calls onClose with value when OK button is clicked", () => {
    const onClose = vi.fn()

    renderComponent({ onClose })

    fireEvent.click(screen.getByText("OK"))

    expect(onClose).toHaveBeenCalled()
  })

  it("calls onClose with value when Enter key is pressed", () => {
    const onClose = vi.fn()

    renderComponent({ onClose })

    fireEvent.keyDown(window, { key: "Enter" })

    expect(onClose).toHaveBeenCalled()
  })
})

function renderComponent(props?: Partial<Props>): HTMLDivElement {
  return render(
    <Alert open={true} {...props} />
  ).container.parentElement as HTMLDivElement
}
