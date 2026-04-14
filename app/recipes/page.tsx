'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateRecipeSuggestionsWithAI } from '@/app/actions/ai'
import Link from 'next/link'
import { DEMO_USER_ID } from '@/lib/demo'

interface Recipe {
  name: string
  ingredients: string[]
  steps: string[]
  prepTime: string
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productsCount, setProductsCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data: products } = await supabase
        .from('products')
        .select('name')
        .eq('user_id', DEMO_USER_ID)
        .eq('opened', false)
        .limit(15)

      if (!products || products.length === 0) {
        setRecipes([])
        setProductsCount(0)
        return
      }

      setProductsCount(products.length)
      const productNames = products.map((p) => p.name)
      const generatedRecipes = await generateRecipeSuggestionsWithAI(productNames)
      setRecipes(generatedRecipes)
    } catch (error) {
      console.error('Error loading recipes:', error)
      setError('Error al generar recetas. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-2xl hover:scale-110 transition-transform">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Recetas Sugeridas</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Info Banner */}
        {productsCount > 0 && !isLoading && (
          <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-orange-900">
              Recetas basadas en tus {productsCount} producto(s) disponible{productsCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🍳</div>
            <p className="text-gray-600 font-medium mb-2">Generando recetas...</p>
            <p className="text-sm text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button
              onClick={loadRecipes}
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : recipes.length > 0 ? (
          <div className="space-y-4">
            {recipes.map((recipe, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h2 className="text-lg font-bold text-gray-800 flex-1">🍳 {recipe.name}</h2>
                  <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0">
                    ⏱️ {recipe.prepTime}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 text-sm mb-2">Ingredientes:</h3>
                    <ul className="space-y-1">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="text-orange-500 font-bold">✓</span> {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 text-sm mb-2">Pasos:</h3>
                    <ol className="space-y-2">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-3">
                          <span className="font-semibold text-orange-500 flex-shrink-0">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-orange-100">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-gray-600 font-medium mb-2">No hay productos disponibles</p>
            <p className="text-sm text-gray-500 mb-4">Sube una foto de tu compra para obtener recetas</p>
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Ir al Dashboard
            </Link>
          </div>
        )}

        <button
          onClick={loadRecipes}
          disabled={isLoading}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-95"
        >
          {isLoading ? '⏳ Generando...' : '🔄 Actualizar Recetas'}
        </button>
      </div>
    </main>
  )
}
