import type { FormEvent, ReactNode } from "react"

import "./Form.scss"

export interface Props {
  children?: ReactNode
  className?: string
  contentClassName?: string
  disabled?: boolean

  onSubmit?: (e: FormEvent) => void
}

export function Form({ children, className, contentClassName, disabled, onSubmit }: Props) {
  return (
    <form className={`ui-form ${className ?? ""}`.trim()} onSubmit={onSubmit}>
      <fieldset className={contentClassName} disabled={disabled}>
        {children}
      </fieldset>
    </form>
  )
}
