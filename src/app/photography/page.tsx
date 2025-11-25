import { Section } from "@/components/Section"
import { PhotoCard } from "@/components/PhotoCard"

export default function PhotographyPage() {
    const photos = [
        { src: "https://images.unsplash.com/photo-1731432245368-2504b772a159?q=80&w=800&auto=format&fit=crop", alt: "Mountain View" },
        { src: "https://images.unsplash.com/photo-1732050343336-39145558d78d?q=80&w=800&auto=format&fit=crop", alt: "City Lights" },
        { src: "https://images.unsplash.com/photo-1731965097486-35366d4c0628?q=80&w=800&auto=format&fit=crop", alt: "Abstract" },
        { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", alt: "Camera Lens" },
        { src: "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=800&auto=format&fit=crop", alt: "Film Roll" },
        { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop", alt: "Photography Studio" },
    ]

    return (
        <Section className="pt-32 pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Photography</h1>
                <p className="text-white/60 max-w-2xl">
                    Capturing moments, light, and composition. Here are some of my favorite shots from recent travels and experiments.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {photos.map((photo, index) => (
                    <PhotoCard key={index} src={photo.src} alt={photo.alt} />
                ))}
            </div>
        </Section>
    )
}
