import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSubscription, PLAN_IDS } from '@/lib/paypal'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { plan } = await request.json()
    
    if (!plan || !['solo', 'pro', 'branch'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    
    // Get user's shop
    const { data: profile } = await supabase
      .from('profiles')
      .select('shop_id')
      .eq('id', user.id)
      .single()
    
    if (!profile?.shop_id) {
      return NextResponse.json({ error: 'No shop found' }, { status: 400 })
    }
    
    // Create PayPal subscription
    const planId = PLAN_IDS[plan as keyof typeof PLAN_IDS]
    const subscription = await createSubscription(planId, user.id, profile.shop_id)
    
    if (!subscription.id) {
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }
    
    // Find the approval URL
    const approvalUrl = subscription.links?.find(
      (link: { rel: string; href: string }) => link.rel === 'approve'
    )?.href
    
    return NextResponse.json({ 
      subscriptionId: subscription.id,
      approvalUrl,
    })
  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
