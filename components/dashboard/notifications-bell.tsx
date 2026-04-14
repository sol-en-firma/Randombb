'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NotificationsBellProps {
  count: number
}

export default function NotificationsBell({ count }: NotificationsBellProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="relative w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-2xl hover:scale-110 transform transition-transform"
      >
        🔔
        {count > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {showMenu && (
        <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-xl border border-orange-100 p-4 w-64 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-3">Notificaciones</h3>

          {count === 0 ? (
            <p className="text-sm text-gray-600 text-center py-4">No tienes notificaciones</p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">{count} notificaciones nuevas</p>
              <Link
                href="/notifications"
                className="block mt-3 py-2 px-3 bg-orange-100 text-orange-700 rounded-lg font-medium text-center hover:bg-orange-200 transition-colors"
              >
                Ver todas
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
