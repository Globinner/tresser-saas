// PayPal Configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Plan IDs - create these in PayPal dashboard
export const PLAN_IDS = {
  solo: process.env.PAYPAL_PLAN_SOLO || 'P-SOLO-PLAN-ID',
  pro: process.env.PAYPAL_PLAN_PRO || 'P-PRO-PLAN-ID',
  branch: process.env.PAYPAL_PLAN_BRANCH || 'P-BRANCH-PLAN-ID',
}

export const PLAN_PRICES = {
  solo: 22,
  pro: 29,
  branch: 49,
}

// Get PayPal access token
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  
  const data = await response.json()
  return data.access_token
}

// Create a subscription
export async function createSubscription(planId: string, userId: string, shopId: string) {
  const accessToken = await getAccessToken()
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `sub-${userId}-${Date.now()}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: JSON.stringify({ userId, shopId }),
      application_context: {
        brand_name: 'Tresser',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      },
    }),
  })
  
  const data = await response.json()
  return data
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  const accessToken = await getAccessToken()
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  
  return response.json()
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string, reason: string) {
  const accessToken = await getAccessToken()
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  })
  
  return response.ok
}

// Verify webhook signature
export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string,
  webhookId: string
): Promise<boolean> {
  const accessToken = await getAccessToken()
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  })
  
  const data = await response.json()
  return data.verification_status === 'SUCCESS'
}
