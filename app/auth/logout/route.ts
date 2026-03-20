import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const supabase = await createClient()
  
  // Sign out and clear all session data
  await supabase.auth.signOut()
  
  // Redirect to login page
  return NextResponse.redirect(`${origin}/auth/login`)
}

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url)
  const supabase = await createClient()
  
  // Sign out and clear all session data
  await supabase.auth.signOut()
  
  // Redirect to login page
  return NextResponse.redirect(`${origin}/auth/login`)
}
