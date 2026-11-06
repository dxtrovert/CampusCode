const SESSION_KEY = 'campuscode-demo-session'
const PROFILE_KEY = 'campuscode-demo-profile'

const demoDashboard = {
  stats: { registered: 1, ongoing: 1, completed: 0, certificates: 0 },
  featuredEvent: {
    title: "ReBuild '26",
    description: 'A hands-on build-and-recreation hackathon for student teams. Shape your idea, work together, and submit your project to the CampusCode arena.',
    participantCount: 34,
    status: 'LIVE',
    href: '/student/events/rebuild-26',
    participantAvatars: [],
  },
  discoverEvents: [
    {
      id: 'rebuild-26',
      title: "ReBuild '26",
      category: 'Web Development',
      startsAt: '2026-11-07T09:00:00',
      isJoined: true,
      href: '/student/events/rebuild-26',
    },
    {
      id: 'firstcommit-quiz-26',
      title: 'FirstCommit ’26 Quiz Competition 2.0',
      category: 'Open Innovation',
      startsAt: '2026-11-21T10:00:00',
      isJoined: false,
      href: '/student/events/firstcommit-quiz-26',
    },
    {
      id: 'firstcommit-26',
      title: 'FirstCommit ’26 Quiz Competition',
      category: 'Open Innovation',
      startsAt: '2026-12-05T10:00:00',
      isJoined: false,
      href: '/student/events/firstcommit-26',
    },
  ],
  upcomingDeadlines: [
    {
      id: 'rebuild-submission',
      title: "ReBuild '26 · project submission",
      dueAt: '2026-11-14T23:59:00',
    },
  ],
  currentActivity: [
    {
      id: 'rebuild-activity',
      eventId: 'RB-26',
      title: "ReBuild '26",
      date: '2026-11-07T09:00:00',
      status: 'Live',
    },
  ],
  notifications: [
    {
      id: 'rebuild-registration',
      title: "You’re registered for ReBuild '26",
      description: 'Your event registration is confirmed. Team up and get ready to build.',
      createdAt: '2026-11-06T09:20:00',
    },
    {
      id: 'profile-tip',
      title: 'Complete your student profile',
      description: 'Add your skills to help teammates discover you.',
      createdAt: '2026-11-05T14:10:00',
    },
  ],
  unreadNotifications: 2,
  journeyTargets: { registered: 3, ongoing: 2, completed: 3, certificates: 2 },
}

function readStorage(key) {
  try {
    const value = window.sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.warn(`CampusCode could not read demo session data from ${key}.`, error)
    return null
  }
}

function writeStorage(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`CampusCode could not save demo session data to ${key}.`, error)
    return false
  }
}

function titleCase(value) {
  return value
    .replace(/[.+_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function makeDemoProfile(identity) {
  const entered = identity.trim()
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entered)
  const name = isEmail ? titleCase(entered.slice(0, entered.indexOf('@'))) : titleCase(entered)
  return {
    name: name || 'Student',
    email: isEmail ? entered : '',
    college: 'Sample College',
    course: 'Computer Science Engineering',
    skills: ['React', 'JavaScript', 'Python', 'UI/UX'],
    bio: 'A student passionate about building products and participating in hackathons.',
  }
}

export function startDemoSession(identity) {
  const profile = makeDemoProfile(identity)
  const saved = writeStorage(SESSION_KEY, { name: profile.name, email: profile.email })
  const profileSaved = writeStorage(PROFILE_KEY, profile)
  return saved && profileSaved
}

export function getDemoSession() {
  const session = readStorage(SESSION_KEY)
  return session && typeof session.name === 'string' ? session : null
}

export function getDemoProfile() {
  const session = getDemoSession()
  if (!session) return null
  const profile = readStorage(PROFILE_KEY)
  if (profile && typeof profile.name === 'string') return profile
  return { ...makeDemoProfile(session.email || session.name), name: session.name, email: session.email || '' }
}

export function saveDemoProfile(profile) {
  const session = getDemoSession()
  if (!session) return false

  const nextProfile = {
    ...profile,
    name: profile.name.trim() || session.name,
    email: profile.email.trim(),
    skills: Array.isArray(profile.skills) ? profile.skills : [],
  }
  const profileSaved = writeStorage(PROFILE_KEY, nextProfile)
  const sessionSaved = writeStorage(SESSION_KEY, { name: nextProfile.name, email: nextProfile.email })
  return profileSaved && sessionSaved
}

export function getDemoDashboard() {
  const profile = getDemoProfile()
  if (!profile) return null
  return {
    student: { fullName: profile.name },
    ...demoDashboard,
  }
}

export function endDemoSession() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY)
    window.sessionStorage.removeItem(PROFILE_KEY)
  } catch (error) {
    console.error('CampusCode could not clear the demo session.', error)
    return false
  }
  return true
}
