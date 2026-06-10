import './Section.css'

function Section({ label, title, children, className = '' }) {
  return (
    <section className={`section ${className}`.trim()}>
      <div className="section__inner">
        {label && <p className="section__label">{label}</p>}
        {title && <h2 className="section__title">{title}</h2>}
        <div className="section__body">{children}</div>
      </div>
    </section>
  )
}

export default Section
