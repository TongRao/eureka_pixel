import type { Metadata } from "next";
import { SurpriseExperience } from "@/components/surprise/SurpriseExperience";

export const metadata: Metadata = {
    title: "Surprise",
    robots: {
        index: false,
        follow: false,
    },
};

export default function SurprisePage() {
    return <SurpriseExperience />;
}
