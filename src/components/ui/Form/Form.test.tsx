import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Form, Props } from "./Form"

describe(Form, () => {
  it("renders correctly with the defaults", () => {
    const { container } = renderComponent()

    const form = container.querySelector("form")

    expect(form).toBeInTheDocument()
    expect(form?.classList.toString()).toBe("ui-form")
  })

  it("applies correctly the provided className", () => {
    const { container } = renderComponent({ className: "custom-test-class" })

    expect(container.querySelector("form")?.classList).toContain("custom-test-class")
  })

  it("applies correctly the provided contentClassName", () => {
    const { container } = renderComponent({ contentClassName: "custom-content-class" })

    expect(container.querySelector("fieldset")?.classList).toContain("custom-content-class")
  })

  it("renders correctly the provided content", () => {
    const { container } = renderComponent({
      children: (
        <div className="some-nested-content">
          <label data-testid="label">Label for Testing</label>
          <input data-testid="input" />
        </div>
      )
    })

    expect(container.querySelector(".some-nested-content")).toBeInTheDocument()
    expect(screen.getByTestId("label")).toBeInTheDocument()
    expect(screen.getByTestId("input")).toBeInTheDocument()
  })

  it("renders correctly when disabled", () => {
    const { container } = renderComponent({ disabled: true })

    expect(container.querySelector("fieldset")).toBeDisabled()
  })

  it("calls the provided onSubmit handler", () => {
    const onSubmit = vi.fn()

    const { container } = renderComponent({ onSubmit })

    fireEvent.submit(container.querySelector("form")!)

    expect(onSubmit).toHaveBeenCalled()
  })
})

function renderComponent(props?: Partial<Props>) {
  return render(
    <Form {...props} />
  )
}
