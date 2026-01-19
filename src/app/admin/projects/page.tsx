"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import Image from "next/image"
import type { Project, Section } from "@/types"

function ProjectsContent() {
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sectionIdParam = searchParams.get("sectionId")

  const [projects, setProjects] = useState<Project[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    sectionId: "",
    order: 0,
    isActive: true,
    images: [] as { url: string; alt: string }[],
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
  }, [status, router])

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, sectionsRes] = await Promise.all([
        fetch(`/api/projects${sectionIdParam ? `?sectionId=${sectionIdParam}` : ""}`),
        fetch("/api/sections"),
      ])

      const projectsData = await projectsRes.json()
      const sectionsData = await sectionsRes.json()

      setProjects(projectsData.data || [])
      setSections(sectionsData.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [sectionIdParam])

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
  }, [status, fetchData])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)

    try {
      const formDataUpload = new FormData()
      Array.from(files).forEach((file) => {
        formDataUpload.append("files", file)
      })

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await res.json()

      if (data.success) {
        const newImages = data.data.map((file: { url: string; filename: string }) => ({
          url: file.url,
          alt: file.filename,
        }))

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
          thumbnail: prev.thumbnail || newImages[0]?.url || "",
        }))
      }
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects"
      const method = editingProject ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingProject(null)
        setFormData({
          title: "",
          description: "",
          thumbnail: "",
          sectionId: "",
          order: 0,
          isActive: true,
          images: [],
        })
        fetchData()
      }
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || "",
      thumbnail: project.thumbnail || "",
      sectionId: project.sectionId,
      order: project.order,
      isActive: project.isActive,
      images:
        project.images?.map((img) => ({
          url: img.url,
          alt: img.alt || "",
        })) || [],
    })
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      sectionId: sectionIdParam || sections[0]?.id || "",
      order: projects.length,
      isActive: true,
      images: [],
    })
    setIsModalOpen(true)
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      thumbnail:
        prev.thumbnail === prev.images[index]?.url
          ? prev.images[0]?.url || ""
          : prev.thumbnail,
    }))
  }

  const setAsThumbnail = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: url,
    }))
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={sections.length === 0}
          className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Project
        </button>
      </div>

      {/* Filter by section */}
      <div className="mb-6">
        <select
          value={sectionIdParam || ""}
          onChange={(e) => {
            const value = e.target.value
            if (value) {
              router.push(`/admin/projects?sectionId=${value}`)
            } else {
              router.push("/admin/projects")
            }
          }}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0"
        >
          <option value="">All Sections</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      {sections.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">Create a section first before adding projects</p>
          <button
            onClick={() => router.push("/admin/sections")}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go to Sections
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-500 mb-4">No projects yet</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 relative">
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {project.images && project.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {project.images.length} images
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      project.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {project.isActive ? "Active" : "Draft"}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingProject ? "Edit Project" : "Create Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <select
                    value={formData.sectionId}
                    onChange={(e) =>
                      setFormData({ ...formData, sectionId: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 text-gray-900"
                    required
                  >
                    <option value="">Select a section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 resize-none text-gray-900"
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                  >
                    {uploadingImages ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    ) : (
                      <>
                        <svg
                          className="w-8 h-8 text-gray-400 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-500">
                          Click to upload images
                        </span>
                      </>
                    )}
                  </label>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={img.url}
                              alt={img.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {formData.thumbnail === img.url && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                              Thumb
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setAsThumbnail(img.url)}
                              className="p-1 bg-white rounded text-xs"
                              title="Set as thumbnail"
                            >
                              ⭐
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1 bg-red-500 text-white rounded text-xs"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? "active" : "draft"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "active",
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 text-gray-900"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  {editingProject ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  )
}
