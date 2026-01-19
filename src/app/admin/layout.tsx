"use client"

import { SessionProvider } from "next-auth/react"
import AdminSidebar from "./AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  )
}
