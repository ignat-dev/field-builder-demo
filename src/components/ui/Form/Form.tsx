import "./Form.scss"

interface Props {
  className?: string
  contentClassName?: string
  children?: React.ReactNode
  disabled?: boolean

  onSubmit?: (e: React.FormEvent) => void
}

export default function Form({ className, contentClassName, children, disabled, onSubmit }: Props) {
  return (
    <form className={`ui-form ${className}`} onSubmit={onSubmit}>
      <fieldset className={contentClassName} disabled={disabled}>
        {children}
      </fieldset>
    </form>
  )
}
