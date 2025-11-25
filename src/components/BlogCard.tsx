import Link from "next/link"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogCardProps {
    title: string
    excerpt: string
    date: string
    slug: string
    className?: string
}

export function BlogCard({ title, excerpt, date, slug, className }: BlogCardProps) {
    return (
        <Link href={`/blog/${slug}`} className={cn("block group", className)}>
            <article className="h-full relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
                <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={date}>{date}</time>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-sm text-white/60 line-clamp-3">{excerpt}</p>
                <div className="mt-4 text-sm font-medium text-blue-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    Read more &rarr;
                </div>
            </article>
        </Link>
    )
}
