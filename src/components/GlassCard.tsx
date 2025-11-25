import { cn } from "@/lib/utils"
import Link from "next/link"
import { ReactNode } from "react"

interface GlassCardProps {
    children: ReactNode
    className?: string
    href?: string
    external?: boolean
}

export function GlassCard({ children, className, href, external = false }: GlassCardProps) {
    const content = (
        <div className={cn(
            "h-full relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10",
            className
        )}>
            {children}
        </div>
    )

    if (href) {
        return (
            <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="block group h-full"
            >
                {content}
            </Link>
        )
    }

    return <div className="h-full">{content}</div>
}
