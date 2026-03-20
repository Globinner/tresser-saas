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
    .select("shop_id")
    .eq("id", user.id)
    .single()
  
  if (!profile?.shop_id) {
    return NextResponse.json({ error: "No shop found. Complete onboarding first." }, { status: 400 })
  }
  
  const shopId = profile.shop_id
  
  try {
    // 1. Insert demo clients
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .upsert([
        {
          shop_id: shopId,
          first_name: "Marcus",
          last_name: "Johnson",
          email: "marcus.johnson@example.com",
          phone: "+1-555-0101",
          total_visits: 12,
          total_spent: 420.00,
          notes: "Prefers fade cuts, regular every 2 weeks"
        },
        {
          shop_id: shopId,
          first_name: "David",
          last_name: "Chen",
          email: "david.chen@example.com",
          phone: "+1-555-0102",
          total_visits: 8,
          total_spent: 280.00,
          notes: "Allergic to certain hair products"
        },
        {
          shop_id: shopId,
          first_name: "Alex",
          last_name: "Thompson",
          email: "alex.thompson@example.com",
          phone: "+1-555-0103",
          total_visits: 15,
          total_spent: 650.00,
          notes: "Regular color treatments, prefers natural look"
        },
        {
          shop_id: shopId,
          first_name: "James",
          last_name: "Williams",
          email: "james.williams@example.com",
          phone: "+1-555-0104",
          total_visits: 5,
          total_spent: 125.00,
          notes: "New client, likes classic cuts"
        },
        {
          shop_id: shopId,
          first_name: "Michael",
          last_name: "Rodriguez",
          email: "michael.rodriguez@example.com",
          phone: "+1-555-0105",
          total_visits: 20,
          total_spent: 800.00,
          notes: "VIP client, always tips well"
        }
      ], { onConflict: 'email' })
      .select()
    
    if (clientsError) {
      console.error("Clients error:", clientsError)
    }
    
    // 2. Insert demo services
    const { error: servicesError } = await supabase
      .from("services")
      .upsert([
        { shop_id: shopId, name: "Classic Haircut", price: 25.00, duration_minutes: 30, category: "Haircuts", is_active: true, description: "Traditional haircut with scissors and clippers" },
        { shop_id: shopId, name: "Fade", price: 30.00, duration_minutes: 45, category: "Haircuts", is_active: true, description: "Skin fade or low/mid/high fade" },
        { shop_id: shopId, name: "Buzz Cut", price: 20.00, duration_minutes: 20, category: "Haircuts", is_active: true, description: "All-over clipper cut" },
        { shop_id: shopId, name: "Kids Cut", price: 18.00, duration_minutes: 25, category: "Haircuts", is_active: true, description: "Haircut for children under 12" },
        { shop_id: shopId, name: "Beard Trim", price: 15.00, duration_minutes: 15, category: "Beard", is_active: true, description: "Shape and trim beard" },
        { shop_id: shopId, name: "Hot Towel Shave", price: 25.00, duration_minutes: 30, category: "Beard", is_active: true, description: "Traditional straight razor shave with hot towel" },
        { shop_id: shopId, name: "Hair Color", price: 60.00, duration_minutes: 90, category: "Color", is_active: true, description: "Full head color treatment" },
        { shop_id: shopId, name: "Highlights", price: 80.00, duration_minutes: 120, category: "Color", is_active: true, description: "Partial or full highlights" },
        { shop_id: shopId, name: "Hair & Beard Combo", price: 40.00, duration_minutes: 50, category: "Combos", is_active: true, description: "Haircut plus beard trim" }
      ], { onConflict: 'name,shop_id', ignoreDuplicates: true })
    
    if (servicesError) {
      console.error("Services error:", servicesError)
    }
    
    // 3. Insert inventory categories
    const { data: categories, error: catError } = await supabase
      .from("inventory_categories")
      .upsert([
        { shop_id: shopId, name: "Hair Products" },
        { shop_id: shopId, name: "Beard Products" },
        { shop_id: shopId, name: "Color & Chemicals" },
        { shop_id: shopId, name: "Tools & Equipment" },
        { shop_id: shopId, name: "Consumables" }
      ], { onConflict: 'name,shop_id', ignoreDuplicates: true })
      .select()
    
    if (catError) {
      console.error("Categories error:", catError)
    }
    
    // Get categories for inventory items
    const { data: allCategories } = await supabase
      .from("inventory_categories")
      .select("id, name")
      .eq("shop_id", shopId)
    
    const categoryMap = allCategories?.reduce((acc: Record<string, string>, cat) => {
      acc[cat.name] = cat.id
      return acc
    }, {}) || {}
    
    // 4. Insert inventory items
    if (Object.keys(categoryMap).length > 0) {
      const { error: invError } = await supabase
        .from("inventory_items")
        .upsert([
          { shop_id: shopId, category_id: categoryMap["Hair Products"], name: "Pomade - Strong Hold", brand: "Suavecito", sku: "HP-001", quantity_in_stock: 24, reorder_level: 10, cost_per_unit: 8.00, sell_price: 18.00, unit: "jar" },
          { shop_id: shopId, category_id: categoryMap["Hair Products"], name: "Hair Gel - Medium Hold", brand: "Got2b", sku: "HP-002", quantity_in_stock: 18, reorder_level: 8, cost_per_unit: 5.00, sell_price: 12.00, unit: "bottle" },
          { shop_id: shopId, category_id: categoryMap["Hair Products"], name: "Shampoo - Daily Use", brand: "American Crew", sku: "HP-003", quantity_in_stock: 30, reorder_level: 12, cost_per_unit: 10.00, sell_price: 22.00, unit: "bottle" },
          { shop_id: shopId, category_id: categoryMap["Beard Products"], name: "Beard Oil", brand: "Honest Amish", sku: "BP-001", quantity_in_stock: 15, reorder_level: 6, cost_per_unit: 12.00, sell_price: 25.00, unit: "bottle" },
          { shop_id: shopId, category_id: categoryMap["Beard Products"], name: "Beard Balm", brand: "Honest Amish", sku: "BP-002", quantity_in_stock: 12, reorder_level: 5, cost_per_unit: 10.00, sell_price: 20.00, unit: "tin" },
          { shop_id: shopId, category_id: categoryMap["Color & Chemicals"], name: "Hair Color - Black", brand: "Wella", sku: "CC-001", quantity_in_stock: 8, reorder_level: 4, cost_per_unit: 15.00, sell_price: 0.00, unit: "tube" },
          { shop_id: shopId, category_id: categoryMap["Color & Chemicals"], name: "Developer 20 Vol", brand: "Wella", sku: "CC-002", quantity_in_stock: 6, reorder_level: 3, cost_per_unit: 8.00, sell_price: 0.00, unit: "bottle" },
          { shop_id: shopId, category_id: categoryMap["Tools & Equipment"], name: "Clipper Blades", brand: "Andis", sku: "TE-001", quantity_in_stock: 4, reorder_level: 2, cost_per_unit: 25.00, sell_price: 0.00, unit: "set" },
          { shop_id: shopId, category_id: categoryMap["Consumables"], name: "Neck Strips", brand: "Generic", sku: "CS-001", quantity_in_stock: 500, reorder_level: 100, cost_per_unit: 0.02, sell_price: 0.00, unit: "strip" },
          { shop_id: shopId, category_id: categoryMap["Consumables"], name: "Disposable Capes", brand: "Generic", sku: "CS-002", quantity_in_stock: 200, reorder_level: 50, cost_per_unit: 0.15, sell_price: 0.00, unit: "cape" }
        ], { onConflict: 'sku,shop_id', ignoreDuplicates: true })
      
      if (invError) {
        console.error("Inventory error:", invError)
      }
    }
    
    // 5. Insert walk-in queue entries
    const today = new Date().toISOString().split('T')[0]
    const { error: queueError } = await supabase
      .from("walk_in_queue")
      .insert([
        { shop_id: shopId, client_name: "John Smith", client_phone: "+1-555-1001", service_requested: "Fade", position: 1, status: "waiting", estimated_wait_minutes: 15, checked_in_at: new Date().toISOString() },
        { shop_id: shopId, client_name: "Robert Brown", client_phone: "+1-555-1002", service_requested: "Beard Trim", position: 2, status: "waiting", estimated_wait_minutes: 30, checked_in_at: new Date().toISOString() },
        { shop_id: shopId, client_name: "Chris Davis", client_phone: "+1-555-1003", service_requested: "Classic Haircut", position: 3, status: "waiting", estimated_wait_minutes: 45, checked_in_at: new Date().toISOString() }
      ])
    
    if (queueError) {
      console.error("Queue error:", queueError)
    }
    
    // 6. Insert appointments for today
    const { data: services } = await supabase
      .from("services")
      .select("id, name")
      .eq("shop_id", shopId)
      .limit(5)
    
    const { data: clientsList } = await supabase
      .from("clients")
      .select("id, first_name")
      .eq("shop_id", shopId)
      .limit(5)
    
    if (services && services.length > 0 && clientsList && clientsList.length > 0) {
      const { error: apptError } = await supabase
        .from("appointments")
        .insert([
          { shop_id: shopId, client_id: clientsList[0]?.id, service_id: services[0]?.id, date: today, start_time: "09:00", end_time: "09:30", status: "confirmed", client_name: "Marcus Johnson", total_price: 25.00 },
          { shop_id: shopId, client_id: clientsList[1]?.id, service_id: services[1]?.id, date: today, start_time: "10:00", end_time: "10:45", status: "confirmed", client_name: "David Chen", total_price: 30.00 },
          { shop_id: shopId, client_id: clientsList[2]?.id, service_id: services[2]?.id, date: today, start_time: "11:00", end_time: "11:30", status: "pending", client_name: "Alex Thompson", total_price: 20.00 },
          { shop_id: shopId, client_id: clientsList[3]?.id, service_id: services[3]?.id, date: today, start_time: "14:00", end_time: "14:30", status: "confirmed", client_name: "James Williams", total_price: 25.00 },
          { shop_id: shopId, client_id: clientsList[4]?.id, service_id: services[4]?.id, date: today, start_time: "15:30", end_time: "16:00", status: "confirmed", client_name: "Michael Rodriguez", total_price: 15.00 }
        ])
      
      if (apptError) {
        console.error("Appointments error:", apptError)
      }
    }
    
    // 7. Insert chemistry records for Alex Thompson
    if (clientsList && clientsList.length >= 3) {
      const alexId = clientsList[2]?.id
      const { error: chemError } = await supabase
        .from("client_chemistry")
        .insert([
          {
            shop_id: shopId,
            client_id: alexId,
            treatment_type: "Color",
            product_name: "Wella Koleston",
            color_formula: "6/0 + 7/1",
            developer_brand: "Wella Welloxon",
            developer_volume: 20,
            mix_ratio: "1:1",
            processing_time_minutes: 35,
            treatment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            result_notes: "Great coverage, client very happy"
          },
          {
            shop_id: shopId,
            client_id: alexId,
            treatment_type: "Highlights",
            product_name: "Wella Blondor",
            color_formula: "Full packet",
            developer_brand: "Wella Welloxon",
            developer_volume: 30,
            mix_ratio: "1:2",
            processing_time_minutes: 45,
            treatment_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            result_notes: "Subtle highlights, natural look achieved"
          }
        ])
      
      if (chemError) {
        console.error("Chemistry error:", chemError)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Demo data seeded successfully!",
      data: {
        clients: 5,
        services: 9,
        inventory_items: 10,
        queue_entries: 3,
        appointments: 5,
        chemistry_records: 2
      }
    })
    
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Failed to seed demo data" }, { status: 500 })
  }
}
