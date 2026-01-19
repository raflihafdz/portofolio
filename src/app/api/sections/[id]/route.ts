import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET single section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        projects: {
          include: { images: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    console.error("Error fetching section:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch section" },
      { status: 500 }
    )
  }
}

// PUT update section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, order, isActive } = body

    const section = await prisma.section.update({
      where: { id },
      data: {
        title,
        description,
        order,
        isActive,
      },
    })

    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    console.error("Error updating section:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update section" },
      { status: 500 }
    )
  }
}

// DELETE section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.section.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Section deleted" })
  } catch (error) {
    console.error("Error deleting section:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete section" },
      { status: 500 }
    )
  }
}
