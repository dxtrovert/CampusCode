import { siteContent } from '../data/content.js'
import { introCarouselItems } from '../data/introCarousel.js'
import CircularCarousel from './CircularCarousel.jsx'
import TechTextLines from './TechTextLines.jsx'

function Intro() {
  const { intro } = siteContent

  return (
    <section id="about" className="intro-section">
      <div className="intro-copy">
        <div className="num">01</div>
        <div className="mono intro-label">{intro.label}</div>
        <TechTextLines className="big intro-tech-lines" lines={intro.title} fontSize={140} outlinedLines={[2]} />
        <p className="lead">{intro.description}</p>
        <div className="three mono">
          {intro.audience.map((item, index) => (
            <div key={item}>{`0${index + 1}`} &nbsp;{item}</div>
          ))}
        </div>
      </div>
      <div className="intro-carousel" aria-label="CampusCode student innovation gallery">
        <CircularCarousel
          items={introCarouselItems}
          preset="cylinder"
          intro="rise"
          cardWidth={260}
          aspectRatio={1.35}
          speed={12}
          captions={false}
          gap={18}
          tilt={-5}
          curve={1}
          perspective={2200}
          autoplay="drift"
          interval={3}
          direction="left"
          momentum={0.6}
          snap
          pauseOnHover={false}
          focusOnClick
          draggable
          parallax={0.18}
          stretch={0.25}
          fadeColor="#111111"
          depthFade={0.38}
          innerShade={0.45}
          cornerRadius={10}
        />
      </div>
    </section>
  )
}

export default Intro
