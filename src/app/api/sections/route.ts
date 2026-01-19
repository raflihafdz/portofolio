import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET all sections
export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      include: {
        projects: {
          include: { images: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    })
    return NextResponse.json({ success: true, data: sections })
  } catch (error) {
    console.error("Error fetching sections:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sections" },
      { status: 500 }
    )
  }
}

// POST create new section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, order, isActive } = body

    const section = await prisma.section.create({
      data: {
        title,
        description,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ success: true, data: section }, { status: 201 })
  } catch (error) {
    console.error("Error creating section:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create section" },
      { status: 500 }
    )
  }
}
