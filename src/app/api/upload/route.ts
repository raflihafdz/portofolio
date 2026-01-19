import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Collect files from both "file" (single) and "files" (multiple)
    const files: File[] = []
    
    // Try "file" first (single upload from settings page)
    const singleFile = formData.get("file")
    if (singleFile && singleFile instanceof File && singleFile.size > 0) {
      files.push(singleFile)
    }
    
    // Then try "files" (multiple upload from projects page)
    const multipleFiles = formData.getAll("files")
    for (const f of multipleFiles) {
      if (f instanceof File && f.size > 0) {
        files.push(f)
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // Directory might already exist
    }

    const uploadedFiles: { url: string; filename: string }[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const ext = path.extname(file.name)
      const filename = `${uuidv4()}${ext}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)

      uploadedFiles.push({
        url: `/uploads/${filename}`,
        filename: file.name,
      })
    }

    // For single file upload, return url directly for convenience
    if (uploadedFiles.length === 1) {
      return NextResponse.json({
        success: true,
        url: uploadedFiles[0].url,
        data: uploadedFiles,
      })
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
    })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload files" },
      { status: 500 }
    )
  }
}
