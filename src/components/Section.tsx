import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode
    className?: string
    fullScreen?: boolean
}

export const Section = forwardRef<HTMLElement, SectionProps>(({ children, className, fullScreen = false, ...props }, ref) => {
    return (
        <section
            ref={ref}
            className={cn(
                "w-full max-w-5xl mx-auto px-6",
                fullScreen ? "h-screen flex flex-col justify-center snap-start" : "pt-32 pb-20",
                className
            )}
            {...props}
        >
            {children}
        </section>
    )
})

Section.displayName = "Section"
