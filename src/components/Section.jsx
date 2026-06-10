import './Section.css'

function Section({ label, title, children, className = '', wide = false }) {
  const classes = ['section', wide && 'section--wide', className]
    .filter(Boolean)
    .join(' ')
  return (
    <section className={classes}>
      <div className="section__inner">
        {label && <p className="section__label">{label}</p>}
        {title && <h2 className="section__title">{title}</h2>}
        <div className="section__body">{children}</div>
      </div>
    </section>
  )
}

export default Section
