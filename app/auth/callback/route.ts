import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('[v0] Auth callback - code:', code ? 'present' : 'missing', 'next:', next)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('[v0] Exchange code error:', error)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  console.log('[v0] Redirect to error page')
  return NextResponse.redirect(`${origin}/auth/error`)
}
