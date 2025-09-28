import { AccessibleText } from "../AccessibleText/AccessibleText"

import "./Label.scss"

export interface Props {
  accessKey?: string
  className?: string
  target?: string
  text: string
}

export function Label({ accessKey, className, target, text }: Props) {
  const key = accessKey ? accessKey.substring(0, 1).toLowerCase() : ""

  return (
    <label className={`ui-label ${className ?? ""}`.trim()} accessKey={key || undefined} htmlFor={target}>
      <AccessibleText accessKey={accessKey} text={text} />
    </label>
  )
}
