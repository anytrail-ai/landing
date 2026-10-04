import './Band.css'

// Homepage section. `tone` switches the whole band between paper, ink, and
// moss so the page changes gear as it scrolls instead of repeating one cream
// block. Content pages keep using Section.
function Band({ tone = 'paper', label, title, intro, className = '', children }) {
  return (
    <section className={`band band--${tone} ${className}`.trim()}>
      <div className="band__inner">
        {(label || title) && (
          <header className="band__head">
            {label && <p className="band__label">{label}</p>}
            <div className="band__head-main">
              {title && <h2 className="band__title">{title}</h2>}
              {intro && <p className="band__intro">{intro}</p>}
            </div>
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

export default Band
