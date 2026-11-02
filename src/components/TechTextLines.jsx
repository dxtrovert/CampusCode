import TechText from './TechText.jsx'

function TechTextLines({
  lines,
  className = '',
  fontSize,
  fontWeight = 900,
  letterSpacing = -0.06,
  lineLetterSpacings = [],
  outlinedLines = [],
  solidLines = [],
  solidOnHoverLines = [],
  autoSelectLines = [],
  sweep = true,
  align = 'left',
}) {
  return (
    <div className={`tech-lines ${className}`.trim()}>
      {lines.map((line, index) => {
        const outlined = outlinedLines.includes(index)
        const solid = solidLines.includes(index)
        const solidOnHover = solidOnHoverLines.includes(index)
        const autoSelect = autoSelectLines.includes(index)

        return (
          <TechText
            key={`${line}-${index}`}
            className="tech-text-line"
            text={line}
            fontWeight={fontWeight}
            fontSize={fontSize}
            letterSpacing={lineLetterSpacings[index] ?? letterSpacing}
            color="currentColor"
            accentColor="currentColor"
            selectionColor="var(--brand-green)"
            align={align}
            dashLength={4}
            dashGap={2}
            outline={outlined}
            solidOnHover={solidOnHover}
            autoSelect={autoSelect}
            specks={15}
            intro="none"
            introDuration={2}
            guides={false}
            reach={200}
            softness={0.7}
            lineStyle={outlined ? 'solid' : 'dashed'}
            strokeWidth={outlined ? 0.75 : 1.5}
            reveal={solid ? 'area' : 'letter'}
            speed={1}
            bounce={0.4}
            selection={true}
            labels={true}
            draggable={true}
            clickKick={true}
            sweep={sweep}
          />
        )
      })}
    </div>
  )
}

export default TechTextLines
