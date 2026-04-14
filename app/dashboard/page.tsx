import { createClient } from '@/lib/supabase/server'
import Header from '@/components/dashboard/header'
import PhotoUpload from '@/components/dashboard/photo-upload'
import ProductsList from '@/components/dashboard/products-list'
import QuickStats from '@/components/dashboard/quick-stats'
import { DEMO_USER_ID } from '@/lib/demo'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch products for demo user
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .order('expiration_date', { ascending: true })

  // Fetch unread notifications for demo user
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .eq('read', false)

  // Calculate stats
  const expiringCount = products?.filter((p) => {
    if (!p.expiration_date) return false
    const today = new Date()
    const soon = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const expDate = new Date(p.expiration_date)
    return expDate >= today && expDate <= soon && !p.opened
  }).length || 0

  const openedCount = products?.filter((p) => p.opened).length || 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white">
      {/* Header */}
      <Header notificationsCount={notifications?.length || 0} />

      {/* Content */}
      <div className="p-4 pb-24 max-w-2xl mx-auto space-y-6">
        {/* Quick Stats */}
        <QuickStats totalProducts={products?.length || 0} expiringCount={expiringCount} openedCount={openedCount} />

        {/* Photo Upload */}
        <PhotoUpload />

        {/* Products List */}
        {products && products.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 px-2">Tus Productos</h2>
            <ProductsList initialProducts={products} />
          </div>
        )}
      </div>
    </main>
  )
}
