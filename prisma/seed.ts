import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create sample sections
  const webSection = await prisma.section.upsert({
    where: { id: 'web-development' },
    update: {},
    create: {
      id: 'web-development',
      title: 'Web Development',
      description: 'Full-stack web applications built with modern technologies',
      order: 0,
      isActive: true,
    },
  })

  const designSection = await prisma.section.upsert({
    where: { id: 'ui-design' },
    update: {},
    create: {
      id: 'ui-design',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interface designs',
      order: 1,
      isActive: true,
    },
  })

  console.log('Sections created:', webSection.title, designSection.title)

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.',
      sectionId: webSection.id,
      order: 0,
      isActive: true,
    },
  })

  const project2 = await prisma.project.upsert({
    where: { id: 'sample-project-2' },
    update: {},
    create: {
      id: 'sample-project-2',
      title: 'Mobile Banking App',
      description: 'Clean and modern mobile banking application design with focus on usability and security.',
      sectionId: designSection.id,
      order: 0,
      isActive: true,
    },
  })

  console.log('Projects created:', project1.title, project2.title)

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'My Portfolio',
      tagline: 'Creating Digital Experiences',
      aboutMe: 'Hello! I am a passionate developer and designer.',
      email: 'hello@example.com',
    },
  })

  console.log('Site settings created')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
