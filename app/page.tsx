import { redirect } from 'next/navigation'

export default async function HomePage() {
  redirect('/dashboard')

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="space-y-3">
          <div className="text-7xl">🥬</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Fresco
          </h1>
          <p className="text-gray-600 text-lg">Tu asistente de cocina y stock</p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex gap-3 items-start">
            <span className="text-2xl">📸</span>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Sube fotos de tu compra</p>
              <p className="text-sm text-gray-600">De tickets o productos</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <span className="text-2xl">⏰</span>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Alertas de vencimiento</p>
              <p className="text-sm text-gray-600">Notificaciones inteligentes</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <span className="text-2xl">🍳</span>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Recetas simples</p>
              <p className="text-sm text-gray-600">Con lo que tienes disponible</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-4">
          <Link
            href="/auth/sign-up"
            className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
          >
            Crear Cuenta
          </Link>
          <Link
            href="/auth/login"
            className="block w-full bg-white text-orange-600 font-semibold py-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-200 text-lg"
          >
            Ingresar
          </Link>
        </div>
      </div>
    </main>
  )
}
