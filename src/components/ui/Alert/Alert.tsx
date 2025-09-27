import { type ReactNode } from "react"
import { Button } from "../Button/Button"
import { Modal } from "../Modal/Modal"

import "./Alert.scss"

export interface Props {
  children?: ReactNode
  id?: string
  maxWidth?: string
  open?: boolean
  text?: string
  title?: string

  onClose?: () => void
}

export function Alert({ children, id, maxWidth, open, text = "", title, onClose }: Props) {
  if (children && text) {
    console.warn("Both slot and text content are provided - only slot content will be rendered.")
  }

  return (
    <Modal
      className="ui-alert"
      footer={renderFooter()}
      id={id}
      maxWidth={maxWidth}
      open={open}
      title={title}
      onClose={onClose}
      onKeyDown={onKeyDown}
    >
      {children || text}
    </Modal>
  )

  function renderFooter(): ReactNode {
    return (
      <Button text="OK" variant="primary" onClick={onClose} />
    )
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      onClose?.()
    }
  }
}
