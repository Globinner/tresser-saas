import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Called when a subscription payment is made
export async function POST(request: Request) {
  const supabase = await createClient()
  const { shop_id, payment_amount, payment_id } = await request.json()

  // Check if this shop was referred
  const { data: signup } = await supabase
    .from("referral_signups")
    .select("*, referral_codes(*)")
    .eq("shop_id", shop_id)
    .single()

  if (!signup || !signup.referral_codes) {
    return NextResponse.json({ commission: false, reason: "No referral" })
  }

  const commission_percent = signup.referral_codes.commission_percent
  const commission_amount = (payment_amount * commission_percent) / 100

  // Record the commission
  const { data: commission, error } = await supabase
    .from("referral_commissions")
    .insert({
      referral_code_id: signup.referral_code_id,
      shop_id: shop_id,
      payment_amount: payment_amount,
      commission_percent: commission_percent,
      commission_amount: commission_amount,
      payment_reference: payment_id
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update total earnings for the referral code
  await supabase.rpc("update_referral_earnings", { 
    code_id: signup.referral_code_id, 
    amount: commission_amount 
  })

  return NextResponse.json({ 
    commission: true, 
    amount: commission_amount,
    id: commission.id
  })
}
