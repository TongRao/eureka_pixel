"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Home", path: "/" },
    { name: "Photography", path: "/photography" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
]

export function Navbar() {
    const pathname = usePathname()

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit pointer-events-none px-4">
            <nav className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-md shadow-lg overflow-x-auto max-w-[calc(100vw-2rem)] scrollbar-hide">
                {navItems.map((item) => {
                    const isActive = pathname === item.path

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full",
                                isActive ? "text-white" : "text-white/60 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/5 shadow-inner"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
