"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Beaker, Droplets, Clock, Percent, Thermometer, FlaskConical } from "lucide-react"

interface NewChemistryModalProps {
  open: boolean
  onClose: () => void
  clientId: string
  shopId: string
  onSuccess: () => void
}

const treatmentTypes = [
  { value: "color", label: "Hair Color" },
  { value: "highlights", label: "Highlights" },
  { value: "lowlights", label: "Lowlights" },
  { value: "balayage", label: "Balayage" },
  { value: "bleach", label: "Bleach / Lightener" },
  { value: "toner", label: "Toner" },
  { value: "gloss", label: "Gloss / Glaze" },
  { value: "relaxer", label: "Relaxer" },
  { value: "perm", label: "Perm" },
  { value: "keratin", label: "Keratin Treatment" },
  { value: "other", label: "Other" },
]

const developerVolumes = [10, 20, 30, 40]

const commonBrands = [
  "Wella",
  "Redken",
  "L'Oreal",
  "Schwarzkopf",
  "Joico",
  "Matrix",
  "Goldwell",
  "Pravana",
  "Pulp Riot",
  "Kenra",
  "Other",
]

export function NewChemistryModal({
  open,
  onClose,
  clientId,
  shopId,
  onSuccess,
}: NewChemistryModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    treatment_type: "",
    brand: "",
    product_line: "",
    color_code: "",
    developer_volume: "",
    mix_ratio: "",
    processing_time: "",
    heat_applied: false,
    formula_notes: "",
    result_notes: "",
    result_rating: "",
    patch_test_done: false,
    patch_test_result: "",
  })

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from("client_chemistry").insert({
      client_id: clientId,
      shop_id: shopId,
      applied_by: user?.id,
      treatment_type: formData.treatment_type,
      brand: formData.brand || null,
      product_line: formData.product_line || null,
      color_code: formData.color_code || null,
      developer_volume: formData.developer_volume ? parseInt(formData.developer_volume) : null,
      mix_ratio: formData.mix_ratio || null,
      processing_time: formData.processing_time ? parseInt(formData.processing_time) : null,
      heat_applied: formData.heat_applied,
      formula_notes: formData.formula_notes || null,
      result_notes: formData.result_notes || null,
      result_rating: formData.result_rating ? parseInt(formData.result_rating) : null,
      patch_test_done: formData.patch_test_done,
      patch_test_result: formData.patch_test_done ? formData.patch_test_result || null : null,
    })

    setLoading(false)

    if (!error) {
      setFormData({
        treatment_type: "",
        brand: "",
        product_line: "",
        color_code: "",
        developer_volume: "",
        mix_ratio: "",
        processing_time: "",
        heat_applied: false,
        formula_notes: "",
        result_notes: "",
        result_rating: "",
        patch_test_done: false,
        patch_test_result: "",
      })
      onSuccess()
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-strong border-border/50 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            New Chemistry Record
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Treatment Type */}
          <div className="space-y-2">
            <Label className="text-foreground">Treatment Type *</Label>
            <Select
              value={formData.treatment_type}
              onValueChange={(value) => setFormData({ ...formData, treatment_type: value })}
              required
            >
              <SelectTrigger className="bg-input border-border/50">
                <SelectValue placeholder="Select treatment type" />
              </SelectTrigger>
              <SelectContent>
                {treatmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand & Product Line */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Brand</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData({ ...formData, brand: value })}
              >
                <SelectTrigger className="bg-input border-border/50">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {commonBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Product Line</Label>
              <Input
                value={formData.product_line}
                onChange={(e) => setFormData({ ...formData, product_line: e.target.value })}
                placeholder="e.g., Color Touch, Shades EQ"
                className="bg-input border-border/50"
              />
            </div>
          </div>

          {/* Color Code */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Beaker className="w-4 h-4 text-primary" />
              Color Code / Formula
            </Label>
            <Input
              value={formData.color_code}
              onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
              placeholder="e.g., 7N + 8G (1:1), 6.0/7.1"
              className="bg-input border-border/50 font-mono"
            />
          </div>

          {/* Developer & Mix Ratio */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                Developer Volume
              </Label>
              <Select
                value={formData.developer_volume}
                onValueChange={(value) => setFormData({ ...formData, developer_volume: value })}
              >
                <SelectTrigger className="bg-input border-border/50">
                  <SelectValue placeholder="Select vol" />
                </SelectTrigger>
                <SelectContent>
                  {developerVolumes.map((vol) => (
                    <SelectItem key={vol} value={vol.toString()}>
                      {vol} Vol ({vol * 3 / 10}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Percent className="w-4 h-4 text-primary" />
                Mix Ratio
              </Label>
              <Input
                value={formData.mix_ratio}
                onChange={(e) => setFormData({ ...formData, mix_ratio: e.target.value })}
                placeholder="e.g., 1:1, 1:2, 2:1"
                className="bg-input border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Processing (min)
              </Label>
              <Input
                type="number"
                value={formData.processing_time}
                onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })}
                placeholder="35"
                className="bg-input border-border/50"
              />
            </div>
          </div>

          {/* Heat Applied */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <div>
                <Label className="text-foreground">Heat Applied</Label>
                <p className="text-sm text-muted-foreground">Dryer, processor, or cap used</p>
              </div>
            </div>
            <Switch
              checked={formData.heat_applied}
              onCheckedChange={(checked) => setFormData({ ...formData, heat_applied: checked })}
            />
          </div>

          {/* Formula Notes */}
          <div className="space-y-2">
            <Label className="text-foreground">Formula Notes</Label>
            <Textarea
              value={formData.formula_notes}
              onChange={(e) => setFormData({ ...formData, formula_notes: e.target.value })}
              placeholder="Additional formula details, application technique, sections..."
              className="bg-input border-border/50 min-h-[80px]"
            />
          </div>

          {/* Patch Test */}
          <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Patch Test Performed</Label>
                <p className="text-sm text-muted-foreground">Allergy/sensitivity test</p>
              </div>
              <Switch
                checked={formData.patch_test_done}
                onCheckedChange={(checked) => setFormData({ ...formData, patch_test_done: checked })}
              />
            </div>
            {formData.patch_test_done && (
              <Select
                value={formData.patch_test_result}
                onValueChange={(value) => setFormData({ ...formData, patch_test_result: value })}
              >
                <SelectTrigger className="bg-input border-border/50">
                  <SelectValue placeholder="Patch test result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passed">Passed - No Reaction</SelectItem>
                  <SelectItem value="mild_reaction">Mild Reaction</SelectItem>
                  <SelectItem value="failed">Failed - Do Not Use</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Result */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Result Rating</Label>
              <Select
                value={formData.result_rating}
                onValueChange={(value) => setFormData({ ...formData, result_rating: value })}
              >
                <SelectTrigger className="bg-input border-border/50">
                  <SelectValue placeholder="Rate result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">★★★★★ Perfect</SelectItem>
                  <SelectItem value="4">★★★★☆ Great</SelectItem>
                  <SelectItem value="3">★★★☆☆ Good</SelectItem>
                  <SelectItem value="2">★★☆☆☆ Needs Adjustment</SelectItem>
                  <SelectItem value="1">★☆☆☆☆ Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Result Notes</Label>
              <Input
                value={formData.result_notes}
                onChange={(e) => setFormData({ ...formData, result_notes: e.target.value })}
                placeholder="How it turned out..."
                className="bg-input border-border/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.treatment_type}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
