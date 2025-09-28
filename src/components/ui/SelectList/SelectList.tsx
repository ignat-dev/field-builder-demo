import "./SelectList.scss"

export interface Props {
  className?: string
  id?: string
  items: Array<string>
  label?: string
  name?: string
  selectedItem?: string | null
  size?: number

  onSelect?: (item: string) => void
}

export function SelectList({ className, items, label, selectedItem, size = 5, onSelect, ...rest }: Props) {
  const styles = { "--list-item-count": `${size}` } as React.CSSProperties

  return (
    <div
      {...rest}
      className={`ui-select-list list-group-flush ${className ?? ""}`.trim()}
      role="listbox"
      style={styles}
      aria-label={label}
    >
      {items.map(item => (
        <button
          className={`list-group-item ${item === selectedItem ? "active" : ""}`}
          key={item}
          role="option"
          type="button"
          aria-selected={item === selectedItem}
          onClick={() => onSelect?.(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
