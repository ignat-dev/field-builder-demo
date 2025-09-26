import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Card, Props } from "./Card"

describe(Card, () => {
  it("renders correctly with the defaults", () => {
    const { container } = renderComponent()
    const card = container.querySelector(".ui-card")

    expect(card).toBeInTheDocument()
    expect(card?.classList.toString()).toBe("ui-card card")
    expect(container.querySelector(".card-header")).not.toBeInTheDocument()
    expect(container.querySelector(".card-body")).toBeInTheDocument()
    expect(container.querySelector(".ui-card__notification-area")).not.toBeInTheDocument()
  })

  it("applies correctly the provided className", () => {
    const { container } = renderComponent({ className: "custom-test-class" })

    expect(container.querySelector(".ui-card")?.classList).toContain("custom-test-class")
  })

  it("applies correctly the provided contentClassName", () => {
    const { container } = renderComponent({ contentClassName: "custom-content-class" })

    expect(container.querySelector(".card-body")?.classList).toContain("custom-content-class")
  })

  it("renders correctly the provided content", () => {
    const { container } = renderComponent({
      children: (
        <span className="test-level-1">
          <strong className="test-level-n">Nested text content</strong>
        </span>
      )
    })

    const el1 = container.querySelector(".test-level-1")
    const el2 = container.querySelector(".test-level-n")

    expect(el1).toBeInTheDocument()
    expect(el2).toBeInTheDocument()
    expect(el2?.textContent).toBe("Nested text content")
  })

  it("renders correctly the provided title", () => {
    const { container } = renderComponent({ title: "Card Title" })
    const header = container.querySelector(".card-header")

    expect(header).toBeInTheDocument()
    expect(header?.textContent).toBe("Card Title")
  })

  it("renders correctly the provided errors", () => {
    const { container } = renderComponent({ errors: ["Error 123", "Error 456"] })
    const area = container.querySelector(".ui-card__notification-area")

    expect(area).toBeInTheDocument()
    expect(area?.textContent).toContain("Error 123")
    expect(area?.textContent).toContain("Error 456")
  })
})

function renderComponent(props?: Partial<Props>) {
  return render(
    <Card {...props} />
  )
}
