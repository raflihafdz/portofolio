"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export default function MessagesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    }
  }, [status, router])

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setMessages(data.data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages()
    }
  }, [status])

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      })
      fetchMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead })
      }
    } catch (error) {
      console.error("Error updating message:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      await fetch(`/api/messages/${id}`, { method: "DELETE" })
      fetchMessages()
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const openMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      handleMarkAsRead(message.id, true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All messages read"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Inbox</h2>
          </div>
          {messages.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-150 overflow-y-auto">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? "bg-gray-50" : ""
                  } ${!message.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${!message.isRead ? "bg-blue-500" : "bg-transparent"}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium text-gray-900 truncate ${!message.isRead ? "font-semibold" : ""}`}>
                          {message.name}
                        </span>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                          {formatDate(message.createdAt).split(",")[0]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {message.subject || "No subject"}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedMessage.subject || "No subject"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.isRead)}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="flex-1 p-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              {/* Reply */}
              <div className="p-6 border-t border-gray-100">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
                  </svg>
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
