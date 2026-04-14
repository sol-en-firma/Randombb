'use server'

import { createClient } from '@/lib/supabase/server'
import { DEMO_USER_ID } from '@/lib/demo'

export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', DEMO_USER_ID)

    if (error) {
      return { error: 'Error al actualizar notificación' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { error: 'Error al procesar' }
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', DEMO_USER_ID)

    if (error) {
      return { error: 'Error al eliminar notificación' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { error: 'Error al procesar' }
  }
}

export async function generateExpirationNotifications() {
  try {
    const supabase = await createClient()

    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    const { data: expiringProducts } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', DEMO_USER_ID)
      .gte('expiration_date', today.toISOString().split('T')[0])
      .lte('expiration_date', tomorrow.toISOString().split('T')[0])
      .eq('opened', false)

    if (!expiringProducts || expiringProducts.length === 0) {
      return { success: true, created: 0 }
    }

    let notificationsCreated = 0

    for (const product of expiringProducts) {
      const isToday = product.expiration_date === today.toISOString().split('T')[0]
      const message = isToday
        ? `"${product.name}" vence hoy. Usalo pronto.`
        : `"${product.name}" vence mañana.`

      const { error } = await supabase.from('notifications').insert({
        user_id: DEMO_USER_ID,
        product_id: product.id,
        type: 'expiration_warning',
        message,
        scheduled_for: new Date().toISOString(),
      })

      if (!error) notificationsCreated++
    }

    return { success: true, created: notificationsCreated }
  } catch (error) {
    console.error('Error generating expiration notifications:', error)
    return { error: 'Error al generar notificaciones' }
  }
}
