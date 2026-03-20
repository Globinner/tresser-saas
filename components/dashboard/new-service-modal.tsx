"use client"

import { useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Scissors, Clock, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface NewServiceModalProps {
  shopId: string | null
  defaultOpen?: boolean
  children: ReactNode
}

export function NewServiceModal({
  shopId,
  defaultOpen = false,
  children,
}: NewServiceModalProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("30")
  const [price, setPrice] = useState("")

  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!shopId) {
      setError("No shop found. Please set up your shop first.")
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from("services")
      .insert({
        shop_id: shopId,
        name,
        description: description || null,
        duration_minutes: parseInt(duration),
        price: parseFloat(price),
        is_active: true,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setOpen(false)
    resetForm()
    router.refresh()
  }

  function resetForm() {
    setName("")
    setDescription("")
    setDuration("30")
    setPrice("")
    setError(null)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-strong border-border sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Service name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Service Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Classic Haircut"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 bg-input border-border"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the service..."
              rows={3}
              className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Duration and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Duration <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="w-full h-10 rounded-lg bg-input border border-border pl-10 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Price <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Service"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
