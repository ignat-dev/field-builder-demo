import { type MouseEvent, useMemo } from "react"
import { AccessibleText } from "../AccessibleText/AccessibleText"

import "./Button.scss"

export interface Props {
  accessKey?: string
  appearance?: "link" | "outline"
  className?: string
  disabled?: boolean
  loading?: boolean
  size?: "small" | "standard" | "large"
  text: string
  tooltip?: string
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"

  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

export function Button({
  accessKey,
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
  ...rest
}: Props) {
  const buttonClassName = useMemo(() => {
    const result = ["btn", className].filter(Boolean)

    if (variant) {
      result.push(appearance === "outline" ? `btn-outline-${variant}` : `btn-${variant}`)
    }

    if (appearance && appearance === "outline") {
      result.push("outline")
    }

    if (variant === "light") {
      result.push("secondary")
    }

    if (appearance && appearance !== "outline") {
      result.push(`btn-${appearance}`)
    }

    if (size && size !== "standard") {
      result.push(`btn-${size === "small" ? "sm" : "lg"}`)
    }

    return result.join(" ")
  }, [appearance, className, size, variant])

  return (
    <span className="ui-button" title={tooltip}>
      <button
        {...rest}
        accessKey={accessKey}
        className={buttonClassName}
        disabled={disabled || loading}
        type={type}
        onClick={onClick}
      >
        {loading && (
          <span className="spinner-border spinner-border-sm" />
        )}
        <AccessibleText accessKey={accessKey} text={text} />
      </button>
    </span>
  )
}
