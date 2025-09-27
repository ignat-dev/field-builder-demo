import { render, screen, fireEvent } from "@testing-library/react"
import { Modal, Props } from "./Modal"

describe(Modal, () => {
  it("renders the component as expected", () => {
    const wrapper = renderComponent({ id: "test-one-two-three" })
    const dialog = wrapper.querySelector("dialog")

    expect(wrapper).toHaveAttribute("id", "test-one-two-three")
    expect(wrapper.className).toBe("ui-modal modal fade show")
    expect(wrapper).toHaveAttribute("tabindex", "-1")
    expect(wrapper).toHaveStyle({ "--modal-max-width": "400px" })
    expect(wrapper.querySelector(".modal-header")).toBeNull()
    expect(wrapper.querySelector(".btn-close")).toBeNull()
    expect(wrapper.querySelector(".modal-footer")).toBeNull()
    expect(dialog).toHaveAttribute("open")
    expect(dialog).toHaveAttribute("role", "dialog")
    expect(dialog).toHaveAttribute("aria-hidden", "false")
    expect(dialog).toHaveAttribute("aria-modal", "true")
  })

  it("renders the component as expected when not open", () => {
    const wrapper = renderComponent({ open: false })
    const dialog = wrapper.querySelector("dialog")

    expect(wrapper.classList).not.toContain("show")
    expect(dialog).not.toHaveAttribute("open")
    expect(dialog).toHaveAttribute("aria-hidden", "true")
  })

  it("renders the modal content correctly", () => {
    renderComponent({ children: <div data-testid="custom-content">Hello Modal</div> })

    expect(screen.getByTestId("custom-content")).toHaveTextContent("Hello Modal")
  })

  it("renders the title when specified", () => {
    const wrapper = renderComponent({ title: "My Awesome Title" })
    const header = wrapper.querySelector(".modal-header")

    expect(header).not.toBeNull()
    expect(header!.textContent).toBe("My Awesome Title")
    expect(header!.querySelector(".btn-close")).not.toBeNull()
  })

  it("renders the footer when provided", () => {
    renderComponent({ footer: <div data-testid="custom-footer">FooBar</div> })

    expect(screen.getByTestId("custom-footer")).toHaveTextContent("FooBar")
  })

  it("applies custom className when provided", () => {
    const wrapper = renderComponent({ className: "custom-class" })

    expect(wrapper).toHaveClass("custom-class")
  })

  it("applies custom 'maxWidth' when specified", () => {
    const wrapper = renderComponent({ maxWidth: "minmax(123px, 45%)" })

    expect(wrapper).toHaveStyle({ "--modal-max-width": "minmax(123px, 45%)" })
  })

  it("does not render close button when configured", () => {
    renderComponent({ allowClose: false })

    expect(screen.queryByLabelText("Close")).toBeNull()
  })

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn()

    renderComponent({ title: "Testing...", onClose })

    fireEvent.click(screen.getByLabelText("Close"))

    expect(onClose).toHaveBeenCalled()
  })

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn()

    renderComponent({ onClose })

    fireEvent.keyDown(window, { key: "Escape" })

    expect(onClose).toHaveBeenCalled()
  })

  it("does not call onClose on Escape keypress when 'allowClose' is false", () => {
    const onClose = vi.fn()

    renderComponent({ onClose, allowClose: false })

    fireEvent.keyDown(window, { key: "Escape" })

    expect(onClose).not.toHaveBeenCalled()
  })

  it("calls onKeyDown handler when provided", () => {
    const onClose = vi.fn()
    const onKeyDown = vi.fn()

    renderComponent({ onClose, onKeyDown })

    fireEvent.keyDown(window, { key: "Escape" })

    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: "Escape" }))
    expect(onClose).toHaveBeenCalled()
  })

  it("blocks default behavior when onKeyDown returns false", () => {
    const onClose = vi.fn()
    const onKeyDown = vi.fn().mockImplementation(() => false)

    renderComponent({ onClose, onKeyDown })

    fireEvent.keyDown(window, { key: "Escape" })

    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: "Escape" }))
    expect(onClose).not.toHaveBeenCalled()
  })
})

function renderComponent(props?: Partial<Props>): HTMLDivElement {
  return render(
    <Modal open={true} {...props}>
      {props?.children ?? <div />}
    </Modal>
  ).container.firstChild as HTMLDivElement
}
