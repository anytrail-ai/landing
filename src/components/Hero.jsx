import './Hero.css'
import { DEMO_URL } from '../config'

function Hero() {
  return (
    <section className="hero">
      <h1 className="hero__title">
        Big-company sales intelligence.
        <br />
        Built for your business.
      </h1>

      <div className="hero__media">
        <img
          className="hero__image"
          src="/hero.jpg"
          alt="A team working together over laptops, notebooks and documents"
          width="1535"
          height="1024"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <div className="hero__content">
        <p className="hero__subtitle">
          Anytrail learns from your sales history, finds the patterns big
          competitors hire data teams to spot, and turns them into ads, emails,
          and replies — automatically.
        </p>
        <div className="hero__actions">
          <a className="hero__cta" href={DEMO_URL}>
            Book a demo
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
