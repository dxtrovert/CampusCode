function Statement({ label, lines, outline, text }) {
  return (
    <section className="center">
      <div className="mono statement-label">{label}</div>
      <div className="big">
        {lines.map((line) => <span key={line}>{line}<br /></span>)}
        <span className="out">{outline}</span>
      </div>
      <p className="lead">{text}</p>
    </section>
  )
}

export default Statement
