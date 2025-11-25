import { ArrowUpRight } from "lucide-react"
import { GlassCard } from "@/components/GlassCard"

interface ProjectCardProps {
    title: string
    description: string
    tags: string[]
    link: string
    className?: string
}

export function ProjectCard({ title, description, tags, link, className }: ProjectCardProps) {
    return (
        <GlassCard href={link} external className={className}>
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
                <ArrowUpRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
            </div>
            <p className="mt-2 text-sm text-white/60 line-clamp-3">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/40 border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>
        </GlassCard>
    )
}
