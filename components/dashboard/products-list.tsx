'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductCard from './product-card'

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

interface ProductsListProps {
  initialProducts: Product[]
}

export default function ProductsList({ initialProducts }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [expiringSoon, setExpiringSoon] = useState<Product[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel('products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts((prev) => [payload.new as Product, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Product) : p))
            )
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Calculate products expiring soon
  useEffect(() => {
    const today = new Date()
    const soon = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const expiring = products.filter((p) => {
      if (!p.expiration_date) return false
      const expDate = new Date(p.expiration_date)
      return expDate >= today && expDate <= soon
    })
    setExpiringSoon(expiring)
  }, [products])

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl">
        <p className="text-gray-600 mb-2">No hay productos aún</p>
        <p className="text-sm text-gray-500">Sube una foto de tu compra para empezar</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Expiring Soon Alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="font-semibold text-red-700 mb-3">⚠️ Próximos a vencer ({expiringSoon.length})</p>
          <div className="space-y-2">
            {expiringSoon.map((product) => (
              <div key={product.id} className="text-sm text-red-600">
                <span className="font-medium">{product.name}</span> vence el{' '}
                {new Date(product.expiration_date!).toLocaleDateString('es-ES')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
