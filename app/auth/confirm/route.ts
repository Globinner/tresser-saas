import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Get the user to set up their profile and shop
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has a profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, shop_id')
          .eq('id', user.id)
          .single()
        
        // If no profile exists, create one with the shop
        if (!profile) {
          const fullName = user.user_metadata?.full_name || ''
          const shopName = user.user_metadata?.shop_name || 'My Shop'
          const [firstName, ...lastNameParts] = fullName.split(' ')
          const lastName = lastNameParts.join(' ')
          
          // Create shop first
          const { data: shop, error: shopError } = await supabase
            .from('shops')
            .insert({
              name: shopName,
              owner_id: user.id,
              slug: shopName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              booking_slug: `${shopName.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`,
            })
            .select()
            .single()
          
          if (!shopError && shop) {
            // Create profile linked to shop
            await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: firstName || 'User',
                last_name: lastName || '',
                shop_id: shop.id,
                role: 'owner',
                is_active: true,
              })
          }
        }
      }
      
      // Redirect user to specified redirect URL or dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirect to error page if verification fails
  return NextResponse.redirect(`${origin}/auth/error?message=Email verification failed`)
}
