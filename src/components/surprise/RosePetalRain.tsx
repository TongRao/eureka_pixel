"use client";

import { useEffect, useRef } from "react";

type ParticleStage = "free" | "letters" | "heart";

type RosePetalRainProps = {
    stage: ParticleStage;
};

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    stretch: number;
    angle: number;
    spin: number;
    affinity: number;
    layer: number;
    foamBias: number;
    phase: number;
    hue: number;
    lightness: number;
    alpha: number;
    joinsFormation: boolean;
    letterTargetIndex: number;
    heartTargetIndex: number;
    targetOffsetX: number;
    targetOffsetY: number;
    releaseVx: number;
    releaseVy: number;
};

type Point = {
    x: number;
    y: number;
};

type Transition = {
    from: ParticleStage;
    kind: "shape" | "scatter";
    startedAt: number;
    target: ParticleStage;
} | null;

type FreeMotionState = {
    height: number;
    isMobile: boolean;
    time: number;
    width: number;
};

type WaveProfile = {
    crest: number;
    foam: number;
    glint: number;
    lift: number;
    roll: number;
};

const TRANSITION_MS = 5000;

function random(min: number, max: number) {
    return min + Math.random() * (max - min);
}

function smoothstep(value: number) {
    const clamped = Math.max(0, Math.min(1, value));

    return clamped * clamped * (3 - 2 * clamped);
}

function getTargetsForStage(stage: ParticleStage, letterTargets: Point[], heartTargets: Point[]) {
    if (stage === "heart") {
        return heartTargets;
    }

    if (stage === "letters") {
        return letterTargets;
    }

    return [];
}

function getParticleTargetIndex(particle: Particle, stage: ParticleStage) {
    return stage === "heart" ? particle.heartTargetIndex : particle.letterTargetIndex;
}

function assignReleaseVelocity(particle: Particle, width: number, height: number) {
    const dx = particle.x - width * 0.5;
    const dy = particle.y - height * 0.5;
    const distance = Math.hypot(dx, dy) || 1;
    const randomAngle = random(0, Math.PI * 2);
    const outwardX = dx / distance;
    const outwardY = dy / distance;
    const strength = random(0.006, 0.024);

    particle.releaseVx = (outwardX * 0.72 + Math.cos(randomAngle) * 0.28) * strength;
    particle.releaseVy = (outwardY * 0.72 + Math.sin(randomAngle) * 0.28) * strength;
}

function resetParticle(
    particle: Particle,
    width: number,
    height: number,
    letterTargetCount: number,
    heartTargetCount: number
) {
    particle.x = random(-width * 0.06, width * 1.06);
    particle.y = random(-height * 0.06, height * 1.06);
    particle.vx = random(-0.18, 0.18);
    particle.vy = random(-0.14, 0.18);
    particle.size = random(0.62, 1.85);
    particle.stretch = random(1.12, 1.48);
    particle.angle = random(0, Math.PI * 2);
    particle.spin = random(-0.035, 0.035);
    particle.affinity = Math.random() < 0.18 ? random(0.05, 0.35) : random(0.58, 1);
    particle.layer = random(0.55, 1.45);
    particle.foamBias = Math.random() < 0.22 ? random(0.72, 1) : random(0.12, 0.62);
    particle.phase = random(0, Math.PI * 2);
    particle.hue = random(334, 354);
    particle.lightness = random(63, 84);
    particle.alpha = random(0.38, 0.88);
    particle.joinsFormation = Math.random() > 0.08;
    particle.letterTargetIndex = Math.floor(random(0, Math.max(letterTargetCount, 1)));
    particle.heartTargetIndex = Math.floor(random(0, Math.max(heartTargetCount, 1)));
    particle.targetOffsetX = random(-1.6, 1.6);
    particle.targetOffsetY = random(-1.6, 1.6);
    assignReleaseVelocity(particle, width, height);
}

function createLetterTargets(width: number, height: number) {
    const offscreen = document.createElement("canvas");
    const scale = 2;
    offscreen.width = Math.floor(width * scale);
    offscreen.height = Math.floor(height * scale);

    const offscreenCtx = offscreen.getContext("2d");

    if (!offscreenCtx) {
        return [];
    }

    offscreenCtx.scale(scale, scale);
    offscreenCtx.clearRect(0, 0, width, height);

    const fontSize = Math.min(width * 0.38, height * 0.56, 360);
    offscreenCtx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";
    offscreenCtx.fillStyle = "#000";
    offscreenCtx.fillText("WYR", width / 2, height / 2 + fontSize * 0.03);

    return sampleOpaquePixels(offscreenCtx, offscreen.width, offscreen.height, scale, width < 640 ? 4 : 4);
}

function createHeartTargets(width: number, height: number) {
    const offscreen = document.createElement("canvas");
    const scale = 2;
    offscreen.width = Math.floor(width * scale);
    offscreen.height = Math.floor(height * scale);

    const offscreenCtx = offscreen.getContext("2d");

    if (!offscreenCtx) {
        return [];
    }

    offscreenCtx.scale(scale, scale);
    offscreenCtx.clearRect(0, 0, width, height);

    const size = Math.min(width * 0.48, height * 0.58, 390);
    const x = width / 2;
    const y = height / 2 - size * 0.04;

    offscreenCtx.fillStyle = "#000";
    offscreenCtx.beginPath();
    offscreenCtx.moveTo(x, y + size * 0.35);
    offscreenCtx.bezierCurveTo(x - size * 0.56, y - size * 0.02, x - size * 0.42, y - size * 0.46, x - size * 0.12, y - size * 0.35);
    offscreenCtx.bezierCurveTo(x, y - size * 0.31, x + size * 0.02, y - size * 0.21, x, y - size * 0.15);
    offscreenCtx.bezierCurveTo(x + size * 0.02, y - size * 0.21, x, y - size * 0.31, x + size * 0.12, y - size * 0.35);
    offscreenCtx.bezierCurveTo(x + size * 0.42, y - size * 0.46, x + size * 0.56, y - size * 0.02, x, y + size * 0.35);
    offscreenCtx.closePath();
    offscreenCtx.fill();

    return sampleOpaquePixels(offscreenCtx, offscreen.width, offscreen.height, scale, width < 640 ? 4 : 4);
}

function sampleOpaquePixels(
    ctx: CanvasRenderingContext2D,
    bitmapWidth: number,
    bitmapHeight: number,
    scale: number,
    step: number
) {
    const imageData = ctx.getImageData(0, 0, bitmapWidth, bitmapHeight);
    const points: Point[] = [];
    const scaledStep = step * scale;

    for (let y = 0; y < bitmapHeight; y += scaledStep) {
        for (let x = 0; x < bitmapWidth; x += scaledStep) {
            const alpha = imageData.data[(y * bitmapWidth + x) * 4 + 3];

            if (alpha > 40 && Math.random() > 0.16) {
                points.push({
                    x: x / scale + random(-1.4, 1.4),
                    y: y / scale + random(-1.4, 1.4),
                });
            }
        }
    }

    return points;
}

function getWaveProfile(particle: Particle, state: FreeMotionState): WaveProfile {
    const normalizedY = particle.y / Math.max(state.height, 1);
    const mobileScale = state.isMobile ? 1.22 : 1;
    const swell = Math.sin(
        particle.x * 0.0088 * mobileScale -
        state.time * 0.032 +
        normalizedY * 5.8 +
        Math.sin(normalizedY * 8 + state.time * 0.006) * 0.85
    );
    const backSwell = Math.sin(
        particle.x * 0.0056 * mobileScale +
        particle.y * 0.0105 -
        state.time * 0.021 +
        particle.phase
    );
    const crossRipple = Math.sin(
        (particle.x * 0.018 + particle.y * 0.026) * mobileScale -
        state.time * 0.061 +
        particle.phase * 0.6
    );
    const capillary = Math.sin(
        particle.x * 0.052 * mobileScale -
        state.time * 0.135 +
        particle.y * 0.018 +
        particle.phase
    );
    const windSheen = Math.cos(
        (particle.x * 0.032 + particle.y * 0.014) * mobileScale -
        state.time * 0.092 +
        particle.phase * 1.7
    );
    const roll = swell * 0.54 + backSwell * 0.28 + crossRipple * 0.18;
    const crest = smoothstep((roll + 0.62) / 1.24);
    const glint = smoothstep((capillary * 0.58 + windSheen * 0.42 + 0.45) / 1.25);
    const foam = smoothstep((crest * 0.78 + glint * 0.44 + particle.foamBias * 0.34) - 0.64);
    const lift = Math.sin(
        particle.x * 0.011 * mobileScale -
        state.time * 0.038 +
        normalizedY * 7.2 +
        particle.phase
    );

    return { crest, foam, glint, lift, roll };
}

function getFreeAcceleration(particle: Particle, state: FreeMotionState, wave: WaveProfile) {
    const normalizedY = particle.y / Math.max(state.height, 1);
    const mobileScale = state.isMobile ? 0.86 : 1;
    const windDrift = 0.009 * particle.layer * mobileScale;
    const troughDrag = (1 - wave.crest) * 0.006;

    const ax =
        wave.roll * 0.037 * particle.layer * mobileScale +
        wave.glint * 0.014 +
        windDrift -
        troughDrag;
    const ay =
        wave.lift * 0.026 * particle.layer * mobileScale -
        wave.foam * 0.016 +
        Math.cos(state.time * 0.016 + normalizedY * Math.PI * 3 + particle.phase) * 0.006;

    return { ax, ay };
}

function drawParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle,
    shapeIntensity: number,
    time: number,
    wave: WaveProfile,
    isMobile: boolean
) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);

    const mutedProgress = particle.joinsFormation ? 0 : shapeIntensity;
    const letterProgress = particle.joinsFormation ? shapeIntensity : 0;
    const mobileFreeBoost = isMobile ? 1 - shapeIntensity : 0;
    const shimmer = Math.sin(particle.x * 0.032 + particle.y * 0.018 + time * 0.09 + particle.phase) * 0.5 + 0.5;
    const waveGlow = wave.foam * 0.82 + wave.glint * 0.28;
    const saturation = Math.max(22, 82 - wave.foam * 34 - mutedProgress * 62);
    const lightness = particle.lightness + waveGlow * (24 + mobileFreeBoost * 10) + shimmer * 7 + mutedProgress * 12 + letterProgress * 3;
    const alpha = particle.alpha * (0.52 + wave.crest * (0.3 + mobileFreeBoost * 0.16) + wave.foam * (0.38 + mobileFreeBoost * 0.24) + shimmer * 0.18) * (1 - mutedProgress * 0.72) + letterProgress * 0.08;

    ctx.globalAlpha = Math.min(0.96, alpha);

    const mobileScale = isMobile ? 0.78 : 1;
    const width = particle.size * mobileScale * (0.82 + wave.crest * (0.45 + mobileFreeBoost * 0.2) + wave.foam * (0.65 + mobileFreeBoost * 0.35) + letterProgress * 0.1);
    const height = width * particle.stretch * (1 + wave.foam * 0.25);
    ctx.fillStyle = `hsla(${particle.hue}, ${saturation}%, ${lightness}%, 0.96)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

export function RosePetalRain({ stage }: RosePetalRainProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const desiredStageRef = useRef<ParticleStage>(stage);

    useEffect(() => {
        desiredStageRef.current = stage;
    }, [stage]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const particles: Particle[] = [];
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let letterTargets: Point[] = [];
        let heartTargets: Point[] = [];
        let width = 0;
        let height = 0;
        let isMobile = false;
        let dpr = 1;
        let time = 0;
        let visualStage: ParticleStage = "free";
        let transition: Transition = null;
        let animationFrame = 0;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            isMobile = width < 640;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            letterTargets = createLetterTargets(width, height);
            heartTargets = createHeartTargets(width, height);

            const targetCount = Math.min(
                isMobile ? 2900 : 3800,
                Math.floor((width * height) / (isMobile ? 170 : 205))
            );

            while (particles.length < targetCount) {
                const particle = {} as Particle;
                resetParticle(particle, width, height, letterTargets.length, heartTargets.length);
                particles.push(particle);
            }

            while (particles.length > targetCount) {
                particles.pop();
            }

            for (const particle of particles) {
                particle.letterTargetIndex = Math.floor(random(0, Math.max(letterTargets.length, 1)));
                particle.heartTargetIndex = Math.floor(random(0, Math.max(heartTargets.length, 1)));
                assignReleaseVelocity(particle, width, height);
            }
        };

        const startTransition = (target: ParticleStage, now: number) => {
            const from = transition?.target || visualStage;

            if (target === "free") {
                for (const particle of particles) {
                    assignReleaseVelocity(particle, width, height);
                }

                transition = { from, kind: "scatter", startedAt: now, target };
                return;
            }

            transition = { from, kind: "shape", startedAt: now, target };
        };

        const animate = () => {
            const now = performance.now();
            const desiredStage = desiredStageRef.current;

            if ((!transition && desiredStage !== visualStage) || (transition && desiredStage !== transition.target)) {
                startTransition(desiredStage, now);
            }

            const transitionProgress = transition
                ? smoothstep((now - transition.startedAt) / TRANSITION_MS)
                : visualStage === "free" ? 0 : 1;

            if (transition && now - transition.startedAt >= TRANSITION_MS) {
                visualStage = transition.target;
                transition = null;
            }

            const shapeIntensity = transition?.kind === "scatter"
                ? 1 - transitionProgress
                : transition?.from === "free" ? transitionProgress : visualStage === "free" ? 0 : 1;

            time += reducedMotion ? 0.32 : 1;
            ctx.fillStyle = `rgba(255, 246, 249, ${isMobile ? 0.145 + shapeIntensity * 0.135 : 0.11 + shapeIntensity * 0.12})`;
            ctx.fillRect(0, 0, width, height);

            for (const particle of particles) {
                const wave = getWaveProfile(particle, { height, isMobile, time, width });
                const freeAcceleration = getFreeAcceleration(particle, { height, isMobile, time, width }, wave);
                const freeAmount = 1 - shapeIntensity;
                const mobileFreeBoost = isMobile ? freeAmount : 0;
                let ax = particle.joinsFormation
                    ? freeAcceleration.ax * freeAmount
                    : freeAcceleration.ax * 0.72;
                let ay = particle.joinsFormation
                    ? freeAcceleration.ay * freeAmount
                    : freeAcceleration.ay * 0.72;

                ax *= 1 + mobileFreeBoost * 0.68;
                ay *= 1 + mobileFreeBoost * 0.92;

                if (transition?.kind === "scatter" && particle.joinsFormation) {
                    const release = Math.sin(transitionProgress * Math.PI);

                    ax += particle.releaseVx * release;
                    ay += particle.releaseVy * release;
                    ax += freeAcceleration.ax * transitionProgress * 0.62;
                    ay += freeAcceleration.ay * transitionProgress * 0.62;
                }

                const shapeStage = transition?.kind === "shape"
                    ? transition.target
                    : visualStage === "letters" || visualStage === "heart" ? visualStage : null;

                if (shapeStage && transition?.kind !== "scatter" && particle.joinsFormation) {
                    const targets = getTargetsForStage(shapeStage, letterTargets, heartTargets);
                    const target = targets[getParticleTargetIndex(particle, shapeStage) % Math.max(targets.length, 1)];

                    if (target) {
                        const driftX = Math.sin(time * 0.018 + getParticleTargetIndex(particle, shapeStage)) * 2.2;
                        const driftY = Math.cos(time * 0.016 + getParticleTargetIndex(particle, shapeStage) * 1.3) * 2.2;
                        const dx = target.x + particle.targetOffsetX + driftX - particle.x;
                        const dy = target.y + particle.targetOffsetY + driftY - particle.y;
                        const pull = 0.0001 + shapeIntensity * 0.00078;

                        ax += dx * pull;
                        ay += dy * pull;
                        ax += Math.sin(time * 0.012 + particle.angle) * 0.006;
                        ay += Math.cos(time * 0.011 + particle.angle) * 0.006;
                    }
                }

                const damping = particle.joinsFormation && shapeIntensity > 0.001
                    ? 0.94 - shapeIntensity * 0.025
                    : 0.982;

                particle.vx = (particle.vx + ax) * damping;
                particle.vy = (particle.vy + ay) * damping;
                particle.x += particle.vx * (reducedMotion ? 0.42 : 1);
                particle.y += particle.vy * (reducedMotion ? 0.42 : 1);
                particle.angle += particle.spin + particle.vx * 0.02;

                if (!transition && shapeIntensity < 0.02 && (
                    particle.x < -30 ||
                    particle.x > width + 30 ||
                    particle.y < -30 ||
                    particle.y > height + 30 ||
                    Math.random() < 0.00028
                )) {
                    resetParticle(particle, width, height, letterTargets.length, heartTargets.length);
                }

                drawParticle(ctx, particle, shapeIntensity, time, wave, isMobile);
            }

            animationFrame = window.requestAnimationFrame(animate);
        };

        resize();
        ctx.fillStyle = "#fff6f9";
        ctx.fillRect(0, 0, width, height);
        animate();

        window.addEventListener("resize", resize);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-10" />;
}
