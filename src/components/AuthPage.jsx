import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { startDemoSession } from '../data/demoSession.js'
import './AuthPage.css'

const makeCaptcha = () => Math.random().toString(36).slice(2, 7).toUpperCase()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const captchaNoise = [
  { x1: 12, y1: 12, x2: 169, y2: 28, color: '#83b903' },
  { x1: 23, y1: 34, x2: 158, y2: 9, color: '#6339fd' },
  { x1: 42, y1: 7, x2: 174, y2: 37, color: '#83b903' },
  { x1: 8, y1: 27, x2: 142, y2: 12, color: '#6339fd' },
]

function Captcha({ value, onRefresh, input, onInput }) {
  return (
    <div className="auth-captcha">
      <div className="auth-captcha-row">
        <svg className="auth-captcha-image" viewBox="0 0 188 46" role="img" aria-label="CAPTCHA challenge">
          <rect x=".5" y=".5" width="187" height="45" rx="5" fill="var(--auth-input)" stroke="var(--auth-line)" />
          {captchaNoise.map((line, index) => (
            <path
              key={index}
              d={`M${line.x1} ${line.y1} Q94 ${index % 2 ? 40 : 4} ${line.x2} ${line.y2}`}
              stroke={line.color}
              strokeOpacity=".36"
              strokeWidth="1"
              fill="none"
            />
          ))}
          <text x="94" y="31" textAnchor="middle" className="auth-captcha-text">{value}</text>
        </svg>
        <button className="auth-captcha-refresh" type="button" onClick={onRefresh} aria-label="Get a new CAPTCHA">
          ↻ <span>NEW</span>
        </button>
      </div>
      <label className="auth-sr-only" htmlFor="captcha">Enter the characters shown in the CAPTCHA</label>
      <input
        id="captcha"
        className="auth-input"
        type="text"
        value={input}
        onChange={(event) => onInput(event.target.value)}
        placeholder="Enter the code above"
        autoComplete="off"
        required
      />
    </div>
  )
}

function AuthPage({ initialMode }) {
  const [mode, setMode] = useState(initialMode)
  const [captcha, setCaptcha] = useState(makeCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${isForgot ? 'Reset password' : isRegister ? 'Create account' : 'Login'} | CampusCode`
    return () => {
      document.title = previousTitle
    }
  }, [isForgot, isRegister])

  const resetForm = (nextMode) => {
    setMode(nextMode)
    setCaptcha(makeCaptcha())
    setCaptchaInput('')
    setMessage('')
    setIsError(false)
    setIsLoading(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const identity = String(data.get(isRegister || isForgot ? 'email' : 'identity') || '').trim()
    const email = identity
    const password = String(data.get('password') || '')
    const confirmPassword = String(data.get('confirmPassword') || '')

    setMessage('')
    setIsError(false)

    if (!isRegister && !isForgot) {
      setIsLoading(true)
      window.setTimeout(() => {
        const saved = startDemoSession(identity)
        if (!saved) {
          setIsLoading(false)
          setIsError(true)
          setMessage('Your browser could not save the demo session. Check session storage settings and try again.')
          return
        }
        window.location.assign('/student/overview')
      }, 450)
      return
    }

    if (isRegister && !name) {
      setIsError(true)
      setMessage('Enter your full name.')
      return
    }

    if (!emailPattern.test(email)) {
      setIsError(true)
      setMessage('Enter a valid email address.')
      return
    }

    if (!isForgot && password.length < 8) {
      setIsError(true)
      setMessage('Your password must be at least 8 characters.')
      return
    }

    if (isRegister && password !== confirmPassword) {
      setIsError(true)
      setMessage('The passwords do not match.')
      return
    }

    if (captchaInput.trim().toUpperCase() !== captcha) {
      setIsError(true)
      setMessage('That CAPTCHA code does not match. Please try again.')
      setCaptcha(makeCaptcha())
      setCaptchaInput('')
      return
    }

    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      setIsError(false)
      setMessage(isForgot
        ? 'Password reset is not connected yet. No reset email was sent.'
        : 'Authentication is not connected yet. Your details were not submitted.')
    }, 350)
  }

  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <a href="/" className="auth-brand" aria-label="CampusCode home">
          <img src={logo} alt="CampusCode Hackathon Arena" />
        </a>
        <a href="/" className="auth-back mono">← Back to home</a>
      </header>

      <main className="auth-main">
        <section className="auth-intro" aria-labelledby="auth-title">
          <svg className="auth-orbits" viewBox="0 0 760 520" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-50 120C120 12 260 40 355 185S550 380 820 132" />
            <path d="M-60 425C145 250 260 250 390 315S600 495 830 330" />
            <path d="M-70 265C120 350 280 410 430 285S620 90 820 210" />
          </svg>
          <span className="auth-eyebrow mono"><i /> CampusCode / Authentication</span>
          <div className="auth-kicker mono"><span>Access</span><span>01 / 02</span></div>
          <h1 className="auth-title" id="auth-title">
            <span>ENTER</span>
            <span>THE</span>
            <span className="auth-outline">ARENA.</span>
          </h1>
          <p className="auth-description">
            Sign in to continue building, collaborating and competing with the CampusCode community.
          </p>

          <div className="auth-pillars" aria-label="Build, compete, ship">
            {['BUILD', 'COMPETE', 'SHIP'].map((word, index) => (
              <div className="auth-pillar" key={word}>
                <span className="mono">0{index + 1}</span>
                <strong>{word}</strong>
              </div>
            ))}
          </div>

          <div className="auth-status mono">
            <span><i /> Authentication ready</span>
            <span>Secure access</span>
            <span>2026</span>
          </div>
        </section>

        <section className="auth-form-column" aria-label="Account access">
          <div className="auth-card">
            <div className="auth-gradient" />
            <div className="auth-card-code mono">CC<br />01</div>
            <div className="auth-card-heading">
              <span className="mono">{isForgot ? 'ACCOUNT RECOVERY' : isRegister ? 'NEW ACCOUNT' : 'EXISTING ACCOUNT'}</span>
              <h2>{isForgot ? 'RESET' : isRegister ? 'CREATE ACCOUNT' : 'LOGIN'}</h2>
              <p>{isForgot ? 'Request access to reset your password.' : isRegister ? 'Create your CampusCode account.' : 'Access your CampusCode account.'}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {isRegister && (
                <label className="auth-field">
                  <span className="mono">FULL NAME</span>
                  <input className="auth-input" type="text" name="name" placeholder="Your name" autoComplete="name" required />
                </label>
              )}
              <label className="auth-field">
                <span className="mono">EMAIL ADDRESS</span>
                <span className="auth-input-wrap">
                  <span aria-hidden="true">@</span>
                  <input
                    className="auth-input"
                    type={isRegister || isForgot ? 'email' : 'text'}
                    name={isRegister || isForgot ? 'email' : 'identity'}
                    placeholder={isRegister || isForgot ? 'you@example.com' : 'Name or email address'}
                    autoComplete={isRegister || isForgot ? 'email' : 'username'}
                  />
                </span>
              </label>

              {!isForgot && (
                <label className="auth-field">
                  <span className="mono">PASSWORD</span>
                  <span className="auth-input-wrap">
                    <span aria-hidden="true">·</span>
                    <input
                      className="auth-input"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      required
                    />
                    <button className="auth-show-password mono" type="button" onClick={() => setShowPassword((shown) => !shown)}>
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </span>
                </label>
              )}

              {isRegister && (
                <label className="auth-field">
                  <span className="mono">CONFIRM PASSWORD</span>
                  <input className="auth-input" type={showPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Re-enter your password" autoComplete="new-password" required />
                </label>
              )}

              <div className="auth-field">
                <span className="mono">CAPTCHA</span>
                <Captcha
                  value={captcha}
                  input={captchaInput}
                  onInput={setCaptchaInput}
                  onRefresh={() => {
                    setCaptcha(makeCaptcha())
                    setCaptchaInput('')
                    setMessage('')
                  }}
                />
              </div>

              <div className="auth-system" aria-label="CampusCode system ready">
                <div className="auth-system-mark"><i /><i /><i /></div>
                <span className="auth-system-sleep mono">Zzz</span>
                <strong className="mono">READY</strong>
                <i className="auth-system-light" />
              </div>

              {message && (
                <p className={`auth-message${isError ? ' is-error' : ''}`} role={isError ? 'alert' : 'status'}>
                  {message}
                </p>
              )}

              <button className="auth-submit" type="submit" disabled={isLoading}>
                <span>{isLoading ? 'PLEASE WAIT…' : isForgot ? 'CONTINUE' : isRegister ? 'CREATE ACCOUNT' : 'LOGIN'}</span>
                <span className={`auth-arrow${isLoading ? ' is-loading' : ''}`} aria-hidden="true">{isLoading ? '' : '↗'}</span>
              </button>
            </form>

            {!isRegister && !isForgot && (
              <button className="auth-text-link auth-forgot mono" type="button" onClick={() => resetForm('forgot')}>
                FORGOT PASSWORD?
              </button>
            )}

            <div className="auth-card-footer">
              {isRegister ? (
                <>
                  <span className="mono">ALREADY HAVE AN ACCOUNT?</span>
                  <a className="mono" href="/login">LOGIN <b>→</b></a>
                </>
              ) : isForgot ? (
                <>
                  <span className="mono">REMEMBERED YOUR PASSWORD?</span>
                  <button className="auth-text-link mono" type="button" onClick={() => resetForm('login')}>BACK TO LOGIN <b>→</b></button>
                </>
              ) : (
                <>
                  <span className="mono">DON’T HAVE AN ACCOUNT?</span>
                  <a className="mono" href="/register">CREATE ACCOUNT <b>→</b></a>
                </>
              )}
            </div>
          </div>
          <div className="auth-card-meta mono">
            <span>AUTH / 2026</span>
            <span><i /> SECURE LOGIN</span>
          </div>
        </section>
      </main>

      <footer className="auth-footer mono">
        <span>CAMPUSCODE © 2026</span>
        <span>LEARN · BUILD · COMPETE · SHIP</span>
        <span>ALL SYSTEMS OPERATIONAL</span>
      </footer>
    </div>
  )
}

export default AuthPage
