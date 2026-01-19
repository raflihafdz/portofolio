import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET all projects
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sectionId = searchParams.get("sectionId")

    const projects = await prisma.project.findMany({
      where: sectionId ? { sectionId } : undefined,
      include: {
        images: { orderBy: { order: "asc" } },
        section: true,
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, thumbnail, sectionId, order, isActive, images } = body

    const project = await prisma.project.create({
      data: {
        title,
        description,
        thumbnail,
        sectionId,
        order: order || 0,
        isActive: isActive ?? true,
        images: images
          ? {
              create: images.map((img: { url: string; alt?: string; order?: number }, index: number) => ({
                url: img.url,
                alt: img.alt || title,
                order: img.order ?? index,
              })),
            }
          : undefined,
      },
      include: { images: true },
    })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    )
  }
}
