import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../Button/Button"
import { Modal } from "../Modal/Modal"

import "./Prompt.scss"

export interface Props {
  allowOverflow?: boolean
  id?: string
  maxLength?: number
  maxLines?: number
  maxWidth?: string
  open?: boolean
  placeholder?: string
  title?: string

  onClose?: (text?: string) => void
}

export function Prompt({
  allowOverflow = true,
  id,
  maxLength,
  maxLines = 3,
  maxWidth,
  open,
  placeholder,
  title,
  onClose,
}: Props) {
  const [value, setValue] = useState("")
  const formatterRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxHeight = useMemo(() => (
    textareaRef.current
      ? parseInt(window.getComputedStyle(textareaRef.current).lineHeight || "24", 10) * maxLines
      : 0
  ), [maxLines, textareaRef])

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current?.focus()
    }
  }, [open])

  return (
    <Modal
      className="ui-prompt"
      footer={renderFooter()}
      id={id}
      maxWidth={maxWidth}
      open={open}
      title={title}
      onClose={onClose}
    >
      <div className="ui-prompt__input-container">
        <div className="ui-prompt__input-formatter" ref={formatterRef}>
          {renderText()}
        </div>
        <textarea
          className="ui-prompt__input-control"
          maxLength={allowOverflow ? undefined : maxLength}
          placeholder={placeholder}
          ref={textareaRef}
          rows={1}
          value={value}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onScroll={onScroll}
        />
      </div>
    </Modal>
  )

  function renderText(): ReactNode {
    if (maxLength === undefined || maxLength <= 0 || !allowOverflow) {
      return (
        <span>{value}</span>
      )
    }

    const textContent = value.slice(0, maxLength)
    const textOverflow = value.slice(maxLength)

    return (
      <>
        <span>{textContent}</span>
        {textOverflow && <span className="text-overflow">{textOverflow}</span>}
      </>
    )
  }

  function renderFooter(): ReactNode {
    return (
      <Button text="OK" variant="primary" onClick={onSubmit} />
    )
  }

  function onInput(e: React.FormEvent<HTMLTextAreaElement>): void {
    if (!formatterRef.current) {
      return
    }

    const textarea = e.currentTarget
    const formatter = formatterRef.current
    let inputValue = e.currentTarget.value

    if (!allowOverflow && maxLength !== undefined) {
      inputValue = inputValue.slice(0, maxLength)
    }

    setValue(inputValue.replace(/[\r\n]/g, ""))

    textarea.style.height = formatter.style.height = "auto"
    textarea.style.height = formatter.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter") {
      e.preventDefault()
      onSubmit()
    }
  }

  function onScroll(): void {
    if (textareaRef.current && formatterRef.current) {
      formatterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  function onSubmit(): void {
    onClose?.(value)
    setValue("")
  }
}
