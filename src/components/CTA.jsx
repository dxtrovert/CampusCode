import { siteContent } from '../data/content.js'
import TechTextLines from './TechTextLines.jsx'

function CTA() {
  const { cta } = siteContent

  return (
    <section className="cta" id="join">
      <div className="mono cta-label">{cta.label}</div>
      <TechTextLines
        className="big cta-tech-lines"
        lines={cta.title}
        fontSize={140}
        align="center"
        outlinedLines={[1]}
      />
      <a className="btn mono" href="#top">{cta.action} <span>↗</span></a>
    </section>
  )
}

export default CTA
