import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { code } = await request.json()

  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("referral_codes")
    .select("id, code, owner_name, commission_percent, is_active")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single()

  if (error || !data) {
    return NextResponse.json({ valid: false, error: "Invalid referral code" }, { status: 404 })
  }

  return NextResponse.json({ 
    valid: true, 
    code: data.code,
    owner_name: data.owner_name,
    commission_percent: data.commission_percent
  })
}
