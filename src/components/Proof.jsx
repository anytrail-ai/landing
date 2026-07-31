import Section from './Section'
import './Proof.css'
import { useLanguage } from '../i18n/useLanguage'

function Proof() {
  const { copy } = useLanguage()
  const c = copy.proof

  return (
    <Section label={c.label} title={c.title} className="proof">
      <p>
        {c.p1a}
        <strong>HIDROREY</strong>
        {c.p1b}
      </p>
      <p>{c.p2}</p>
    </Section>
  )
}

export default Proof
