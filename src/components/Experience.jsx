import { useRef, useState } from 'react'
import experienceVideo from '../assets/what-is-campuscode.mp4'
import { siteContent } from '../data/content.js'

function Experience() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [playbackError, setPlaybackError] = useState(false)
  const { experience } = siteContent

  const playVideo = async () => {
    try {
      await videoRef.current?.play()
      setPlaybackError(false)
    } catch {
      setPlaybackError(true)
    }
  }

  return (
    <section>
      <div className="mono experience-label">{experience.label}</div>
      <div className="vhead">{experience.heading[0]}<br />{experience.heading[1]}</div>
      <div className="vstage">
        <div className="vcard">
          <video
            ref={videoRef}
            className="experience-video"
            src={experienceVideo}
            controls
            playsInline
            preload="metadata"
            aria-label={`${experience.cardLabel}: ${experience.cardHeading.join(' ')}`}
            onPlay={() => {
              setPlaying(true)
              setPlaybackError(false)
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setPlaying(false)
              setPlaybackError(true)
            }}
          />
          {!playing && (
            <div className="video-overlay">
              <span className="logo2" aria-hidden="true">S</span>
              <span className="blob" aria-hidden="true" />
              <small>{experience.cardLabel}</small>
              <h3>{experience.cardHeading[0]}<br />{experience.cardHeading[1]}</h3>
              <button
                className="play"
                onClick={playVideo}
                aria-label="Play CampusCode video"
                type="button"
              >
                ▶
              </button>
              <em>{playbackError ? 'VIDEO UNAVAILABLE — TRY AGAIN' : 'TAP TO PLAY'}</em>
            </div>
          )}
        </div>
      </div>
      <div className="vfoot mono">
        <span>{experience.footerLeft}</span>
        <span>{experience.footerRight}</span>
      </div>
    </section>
  )
}

export default Experience
