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
    hue: number;
    lightness: number;
    alpha: number;
    joinsFormation: boolean;
    letterTargetIndex: number;
    heartTargetIndex: number;
    targetOffsetX: number;
    targetOffsetY: number;
    scatterX: number;
    scatterY: number;
};

type Point = {
    x: number;
    y: number;
};

type Vortex = {
    x: number;
    y: number;
    radius: number;
    strength: number;
    phase: number;
    speed: number;
};

type Transition = {
    from: ParticleStage;
    kind: "shape" | "scatter";
    startedAt: number;
    target: ParticleStage;
} | null;

type FreeMotionState = {
    centerX: number;
    centerY: number;
    height: number;
    mode: number;
    pointer: {
        active: boolean;
        x: number;
        y: number;
    };
    time: number;
    vortices: Vortex[];
    width: number;
};

const TRANSITION_MS = 5000;
const FREE_MODE_MS = 15000;
const FREE_MODE_BLEND_MS = 1800;

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

function assignScatterTarget(particle: Particle, width: number, height: number) {
    particle.scatterX = random(width * 0.04, width * 0.96);
    particle.scatterY = random(height * 0.04, height * 0.96);
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
    particle.hue = random(334, 354);
    particle.lightness = random(63, 84);
    particle.alpha = random(0.38, 0.88);
    particle.joinsFormation = Math.random() > 0.08;
    particle.letterTargetIndex = Math.floor(random(0, Math.max(letterTargetCount, 1)));
    particle.heartTargetIndex = Math.floor(random(0, Math.max(heartTargetCount, 1)));
    particle.targetOffsetX = random(-1.6, 1.6);
    particle.targetOffsetY = random(-1.6, 1.6);
    assignScatterTarget(particle, width, height);
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

function getFreeAcceleration(particle: Particle, state: FreeMotionState) {
    let ax = Math.sin((particle.y + state.time * 1.7) * 0.003) * 0.006;
    let ay = Math.cos((particle.x - state.time * 1.4) * 0.0026) * 0.005;

    if (state.mode === 0) {
        for (const vortex of state.vortices) {
            const dx = vortex.x - particle.x;
            const dy = vortex.y - particle.y;
            const distance = Math.hypot(dx, dy) || 1;

            if (distance < vortex.radius) {
                const force = (1 - distance / vortex.radius) * vortex.strength;
                ax += (-dy / distance) * force * 0.047;
                ay += (dx / distance) * force * 0.047;
                ax += (dx / distance) * Math.abs(force) * 0.006;
                ay += (dy / distance) * Math.abs(force) * 0.006;
            }
        }
    }

    if (state.mode === 1) {
        ax += 0.028 + Math.sin((particle.y + state.time * 2.2) * 0.006) * 0.018;
        ay += -0.01 + Math.cos((particle.x - state.time * 1.5) * 0.004) * 0.015;
    }

    if (state.mode === 2) {
        ax += Math.sin(particle.y * 0.018 + state.time * 0.035) * 0.035;
        ay += Math.cos(particle.x * 0.01 - state.time * 0.026) * 0.014;
    }

    if (state.mode === 3) {
        const dx = state.centerX - particle.x;
        const dy = state.centerY - particle.y;
        const distance = Math.hypot(dx, dy) || 1;
        const force = Math.min(1, distance / Math.max(state.width, state.height)) * 0.055;

        ax += (-dy / distance) * force;
        ay += (dx / distance) * force;
        ax += (dx / distance) * 0.005;
        ay += (dy / distance) * 0.005;
    }

    if (state.mode === 4) {
        const dx = particle.x - state.centerX;
        const distanceFromCenter = Math.abs(dx) / Math.max(state.width * 0.5, 1);

        ax += Math.sin(state.time * 0.025 + particle.y * 0.01) * 0.018;
        ay += -0.035 + distanceFromCenter * 0.018;
    }

    if (state.mode === 5) {
        const dx = particle.x - state.centerX;
        const dy = particle.y - state.centerY;
        const distance = Math.hypot(dx, dy) || 1;

        ax += (dx / distance) * 0.018 + Math.cos(state.time * 0.02 + particle.y * 0.006) * 0.014;
        ay += (dy / distance) * 0.012 + Math.sin(state.time * 0.018 + particle.x * 0.006) * 0.014;
    }

    if (state.pointer.active) {
        const dx = state.pointer.x - particle.x;
        const dy = state.pointer.y - particle.y;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = state.width < 640 ? 300 : 360;

        if (distance < radius) {
            const force = (1 - distance / radius) * particle.affinity;
            ax += (dx / distance) * force * 0.058;
            ay += (dy / distance) * force * 0.058;
            ax += (-dy / distance) * force * 0.01;
            ay += (dx / distance) * force * 0.01;
        }
    }

    return { ax, ay };
}

function blendAcceleration(
    particle: Particle,
    baseState: Omit<FreeMotionState, "mode">,
    previousMode: number,
    currentMode: number,
    blend: number
) {
    const previous = getFreeAcceleration(particle, { ...baseState, mode: previousMode });
    const current = getFreeAcceleration(particle, { ...baseState, mode: currentMode });

    return {
        ax: previous.ax * (1 - blend) + current.ax * blend,
        ay: previous.ay * (1 - blend) + current.ay * blend,
    };
}

function drawParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle,
    shapeIntensity: number
) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);

    const mutedProgress = particle.joinsFormation ? 0 : shapeIntensity;
    const letterProgress = particle.joinsFormation ? shapeIntensity : 0;
    const saturation = 86 - mutedProgress * 62;
    const lightness = particle.lightness + mutedProgress * 12 + letterProgress * 3;
    const alpha = particle.alpha * (1 - mutedProgress * 0.72) + letterProgress * 0.08;

    ctx.globalAlpha = Math.min(0.96, alpha);

    const width = particle.size * (1 + letterProgress * 0.1);
    const height = width * particle.stretch;
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
        const pointer = { active: false, x: 0, y: 0 };
        const vortices: Vortex[] = [
            { x: 0, y: 0, radius: 280, strength: 0.52, phase: 0, speed: 0.0026 },
            { x: 0, y: 0, radius: 380, strength: -0.38, phase: 2.4, speed: 0.0019 },
            { x: 0, y: 0, radius: 240, strength: 0.3, phase: 4.7, speed: 0.0034 },
        ];
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let letterTargets: Point[] = [];
        let heartTargets: Point[] = [];
        let width = 0;
        let height = 0;
        let dpr = 1;
        let time = 0;
        let visualStage: ParticleStage = "free";
        let transition: Transition = null;
        let previousFreeMode = 0;
        let currentFreeMode = 0;
        let lastModeSwitchTime = performance.now();
        let animationFrame = 0;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            letterTargets = createLetterTargets(width, height);
            heartTargets = createHeartTargets(width, height);

            const targetCount = Math.min(
                width < 640 ? 2300 : 3600,
                Math.floor((width * height) / (width < 640 ? 210 : 220))
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
                assignScatterTarget(particle, width, height);
            }
        };

        const startTransition = (target: ParticleStage, now: number) => {
            const from = transition?.target || visualStage;

            if (target === "free") {
                for (const particle of particles) {
                    assignScatterTarget(particle, width, height);
                }

                transition = { from, kind: "scatter", startedAt: now, target };
                return;
            }

            transition = { from, kind: "shape", startedAt: now, target };
        };

        const updatePointer = (event: PointerEvent) => {
            pointer.active = true;
            pointer.x = event.clientX;
            pointer.y = event.clientY;
        };

        const updateTouchPointer = (event: TouchEvent) => {
            const touch = event.touches[0];

            if (!touch) {
                return;
            }

            pointer.active = true;
            pointer.x = touch.clientX;
            pointer.y = touch.clientY;
        };

        const clearPointer = () => {
            pointer.active = false;
        };

        const animate = () => {
            const now = performance.now();
            const desiredStage = desiredStageRef.current;

            if ((!transition && desiredStage !== visualStage) || (transition && desiredStage !== transition.target)) {
                startTransition(desiredStage, now);
            }

            if (!transition && visualStage === "free" && now - lastModeSwitchTime > FREE_MODE_MS) {
                previousFreeMode = currentFreeMode;
                currentFreeMode = (currentFreeMode + 1) % 6;
                lastModeSwitchTime = now;
            }

            const modeBlend = smoothstep((now - lastModeSwitchTime) / FREE_MODE_BLEND_MS);
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
            ctx.fillStyle = `rgba(255, 246, 249, ${0.13 + shapeIntensity * 0.13})`;
            ctx.fillRect(0, 0, width, height);

            const centerX = width * 0.5;
            const centerY = height * 0.5;

            for (const vortex of vortices) {
                vortex.phase += vortex.speed * (reducedMotion ? 0.35 : 1);
                vortex.x = centerX + Math.cos(vortex.phase) * width * 0.27;
                vortex.y = centerY + Math.sin(vortex.phase * 1.18) * height * 0.25;
            }

            for (const particle of particles) {
                const freeAcceleration = blendAcceleration(
                    particle,
                    { centerX, centerY, height, pointer, time, vortices, width },
                    previousFreeMode,
                    currentFreeMode,
                    modeBlend
                );
                let ax = particle.joinsFormation
                    ? freeAcceleration.ax * (1 - shapeIntensity)
                    : freeAcceleration.ax * 0.72;
                let ay = particle.joinsFormation
                    ? freeAcceleration.ay * (1 - shapeIntensity)
                    : freeAcceleration.ay * 0.72;

                if (transition?.kind === "scatter" && particle.joinsFormation) {
                    const dx = particle.scatterX - particle.x;
                    const dy = particle.scatterY - particle.y;
                    const pull = 0.00012 + transitionProgress * 0.00072;

                    ax += dx * pull;
                    ay += dy * pull;
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

                if (shapeIntensity < 0.02 && (
                    particle.x < -30 ||
                    particle.x > width + 30 ||
                    particle.y < -30 ||
                    particle.y > height + 30 ||
                    Math.random() < 0.00028
                )) {
                    resetParticle(particle, width, height, letterTargets.length, heartTargets.length);
                }

                drawParticle(ctx, particle, shapeIntensity);
            }

            animationFrame = window.requestAnimationFrame(animate);
        };

        resize();
        ctx.fillStyle = "#fff6f9";
        ctx.fillRect(0, 0, width, height);
        animate();

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", updatePointer, { passive: true });
        window.addEventListener("pointerdown", updatePointer, { passive: true });
        window.addEventListener("touchstart", updateTouchPointer, { passive: true });
        window.addEventListener("touchmove", updateTouchPointer, { passive: true });
        window.addEventListener("pointerup", clearPointer);
        window.addEventListener("pointerleave", clearPointer);
        window.addEventListener("touchend", clearPointer);
        window.addEventListener("touchcancel", clearPointer);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", updatePointer);
            window.removeEventListener("pointerdown", updatePointer);
            window.removeEventListener("touchstart", updateTouchPointer);
            window.removeEventListener("touchmove", updateTouchPointer);
            window.removeEventListener("pointerup", clearPointer);
            window.removeEventListener("pointerleave", clearPointer);
            window.removeEventListener("touchend", clearPointer);
            window.removeEventListener("touchcancel", clearPointer);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-10 touch-none" />;
}
