import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET single link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const link = await prisma.link.findUnique({
      where: { id },
    })

    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: link })
  } catch (error) {
    console.error("Error fetching link:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch link" },
      { status: 500 }
    )
  }
}

// PUT update link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, url, icon, order, isActive } = body

    const link = await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        icon,
        order,
        isActive,
      },
    })

    return NextResponse.json({ success: true, data: link })
  } catch (error) {
    console.error("Error updating link:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update link" },
      { status: 500 }
    )
  }
}

// DELETE link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.link.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Link deleted" })
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete link" },
      { status: 500 }
    )
  }
}
