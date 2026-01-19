import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

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

    const uploadedFiles: { url: string; filename: string }[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Convert buffer to base64 for Cloudinary
      const base64 = buffer.toString('base64')
      const dataURI = `data:${file.type};base64,${base64}`

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'portfolio',
        resource_type: 'auto',
      })

      uploadedFiles.push({
        url: result.secure_url,
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

