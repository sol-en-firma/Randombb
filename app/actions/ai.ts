'use server'

import { generateText } from 'ai'
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  quantity: z.number(),
  unit: z.string().optional(),
  expirationDate: z.string().optional(),
})

const ExtractedProductsSchema = z.object({
  products: z.array(ProductSchema),
  unidentified: z.boolean().optional(),
})

export interface AnalysisResult {
  products: z.infer<typeof ProductSchema>[]
  unidentified: boolean
}

// Funcion principal que recibe base64 directamente
export async function analyzeImageWithAI(base64: string, mimeType: string): Promise<AnalysisResult> {
  console.log('[v0] analyzeImageWithAI called, base64 length:', base64.length)
  
  try {
    const imageMediaType = (mimeType || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    // Get today's date for expiration calculations
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // Calculate example dates
    const addDays = (days: number) => {
      const d = new Date(today)
      d.setDate(d.getDate() + days)
      return d.toISOString().split('T')[0]
    }

    console.log('[v0] Calling Gemini for image analysis...')
    const result = await generateText({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: `data:${imageMediaType};base64,${base64}`,
            },
            {
              type: 'text',
              text: `Eres un experto en identificar alimentos. Mira esta imagen y detecta los productos.

FECHA DE HOY: ${todayStr}

INSTRUCCIONES:
1. Si es un TICKET de compra: lee el texto y extrae los nombres de productos
2. Si es una FOTO de alimentos: identifica visualmente cada producto por su forma, color y textura

VENCIMIENTOS ESTIMADOS:
- Verduras de hoja: ${addDays(5)}
- Verduras firmes: ${addDays(14)}
- Frutas blandas: ${addDays(5)}
- Citricos: ${addDays(14)}
- Lacteos: ${addDays(7)}
- Carnes: ${addDays(3)}
- Pan: ${addDays(4)}
- Huevos: ${addDays(21)}

Responde SOLO con este JSON (sin texto adicional):
{"products":[{"name":"Nombre","category":"verduras|frutas|lacteos|carnes|panaderia|huevos|bebidas|otros","quantity":1,"unit":"unidad","expirationDate":"YYYY-MM-DD"}],"unidentified":false}

Si no puedes identificar alimentos: {"products":[],"unidentified":true}`,
            },
          ],
        },
      ],
    })

    console.log('[v0] AI Response received')
    console.log('[v0] AI Raw response:', result.text)

    // Parse the response
    const text = result.text.trim()
    // Extract JSON from response if wrapped in markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[v0] No JSON found in response:', text)
      return { products: [], unidentified: true }
    }

    const parsed = JSON.parse(jsonMatch[0])
    console.log('[v0] Parsed JSON:', parsed)
    
    const validated = ExtractedProductsSchema.parse(parsed)
    console.log('[v0] Validated products:', validated.products.length)
    
    return {
      products: validated.products,
      unidentified: validated.unidentified || false
    }
  } catch (error) {
    console.error('[v0] AI analysis error:', error)
    console.error('[v0] Error stack:', error instanceof Error ? error.stack : String(error))
    return { products: [], unidentified: true }
  }
}

export async function generateRecipeSuggestionsWithAI(productNames: string[]) {
  try {
    const result = await generateText({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Tengo estos productos en mi cocina: ${productNames.join(', ')}
          
Por favor sugiere 3 recetas SIMPLES que pueda hacer con estos productos. Para cada receta incluye:
- Nombre de la receta
- Ingredientes de la lista que necesita
- Pasos breves (máximo 5 pasos)
- Tiempo de preparación estimado

Responde en formato JSON válido:
{
  "recipes": [
    {
      "name": "Nombre",
      "ingredients": ["ingrediente1", "ingrediente2"],
      "steps": ["paso1", "paso2"],
      "prepTime": "30 minutos"
    }
  ]
}`,
        },
      ],
    })

    const text = result.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []

    const parsed = JSON.parse(jsonMatch[0])
    return parsed.recipes || []
  } catch (error) {
    console.error('Recipe generation error:', error)
    return []
  }
}
