import { useRef } from 'react'
import logo from '../assets/logo.png'
import { siteContent } from '../data/content.js'
import useTheme from '../context/useTheme.js'

function Navbar() {
  const toggleRef = useRef(null)
  const { theme, isTransitioning, toggleTheme } = useTheme()
  const { nav } = siteContent

  return (
    <nav>
      <a className="logo-link" href="#top" aria-label="CampusCode home">
        <img className="logo-image" src={logo} alt="CampusCode Hackathon Arena" />
      </a>
      <div className="nav-links">
        {nav.links.map((link) => (
          <a className="mono" href={link.href} key={link.href}>{link.label}</a>
        ))}
      </div>
      <div className="nav-actions">
        <a className="nav-login mono" href="/login">{nav.login}</a>
        <button
          ref={toggleRef}
          className="theme-toggle"
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-pressed={theme === 'dark'}
          disabled={isTransitioning}
          onClick={() => toggleTheme(toggleRef.current)}
        >
          <svg
            className={`theme-icon theme-icon-sun${theme === 'light' ? ' is-active' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
          <svg
            className={`theme-icon theme-icon-moon${theme === 'dark' ? ' is-active' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
          </svg>
        </button>
        <a className="btn mono nav-join" href="#join">{nav.join}<span>↗</span></a>
        <button className="burger" aria-label="Menu" type="button">☰</button>
      </div>
    </nav>
  )
}

export default Navbar
