import { render, screen, fireEvent } from "@testing-library/react"
import { Props, SelectList } from "./SelectList"

describe(SelectList, () => {
  it("renders the component as expected", () => {
    const wrapper = renderComponent()

    expect(wrapper).toBeInTheDocument()
    expect(wrapper.className).toBe("ui-select-list list-group-flush")
    expect(wrapper).toHaveStyle({ "--list-item-count": "5" })
    expect(wrapper.querySelectorAll(".list-group-item").length).toBe(0)
  })

  it("renders the provided items correctly", () => {
    const wrapper = renderComponent({ items: ["Uno", "Dos", "Tres"] })

    expect(wrapper.querySelectorAll(".list-group-item").length).toBe(3)
    expect(wrapper).toContainElement(screen.getByText("Uno"))
    expect(wrapper).toContainElement(screen.getByText("Dos"))
    expect(wrapper).toContainElement(screen.getByText("Tres"))
  })

  it("renders the provided label correctly", () => {
    const wrapper = renderComponent({ label: "My Custom Label" })

    expect(wrapper).toHaveAttribute("aria-label", "My Custom Label")
  })

  it("highlights the selected item", () => {
    renderComponent({ items: ["Uno", "Dos", "Tres"], selectedItem: "Dos" })

    expect(screen.getByText("Dos")).toHaveClass("active")
  })

  it("applies correctly the provided className", () => {
    const wrapper = renderComponent({ className: "my-very-custom-list" })

    expect(wrapper).toHaveClass("my-very-custom-list")
  })

  it("applies correctly the provided size", () => {
    const wrapper = renderComponent({ size: 123 })

    expect(wrapper).toHaveStyle({ "--list-item-count": "123" })
  })

  it("calls onSelect when an item is clicked", () => {
    const onSelect = vi.fn()

    renderComponent({ items: ["Uno", "Dos", "Tres"], onSelect })

    fireEvent.click(screen.getByText("Dos"))

    expect(onSelect).toHaveBeenCalledWith("Dos")
  })
})

function renderComponent(props?: Partial<Props>) {
  return render(
    <SelectList items={[]} {...props} />
  ).container.firstChild as HTMLDivElement
}
