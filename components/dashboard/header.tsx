interface HeaderProps {
  notificationsCount: number
}

export default function Header({ notificationsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🥬</div>
          <div>
            <h1 className="font-bold text-gray-800">Fresco</h1>
            <p className="text-xs text-gray-500">Tu asistente de cocina</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notificationsCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            Modo Demo
          </span>
        </div>
      </div>
    </header>
  )
}
