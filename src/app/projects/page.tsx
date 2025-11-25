import { Section } from "@/components/Section"
import { ProjectCard } from "@/components/ProjectCard"

export default function ProjectsPage() {
    const projects = [
        {
            title: "Eureka Pixel",
            description: "A personal portfolio website built with Next.js, Tailwind CSS, and Framer Motion.",
            tags: ["Next.js", "React", "Tailwind"],
            link: "https://github.com/TongRao/eureka_pixel"
        },
        {
            title: "AI Agent",
            description: "An intelligent agent capable of complex reasoning and code generation.",
            tags: ["Python", "LLM", "Agentic"],
            link: "#"
        },
        {
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution with Stripe integration and real-time inventory management.",
            tags: ["Next.js", "Stripe", "Prisma"],
            link: "#"
        },
        {
            title: "Task Manager",
            description: "A productivity app for managing daily tasks and long-term goals.",
            tags: ["React Native", "Firebase"],
            link: "#"
        }
    ]

    return (
        <Section className="pt-32 pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
                <p className="text-white/60 max-w-2xl">
                    A collection of my work in web development, mobile apps, and open source contributions.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>
        </Section>
    )
}
