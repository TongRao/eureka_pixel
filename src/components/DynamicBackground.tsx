"use client"

import { useEffect, useRef } from "react"

interface DynamicBackgroundProps {
    pageIndex: number
}

export function DynamicBackground({ pageIndex }: DynamicBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pageIndexRef = useRef(pageIndex)

    // Update ref when prop changes to avoid restarting effect
    useEffect(() => {
        pageIndexRef.current = pageIndex
    }, [pageIndex])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let time = 0

        // Configuration for different states (Brighter colors but low opacity for subtle effect)
        const configs = [
            // Hero: Deep Tech Blue, Breathing Grid
            { r: 37, g: 99, b: 235, opacity: 0.4, scale: 1, speed: 0.5, type: 'grid' },
            // Projects: Purple, Flowing Wave
            { r: 168, g: 85, b: 247, opacity: 0.5, scale: 1.1, speed: 1, type: 'wave' },
            // Photography: Teal, Floating Particles
            { r: 45, g: 212, b: 191, opacity: 0.5, scale: 0.9, speed: 0.3, type: 'float' },
            // Blog: Rose, Gentle Pulse
            { r: 251, g: 113, b: 133, opacity: 0.5, scale: 1.2, speed: 0.8, type: 'pulse' },
        ]

        // Current state values (initialized to first config)
        let currentR = configs[0].r
        let currentG = configs[0].g
        let currentB = configs[0].b
        let currentOpacity = configs[0].opacity
        let currentScale = configs[0].scale

        // Interpolation factors for different pattern strengths
        let gridStrength = 0
        let waveStrength = 0
        let floatStrength = 0
        let pulseStrength = 0

        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor
        }

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("resize", resize)
        resize()

        const render = () => {
            time += 0.01

            const targetIndex = pageIndexRef.current
            const target = configs[targetIndex] || configs[0]

            // Super smooth transition factor
            const lerpFactor = 0.02

            // Interpolate global properties
            currentR = lerp(currentR, target.r, lerpFactor)
            currentG = lerp(currentG, target.g, lerpFactor)
            currentB = lerp(currentB, target.b, lerpFactor)
            currentOpacity = lerp(currentOpacity, target.opacity, lerpFactor)
            currentScale = lerp(currentScale, target.scale, lerpFactor)

            // Interpolate effect strengths based on active type
            gridStrength = lerp(gridStrength, target.type === 'grid' ? 1 : 0, lerpFactor)
            waveStrength = lerp(waveStrength, target.type === 'wave' ? 1 : 0, lerpFactor)
            floatStrength = lerp(floatStrength, target.type === 'float' ? 1 : 0, lerpFactor)
            pulseStrength = lerp(pulseStrength, target.type === 'pulse' ? 1 : 0, lerpFactor)

            // Clear canvas
            ctx.fillStyle = "#0a0a0a"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const spacing = 25
            const rows = Math.ceil(canvas.height / spacing)
            const cols = Math.ceil(canvas.width / spacing)

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const posX = x * spacing
                    const posY = y * spacing

                    let offsetX = 0
                    let offsetY = 0
                    let dotScale = currentScale
                    let dotOpacity = currentOpacity

                    // 1. Radial Wave Effect (Hero) - "Sea Wave"
                    if (gridStrength > 0.01) {
                        const centerX = cols / 2
                        const centerY = rows / 2
                        // Calculate distance from center (normalized)
                        const dx = x - centerX
                        const dy = y - centerY
                        const dist = Math.sqrt(dx * dx + dy * dy)

                        // Create outward moving waves
                        // sin(dist - time) creates outward movement
                        const wave = Math.sin(dist * 0.2 - time * 1.5)

                        // Only affect scale when wave passes
                        // Map [-1, 1] to [0, 1] for smoother scale effect
                        const waveFactor = (wave + 1) / 2

                        // Gentle swell: Base scale + wave effect
                        dotScale *= (1 + waveFactor * 0.5 * gridStrength)

                        // Slight opacity boost on the wave crest
                        dotOpacity = Math.min(1, dotOpacity * (1 + waveFactor * 0.3 * gridStrength))
                    }

                    // 2. Wave Effect (Projects)
                    if (waveStrength > 0.01) {
                        offsetY += Math.sin(x * 0.15 + time) * 15 * waveStrength
                        offsetX += Math.cos(y * 0.15 + time) * 5 * waveStrength
                    }

                    // 3. Float/Scatter Effect (Photography)
                    if (floatStrength > 0.01) {
                        // Deterministic pseudo-random movement
                        const noiseX = Math.sin(x * 12.9898 + y * 78.233 + time * 0.2)
                        const noiseY = Math.cos(x * 12.9898 + y * 78.233 + time * 0.2)
                        offsetX += noiseX * 20 * floatStrength
                        offsetY += noiseY * 20 * floatStrength
                        dotScale *= (1 + noiseX * 0.3 * floatStrength)
                    }

                    // 4. Pulse/Ripple Effect (Blog)
                    if (pulseStrength > 0.01) {
                        const centerX = cols / 2
                        const centerY = rows / 2
                        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
                        const ripple = Math.sin(dist * 0.5 - time * 2)
                        dotScale += ripple * 0.3 * pulseStrength
                    }

                    ctx.beginPath()
                    ctx.arc(posX + offsetX, posY + offsetY, Math.max(0, 1.5 * dotScale), 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)}, ${dotOpacity})`
                    ctx.fill()
                }
            }

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, []) // Empty dependency array ensures effect runs once and persists

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
        />
    )
}
