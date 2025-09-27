import { type ReactNode, useEffect, useMemo } from "react"

import "./Modal.scss"

export interface Props {
  allowClose?: boolean
  children: ReactNode
  className?: string
  footer?: ReactNode
  id?: string
  maxWidth?: string
  open?: boolean
  title?: string

  onClose?: () => void
  onKeyDown?: (e: KeyboardEvent) => boolean | void
}

export function Modal({
  allowClose = true,
  children,
  className,
  footer,
  id,
  maxWidth,
  open,
  title,
  onClose,
  onKeyDown
}: Props) {
  const wrapperClassName = useMemo(() => {
    return ["ui-modal", className ?? "", "modal", "fade", open ? "show" : ""].filter(Boolean).join(" ").trim()
  }, [className, open])
  const wrapperStyle = useMemo(() => {
    return { ["--modal-max-width"]: maxWidth ?? "400px" } as React.CSSProperties
  }, [maxWidth])

  useEffect(() => {
    if (!open || !(onClose || onKeyDown)) {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (onKeyDown?.(e) === false) {
        return
      }

      if (allowClose && e.key === "Escape") {
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [allowClose, open, onClose, onKeyDown])

  return (
    <div className={wrapperClassName} id={id} tabIndex={-1} style={wrapperStyle}>
      <dialog
        className="modal-dialog modal-dialog-centered"
        open={open}
        role="dialog"
        aria-hidden={!open}
        aria-modal="true"
      >
        <article className="modal-content">
          {title && (
            <header className="modal-header">
              <h5 className="modal-title">{title}</h5>
              {allowClose && (
                <button type="button" className="btn-close" aria-label="Close" rel="prev" onClick={onClose} />
              )}
            </header>
          )}
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <footer className="modal-footer">
              {footer}
            </footer>
          )}
        </article>
      </dialog>
    </div>
  )
}
