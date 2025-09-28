import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Button, Props } from "./Button"

describe(Button, () => {
  it("renders correctly with the defaults", () => {
    renderComponent()

    const button = screen.getByRole("button")

    expect(button).toBeInTheDocument()
    expect(button.closest("span")?.classList.toString()).toBe("ui-button")
    expect(button.classList.toString()).toBe("btn")
    expect(button).not.toBeDisabled()
    expect(button.attributes.getNamedItem("type")?.value).toBe("button")
  })

  it("renders correctly the specified text", () => {
    renderComponent({ text: "Test Button" })

    expect(screen.getByRole("button").textContent).toBe("Test Button")
  })

  describe("applies correctly the provided variant", () => {
    it.each([
      ["primary", "btn-primary"],
      ["secondary", "btn-secondary"],
      ["success", "btn-success"],
      ["danger", "btn-danger"],
      ["warning", "btn-warning"],
      ["info", "btn-info"],
      ["light", "btn-light"],
      ["dark", "btn-dark"],
    ])("%s", (variant, expectedClass) => {
      renderComponent({ variant: variant as Props["variant"] })

      expect(screen.getByRole("button").className).toBe(`btn ${expectedClass}`)
    })
  })

  describe("applies correctly the provided appearance", () => {
    it.each([
      ["link", "btn-dark btn-link"],
      ["outline", "btn-outline-dark"],
    ])("%s", (appearance, expectedClass) => {
      renderComponent({ variant: "dark", appearance: appearance as Props["appearance"] })

      expect(screen.getByRole("button").classList.toString()).toBe(`btn ${expectedClass}`)
    })
  })

  it("does not add outline class when no variant is set", () => {
    renderComponent({ appearance: "outline" })

    expect(screen.getByRole("button").className).not.toMatch(/btn-outline-/)
  })

  it.each([
    ["small", "btn-sm"],
    ["standard", ""],
    ["large", "btn-lg"],
  ])("applies correctly the provided size: %s", (size, expectedClass) => {
    renderComponent({ size: size as Props["size"] })
    expect(screen.getByRole("button").classList.toString()).toBe(`btn ${expectedClass}`.trim())
  })

  it("renders correctly when disabled", () => {
    renderComponent({ disabled: true })

    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("renders correctly when loading", () => {
    renderComponent({ loading: true })

    const button = screen.getByRole("button")

    expect(button).toBeDisabled()
    expect(button.querySelector(".spinner-border")).toBeInTheDocument()
  })

  it("renders correctly the provided tooltip", () => {
    renderComponent({ tooltip: "It's test tooltip!" })

    expect(screen.getByRole("button").closest("span")?.title).toBe("It's test tooltip!")
  })

  it("sets correctly the provided type", () => {
    renderComponent({ type: "submit" })

    expect(screen.getByRole("button").attributes.getNamedItem("type")?.value).toBe("submit")
  })

  it("sets correctly the provided accessKey", () => {
    renderComponent({ accessKey: "x" })

    expect(screen.getByRole("button").attributes.getNamedItem("accessKey")?.value).toBe("x")
  })

  it("calls the provided onClick handler", () => {
    const onClick = vi.fn()

    renderComponent({ onClick })

    fireEvent.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalled()
  })

})

function renderComponent(props?: Partial<Props>) {
  return render(
    <Button text="Btn" {...props} />
  )
}
