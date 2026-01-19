import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearOldImages() {
  try {
    // Update settings - clear old /uploads images
    await prisma.siteSettings.updateMany({
      where: {
        OR: [
          { profileImage: { startsWith: '/uploads' } },
          { heroImage: { startsWith: '/uploads' } }
        ]
      },
      data: {
        profileImage: null,
        heroImage: null
      }
    })

    // Update projects - clear old /uploads thumbnails
    await prisma.project.updateMany({
      where: {
        thumbnail: { startsWith: '/uploads' }
      },
      data: {
        thumbnail: null
      }
    })

    // Delete old /uploads images
    await prisma.image.deleteMany({
      where: {
        url: { startsWith: '/uploads' }
      }
    })

    console.log('✅ Old local images cleared. Please re-upload images in admin.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearOldImages()
