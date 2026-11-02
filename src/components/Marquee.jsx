import { marqueeWords } from '../data/content.js'

function Marquee() {
  const items = Array.from({ length: 4 }).flatMap(() => marqueeWords)

  return (
    <div className="marq">
      <div className="track">
        {items.map((word, index) => (
          <span key={index}>{word} <i>✦</i></span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
