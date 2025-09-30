import type { ReactNode } from "react"

import "./Card.scss"

export interface Props {
  children?: ReactNode
  className?: string
  contentClassName?: string
  errors?: Array<string>
  title?: string
}

export function Card({ children, className, contentClassName, errors, title }: Props) {
  return (
    <article className={`ui-card card ${className ?? ""}`.trim()}>
      {title && (
        <header className="card-header">
          {title}
        </header>
      )}
      {errors && errors.length > 0 && (
        <div className="ui-card__notification-area type-danger">
          <p>Please correct the following errors and try again:</p>
          <ul>{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
        </div>
      )}
      <div className={`card-body ${contentClassName}`}>
        {children}
      </div>
    </article>
  )
}
