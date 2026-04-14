'use client'

import { useState, useRef } from 'react'
import { uploadImageToBlob, saveProducts } from '@/app/actions/upload'

interface DetectedProduct {
  name: string
  category: string
  quantity: number
  unit: string
  expirationDate: string
}

// Comprimir imagen antes de subir
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.size < 500000) {
      resolve(file)
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

type Step = 'idle' | 'preview' | 'analyzing' | 'editing' | 'saving' | 'success'

export default function PhotoUpload() {
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [detectedProducts, setDetectedProducts] = useState<DetectedProduct[]>([])
  const [blobPathname, setBlobPathname] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    
    // Comprimir y crear preview
    const processedFile = await compressImage(file)
    setSelectedFile(processedFile)
    setPreviewUrl(URL.createObjectURL(processedFile))
    setStep('preview')
  }

  const handleCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedFile(null)
    setDetectedProducts([])
    setBlobPathname(null)
    setStep('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return

    setStep('analyzing')
    setError(null)

    try {
      // 1. Convertir a base64 para la API de análisis
      const arrayBuffer = await selectedFile.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      const mimeType = selectedFile.type || 'image/jpeg'

      // 2. Subir a Blob en paralelo con el análisis
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const [blobResult, analysisResponse] = await Promise.all([
        uploadImageToBlob(formData),
        fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
        })
      ])

      if (blobResult.error) {
        setError(blobResult.error)
        setStep('preview')
        return
      }

      setBlobPathname(blobResult.blobPathname || null)
      
      // 3. Procesar resultado del análisis
      const analysisResult = await analysisResponse.json()
      
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 7)
      const defaultExpDate = defaultDate.toISOString().split('T')[0]
      
      if (analysisResult.products && analysisResult.products.length > 0) {
        setDetectedProducts(analysisResult.products.map((p: DetectedProduct) => ({
          name: p.name || '',
          category: p.category || 'otros',
          quantity: p.quantity || 1,
          unit: p.unit || 'unidad',
          expirationDate: p.expirationDate || defaultExpDate,
        })))
        setStep('editing')
      } else {
        // No se identificaron productos - formulario manual
        setDetectedProducts([{
          name: '',
          category: 'otros',
          quantity: 1,
          unit: 'unidad',
          expirationDate: defaultExpDate,
        }])
        if (analysisResult.unidentified) {
          setError('No pudimos identificar el producto. Por favor, completa los datos manualmente.')
        }
        setStep('editing')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Error al analizar: ${errorMessage}`)
      setStep('preview')
    }
  }

  const handleProductChange = (index: number, field: keyof DetectedProduct, value: string | number) => {
    setDetectedProducts(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddProduct = () => {
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 7)
    setDetectedProducts(prev => [...prev, {
      name: '',
      category: 'otros',
      quantity: 1,
      unit: 'unidad',
      expirationDate: defaultDate.toISOString().split('T')[0],
    }])
  }

  const handleRemoveProduct = (index: number) => {
    setDetectedProducts(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveProducts = async () => {
    if (!blobPathname || detectedProducts.length === 0) return

    // Validar que todos tengan nombre
    const validProducts = detectedProducts.filter(p => p.name.trim())
    if (validProducts.length === 0) {
      setError('Agrega al menos un producto con nombre')
      return
    }

    setStep('saving')
    setError(null)

    try {
      const result = await saveProducts(validProducts, blobPathname)

      if (result.error) {
        setError(result.error)
        setStep('editing')
        return
      }

      setStep('success')
      setTimeout(() => {
        handleCancel()
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Error al guardar: ${errorMessage}`)
      setStep('editing')
    }
  }

  const categories = [
    { value: 'verduras', label: 'Verduras' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'lacteos', label: 'Lacteos' },
    { value: 'carnes', label: 'Carnes' },
    { value: 'granos', label: 'Granos' },
    { value: 'condimentos', label: 'Condimentos' },
    { value: 'otros', label: 'Otros' },
  ]

  // Estado inicial - seleccionar foto
  if (step === 'idle') {
    return (
      <div className="bg-white rounded-3xl border-2 border-dashed border-orange-300 hover:border-orange-500 p-6 text-center transition-all">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-input"
        />
        <label htmlFor="photo-input" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl md:text-5xl">📸</div>
            <div>
              <p className="font-bold text-gray-800 text-base md:text-lg mb-1">Sube una foto</p>
              <p className="text-xs md:text-sm text-gray-600">De tu ticket o productos</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                fileInputRef.current?.click()
              }}
              className="mt-3 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              Elegir Foto
            </button>
          </div>
        </label>
      </div>
    )
  }

  // Preview de la imagen
  if (step === 'preview') {
    return (
      <div className="bg-white rounded-3xl border-2 border-orange-300 p-4 transition-all">
        <p className="text-sm font-medium text-gray-700 mb-3 text-center">Vista previa</p>
        
        {previewUrl && (
          <div className="relative mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        )}

        {error && (
          <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleUploadAndAnalyze}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
          >
            Analizar
          </button>
        </div>
      </div>
    )
  }

  // Analizando con IA
  if (step === 'analyzing') {
    return (
      <div className="bg-white rounded-3xl border-2 border-blue-300 bg-blue-50 p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl animate-pulse">🤖</div>
          <div>
            <p className="font-bold text-gray-800">Analizando imagen...</p>
            <p className="text-sm text-gray-600">La IA esta detectando productos</p>
          </div>
          <div className="flex gap-1 mt-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Editor de productos detectados
  if (step === 'editing') {
    const hasDetectedProducts = detectedProducts.some(p => p.name.trim() !== '')
    
    return (
      <div className="bg-white rounded-3xl border-2 border-orange-300 p-4 transition-all">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">
            {hasDetectedProducts ? 'Productos detectados' : 'Agregar producto'}
          </p>
          <button
            onClick={handleAddProduct}
            className="text-xs text-orange-600 font-medium hover:text-orange-700"
          >
            + Agregar otro
          </button>
        </div>
        
        {hasDetectedProducts && (
          <p className="text-xs text-gray-500 mb-3">
            Verifica los datos detectados y modifica si es necesario
          </p>
        )}

        {previewUrl && (
          <div className="mb-3">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-24 object-cover rounded-lg opacity-60"
            />
          </div>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {detectedProducts.map((product, index) => (
            <div key={index} className="bg-orange-50 rounded-xl p-3 relative">
              <button
                onClick={() => handleRemoveProduct(index)}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xs hover:bg-red-200"
              >
                x
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    placeholder="Nombre del producto"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <select
                  value={product.category}
                  onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                  className="px-2 py-2 text-sm rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>

                <div className="flex gap-1">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-16 px-2 py-2 text-sm rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    value={product.unit}
                    onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                    placeholder="unidad"
                    className="flex-1 px-2 py-2 text-sm rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Vence</label>
                  <input
                    type="date"
                    value={product.expirationDate}
                    onChange={(e) => handleProductChange(index, 'expirationDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveProducts}
            disabled={detectedProducts.length === 0}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    )
  }

  // Guardando
  if (step === 'saving') {
    return (
      <div className="bg-white rounded-3xl border-2 border-blue-300 bg-blue-50 p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl">💾</div>
          <p className="font-bold text-gray-800">Guardando productos...</p>
        </div>
      </div>
    )
  }

  // Exito
  if (step === 'success') {
    return (
      <div className="bg-white rounded-3xl border-2 border-green-300 bg-green-50 p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl">✅</div>
          <p className="font-bold text-gray-800">Productos guardados</p>
        </div>
      </div>
    )
  }

  return null
}
