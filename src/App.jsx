import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Intro from './components/Intro.jsx'
import Experience from './components/Experience.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import HackathonArena from './components/HackathonArena.jsx'
import Statement from './components/Statement.jsx'
import CTA from './components/CTA.jsx'
import Footer from './components/Footer.jsx'
import ParticleField from './components/ParticleField.jsx'
import AuthPage from './components/AuthPage.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import { statements } from './data/content.js'
import './styles/base.css'
import './styles/layout.css'
import './styles/hero.css'
import './styles/sections.css'
import './styles/tech-text.css'
import './styles/responsive.css'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/login' || path === '/register') {
    return (
      <div className="campus-auth">
        <ParticleField />
        <AuthPage initialMode={path === '/register' ? 'register' : 'login'} />
      </div>
    )
  }

  if (path === '/student' || path.startsWith('/student/')) {
    return <StudentDashboard path={path} />
  }

  return (
    <div className="cc">
      <ParticleField />
      <div className="wrap">
        <Navbar />
        <Hero />
      </div>
      <Marquee />
      <div className="wrap">
        <Intro />
        <Experience />
        <HowItWorks />
        <HackathonArena />
        {statements.map((statement) => (
          <Statement key={statement.label} {...statement} />
        ))}
        <CTA />
      </div>
      <Footer />
    </div>
  )
}

export default App
