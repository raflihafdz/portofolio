import Image from "next/image"
import prisma from "@/lib/prisma"

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return settings
  } catch (error) {
    console.error("Error fetching settings:", error)
    return null
  }
}

export default async function About() {
  const settings = await getSettings()

  return (
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
              {settings?.profileImage ? (
                <Image
                  src={settings.profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-900 rounded-2xl -z-10"></div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Me
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {settings?.aboutMe ? (
                settings.aboutMe.split('\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    Hello! I&apos;m a creative professional passionate about building 
                    digital products that are both beautiful and functional.
                  </p>
                  <p>
                    With years of experience in design and development, I bring ideas 
                    to life through clean code and intuitive interfaces. I believe in 
                    the power of simplicity and attention to detail.
                  </p>
                  <p>
                    When I&apos;m not coding, you can find me exploring new technologies, 
                    contributing to open-source projects, or enjoying a good cup of coffee.
                  </p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
              <div>
                <div className="text-3xl font-bold text-gray-900">10+</div>
                <div className="text-sm text-gray-500">Projects Done</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
