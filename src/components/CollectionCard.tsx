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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-xl font-bold text-white mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{title}</h3>
                <span className="inline-flex items-center justify-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {count} Photos
                </span>
            </div>
        </Link>
    )
}
