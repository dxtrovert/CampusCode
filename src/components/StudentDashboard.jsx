import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import ParticleField from './ParticleField.jsx'
import {
  endDemoSession,
  getDemoDashboard,
  getDemoProfile,
  getDemoSession,
  saveDemoProfile,
} from '../data/demoSession.js'
import './StudentDashboard.css'

const navigation = [
  { label: 'Overview', href: '/student/overview', icon: 'grid' },
  { label: 'Events', href: '/student/events', icon: 'calendar' },
  { label: 'My Events', href: '/student/my-events', icon: 'clock' },
  { label: 'HackMate AI', href: '/student/ai/hackmate', icon: 'spark' },
  { label: 'IdeaCheck AI', href: '/student/ai/ideacheck', icon: 'bulb' },
  { label: 'Certificates', href: '/student/certificates', icon: 'award' },
  { label: 'Digital Card', href: '/student/digital-card', icon: 'card' },
  { label: 'RuleBot AI', href: '/student/ai/rulebot', icon: 'bot', badge: 'AI' },
  { label: 'Student Guide', href: '/student/guide', icon: 'book' },
  { label: 'Official Communication', href: '/student/communication', icon: 'mail' },
  { label: 'Notifications', href: '/student/notifications', icon: 'bell' },
  { label: 'Help & Support', href: '/student/support', icon: 'help' },
  { label: 'Profile', href: '/student/profile', icon: 'user' },
]

const sectionTitles = Object.fromEntries(navigation.map(({ href, label }) => [href, label]))
const journeyLabels = [
  ['Hackathons', 'registered'],
  ['Ongoing', 'ongoing'],
  ['Completed', 'completed'],
  ['Certificates', 'certificates'],
]

function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    bulb: <><path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 12.7c.8.6 1 1.3 1 2.3h6c0-1 .2-1.7 1-2.3A7 7 0 0 0 12 2Z" /></>,
    award: <><circle cx="12" cy="8" r="6" /><path d="m8.2 13-1 8 4.8-2.6 4.8 2.6-1-8" /></>,
    card: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="10" r="2" /><path d="M5.5 16c.7-2 4.3-2 5 0m3-5h4m-4 4h4" /></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="3" /><path d="M12 3v4m-5 5h.01M17 12h.01M9 16h6m-7-9-2-2m12 2 2-2" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z" /><path d="M4 16h16M8 7h8m-8 3h6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.3 1.8c-1.2 1.1-1.9 1.3-1.9 3m0 3h.01" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" /></>,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
  }

  return (
    <svg className="sd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.grid}
    </svg>
  )
}

function formatDate(value, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat(undefined, options).format(date)
}

function getInitials(name) {
  return name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'ST'
}

function MetricCard({ label, value }) {
  return (
    <article className="sd-metric">
      <span className="sd-overline">{label}</span>
      <strong>{Number.isFinite(value) ? value : '—'}</strong>
      <span className="sd-source">Demo data</span>
    </article>
  )
}

function EventCard({ event }) {
  const joined = Boolean(event.isJoined)
  return (
    <article className="sd-event-card">
      <div className="sd-event-head">
        <span className="sd-event-avatar">{getInitials(event.organizerName || event.title)}</span>
        <span className={`sd-status-chip${joined ? ' is-joined' : ''}`}>{joined ? 'Joined' : event.status || 'Open'}</span>
      </div>
      <span className="sd-overline">{event.category || 'Event category unavailable'}</span>
      <h3>{event.title || 'Untitled event'}</h3>
      <p>{formatDate(event.startsAt || event.date, { month: 'short', day: 'numeric' })} · {joined ? 'Your participation' : 'Open participation'}</p>
      <a className="sd-event-action" href={event.href || '/student/events'} aria-label={`${joined ? 'View' : 'Join'} ${event.title || 'event'}`}>
        {joined ? 'JOINED' : 'JOIN NOW'} <span>↗</span>
      </a>
    </article>
  )
}

function DemoAvatar({ name, className = '' }) {
  let hash = 0
  for (const character of name || 'Student') hash = (hash * 31 + character.charCodeAt(0)) | 0
  return (
    <span
      className={`sd-demo-avatar ${className}`}
      style={{ '--avatar-hue': Math.abs(hash) % 360 }}
      aria-label={`${name || 'Student'} avatar`}
    >
      {getInitials(name)}
    </span>
  )
}

function ProfilePage({ profile, onSave }) {
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const result = onSave({
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      college: String(form.get('college') || ''),
      course: String(form.get('course') || ''),
      skills: String(form.get('skills') || '').split(',').map((skill) => skill.trim()).filter(Boolean),
      bio: String(form.get('bio') || ''),
    })
    setSaved(result)
    setSaveError(result ? '' : 'Unable to save profile to this browser session.')
  }

  return (
    <section className="sd-profile-page">
      <div className="sd-profile-heading">
        <DemoAvatar name={profile.name} className="sd-profile-large-avatar" />
        <div>
          <span className="sd-overline">Student profile / demo</span>
          <h1>{profile.name}</h1>
          <p>Edit your profile information for this browsing session.</p>
        </div>
      </div>
      <form className="sd-profile-form" onSubmit={handleSubmit}>
        <label><span>FULL NAME</span><input name="name" defaultValue={profile.name} required /></label>
        <label><span>EMAIL ADDRESS</span><input name="email" type="email" defaultValue={profile.email} /></label>
        <label><span>COLLEGE</span><input name="college" defaultValue={profile.college} /></label>
        <label><span>COURSE</span><input name="course" defaultValue={profile.course} /></label>
        <label className="sd-profile-wide"><span>SKILLS <small>COMMA SEPARATED</small></span><input name="skills" defaultValue={profile.skills.join(', ')} /></label>
        <label className="sd-profile-wide"><span>BIO</span><textarea name="bio" rows="4" defaultValue={profile.bio} /></label>
        <div className="sd-profile-actions">
          <button className="sd-button" type="submit">SAVE PROFILE <span>↗</span></button>
          {saved && <span className="sd-profile-saved" role="status">Saved for this session.</span>}
          {saveError && <span className="sd-profile-error" role="alert">{saveError}</span>}
        </div>
      </form>
    </section>
  )
}

function StudentDashboard({ path = window.location.pathname }) {
  const currentPath = path.replace(/\/+$/, '') || '/student/overview'
  const isOverview = currentPath === '/student' || currentPath === '/student/overview'
  const [data, setData] = useState(getDemoDashboard)
  const [profile, setProfile] = useState(getDemoProfile)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [profileError, setProfileError] = useState('')
  const title = sectionTitles[currentPath] || 'Overview'

  useEffect(() => {
    if (!getDemoSession()) {
      window.location.replace('/login')
      return undefined
    }

    const previousTitle = document.title
    document.title = `${title} | CampusCode Student`
    return () => {
      document.title = previousTitle
    }
  }, [title])

  const student = data?.student || null
  const stats = data?.stats || {}
  const name = student?.fullName?.trim() || ''
  const events = Array.isArray(data?.discoverEvents) ? data.discoverEvents : []
  const deadlines = Array.isArray(data?.upcomingDeadlines) ? data.upcomingDeadlines : null
  const notifications = Array.isArray(data?.notifications) ? data.notifications : null
  const activity = Array.isArray(data?.currentActivity) ? data.currentActivity : null
  const unreadCount = Number.isFinite(data?.unreadNotifications) ? data.unreadNotifications : 0
  const featured = data?.featuredEvent || null
  const featuredAvatars = Array.isArray(featured?.participantAvatars)
    ? featured.participantAvatars.filter((avatar) => avatar?.url)
    : []
  const reload = () => setData(getDemoDashboard())
  const logout = () => {
    endDemoSession()
    window.location.assign('/')
  }
  const handleProfileSave = (nextProfile) => {
    const saved = saveDemoProfile(nextProfile)
    if (!saved) {
      setProfileError('Unable to save profile to this browser session.')
      return false
    }
    const updatedProfile = { ...nextProfile, name: nextProfile.name.trim() || profile.name }
    setProfile(updatedProfile)
    setProfileError('')
    setData((current) => current ? {
      ...current,
      student: { ...current.student, fullName: updatedProfile.name },
    } : current)
    return true
  }

  if (!getDemoSession() || !data || !profile) return null

  return (
    <div className="student-dashboard">
      <ParticleField />
      <button
        className={`sd-drawer-backdrop${drawerOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Close navigation"
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={`sd-sidebar${drawerOpen ? ' is-open' : ''}`}>
        <a className="sd-logo" href="/" aria-label="CampusCode home">
          <img src={logo} alt="CampusCode Hackathon Arena" />
        </a>
        <span className="sd-nav-label">Workspace</span>
        <nav className="sd-side-nav" aria-label="Student workspace">
          {navigation.map((item) => {
            const active = currentPath === item.href || (currentPath === '/student' && item.href === '/student/overview')
            return (
              <a
                key={item.href}
                href={item.href}
                className={`sd-nav-item${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {item.badge && <small>{item.badge}</small>}
                {active && <b aria-hidden="true">→</b>}
              </a>
            )
          })}
        </nav>
        <div className="sd-sidebar-bottom">
          <a className="sd-sidebar-home" href="/">← Back to CampusCode</a>
          <button className="sd-logout-button" type="button" onClick={logout}>LOG OUT <span>↗</span></button>
        </div>
      </aside>

      <div className="sd-main">
        <header className="sd-topbar">
          <button
            type="button"
            className="sd-menu-toggle"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
          <div className="sd-breadcrumb">
            <span>CAMPUSCODE / STUDENT</span>
            <strong>{title.toUpperCase()}</strong>
          </div>
          <div className="sd-top-actions">
            <a className="sd-notification-button" href="/student/notifications" aria-label={`${unreadCount} unread notifications`}>
              <Icon name="bell" />
              {unreadCount > 0 && <span>{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </a>
            <button className="sd-refresh-button" type="button" onClick={reload} aria-label="Refresh dashboard">
              <Icon name="refresh" /><span>REFRESH</span>
            </button>
            <div className="sd-profile-summary">
              <DemoAvatar name={name} />
              <strong>{name || 'Student'}</strong>
            </div>
          </div>
        </header>

        <main className="sd-content">
          {isOverview ? (
            <>
              <section className="sd-welcome">
                <span className="sd-overline">Student workspace / live</span>
                <h1>WELCOME BACK, <span>{name || 'STUDENT'}</span>.</h1>
                <p>Your CampusCode demo activity is ready to explore.</p>
              </section>

                  <section className="sd-featured" aria-label="Featured hackathon">
                    {featured ? (
                      <>
                        <div className="sd-featured-copy">
                          <span className="sd-overline">Build · Learn · Collaborate</span>
                          <h2>{featured.title}</h2>
                          <p>{featured.description || 'Details for this event are available on its event page.'}</p>
                          <div className="sd-featured-meta">
                            <span>{Number.isFinite(featured.participantCount) ? `${featured.participantCount} participants` : 'Participation details'}</span>
                            <span className="sd-featured-status">{featured.status || 'Status unavailable'}</span>
                          </div>
                          <a className="sd-button" href={featured.href || '/student/events'}>OPEN EVENT <Icon name="arrow" /></a>
                        </div>
                        <div className="sd-participants" aria-label="Event participants">
                          {featuredAvatars.slice(0, 4).map((avatar, index) => (
                            <img key={avatar.id || avatar.url || index} src={avatar.url} alt={avatar.name || 'Participant'} />
                          ))}
                          {Number.isFinite(featured.participantCount) && featured.participantCount > featuredAvatars.length && (
                            <span className="sd-participant-count">+{featured.participantCount - featuredAvatars.length}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="sd-empty-featured">
                        <span className="sd-overline">Featured hackathon</span>
                        <h2>No featured event right now.</h2>
                        <p>When an event is featured for students, it will appear here.</p>
                        <a className="sd-button" href="/student/events">BROWSE EVENTS <Icon name="arrow" /></a>
                      </div>
                    )}
                  </section>

                  <section className="sd-metrics" aria-label="Student statistics">
                    <MetricCard label="Registered" value={stats.registered} />
                    <MetricCard label="Ongoing" value={stats.ongoing} />
                    <MetricCard label="Completed" value={stats.completed} />
                    <MetricCard label="Certificates" value={stats.certificates} />
                  </section>

                  <section className="sd-section sd-discover">
                    <div className="sd-section-heading">
                      <h2><span>03 /</span> Discover events</h2>
                      <a href="/student/events">VIEW ALL <b>↗</b></a>
                    </div>
                    {events.length ? (
                      <div className="sd-event-grid">{events.slice(0, 3).map((event) => <EventCard key={event.id || event.title} event={event} />)}</div>
                    ) : (
                      <div className="sd-empty">No event listings to show yet. Published opportunities will appear here.</div>
                    )}
                  </section>

                  <section className="sd-panels">
                    <article className="sd-panel sd-deadlines">
                      <div className="sd-section-heading">
                        <h2>Upcoming deadlines</h2>
                        <a href="/student/events">VIEW ALL <b>↗</b></a>
                      </div>
                      {deadlines?.length ? deadlines.slice(0, 3).map((deadline) => (
                        <div className="sd-deadline" key={deadline.id || deadline.title}>
                          <strong>{deadline.title || deadline.eventName}</strong>
                          <span>{formatDate(deadline.dueAt)}</span>
                        </div>
                      )) : (
                        <div className="sd-empty-compact">
                          <strong>No deadlines yet.</strong>
                          <p>Join an event to see upcoming submission dates here.</p>
                          <a className="sd-button sd-button-green" href="/student/events">BROWSE EVENTS <span>↗</span></a>
                        </div>
                      )}
                    </article>

                    <article className="sd-panel sd-ai-panel">
                      <span className="sd-overline">AI spotlight</span>
                      <h2>Your AI teammates are ready.</h2>
                      <p>Choose an assistant to help with your next build.</p>
                      <div className="sd-ai-links">
                        <a href="/student/ai/ideacheck"><Icon name="bulb" /> IDEACHECK</a>
                        <a href="/student/ai/hackmate"><Icon name="spark" /> HACKMATE</a>
                        <a href="/student/ai/rulebot"><Icon name="bot" /> RULEBOT</a>
                      </div>
                    </article>

                    <article className="sd-panel sd-journey">
                      <div className="sd-section-heading">
                        <h2>Your journey</h2>
                        <a href="/student/certificates">CERTIFICATES <b>›</b></a>
                      </div>
                      {journeyLabels.map(([label, key]) => {
                        const value = Number.isFinite(stats[key]) ? stats[key] : null
                        const target = Number.isFinite(data?.journeyTargets?.[key]) && data.journeyTargets[key] > 0
                          ? data.journeyTargets[key]
                          : null
                        const progress = value !== null && target ? Math.min(100, (value / target) * 100) : 0
                        return (
                          <div className="sd-progress-row" key={key}>
                            <span className="sd-progress-icon"><Icon name={key === 'certificates' ? 'award' : 'grid'} /></span>
                            <div className="sd-progress-track"><i style={{ width: `${progress}%` }} /></div>
                            <strong>{value === null ? '—' : value}</strong>
                            <small>{label}</small>
                          </div>
                        )
                      })}
                    </article>
                  </section>

                  <section className="sd-bottom-panels">
                    <article className="sd-panel sd-activity">
                      <div className="sd-section-heading">
                        <h2><span>01 /</span> Current activity</h2>
                        <a href="/student/my-events">VIEW EVENTS <b>↗</b></a>
                      </div>
                      {activity?.length ? activity.slice(0, 3).map((item) => (
                        <div className="sd-activity-item" key={item.id || item.title}>
                          <span className="sd-activity-id">{item.eventId || '—'}</span>
                          <div><strong>{item.title || item.eventName}</strong><span>{formatDate(item.date || item.startsAt)}</span></div>
                          <span className="sd-status-chip">{item.status || 'Status unavailable'}</span>
                        </div>
                      )) : (
                        <div className="sd-empty">You have no current event activity.</div>
                      )}
                    </article>

                    <article className="sd-panel sd-notifications">
                      <div className="sd-section-heading">
                        <h2><span>02 /</span> Notifications</h2>
                        <a href="/student/notifications">OPEN ALL <b>↗</b></a>
                      </div>
                      {notifications?.length ? notifications.slice(0, 3).map((notification) => (
                        <div className="sd-notification-item" key={notification.id || notification.title}>
                          <i />
                          <div><strong>{notification.title}</strong><p>{notification.description}</p></div>
                          <time>{formatDate(notification.createdAt, { month: 'short', day: 'numeric' })}</time>
                        </div>
                      )) : (
                        <div className="sd-empty">You are all caught up.</div>
                      )}
                    </article>
                  </section>
            </>
          ) : currentPath === '/student/profile' ? (
            <div className="sd-profile-route">
              {profileError && <p className="sd-profile-error" role="alert">{profileError}</p>}
              <ProfilePage profile={profile} onSave={handleProfileSave} />
            </div>
          ) : (
            <section className="sd-unavailable">
              <span className="sd-overline">Student workspace / {title}</span>
              <h1>{title}</h1>
              <p>This page is not implemented or connected in the current CampusCode frontend.</p>
              <p>Its existing page or backend integration can be connected here when available.</p>
              <a className="sd-button" href="/student/overview">BACK TO OVERVIEW <Icon name="arrow" /></a>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard
