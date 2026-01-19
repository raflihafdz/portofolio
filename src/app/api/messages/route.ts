import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - fetch all messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// POST - create new message (from contact form)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required" },
        { status: 400 }
      )
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
    })

    return NextResponse.json({ success: true, data: newMessage })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    )
  }
}
