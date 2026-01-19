import type { Section as SectionType } from "@/types"
import ProjectCard from "./ProjectCard"

interface SectionProps {
  section: SectionType
}

export default function Section({ section }: SectionProps) {
  if (!section.projects || section.projects.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          {section.description && (
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {section.description}
            </p>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.projects
            .filter((p) => p.isActive)
            .sort((a, b) => a.order - b.order)
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      </div>
    </section>
  )
}
