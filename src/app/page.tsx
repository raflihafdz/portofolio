import { Header, Footer, Hero, About, Contact, Section } from "@/components"
import prisma from "@/lib/prisma"
import type { Section as SectionType } from "@/types"

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
