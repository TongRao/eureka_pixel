import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode
    className?: string
}

export function Section({ children, className, ...props }: SectionProps) {
    return (
        <section
            className={cn("w-full max-w-5xl mx-auto px-6 py-12 md:py-20", className)}
            {...props}
        >
            {children}
        </section>
    )
}
