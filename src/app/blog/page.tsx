import { Section } from "@/components/Section"
import { BlogCard } from "@/components/BlogCard"

export default function BlogPage() {
    const posts = [
        {
            title: "Building with Next.js 15",
            excerpt: "Exploring the new features in Next.js 15 including Turbopack and improved caching.",
            date: "Nov 25, 2025",
            slug: "building-with-nextjs-15"
        },
        {
            title: "The Art of Photography",
            excerpt: "How I approach composition and lighting in my landscape photography.",
            date: "Nov 20, 2025",
            slug: "art-of-photography"
        },
        {
            title: "Designing for Dark Mode",
            excerpt: "Best practices for creating comfortable and accessible dark mode interfaces.",
            date: "Nov 15, 2025",
            slug: "designing-for-dark-mode"
        },
        {
            title: "Mastering Tailwind CSS",
            excerpt: "Tips and tricks for writing clean, maintainable Tailwind CSS code.",
            date: "Nov 10, 2025",
            slug: "mastering-tailwind-css"
        }
    ]

    return (
        <Section className="pt-32 pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
                <p className="text-white/60 max-w-2xl">
                    Thoughts on technology, design, and photography.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                    <BlogCard key={index} {...post} />
                ))}
            </div>
        </Section>
    )
}
