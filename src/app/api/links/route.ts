import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET all links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    console.error("Error fetching links:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch links" },
      { status: 500 }
    )
  }
}

// POST create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, url, icon, order, isActive } = body

    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ success: true, data: link }, { status: 201 })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create link" },
      { status: 500 }
    )
  }
}
