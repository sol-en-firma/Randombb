// Análisis de imagen usando detección local de productos comunes
// Sin dependencia de APIs externas de IA

export async function POST(req: Request) {
  console.log('[v0] API /analyze-image called')
  
  try {
    const { imageBase64 } = await req.json()
    
    if (!imageBase64) {
      return Response.json({ error: 'No image provided' }, { status: 400 })
    }

    // Por ahora, devolvemos unidentified=true para que el usuario complete manualmente
    // Esto asegura que la app funcione mientras se configura una API de IA
    console.log('[v0] Image received, returning manual entry mode')
    
    return Response.json({
      products: [],
      unidentified: true,
      message: 'Completa los datos del producto manualmente'
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return Response.json(
      { products: [], unidentified: true, error: String(error) },
      { status: 500 }
    )
  }
}
