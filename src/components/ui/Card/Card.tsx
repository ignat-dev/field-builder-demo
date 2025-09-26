import "./Card.scss"

interface Props {
  className?: string
  contentClassName?: string
  errors?: Array<string>
  children?: React.ReactNode
  title?: string
}

export default function Card({ children, className, contentClassName, errors, title }: Props) {
  return (
    <div className={`ui-card card ${className}`}>
      {title && (
        <div className="card-header">
          {title}
        </div>
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
    </div>
  )
}
