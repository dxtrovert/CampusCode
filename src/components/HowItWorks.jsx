import { siteContent, steps } from '../data/content.js'
import TechTextLines from './TechTextLines.jsx'

function HowItWorks() {
  const { howItWorks } = siteContent

  return (
    <section id="how-it-works">
      <div className="hhead">
        <div className="how-title" role="heading" aria-level="2" aria-label={`${howItWorks.number} ${howItWorks.heading}`}>
          <span className="num">{howItWorks.number}</span>
          <TechTextLines
            className="how-tech-lines"
            lines={[howItWorks.heading]}
            fontSize={38}
            letterSpacing={-0.05}
          />
        </div>
        <span className="mono how-subtitle">
          {howItWorks.subtitle[0]}<br />{howItWorks.subtitle[1]}
        </span>
      </div>
      <div className="grid4">
        {steps.map((step) => {
          const stepType = step.title.toLowerCase().replace(/\s+/g, '-')
          return (
            <article
              key={step.number}
              className="step-card"
              data-step={stepType}
              tabIndex={0}
              role="group"
              aria-label={`${step.number} ${step.title}`}
            >
              <span className="step-number mono" data-number={step.number} aria-hidden="true">
                <span>{step.number}</span>
                <span>{step.number}</span>
              </span>
              <span className="step-wash" aria-hidden="true" />
              <span className="step-accent" aria-hidden="true" />
              <span className="step-blueprint" aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="ar" aria-hidden="true">↗</span>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default HowItWorks
