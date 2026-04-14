import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import NotificationItem from '@/components/notifications/notification-item'
import { DEMO_USER_ID } from '@/lib/demo'

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-2xl hover:scale-110 transition-transform">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-600">No hay notificaciones</p>
          </div>
        )}
      </div>
    </main>
  )
}
