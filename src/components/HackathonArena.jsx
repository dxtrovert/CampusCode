import { hackathons, siteContent } from '../data/content.js'

function HackathonArena() {
  const { arena } = siteContent

  return (
    <section id="arena">
      <div className="hhead">
        <h2><span className="num">{arena.number}</span>{arena.heading}</h2>
        <a className="mono" href="#arena">{arena.viewAll} ↗</a>
      </div>
      <div className="arena">
        {hackathons.map((hackathon, index) => {
          const [number, category] = hackathon.category.split(' · ')
          return (
            <a
              className="ac"
              href="#join"
              key={hackathon.title}
              data-arena-card={index + 1}
              onPointerMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect()
                event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
                event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
              }}
            >
              <span className="arena-trace" aria-hidden="true" />
              <span className="arena-corners" aria-hidden="true"><i /><i /><i /><i /></span>
              <span className="arena-coordinate mono" aria-hidden="true">{`X-${number} / CC`}</span>
              <span className="mono card-category" aria-label={hackathon.category}>
                <span className="arena-index" aria-hidden="true">
                  <span>{number}</span>
                  <span>{number}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{category}</span>
              </span>
              <h3>{hackathon.title}</h3>
              <p>{hackathon.description}</p>
              <span className="tag mono">
                <span>{hackathon.status}</span>
                <span className="arena-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default HackathonArena
