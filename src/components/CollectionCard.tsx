import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CollectionCardProps {
    title: string
    count: number
    coverSrc: string
    slug: string
    className?: string
}

export function CollectionCard({ title, count, coverSrc, slug, className }: CollectionCardProps) {
    return (
        <Link href={`/photography/${slug}`} className={cn("group block relative aspect-square overflow-hidden rounded-3xl", className)}>
            <Image
                src={coverSrc}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={cn(
                "absolute inset-0 z-10 flex flex-col items-center text-center p-4 transition-all duration-300",
                "justify-end pb-6", // Always bottom
                "opacity-100", // Always visible
                "bg-gradient-to-t from-black/90 via-black/40 to-transparent" // Always gradient
            )}>
                <h3 className="text-xl font-bold text-white mb-1 translate-y-0 transition-transform duration-300">{title}</h3>
                <span className="inline-flex items-center justify-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {count} Photos
                </span>
            </div>
        </Link>
    )
}
