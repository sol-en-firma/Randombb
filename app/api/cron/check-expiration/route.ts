import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// This route should be called by a cron job service (e.g., Vercel Cron)
// Configure in vercel.json with a cron expression
export async function GET(request: NextRequest) {
  // Verify the request is coming from Vercel's cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Get all users with products
    const { data: users } = await supabase
      .from('products')
      .select('user_id')
      .neq('expiration_date', null)
      .distinct()

    if (!users || users.length === 0) {
      return NextResponse.json({ success: true, notificationsCreated: 0 })
    }

    const userIds = users.map((u) => u.user_id)

    let notificationsCreated = 0

    // For each user
    for (const userId of userIds) {
      const today = new Date()
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      // Get products expiring today or tomorrow
      const { data: expiringProducts } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .gte('expiration_date', today.toISOString().split('T')[0])
        .lte('expiration_date', tomorrow.toISOString().split('T')[0])
        .eq('opened', false)

      // Create notification for products expiring today/tomorrow
      if (expiringProducts && expiringProducts.length > 0) {
        for (const product of expiringProducts) {
          const { error } = await supabase.from('notifications').insert({
            user_id: userId,
            product_id: product.id,
            type: 'expiration_warning',
            message: `⚠️ "${product.name}" vence ${product.expiration_date === today.toISOString().split('T')[0] ? 'hoy' : 'mañana'}. ¡Úsalo pronto!`,
            scheduled_for: new Date().toISOString(),
          })

          if (!error) notificationsCreated++
        }
      }

      // Check for unopened products (send weekly reminder)
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const { data: unopenedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .eq('opened', false)
        .gte('purchase_date', lastWeek.toISOString().split('T')[0])
        .lte('purchase_date', today.toISOString().split('T')[0])
        .gte('expiration_date', today.toISOString().split('T')[0])

      if (unopenedProducts && unopenedProducts.length > 0) {
        const { error } = await supabase.from('notifications').insert({
          user_id: userId,
          type: 'opened_check',
          message: `🔓 ¿Ya abriste los ${unopenedProducts.length} producto(s) que compraste esta semana?`,
          scheduled_for: new Date().toISOString(),
        })

        if (!error) notificationsCreated++
      }
    }

    return NextResponse.json({ success: true, notificationsCreated, usersProcessed: userIds.length })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
