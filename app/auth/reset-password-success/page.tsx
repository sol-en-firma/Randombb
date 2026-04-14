import Link from 'next/link'

export default function ResetPasswordSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Revisa tu email</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Te enviamos un link para restablecer tu contraseña. Puede tardar unos minutos en llegar. Revisá también la carpeta de spam.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </main>
  )
}
