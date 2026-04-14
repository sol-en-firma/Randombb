'use client'

import { useState } from 'react'
import { markNotificationAsRead, deleteNotification } from '@/app/actions/notifications'

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

interface NotificationItemProps {
  notification: Notification
}

const typeEmojis: Record<string, string> = {
  opened_check: '🔓',
  expiration_warning: '⚠️',
  recipe_suggestion: '🍳',
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.read)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleMarkAsRead = async () => {
    setIsRead(true)
    await markNotificationAsRead(notification.id)
  }

  const handleDelete = async () => {
    setIsDeleted(true)
    await deleteNotification(notification.id)
  }

  if (isDeleted) return null

  return (
    <div
      className={`p-4 rounded-xl border-l-4 transition-all ${
        isRead
          ? 'bg-gray-50 border-l-gray-300'
          : notification.type === 'expiration_warning'
            ? 'bg-red-50 border-l-red-500'
            : notification.type === 'recipe_suggestion'
              ? 'bg-green-50 border-l-green-500'
              : 'bg-blue-50 border-l-blue-500'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{typeEmojis[notification.type] || '📢'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-sm">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.created_at).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex gap-2 ml-2 flex-shrink-0">
          {!isRead && (
            <button
              onClick={handleMarkAsRead}
              className="text-xs font-medium text-orange-600 hover:text-orange-700 whitespace-nowrap px-2 py-1 rounded bg-orange-100 hover:bg-orange-200 transition-colors"
            >
              Leer
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-gray-500 hover:text-red-600 whitespace-nowrap px-2 py-1 rounded hover:bg-red-100 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
