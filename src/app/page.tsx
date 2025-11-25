"use client"

import { useState, useEffect, useRef } from "react"
import { Section } from "@/components/Section"
import { ProjectCard } from "@/components/ProjectCard"
import { PhotoCarousel } from "@/components/PhotoCarousel"
import { CollectionCard } from "@/components/CollectionCard"
import { BlogCard } from "@/components/BlogCard"
import { Footer } from "@/components/Footer"
import { DynamicBackground } from "@/components/DynamicBackground"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(entry.target as HTMLElement)
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const recentPhotos = [
    { src: "https://images.unsplash.com/photo-1731432245368-2504b772a159?q=80&w=1200&auto=format&fit=crop", alt: "Mountain View" },
    { src: "https://images.unsplash.com/photo-1732050343336-39145558d78d?q=80&w=1200&auto=format&fit=crop", alt: "City Lights" },
    { src: "https://images.unsplash.com/photo-1731965097486-35366d4c0628?q=80&w=1200&auto=format&fit=crop", alt: "Abstract" },
  ]

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth relative">
      <DynamicBackground pageIndex={activeIndex} />

      {/* Hero Section */}
      <Section
        fullScreen
        className="pt-0 pb-0"
        ref={(el) => { sectionsRef.current[0] = el }}
      >
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
            Crafting digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">experiences</span>.
          </h1>
          <p className="text-xl text-white/60 mb-8 leading-relaxed">
            I&apos;m a developer and photographer based in San Francisco. I build accessible, pixel-perfect, performant web experiences and capture moments in time.
          </p>
          <div className="flex gap-4">
            <Link href="/projects" className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors">
              View Projects
            </Link>
            <Link href="/photography" className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10">
              See Photos
            </Link>
          </div>
        </div>
      </Section>

      {/* Projects Preview */}
      <Section
        fullScreen
        ref={(el) => { sectionsRef.current[1] = el }}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white">Selected Work</h2>
          <Link href="/projects" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectCard
            title="Eureka Pixel"
            description="A personal portfolio website built with Next.js, Tailwind CSS, and Framer Motion."
            tags={["Next.js", "React", "Tailwind"]}
            link="https://github.com/TongRao/eureka_pixel"
          />
          <ProjectCard
            title="AI Agent"
            description="An intelligent agent capable of complex reasoning and code generation."
            tags={["Python", "LLM", "Agentic"]}
            link="#"
          />
        </div>
      </Section>

      {/* Photography Preview */}
      <Section
        fullScreen
        className="pt-24"
        ref={(el) => { sectionsRef.current[2] = el }}
      >
        <div className="flex flex-col h-full justify-center w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Recent Shots</h2>
            <Link href="/photography" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              View gallery <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <PhotoCarousel photos={recentPhotos} className="mb-8 w-full" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CollectionCard
              title="Landscapes"
              count={12}
              coverSrc="https://images.unsplash.com/photo-1731432245368-2504b772a159?q=80&w=400&auto=format&fit=crop"
              slug="landscapes"
            />
            <CollectionCard
              title="Urban"
              count={8}
              coverSrc="https://images.unsplash.com/photo-1732050343336-39145558d78d?q=80&w=400&auto=format&fit=crop"
              slug="urban"
            />
            <CollectionCard
              title="Abstract"
              count={5}
              coverSrc="https://images.unsplash.com/photo-1731965097486-35366d4c0628?q=80&w=400&auto=format&fit=crop"
              slug="abstract"
            />
            <CollectionCard
              title="Portraits"
              count={15}
              coverSrc="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&auto=format&fit=crop"
              slug="portraits"
            />
          </div>
        </div>
      </Section>

      {/* Blog Preview & Footer */}
      <Section
        fullScreen
        className="relative"
        ref={(el) => { sectionsRef.current[3] = el }}
      >
        <div className="flex flex-col h-full justify-center">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white">Latest Thoughts</h2>
            <Link href="/blog" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              Read blog <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <BlogCard
              title="Building with Next.js 15"
              excerpt="Exploring the new features in Next.js 15 including Turbopack and improved caching."
              date="Nov 25, 2025"
              slug="building-with-nextjs-15"
            />
            <BlogCard
              title="The Art of Photography"
              excerpt="How I approach composition and lighting in my landscape photography."
              date="Nov 20, 2025"
              slug="art-of-photography"
            />
            <BlogCard
              title="Designing for Dark Mode"
              excerpt="Best practices for creating comfortable and accessible dark mode interfaces."
              date="Nov 15, 2025"
              slug="designing-for-dark-mode"
            />
          </div>
        </div>

        {/* Footer inside the last snap section to avoid scroll overflow */}
        <div className="absolute bottom-0 left-0 right-0">
          <Footer />
        </div>
      </Section>
    </div>
  )
}
