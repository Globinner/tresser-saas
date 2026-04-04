import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookSignature, getSubscription } from '@/lib/paypal'

// Use service role for webhook handling
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    // Verify webhook signature
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    if (webhookId) {
      const isValid = await verifyWebhookSignature(headers, body, webhookId)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }
    
    const event = JSON.parse(body)
    const eventType = event.event_type
    const resource = event.resource
    
    console.log('PayPal webhook received:', eventType)
    
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.CREATED': {
        // Subscription activated - update shop
        const subscriptionId = resource.id
        const customData = JSON.parse(resource.custom_id || '{}')
        const { shopId } = customData
        
        // Get plan details from subscription
        const subscription = await getSubscription(subscriptionId)
        const planId = subscription.plan_id
        
        // Determine plan type from plan ID
        let planType = 'solo'
        if (planId?.includes('PRO')) planType = 'pro'
        if (planId?.includes('BRANCH')) planType = 'branch'
        
        // Update shop subscription
        await supabase
          .from('shops')
          .update({
            subscription_plan: planType,
            subscription_id: subscriptionId,
            subscription_status: 'active',
            subscription_start: new Date().toISOString(),
            subscription_end: null,
          })
          .eq('id', shopId)
        
        console.log(`Subscription activated for shop ${shopId}: ${planType}`)
        break
      }
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        // Subscription cancelled - downgrade shop
        const subscriptionId = resource.id
        
        // Find shop by subscription ID
        const { data: shop } = await supabase
          .from('shops')
          .select('id')
          .eq('subscription_id', subscriptionId)
          .single()
        
        if (shop) {
          await supabase
            .from('shops')
            .update({
              subscription_plan: 'free',
              subscription_status: 'cancelled',
              subscription_end: new Date().toISOString(),
            })
            .eq('id', shop.id)
          
          console.log(`Subscription cancelled for shop ${shop.id}`)
        }
        break
      }
      
      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        // Payment failed - mark as suspended
        const subscriptionId = resource.id
        
        const { data: shop } = await supabase
          .from('shops')
          .select('id')
          .eq('subscription_id', subscriptionId)
          .single()
        
        if (shop) {
          await supabase
            .from('shops')
            .update({
              subscription_status: 'suspended',
            })
            .eq('id', shop.id)
          
          console.log(`Subscription suspended for shop ${shop.id}`)
        }
        break
      }
      
      case 'PAYMENT.SALE.COMPLETED': {
        // Payment received - log transaction
        const amount = parseFloat(resource.amount?.total || '0')
        const subscriptionId = resource.billing_agreement_id
        
        const { data: shop } = await supabase
          .from('shops')
          .select('id')
          .eq('subscription_id', subscriptionId)
          .single()
        
        if (shop) {
          await supabase
            .from('subscription_payments')
            .insert({
              shop_id: shop.id,
              paypal_payment_id: resource.id,
              amount,
              currency: resource.amount?.currency || 'USD',
              status: 'completed',
            })
          
          console.log(`Payment recorded for shop ${shop.id}: $${amount}`)
        }
        break
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
