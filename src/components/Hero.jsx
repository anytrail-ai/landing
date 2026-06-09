import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <h1 className="hero__title">
        Turn your business into an expert AI agent — in one click.
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
          Anytrail builds AI sales agents that reply to your customers 24/7. One
          click makes the agent an expert in everything you sell — answering
          questions and recommending the right next step, day or night.
        </p>
        <div className="hero__actions">
          <a className="hero__cta" href="#waitlist">
            Join waitlist
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
