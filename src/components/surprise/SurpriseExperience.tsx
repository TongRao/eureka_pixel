"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { RosePetalRain } from "./RosePetalRain";

export function SurpriseExperience() {
    const [unlocked, setUnlocked] = useState(false);

    if (unlocked) {
        return <RoseStorm />;
    }

    return <PasswordGate onUnlocked={() => setUnlocked(true)} />;
}

function PasswordGate({ onUnlocked }: { onUnlocked: () => void }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);
        setError("");

        try {
            const response = await fetch("/api/surprise/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                setError("Incorrect password");
                return;
            }

            onUnlocked();
        } finally {
            setPending(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8fa] px-5 text-[#25171c]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(244,184,202,0.28),transparent_34%),radial-gradient(circle_at_72%_82%,rgba(195,72,111,0.14),transparent_36%),linear-gradient(135deg,#fffdfb_0%,#fff5f8_48%,#f7dce6_100%)]" />

            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-full max-w-[360px] rounded-3xl border border-white/80 bg-white/64 p-7 shadow-[0_32px_90px_rgba(106,42,63,0.14)] backdrop-blur-2xl"
            >
                <div className="mb-7 text-center">
                    <h1 className="flex items-center justify-center gap-2 text-3xl font-medium tracking-[0.08em] text-[#2d1b22]">
                        Surprise
                        <Heart className="h-6 w-6 fill-[#dc3f65] text-[#dc3f65]" />
                    </h1>
                    <p className="mt-2 text-sm font-medium tracking-[0.24em] text-[#d85f82]">
                        粉红玫瑰海浪
                    </p>
                </div>

                <label className="block">
                    <span className="sr-only">Password</span>
                    <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        className="h-[52px] w-full rounded-full border border-[#e8c9d4] bg-white/78 px-5 text-center text-base text-[#2d1b22] outline-none transition placeholder:text-[#ad8794] focus:border-[#b96582] focus:bg-white"
                        placeholder="Password"
                    />
                </label>

                <button
                    type="submit"
                    disabled={pending || !password}
                    className="mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#d85f82] px-5 text-sm font-medium tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(216,95,130,0.28)] transition hover:bg-[#c84f74] disabled:cursor-not-allowed disabled:opacity-45"
                >
                    {pending ? "OPENING" : "ENTER"}
                    <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-4 min-h-5 text-center text-sm text-[#9b4661]">
                    {error}
                </p>
            </form>
        </main>
    );
}

function RoseStorm() {
    const [particleStage, setParticleStage] = useState<"free" | "letters" | "heart">("free");

    const advanceParticleStage = () => {
        setParticleStage((stage) => {
            if (stage === "free") {
                return "letters";
            }

            if (stage === "letters") {
                return "heart";
            }

            return "free";
        });
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#fff6f9] text-[#2b1820]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.68),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(232,122,157,0.18),transparent_30%),linear-gradient(145deg,#fffafc_0%,#fce5ed_48%,#eeb5c8_100%)]" />
            <RosePetalRain stage={particleStage} />
            <button
                type="button"
                onClick={advanceParticleStage}
                className={`fixed bottom-7 left-1/2 z-30 h-12 -translate-x-1/2 rounded-full border border-white/70 bg-white/58 px-7 text-sm font-medium tracking-[0.18em] shadow-[0_18px_55px_rgba(132,49,76,0.2)] backdrop-blur-xl transition hover:bg-white/74 sm:bottom-9 ${particleStage === "heart" ? "text-xl text-[#dc3f65]" : "text-[#7b2c48]"}`}
            >
                {particleStage === "free" ? "Click Me" : particleStage === "letters" ? "Click Me Again" : "♥"}
            </button>
        </main>
    );
}
