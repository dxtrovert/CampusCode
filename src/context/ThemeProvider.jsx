import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import ThemeContext from './themeContext.js'

const THEME_STORAGE_KEY = 'campuscode-theme'
const FALLBACK_DURATION = 480

function getInitialTheme() {
  const theme = document.documentElement.dataset.theme
  if (theme === 'light' || theme === 'dark') return theme

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionLock = useRef(false)
  const fallbackTimer = useRef(null)

  useEffect(() => () => {
    if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current)
  }, [])

  const changeTheme = useCallback((nextTheme, toggleButton) => {
    if (transitionLock.current || nextTheme === theme) return

    transitionLock.current = true
    setIsTransitioning(true)

    const applyTheme = () => {
      document.documentElement.dataset.theme = nextTheme
      document.documentElement.style.colorScheme = nextTheme
      document.querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', nextTheme === 'dark' ? '#101014' : '#f8f7f3')
      setTheme(nextTheme)

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      } catch (error) {
        console.warn('CampusCode could not save the selected theme.', error)
      }
    }

    const releaseLock = () => {
      transitionLock.current = false
      setIsTransitioning(false)
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startViewTransition = document.startViewTransition

    if (typeof startViewTransition === 'function' && !reduceMotion) {
      const bounds = toggleButton.getBoundingClientRect()
      const x = bounds.left + bounds.width / 2
      const y = bounds.top + bounds.height / 2
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      const radius = Math.ceil(Math.hypot(
        Math.max(x, width - x),
        Math.max(y, height - y),
      ))

      document.documentElement.style.setProperty('--theme-reveal-x', `${x}px`)
      document.documentElement.style.setProperty('--theme-reveal-y', `${y}px`)
      document.documentElement.style.setProperty('--theme-reveal-radius', `${radius}px`)

      const transition = startViewTransition.call(document, () => {
        flushSync(applyTheme)
      })

      transition.finished.then(releaseLock, (error) => {
        console.error('CampusCode theme transition did not finish.', error)
        releaseLock()
      })
      return
    }

    document.documentElement.classList.add('theme-fallback-transition')
    applyTheme()
    fallbackTimer.current = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-fallback-transition')
      fallbackTimer.current = null
      releaseLock()
    }, reduceMotion ? 100 : FALLBACK_DURATION)
  }, [theme])

  const toggleTheme = useCallback((toggleButton) => {
    changeTheme(theme === 'dark' ? 'light' : 'dark', toggleButton)
  }, [changeTheme, theme])

  return (
    <ThemeContext.Provider value={{ theme, isTransitioning, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
