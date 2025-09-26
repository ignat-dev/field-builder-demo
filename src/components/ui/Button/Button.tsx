import { useMemo } from "react"

import "./Button.scss"

interface Props {
  appearance?: "link" | "outline"
  className?: string
  disabled?: boolean
  loading?: boolean
  size?: "small" | "standard" | "large"
  text: string
  tooltip?: string
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"

  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({
  appearance,
  className,
  disabled,
  loading,
  size = "standard",
  text,
  tooltip,
  type = "button",
  variant,
  onClick,
}: Props) {
  const buttonClassName = useMemo(() => {
    const result = ["btn", className].filter(Boolean)

    if (variant) {
      result.push(appearance === "outline" ? `btn-outline-${variant}` : `btn-${variant}`)
    }

    if (appearance !== "outline") {
      result.push(`btn-${appearance}`)
    }

    if (size !== "standard") {
      result.push(`btn-${size === "small" ? "sm" : "lg"}`)
    }

    return result.join(" ")
  }, [appearance, className, size, variant])

  return (
    <span className="ui-button" title={tooltip}>
      <button className={buttonClassName} disabled={disabled || loading} type={type} onClick={onClick}>
        {loading && (
          <span className="spinner-border spinner-border-sm" />
        )}
        <span>{text}</span>
      </button>
    </span>
  )
}
