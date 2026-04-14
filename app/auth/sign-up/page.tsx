import { signUp } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SignUpPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {/* Logo/Title */}
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              🥬
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Fresco</h1>
            <p className="text-gray-600 text-sm">Tu asistente de cocina y stock</p>
          </div>

          {/* Sign Up Form */}
          <form action={signUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Crear Cuenta
            </button>
          </form>

          {/* Login link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-orange-600 font-semibold hover:text-orange-700">
                Ingresar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
