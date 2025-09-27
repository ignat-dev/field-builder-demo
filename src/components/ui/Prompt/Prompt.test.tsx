import { render, screen, fireEvent } from "@testing-library/react"
import { Prompt, Props } from "./Prompt"

describe(Prompt, () => {
  it("renders the component as expected", () => {
    renderComponent({ title: "Enter Something Interesting" })

    expect(screen.getByText("Enter Something Interesting")).toBeInTheDocument()
    expect(screen.getByText("OK")).toBeInTheDocument()
  })

  it("renders the textarea and formatter", () => {
    const wrapper = renderComponent()

    expect(wrapper.querySelector(".ui-prompt__input-control")).not.toBeNull()
    expect(wrapper.querySelector(".ui-prompt__input-formatter")).not.toBeNull()
  })

  it("renders placeholder text when provided", () => {
    renderComponent({ placeholder: "Enter something interesting..." })

    expect(screen.getByPlaceholderText("Enter something interesting...")).toBeInTheDocument()
  })

  it("focuses the textarea after open", () => {
    renderComponent()

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement

    expect(document.activeElement).toBe(textarea)
  })

  it("limits input length to 'maxLength' when 'allowOverflow' is false", () => {
    renderComponent({ maxLength: 10, allowOverflow: false })
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement

    fireEvent.input(textarea, { target: { value: "1234567890abcdef" } })

    expect(textarea.value.length).toBe(10)
    expect(textarea.value).toBe("1234567890")
  })

  it("allows overflow when 'allowOverflow' is true", () => {
    const wrapper = renderComponent({ maxLength: 10, allowOverflow: true })
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement
    const text = "1234567890abcdef"

    fireEvent.input(textarea, { target: { value: text } })

    expect(textarea.value.length).toBe(text.length)
    expect(textarea.value).toBe(text)
    expect(wrapper.querySelector(".text-overflow")).toHaveTextContent("abcdef")
  })

  it("disallows new lines in the entered text", () => {
    const onClose = vi.fn()

    renderComponent({ onClose })
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement

    fireEvent.input(textarea, { target: { value: "abc\ndef" } })
    fireEvent.keyDown(textarea, { key: "Enter" })

    expect(textarea.value).not.toContain("\n")
    expect(onClose).toHaveBeenCalledWith("abcdef")
  })

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn()

    renderComponent({ title: "Prompt", onClose })

    fireEvent.click(screen.getByLabelText("Close"))

    expect(onClose).toHaveBeenCalled()
  })

  it("calls onClose with value when OK button is clicked", () => {
    const onClose = vi.fn()

    renderComponent({ onClose })

    fireEvent.input(screen.getByRole("textbox"), { target: { value: "hello world" } })
    fireEvent.click(screen.getByText("OK"))

    expect(onClose).toHaveBeenCalledWith("hello world")
  })

  it("calls onClose with value when Enter key is pressed", () => {
    const onClose = vi.fn()

    renderComponent({ onClose })
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement

    fireEvent.input(textarea, { target: { value: "abcdef" } })
    fireEvent.keyDown(textarea, { key: "Enter" })

    expect(onClose).toHaveBeenCalledWith("abcdef")
  })
})

function renderComponent(props?: Partial<Props>): HTMLDivElement {
  return render(
    <Prompt open={true} {...props} />
  ).container.parentElement as HTMLDivElement
}
