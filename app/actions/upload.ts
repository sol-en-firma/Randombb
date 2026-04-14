'use server'

import { createClient } from '@/lib/supabase/server'
import { put } from '@vercel/blob'
import { DEMO_USER_ID } from '@/lib/demo'

interface DetectedProduct {
  name: string
  category: string
  quantity: number
  unit: string
  expirationDate: string
}

// Paso 1: Subir imagen a Blob (el análisis lo hace el cliente via API)
export async function uploadImageToBlob(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { error: 'No se encontró archivo' }
    }
    
    if (!(file instanceof File)) {
      return { error: 'El archivo no es válido' }
    }

    // Subir a Vercel Blob
    const blob = await put(file.name, file, {
      access: 'private',
      addRandomSuffix: true,
    })

    return { 
      success: true, 
      blobPathname: blob.pathname,
      blobUrl: blob.url,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
    return { error: `Error subiendo imagen: ${errorMsg}` }
  }
}

// Paso 2: Guardar los productos editados por el usuario
export async function saveProducts(products: DetectedProduct[], blobPathname: string) {
  try {
    const supabase = await createClient()

    // Guardar registro de compra
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: DEMO_USER_ID,
        image_url: blobPathname,
        purchase_date: new Date().toISOString().split('T')[0],
        processed: true,
      })
      .select()
      .single()

    if (purchaseError) {
      return { error: `Error al guardar compra: ${purchaseError.message}` }
    }

    // Insertar productos
    const productsData = products.map((p) => ({
      user_id: DEMO_USER_ID,
      name: p.name,
      category: p.category,
      quantity: p.quantity,
      unit: p.unit || 'unidad',
      purchase_date: new Date().toISOString().split('T')[0],
      expiration_date: p.expirationDate || null,
      image_url: blobPathname,
    }))

    const { error: insertError } = await supabase.from('products').insert(productsData)
    if (insertError) {
      return { error: `Error al guardar productos: ${insertError.message}` }
    }

    return { success: true, purchaseId: purchase.id }
  } catch (error) {
    console.error('Save error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
    return { error: `Error al guardar: ${errorMsg}` }
  }
}

// Funcion auxiliar para fecha de vencimiento por defecto (7 dias)
function getDefaultExpirationDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString().split('T')[0]
}

// Mantener la funcion original para compatibilidad
export async function uploadPhoto(formData: FormData) {
  const result = await uploadAndAnalyzePhoto(formData)
  
  if (result.error || !result.blobPathname) {
    return result
  }

  // Si hay productos, guardarlos directamente
  if (result.products && result.products.length > 0) {
    return saveProducts(result.products, result.blobPathname)
  }

  // Si no hay productos, crear uno generico
  const defaultProduct: DetectedProduct = {
    name: 'Producto',
    category: 'otros',
    quantity: 1,
    unit: 'unidad',
    expirationDate: getDefaultExpirationDate(),
  }

  return saveProducts([defaultProduct], result.blobPathname)
}
