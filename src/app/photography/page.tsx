import { Section } from "@/components/Section"
import { PhotoCarousel } from "@/components/PhotoCarousel"
import { CollectionCard } from "@/components/CollectionCard"

export default function PhotographyPage() {
    const featuredPhotos = [
        { src: "https://images.unsplash.com/photo-1731432245368-2504b772a159?q=80&w=1200&auto=format&fit=crop", alt: "Mountain View" },
        { src: "https://images.unsplash.com/photo-1732050343336-39145558d78d?q=80&w=1200&auto=format&fit=crop", alt: "City Lights" },
        { src: "https://images.unsplash.com/photo-1731965097486-35366d4c0628?q=80&w=1200&auto=format&fit=crop", alt: "Abstract" },
        { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop", alt: "Camera Lens" },
    ]

    return (
        <Section className="pt-32 pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Photography</h1>
                <p className="text-white/60 max-w-2xl mb-8">
                    Capturing moments, light, and composition. Here are some of my favorite shots from recent travels and experiments.
                </p>

                <PhotoCarousel photos={featuredPhotos} className="mb-16" />

                <h2 className="text-2xl font-bold text-white mb-6">Collections</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <CollectionCard
                        title="Landscapes"
                        count={12}
                        coverSrc="https://images.unsplash.com/photo-1731432245368-2504b772a159?q=80&w=400&auto=format&fit=crop"
                        slug="landscapes"
                    />
                    <CollectionCard
                        title="Urban"
                        count={8}
                        coverSrc="https://images.unsplash.com/photo-1732050343336-39145558d78d?q=80&w=400&auto=format&fit=crop"
                        slug="urban"
                    />
                    <CollectionCard
                        title="Abstract"
                        count={5}
                        coverSrc="https://images.unsplash.com/photo-1731965097486-35366d4c0628?q=80&w=400&auto=format&fit=crop"
                        slug="abstract"
                    />
                    <CollectionCard
                        title="Portraits"
                        count={15}
                        coverSrc="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop"
                        slug="portraits"
                    />
                </div>
            </div>
        </Section>
    )
}
