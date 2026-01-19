import { Header, Footer, Hero, About, Contact, Section } from "@/components"
import prisma from "@/lib/prisma"
import type { Section as SectionType } from "@/types"

// Revalidate every 60 seconds or force dynamic
export const revalidate = 60 // Revalidate page every 60 seconds

async function getSections() {
  try {
    const sections = await prisma.section.findMany({
      where: { isActive: true },
      include: {
        projects: {
          where: { isActive: true },
          include: { images: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    })
    return sections as SectionType[]
  } catch {
    return []
  }
}

export default async function Home() {
  const sections = await getSections()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <Hero />
        <About />
        
        {/* Dynamic Sections */}
        <div id="projects">
          {sections.map((section: SectionType) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
        
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
