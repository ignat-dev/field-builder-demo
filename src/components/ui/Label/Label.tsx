import { type ReactNode } from "react"
import { useAltKeyActive } from "../../hooks/useAltKeyActive"

import "./Label.scss"

export interface Props {
  accessKey?: string
  className?: string
  target?: string
  text: string
}

export function Label({ accessKey, className, target, text }: Props) {
  const altActive = useAltKeyActive()
  const key = accessKey ? accessKey.substring(0, 1).toLowerCase() : ""
  const index = key ? text.toLowerCase().indexOf(key) : -1

  return (
    <label className={`ui-label ${className ?? ""}`.trim()} htmlFor={target} accessKey={key || undefined}>
      {renderText()}
    </label>
  )

  function renderText(): ReactNode {
    if (!key || index === -1) {
      return (
        <span>{text}</span>
      )
    }

    return (
      <span>
        {text.slice(0, index)}
        <span className={altActive ? "ui-label__accesskey" : ""}>
          {text[index]}
        </span>
        {text.slice(index + 1)}
      </span>
    )
  }
}
