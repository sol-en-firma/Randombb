import Link from 'next/link'

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  const errorMessages: Record<string, string> = {
    user_already_exists: 'Este email ya está registrado. Intenta ingresar.',
    invalid_credentials: 'Email o contraseña incorrectos.',
    invalid_email: 'Por favor ingresa un email válido.',
    weak_password: 'La contraseña debe tener al menos 6 caracteres.',
    email_not_confirmed: 'Por favor confirma tu email antes de ingresar.',
    rate_limit: 'Demasiados intentos. Intenta de nuevo en unos minutos.',
  }

  const errorCode = params?.error
  const errorMessage = errorCode && errorMessages[errorCode] ? errorMessages[errorCode] : 'Algo salió mal. Por favor intenta de nuevo.'

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {/* Error Icon */}
          <div className="text-center space-y-3">
            <div className="text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800">Oops</h1>
            <p className="text-gray-600">{errorMessage}</p>
          </div>

          {/* Error Details */}
          {errorCode && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-600">
                <span className="font-semibold">Código:</span> {errorCode}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/auth/sign-up"
              className="block w-full text-center bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Crear Cuenta
            </Link>
            <Link
              href="/auth/login"
              className="block w-full text-center bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
