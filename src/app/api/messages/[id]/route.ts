import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - fetch single message
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const message = await prisma.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error("Error fetching message:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch message" },
      { status: 500 }
    )
  }
}

// PUT - mark message as read/unread
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const message = await prisma.message.update({
      where: { id },
      data: { isRead: body.isRead },
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 }
    )
  }
}

// DELETE - delete message
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.message.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 }
    )
  }
}
