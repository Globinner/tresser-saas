"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Loader2, MapPin, Phone, Mail, Coins, Sparkles } from "lucide-react"
import { CURRENCY_OPTIONS, type CurrencyCode } from "@/lib/currency"
import { useLanguage } from "@/lib/i18n/language-context"

interface CreateShopFormProps {
  userId: string
}

export function CreateShopForm({ userId }: CreateShopFormProps) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [currency, setCurrency] = useState<CurrencyCode>("ILS")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  // Generate URL-friendly slug from shop name
  function generateSlug(shopName: string): string {
    const baseSlug = shopName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Remove consecutive dashes
    // Add random suffix for uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `${baseSlug}-${randomSuffix}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const slug = generateSlug(name)

    // Create the shop with all required fields
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .insert({
        name,
        slug,
        booking_slug: slug,
        address: address || null,
        phone: phone || null,
        email: email || null,
        currency,
        owner_id: userId,
        public_booking_enabled: false,
        booking_slot_duration: 30,
        booking_advance_days: 14,
        booking_start_time: '09:00',
        booking_end_time: '18:00',
        booking_days_open: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      })
      .select()
      .single()

    if (shopError) {
      setMessage({ type: "error", text: shopError.message })
      setLoading(false)
      return
    }

    // Link shop to user profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ shop_id: shop.id })
      .eq("id", userId)

    if (profileError) {
      setMessage({ type: "error", text: profileError.message })
      setLoading(false)
      return
    }

    setMessage({ type: "success", text: t("shop.created") })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">{t("shop.createTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("shop.createDescription")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("shop.name")} *</label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("shop.namePlaceholder")}
              required
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("shop.address")}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("shop.addressPlaceholder")}
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("shop.phone")}</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("shop.phonePlaceholder")}
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("shop.email")}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("shop.emailPlaceholder")}
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("shop.currency")}</label>
          <div className="relative">
            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
              <SelectTrigger className="pl-10 bg-input border-border">
                <SelectValue placeholder={t("shop.currencyPlaceholder")} />
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
          disabled={loading || !name.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("common.saving")}
            </>
          ) : (
            <>
              <Store className="w-4 h-4 mr-2" />
              {t("shop.createButton")}
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
