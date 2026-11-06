import './RouteNotFound.css'

function RouteNotFound() {
  return (
    <main className="route-not-found">
      <span className="route-not-found-label">CampusCode / Route error</span>
      <p className="route-not-found-code">404</p>
      <h1>This page isn’t in the arena.</h1>
      <p className="route-not-found-copy">Check the address or return to a CampusCode page.</p>
      <div className="route-not-found-actions">
        <a href="/">BACK TO HOME <span>↗</span></a>
        <a href="/login">LOGIN <span>↗</span></a>
      </div>
    </main>
  )
}

export default RouteNotFound
