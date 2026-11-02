import { useEffect, useRef } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const CELL_SIZE = 190

function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: -1000, y: -1000, active: false }
    let particles = []
    let frameId = 0
    let width = 0
    let height = 0
    let pixelRatio = 1
    let color = '#6339fd'
    let accentColor = '#8274ee'
    let alpha = 0.22
    let lineColor = '#958bad'
    let lineAlpha = 0.34
    let lastTime = 0
    let lastConnectionUpdate = -Infinity
    const connections = new Map()

    const createParticle = () => {
      const baseX = Math.random() * width
      const baseY = Math.random() * height
      const linkRoll = Math.random()
      return {
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        driftX: 58 + Math.random() * 34,
        driftY: 52 + Math.random() * 32,
        swayX: 0.28 + Math.random() * 0.18,
        swayY: 0.28 + Math.random() * 0.18,
        speedX: 0.00034 + Math.random() * 0.0003,
        speedY: 0.00031 + Math.random() * 0.00032,
        density: Math.random(),
        radius: Math.random() < 0.1 ? 1.55 + Math.random() * 0.35 : 0.55 + Math.random() * 0.8,
        opacity: 0.15 + Math.random() * 0.5,
        links: linkRoll < 0.12 ? 0 : linkRoll < 0.5 ? 1 : linkRoll < 0.9 ? 2 : 3,
        longLink: Math.random() < 0.07,
      }
    }

    const refreshConnections = () => {
      const cells = new Map()
      particles.forEach((particle, index) => {
        const cellX = Math.floor(particle.x / CELL_SIZE)
        const cellY = Math.floor(particle.y / CELL_SIZE)
        const key = `${cellX}:${cellY}`
        const cell = cells.get(key)
        if (cell) cell.push(index)
        else cells.set(key, [index])
      })

      for (const edge of connections.values()) edge.target = 0
      const desired = new Map()

      particles.forEach((particle, index) => {
        if (!particle.links && !particle.longLink) return
        const cellX = Math.floor(particle.x / CELL_SIZE)
        const cellY = Math.floor(particle.y / CELL_SIZE)
        const nearby = []
        let longIndex = -1
        let longScore = Infinity
        const longDistance = 205 + particle.phase / (Math.PI * 2) * 125

        for (let x = cellX - 2; x <= cellX + 2; x++) {
          for (let y = cellY - 2; y <= cellY + 2; y++) {
            const cell = cells.get(`${x}:${y}`)
            if (!cell) continue

            for (const otherIndex of cell) {
              if (otherIndex === index) continue
              const other = particles[otherIndex]
              const distance = Math.hypot(other.x - particle.x, other.y - particle.y)
              const variation = (other.phase * 0.173 + particle.phase * 0.119 + otherIndex * 0.618) % 1

              if (distance >= 38 && distance <= 245) {
                nearby.push({ index: otherIndex, score: distance * (0.82 + variation * 0.48) })
              }
              if (particle.longLink && distance >= 165 && distance <= 355) {
                const score = Math.abs(distance - longDistance) + variation * 32
                if (score < longScore) {
                  longScore = score
                  longIndex = otherIndex
                }
              }
            }
          }
        }

        nearby.sort((first, second) => first.score - second.score)
        let selected = 0
        for (const candidate of nearby) {
          if (selected >= particle.links) break
          const firstIndex = Math.min(index, candidate.index)
          const secondIndex = Math.max(index, candidate.index)
          const key = `${firstIndex}:${secondIndex}`
          if (desired.has(key)) continue
          const variation = (particles[firstIndex].phase * 0.137 + particles[secondIndex].phase * 0.219) % 1
          desired.set(key, { firstIndex, secondIndex, variation, long: false })
          selected++
        }

        if (longIndex >= 0) {
          const firstIndex = Math.min(index, longIndex)
          const secondIndex = Math.max(index, longIndex)
          const key = `${firstIndex}:${secondIndex}`
          if (!desired.has(key)) {
            const variation = (particles[firstIndex].phase * 0.137 + particles[secondIndex].phase * 0.219) % 1
            desired.set(key, { firstIndex, secondIndex, variation, long: true })
          }
        }
      })

      for (const [key, edge] of desired) {
        const current = connections.get(key)
        if (current) {
          current.target = 1
          current.variation = edge.variation
          current.long = edge.long
        } else {
          connections.set(key, { ...edge, opacity: 0, target: 1 })
        }
      }
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const themeStyles = getComputedStyle(document.documentElement)
      color = themeStyles.getPropertyValue('--brand-purple').trim() || color
      accentColor = themeStyles.getPropertyValue('--dot').trim() || accentColor
      alpha = Number.parseFloat(themeStyles.getPropertyValue('--particle-alpha')) || 0.22
      lineColor = themeStyles.getPropertyValue('--particle-line-color').trim() || lineColor
      lineAlpha = Number.parseFloat(themeStyles.getPropertyValue('--particle-line-alpha')) || 0.34

      const count = clamp(Math.round((width * height) / 14000), 60, 140)
      particles = Array.from({ length: count }, createParticle)
      connections.clear()
      lastConnectionUpdate = -Infinity
      refreshConnections()
      draw(0, true)
      if (!reducedMotion.matches) wake()
    }

    const draw = (timestamp, staticFrame = false) => {
      const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.04) : 1 / 60
      lastTime = timestamp
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        const driftX = staticFrame ? 0 : (
          Math.sin(timestamp * particle.speedX + particle.phase)
          + Math.sin(timestamp * particle.speedX * 0.43 + particle.phaseY) * particle.swayX
        ) * particle.driftX
        const driftY = staticFrame ? 0 : (
          Math.cos(timestamp * particle.speedY + particle.phaseY)
          + Math.sin(timestamp * particle.speedY * 0.57 + particle.phase) * particle.swayY
        ) * particle.driftY
        let pushX = 0
        let pushY = 0

        if (!staticFrame && pointer.active) {
          const dx = particle.x - pointer.x
          const dy = particle.y - pointer.y
          const distance = Math.hypot(dx, dy)
          const radius = 96
          if (distance > 0 && distance < radius) {
            const force = (1 - distance / radius) ** 2 * 10
            pushX = (dx / distance) * force
            pushY = (dy / distance) * force
          }
        }

        const targetX = particle.baseX + driftX + pushX
        const targetY = particle.baseY + driftY + pushY

        if (!staticFrame) {
          particle.vx = (particle.vx + (targetX - particle.x) * delta * 2.8) * 0.94
          particle.vy = (particle.vy + (targetY - particle.y) * delta * 2.8) * 0.94
          particle.x += particle.vx
          particle.y += particle.vy
        } else {
          particle.x = targetX
          particle.y = targetY
        }
      }

      if (timestamp - lastConnectionUpdate >= 240 || staticFrame) {
        refreshConnections()
        lastConnectionUpdate = timestamp
      }

      const fadeStep = staticFrame ? 1 : Math.min(1, delta * 2.8)
      for (const [key, edge] of connections) {
        edge.opacity += (edge.target - edge.opacity) * fadeStep
        if (!staticFrame && edge.target === 0 && edge.opacity < 0.015) connections.delete(key)
      }

      context.lineWidth = 0.8
      context.lineCap = 'round'
      context.setLineDash([1.5, 5])
      context.lineDashOffset = staticFrame ? 0 : -timestamp * 0.002

      for (const edge of connections.values()) {
        if (edge.opacity < 0.01) continue
        const first = particles[edge.firstIndex]
        const second = particles[edge.secondIndex]
        const dx = second.x - first.x
        const dy = second.y - first.y
        const distance = Math.hypot(dx, dy)
        const maxDistance = edge.long ? 370 : 260
        const midpointX = (first.x + second.x) / 2
        const midpointY = (first.y + second.y) / 2
        let pointerBoost = 1
        if (!staticFrame && pointer.active) {
          const pointerDistance = Math.hypot(midpointX - pointer.x, midpointY - pointer.y)
          if (pointerDistance < 110) pointerBoost = 1 + (1 - pointerDistance / 110) * 0.18
        }

        const distanceFade = Math.max(0, 1 - distance / maxDistance) ** 1.35
        const densityFade = 0.62 + ((first.density + second.density) / 2) * 0.38
        context.globalAlpha = Math.min(1, lineAlpha * 3 * edge.opacity * distanceFade * densityFade * pointerBoost)
        context.strokeStyle = edge.variation > 0.84 ? accentColor : lineColor
        context.beginPath()
        context.moveTo(first.x, first.y)
        context.lineTo(second.x, second.y)
        context.stroke()
      }
      context.setLineDash([])

      for (const particle of particles) {
        const distanceToPointer = pointer.active
          ? Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
          : Infinity
        const interactionAlpha = distanceToPointer < 96 ? 1.15 : 1
        const themeOpacity = alpha / 0.22
        context.globalAlpha = Math.min(0.65, particle.opacity * themeOpacity * interactionAlpha)
        context.fillStyle = particle.phaseY < 0.7 ? accentColor : color
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1

      if (!staticFrame && !document.hidden && !reducedMotion.matches) {
        frameId = window.requestAnimationFrame(draw)
      } else {
        frameId = 0
      }
    }

    const wake = () => {
      if (!frameId && !document.hidden && !reducedMotion.matches) {
        frameId = window.requestAnimationFrame(draw)
      }
    }

    const onPointerMove = event => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * width
      pointer.y = ((event.clientY - bounds.top) / bounds.height) * height
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameId)
        frameId = 0
        lastTime = 0
      } else {
        wake()
      }
    }
    const onMotionPreferenceChange = () => {
      window.cancelAnimationFrame(frameId)
      frameId = 0
      lastTime = 0
      if (reducedMotion.matches) draw(0, true)
      else wake()
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    reducedMotion.addEventListener?.('change', onMotionPreferenceChange)

    const themeObserver = new MutationObserver(() => {
      const themeStyles = getComputedStyle(document.documentElement)
      color = themeStyles.getPropertyValue('--brand-purple').trim() || color
      accentColor = themeStyles.getPropertyValue('--dot').trim() || accentColor
      alpha = Number.parseFloat(themeStyles.getPropertyValue('--particle-alpha')) || 0.22
      lineColor = themeStyles.getPropertyValue('--particle-line-color').trim() || lineColor
      lineAlpha = Number.parseFloat(themeStyles.getPropertyValue('--particle-line-alpha')) || 0.34
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    resize()
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotion.removeEventListener?.('change', onMotionPreferenceChange)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}

export default ParticleField
