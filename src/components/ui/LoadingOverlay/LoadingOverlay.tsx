import type { ReactNode } from "react"

import "./LoadingOverlay.scss"

export interface Props {
  children?: ReactNode
  className?: string
  text?: string
  visible?: boolean
  zIndex?: number
}

export function LoadingOverlay({ children, className, text, visible, zIndex }: Props) {
  const loadingText = text ?? "Loading, please wait..."
  const style = { "--overlay-z-index": zIndex ?? 9999 } as React.CSSProperties

  if (!visible) {
    return null
  }

  return (
    <div className={`ui-loading-overlay ${className ?? ""}`.trim()} style={style}>
      <span>
        <span className="spinner-border text-primary" role="status" aria-label={loadingText} />
        <span>{children ?? loadingText}</span>
      </span>
    </div>
  )
}
