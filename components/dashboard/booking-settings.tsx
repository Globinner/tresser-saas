"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Globe, 
  Copy, 
  Check, 
  ExternalLink,
  Clock,
  Calendar,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ShopBookingSettings {
  id: string
  public_booking_enabled: boolean
  booking_slug: string
  booking_advance_days: number
  booking_slot_duration: number
  booking_start_time: string
  booking_end_time: string
  booking_days_open: string[]
}

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
]

const SLOT_DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
]

export function BookingSettings({ shopId }: { shopId: string }) {
  const [settings, setSettings] = useState<ShopBookingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [shopId])

  async function loadSettings() {
    setLoading(true)
    setError(null)
    
    const { data, error: fetchError } = await supabase
      .from("shops")
      .select("id, public_booking_enabled, booking_slug, booking_advance_days, booking_slot_duration, booking_start_time, booking_end_time, booking_days_open")
      .eq("id", shopId)
      .single()

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    if (data) {
      setSettings({
        ...data,
        booking_days_open: data.booking_days_open || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        booking_start_time: data.booking_start_time || '09:00',
        booking_end_time: data.booking_end_time || '18:00',
        booking_slot_duration: data.booking_slot_duration || 30,
        booking_advance_days: data.booking_advance_days || 14,
      })
    }
    setLoading(false)
  }

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    setError(null)
    
    const { error: updateError } = await supabase
      .from("shops")
      .update({
        public_booking_enabled: settings.public_booking_enabled,
        booking_slug: settings.booking_slug,
        booking_advance_days: settings.booking_advance_days,
        booking_slot_duration: settings.booking_slot_duration,
        booking_start_time: settings.booking_start_time,
        booking_end_time: settings.booking_end_time,
        booking_days_open: settings.booking_days_open,
      })
      .eq("id", shopId)

    if (updateError) {
      setError(updateError.message)
    }
    setSaving(false)
  }

  function copyLink() {
    const url = `${window.location.origin}/book/${settings?.booking_slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function toggleDay(day: string) {
    if (!settings) return
    const days = settings.booking_days_open || []
    if (days.includes(day)) {
      setSettings({ ...settings, booking_days_open: days.filter(d => d !== day) })
    } else {
      setSettings({ ...settings, booking_days_open: [...days, day] })
    }
  }

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading settings...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={loadSettings} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (!settings) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Could not load booking settings</p>
        </CardContent>
      </Card>
    )
  }

  const bookingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/book/${settings.booking_slug}`

  return (
    <div className="space-y-6">
      {/* Enable/Disable */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Online Booking
              </CardTitle>
              <CardDescription>Allow clients to book appointments online</CardDescription>
            </div>
            <Switch
              checked={settings.public_booking_enabled || false}
              onCheckedChange={(checked) => setSettings({ ...settings, public_booking_enabled: checked })}
            />
          </div>
        </CardHeader>
        {settings.public_booking_enabled && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
              <Input
                value={bookingUrl}
                readOnly
                className="bg-transparent border-0 text-sm"
              />
              <Button variant="ghost" size="icon" onClick={copyLink}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Booking URL Slug */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Booking URL</CardTitle>
          <CardDescription>Customize your booking page URL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">/book/</span>
            <Input
              value={settings.booking_slug || ''}
              onChange={(e) => setSettings({ ...settings, booking_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
              className="bg-secondary/50 max-w-xs"
              placeholder="your-shop-name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Rules */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Booking Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Advance Booking (days)</Label>
              <Input
                type="number"
                min={1}
                max={90}
                value={settings.booking_advance_days || 14}
                onChange={(e) => setSettings({ ...settings, booking_advance_days: parseInt(e.target.value) || 14 })}
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground">How far in advance clients can book</p>
            </div>
            <div className="space-y-2">
              <Label>Time Slot Duration</Label>
              <Select 
                value={String(settings.booking_slot_duration || 30)}
                onValueChange={(val) => setSettings({ ...settings, booking_slot_duration: parseInt(val) })}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SLOT_DURATIONS.map(d => (
                    <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Interval between available slots</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Business Hours
          </CardTitle>
          <CardDescription>Set your available hours for online booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Opening Time</Label>
              <Input
                type="time"
                value={settings.booking_start_time || '09:00'}
                onChange={(e) => setSettings({ ...settings, booking_start_time: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Closing Time</Label>
              <Input
                type="time"
                value={settings.booking_end_time || '18:00'}
                onChange={(e) => setSettings({ ...settings, booking_end_time: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Open Days</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => {
                const isOpen = (settings.booking_days_open || []).includes(day.key)
                return (
                  <Button
                    key={day.key}
                    type="button"
                    variant={isOpen ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day.key)}
                    className={cn(
                      isOpen && "bg-primary text-primary-foreground"
                    )}
                  >
                    {day.label.slice(0, 3)}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={saving} className="w-full bg-primary text-primary-foreground">
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Booking Settings"
        )}
      </Button>
    </div>
  )
}
