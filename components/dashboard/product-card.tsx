'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  expiration_date: string | null
  opened: boolean
  opened_date: string | null
  image_url: string | null
}

interface ProductCardProps {
  product: Product
}

const categoryEmojis: Record<string, string> = {
  verduras: '🥬',
  frutas: '🍎',
  lacteos: '🧀',
  carnes: '🥩',
  granos: '🌾',
  condimentos: '🌶️',
  otros: '📦',
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const daysUntilExpiration = product.expiration_date
    ? Math.ceil((new Date(product.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const isExpired = daysUntilExpiration !== null && daysUntilExpiration < 0
  const isExpiringSoon = daysUntilExpiration !== null && daysUntilExpiration >= 0 && daysUntilExpiration <= 3

  const handleToggleOpened = async () => {
    setIsUpdating(true)
    try {
      await supabase
        .from('products')
        .update({
          opened: !product.opened,
          opened_date: !product.opened ? new Date().toISOString().split('T')[0] : null,
        })
        .eq('id', product.id)
    } catch (error) {
      console.error('Error updating product:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este producto?')) return
    setIsUpdating(true)
    try {
      await supabase.from('products').delete().eq('id', product.id)
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
      <div
      className={`bg-white rounded-2xl p-4 border-l-4 shadow-sm transition-all ${
        isExpired
          ? 'border-l-red-500 bg-red-50'
          : isExpiringSoon
            ? 'border-l-orange-500 bg-orange-50'
            : 'border-l-green-500 bg-green-50'
      }`}
    >
      <div className="flex gap-4">
        {/* Image */}
        {product.image_url && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-800 text-sm line-clamp-2">
                {categoryEmojis[product.category.toLowerCase()] || '📦'} {product.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {product.quantity} {product.unit}
              </p>
            </div>
            <button
              onClick={handleDelete}
              disabled={isUpdating}
              className="text-gray-400 hover:text-red-500 transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {/* Expiration and Status */}
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            {product.expiration_date && (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isExpired
                    ? 'bg-red-200 text-red-700'
                    : isExpiringSoon
                      ? 'bg-orange-200 text-orange-700'
                      : 'bg-green-200 text-green-700'
                }`}
              >
                {isExpired ? '❌ Vencido' : `${daysUntilExpiration}d`}
              </span>
            )}

            {product.opened && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-200 text-blue-700">
                🔓 Abierto
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleToggleOpened}
        disabled={isUpdating}
        className="mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors active:scale-95 disabled:opacity-50 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 hover:from-orange-200 hover:to-red-200"
      >
        {isUpdating ? '⏳' : product.opened ? '🔓 Abierto' : '🔒 Marcar abierto'}
      </button>
    </div>
  )
}
