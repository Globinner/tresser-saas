import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  
  // Get user's shop
  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_id, role")
    .eq("id", user.id)
    .single()
  
  if (!profile?.shop_id) {
    return NextResponse.json({ error: "No shop found" }, { status: 400 })
  }

  // Only owners can clear all data
  if (profile.role !== "owner") {
    return NextResponse.json({ error: "Only shop owners can clear data" }, { status: 403 })
  }
  
  const shopId = profile.shop_id
  
  try {
    // Clear data in order (respecting foreign keys)
    
    // 1. Clear sent_reminders
    await supabase
      .from("sent_reminders")
      .delete()
      .eq("shop_id", shopId)
    
    // 2. Clear transactions
    await supabase
      .from("transactions")
      .delete()
      .eq("shop_id", shopId)
    
    // 3. Clear appointments
    await supabase
      .from("appointments")
      .delete()
      .eq("shop_id", shopId)
    
    // 4. Clear walk_in_queue
    await supabase
      .from("walk_in_queue")
      .delete()
      .eq("shop_id", shopId)
    
    // 5. Clear client_chemistry
    await supabase
      .from("client_chemistry")
      .delete()
      .eq("shop_id", shopId)
    
    // 6. Clear client_photos
    await supabase
      .from("client_photos")
      .delete()
      .eq("shop_id", shopId)
    
    // 7. Clear clients
    await supabase
      .from("clients")
      .delete()
      .eq("shop_id", shopId)
    
    // 8. Clear inventory_transactions
    await supabase
      .from("inventory_transactions")
      .delete()
      .eq("shop_id", shopId)
    
    // 9. Clear inventory_items
    await supabase
      .from("inventory_items")
      .delete()
      .eq("shop_id", shopId)
    
    // 10. Clear inventory_categories
    await supabase
      .from("inventory_categories")
      .delete()
      .eq("shop_id", shopId)
    
    // 11. Clear services
    await supabase
      .from("services")
      .delete()
      .eq("shop_id", shopId)
    
    return NextResponse.json({ 
      success: true, 
      message: "All data has been cleared successfully"
    })
    
  } catch (error) {
    console.error("Clear error:", error)
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 })
  }
}
