'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
  }

  // Si la confirmación de email está deshabilitada, el usuario ya tiene sesión
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // Si requiere confirmación de email (no debería con la config correcta)
  revalidatePath('/', 'layout')
  redirect('/auth/sign-up-success')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/auth/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/auth/error')
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // Nota: Para reset de password, Supabase NECESITA una URL de redirect
  // porque envía un email con un link. Asegurate de agregar tu URL de producción
  // en Supabase Dashboard > Authentication > URL Configuration > Redirect URLs
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getBaseUrl()}/auth/callback?next=/auth/update-password`,
  })

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/reset-password-success')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/auth/update-password?error=mismatch')
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect('/auth/update-password?error=failed')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?message=password_updated')
}
