'use client'

import { useState } from 'react'

interface ProductDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    name: string
    category: string
    quantity: number
    unit: string
    expirationDate?: string
  } | null
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

export default function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6 space-y-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {categoryEmojis[product.category.toLowerCase()] || '📦'} {product.name}
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="text-gray-700">Categoría</span>
            <span className="font-semibold text-orange-700 capitalize">{product.category}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-gray-700">Cantidad</span>
            <span className="font-semibold text-blue-700">
              {product.quantity} {product.unit}
            </span>
          </div>

          {product.expirationDate && (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Vencimiento</span>
              <span className="font-semibold text-red-700">
                {new Date(product.expirationDate).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
