import { footerColumns, siteContent } from '../data/content.js'

function Footer() {
  const { footer } = siteContent

  return (
    <footer className="foot" id="community">
      <div className="wrap">
        <div className="fcols">
          <div>
            <b className="footer-brand">CAMPUSCODE</b>
            <p className="mono footer-brand-label">HACKATHON ARENA</p>
            <p className="footer-description">{footer.description}</p>
          </div>
          {Object.entries(footerColumns).map(([title, links]) => (
            <div key={title}>
              <h4 className="mono">{title}</h4>
              {links.map((link) => <a key={link} href="#">{link}</a>)}
            </div>
          ))}
        </div>
        <div className="fbot mono">
          <span className="ok">{footer.status}</span>
          <span>{footer.legal}</span>
        </div>
        <div className="fbot mono footer-bottom">
          <span>{footer.copyright}</span>
          <span>{footer.tagline}</span>
          <span>{footer.location}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
