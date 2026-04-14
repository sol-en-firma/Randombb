'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 flex items-center justify-around z-40">
      <Link
        href="/dashboard"
        className={`flex-1 py-4 text-center transition-colors ${
          isActive('/dashboard')
            ? 'text-orange-600 border-t-2 border-orange-600'
            : 'text-gray-600 border-t-2 border-transparent'
        }`}
      >
        <span className="text-2xl">🏠</span>
        <p className="text-xs mt-1">Inicio</p>
      </Link>

      <Link
        href="/recipes"
        className={`flex-1 py-4 text-center transition-colors ${
          isActive('/recipes')
            ? 'text-orange-600 border-t-2 border-orange-600'
            : 'text-gray-600 border-t-2 border-transparent'
        }`}
      >
        <span className="text-2xl">🍳</span>
        <p className="text-xs mt-1">Recetas</p>
      </Link>

      <Link
        href="/notifications"
        className={`flex-1 py-4 text-center transition-colors ${
          isActive('/notifications')
            ? 'text-orange-600 border-t-2 border-orange-600'
            : 'text-gray-600 border-t-2 border-transparent'
        }`}
      >
        <span className="text-2xl">🔔</span>
        <p className="text-xs mt-1">Alertas</p>
      </Link>
    </nav>
  )
}
