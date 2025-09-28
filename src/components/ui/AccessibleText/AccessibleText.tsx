import { type ReactNode } from "react"
import { useAltKeyActive } from "../../hooks/useAltKeyActive"

import "./AccessibleText.scss"

export interface Props {
  accessKey?: string
  className?: string
  text: string
}

export function AccessibleText({ accessKey, className, text }: Props) {
  const altActive = useAltKeyActive()
  const key = accessKey ? accessKey.substring(0, 1).toLowerCase() : ""
  const index = key ? text.toLowerCase().indexOf(key) : -1

  return (
    <span className={`ui-accessible-text ${className ?? ""}`.trim()}>
      {renderText()}
    </span>
  )

  function renderText(): ReactNode {
    if (!key || index === -1) {
      return text
    }

    return (
      <>
        {text.slice(0, index)}
        <span className={altActive ? "access-key" : ""}>
          {text[index]}
        </span>
        {text.slice(index + 1)}
      </>
    )
  }
}
