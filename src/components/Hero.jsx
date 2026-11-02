import { heroDots, siteContent } from '../data/content.js'
import TechTextLines from './TechTextLines.jsx'

function Hero() {
  const { hero } = siteContent

  return (
    <header className="hero" id="top">
      <svg className="curves" viewBox="0 0 1400 1000" preserveAspectRatio="none" aria-hidden="true">
        <path className="orbit orbit-one" d="M-80 250C170 90 340 115 510 330S870 730 1480 205" />
        <path className="orbit orbit-two" d="M-100 800C170 530 350 470 560 600S990 1080 1480 530" />
        <path className="orbit orbit-three" d="M-80 515C230 680 390 800 650 690S1080 250 1480 390" />
        <path className="orbit orbit-four" d="M-80 80C230 290 430 280 690 170S1120 50 1480 900" />
      </svg>
      {heroDots.map((dot, index) => (
        <i key={index} className="pdot" style={dot} />
      ))}
      <div className="sub mono">
        <span>{hero.subtitle}</span>
        <span>{hero.location}</span>
      </div>
      <div className="eyebrow mono">{hero.eyebrow}</div>
      <div className="hero-title" role="heading" aria-level="1" aria-label={hero.title.join(', ')}>
        <TechTextLines
          className="hero-tech-lines"
          lines={hero.title}
          fontSize={224}
          lineLetterSpacings={[-0.055, -0.04, -0.055]}
          autoSelectLines={[0, 1, 2]}
          sweep={false}
        />
        <i className="dot" aria-hidden="true" />
      </div>
      <div className="heroRow">
        <p>{hero.description}</p>
        <a className="btn mono" href="#arena">
          {hero.action} <span>↗</span>
        </a>
      </div>
      <div className="scrollRow mono">
        <span>{hero.scrollLabel}</span>
        <span>{hero.pageNumber}</span>
      </div>
    </header>
  )
}

export default Hero
