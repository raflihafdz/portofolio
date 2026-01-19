import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        section: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, thumbnail, sectionId, order, isActive, images } = body

    // Delete existing images if new images are provided
    if (images) {
      await prisma.image.deleteMany({
        where: { projectId: id },
      })
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        thumbnail,
        sectionId,
        order,
        isActive,
        images: images
          ? {
              create: images.map((img: { url: string; alt?: string; order?: number }, index: number) => ({
                url: img.url,
                alt: img.alt,
                order: img.order ?? index,
              })),
            }
          : undefined,
      },
      include: { images: true },
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Project deleted" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
