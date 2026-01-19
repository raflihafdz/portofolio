import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - fetch site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst()
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "My Portfolio",
          tagline: "Creative Developer & Designer",
          aboutMe: "Hello! I'm a creative professional passionate about building digital products that are both beautiful and functional.",
        },
      })
    }
    
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// PUT - update site settings
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    let settings = await prisma.siteSettings.findFirst()
    
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: body,
      })
    } else {
      settings = await prisma.siteSettings.create({
        data: body,
      })
    }
    
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
