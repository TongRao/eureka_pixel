"use client"

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { cn } from "@/lib/utils"

interface PhotoCarouselProps {
    photos: { src: string; alt: string }[]
    className?: string
}

export function PhotoCarousel({ photos, className }: PhotoCarouselProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })])

    return (
        <div className={cn("overflow-hidden rounded-xl border border-white/10 bg-white/5", className)} ref={emblaRef}>
            <div className="flex">
                {photos.map((photo, index) => (
                    <div key={index} className="relative flex-[0_0_100%] min-w-0 aspect-[16/9] sm:aspect-[21/9]">
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
                            <p className="text-lg sm:text-2xl font-bold text-white">{photo.alt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
