"use client"

import { useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Phone, Mail, Scissors, AlertTriangle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Predefined client preferences
const HAIRCUT_STYLES = [
  "Low Fade", "Mid Fade", "High Fade", "Skin Fade", "Taper", 
  "Buzz Cut", "Crew Cut", "Undercut", "Pompadour", "Quiff"
]

const CUTTING_PREFERENCES = [
  "Scissors only", "Clippers only", "Both scissors & clippers"
]

const ALLERGIES = [
  "Hair dye", "Bleach", "Latex", "Fragrances", "Certain products"
]

const OTHER_PREFERENCES = [
  "Sensitive scalp", "Thinning hair", "Beard trim included", 
  "Hot towel", "No small talk", "Line up/Edge up"
]

interface NewClientModalProps {
  shopId: string | null
  defaultOpen?: boolean
  children: ReactNode
}

export function NewClientModal({
  shopId,
  defaultOpen = false,
  children,
}: NewClientModalProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  
  // Preferences
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedCutting, setSelectedCutting] = useState<string | null>(null)
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [selectedOther, setSelectedOther] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState("")

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

    // Build preferences notes
    const preferenceParts: string[] = []
    if (selectedStyles.length > 0) {
      preferenceParts.push(`Preferred styles: ${selectedStyles.join(", ")}`)
    }
    if (selectedCutting) {
      preferenceParts.push(`Cutting: ${selectedCutting}`)
    }
    if (selectedAllergies.length > 0) {
      preferenceParts.push(`ALLERGIES: ${selectedAllergies.join(", ")}`)
    }
    if (selectedOther.length > 0) {
      preferenceParts.push(`Preferences: ${selectedOther.join(", ")}`)
    }
    if (notes) {
      preferenceParts.push(`Notes: ${notes}`)
    }
    
    const fullNotes = preferenceParts.join("\n")

    const { error: insertError } = await supabase
      .from("clients")
      .insert({
        shop_id: shopId,
        first_name: firstName,
        last_name: lastName || null,
        phone: phone || null,
        email: email || null,
        notes: fullNotes || null,
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
    setFirstName("")
    setLastName("")
    setPhone("")
    setEmail("")
    setNotes("")
    setSelectedStyles([])
    setSelectedCutting(null)
    setSelectedAllergies([])
    setSelectedOther([])
    setCustomAllergy("")
    setError(null)
    setLoading(false)
  }
  
  function toggleSelection(item: string, list: string[], setList: (items: string[]) => void) {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }
  
  function addCustomAllergy() {
    if (customAllergy.trim() && !selectedAllergies.includes(customAllergy.trim())) {
      setSelectedAllergies([...selectedAllergies, customAllergy.trim()])
      setCustomAllergy("")
    }
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
          <DialogTitle className="text-xl font-bold">Add New Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Last Name
              </label>
              <Input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-input border-border"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
          </div>

          {/* Haircut Styles */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Scissors className="w-4 h-4 text-primary" />
              Preferred Haircut Styles
            </label>
            <div className="flex flex-wrap gap-2">
              {HAIRCUT_STYLES.map((style) => (
                <Badge
                  key={style}
                  variant={selectedStyles.includes(style) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedStyles.includes(style) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/20"
                  }`}
                  onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cutting Preference */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cutting Preference</label>
            <div className="flex flex-wrap gap-2">
              {CUTTING_PREFERENCES.map((pref) => (
                <Badge
                  key={pref}
                  variant={selectedCutting === pref ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedCutting === pref 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/20"
                  }`}
                  onClick={() => setSelectedCutting(selectedCutting === pref ? null : pref)}
                >
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Allergies / Sensitivities
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ALLERGIES.map((allergy) => (
                <Badge
                  key={allergy}
                  variant={selectedAllergies.includes(allergy) ? "destructive" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedAllergies.includes(allergy) 
                      ? "" 
                      : "hover:bg-destructive/20"
                  }`}
                  onClick={() => toggleSelection(allergy, selectedAllergies, setSelectedAllergies)}
                >
                  {allergy}
                </Badge>
              ))}
              {selectedAllergies.filter(a => !ALLERGIES.includes(a)).map((custom) => (
                <Badge
                  key={custom}
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => toggleSelection(custom, selectedAllergies, setSelectedAllergies)}
                >
                  {custom}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add custom allergy..."
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAllergy())}
                className="bg-input border-border text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomAllergy}>
                Add
              </Button>
            </div>
          </div>

          {/* Other Preferences */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Other Preferences</label>
            <div className="flex flex-wrap gap-2">
              {OTHER_PREFERENCES.map((pref) => (
                <Badge
                  key={pref}
                  variant={selectedOther.includes(pref) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedOther.includes(pref) 
                      ? "bg-secondary text-secondary-foreground" 
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => toggleSelection(pref, selectedOther, setSelectedOther)}
                >
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other important information..."
              rows={2}
              className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
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
                "Add Client"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
