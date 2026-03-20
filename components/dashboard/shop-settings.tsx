"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Loader2, MapPin, Phone, Mail, Coins } from "lucide-react"
import { CURRENCY_OPTIONS, type CurrencyCode } from "@/lib/currency"

interface Shop {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  currency: string | null
}

interface ShopSettingsProps {
  shop: Shop
}

export function ShopSettings({ shop }: ShopSettingsProps) {
  const [name, setName] = useState(shop.name)
  const [address, setAddress] = useState(shop.address || "")
  const [phone, setPhone] = useState(shop.phone || "")
  const [email, setEmail] = useState(shop.email || "")
  const [currency, setCurrency] = useState<CurrencyCode>((shop.currency as CurrencyCode) || "USD")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from("shops")
      .update({
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
        currency,
      })
      .eq("id", shop.id)

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Shop settings updated successfully" })
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Store className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Shop Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your shop information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Shop Name</label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your shop name"
              required
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="shop@example.com"
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Currency</label>
          <div className="relative">
            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
              <SelectTrigger className="pl-10 bg-input border-border">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            This currency will be used for all prices in your shop
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === "success" 
              ? "bg-green-400/10 text-green-400 border border-green-400/20" 
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}
