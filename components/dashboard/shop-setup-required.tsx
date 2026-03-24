"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface ShopSetupRequiredProps {
  userId: string
  featureName?: string
}

export function ShopSetupRequired({ userId, featureName = "this feature" }: ShopSetupRequiredProps) {
  const [loading, setLoading] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [shopName, setShopName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const createShop = async (withDemo: boolean) => {
    if (!shopName.trim()) {
      setError("Please enter a shop name")
      return
    }

    withDemo ? setLoadingDemo(true) : setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      
      // Create the shop
      const slug = shopName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const bookingSlug = `${slug}-${Math.random().toString(36).substring(2, 8)}`
      
      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .insert({
          name: shopName.trim(),
          owner_id: userId,
          slug: slug,
          booking_slug: bookingSlug,
        })
        .select()
        .single()

      if (shopError) throw shopError

      // Update profile with shop_id
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ shop_id: shop.id })
        .eq("id", userId)

      if (profileError) throw profileError

      // If demo mode, seed the data
      if (withDemo) {
        const response = await fetch("/api/seed-demo-data", {
          method: "POST",
        })
        
        if (!response.ok) {
          console.error("Failed to seed demo data, but shop was created")
        }
      }

      // Refresh the page
      router.refresh()
    } catch (err: unknown) {
      console.error("Error creating shop:", err)
      setError(err instanceof Error ? err.message : "Failed to create shop. Please try again.")
    } finally {
      setLoading(false)
      setLoadingDemo(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Shop Setup Required</CardTitle>
          <CardDescription>
            Create your shop to access {featureName}. You can start with demo data to explore all features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              placeholder="Enter your shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              disabled={loading || loadingDemo}
            />
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => createShop(true)} 
              disabled={loading || loadingDemo}
              className="w-full"
            >
              {loadingDemo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating with Demo Data...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Shop with Demo Data
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => createShop(false)} 
              disabled={loading || loadingDemo}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Empty Shop"
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Demo data includes sample clients, services, appointments, and inventory that you can clear anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
