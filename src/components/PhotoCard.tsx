import Image from "next/image"
import { cn } from "@/lib/utils"

interface PhotoCardProps {
    src: string
    alt: string
    className?: string
}

export function PhotoCard({ src, alt, className }: PhotoCardProps) {
    return (
        <div className={cn("group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 aspect-[4/5]", className)}>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{alt}</p>
            </div>
        </div>
    )
}
