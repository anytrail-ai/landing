import './MockCard.css'

function MockCard({ children, ariaLabel }) {
  return (
    <figure className="mockcard" role="group" aria-label={ariaLabel}>
      {children}
    </figure>
  )
}

export default MockCard
