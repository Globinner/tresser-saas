"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Beaker, 
  Plus, 
  Droplets, 
  Clock, 
  Percent,
  FlaskConical,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { NewChemistryModal } from "./new-chemistry-modal"

interface ChemistryRecord {
  id: string
  treatment_type: string
  brand: string | null
  product_line: string | null
  color_code: string | null
  developer_volume: number | null
  mix_ratio: string | null
  processing_time: number | null
  heat_applied: boolean
  formula_notes: string | null
  result_notes: string | null
  result_rating: number | null
  patch_test_done: boolean
  patch_test_result: string | null
  created_at: string
  profiles: { full_name: string } | null
}

interface ClientChemistryProps {
  clientId: string
  clientName: string
  shopId: string
}

const treatmentColors: Record<string, string> = {
  color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  highlights: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  lowlights: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  balayage: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  relaxer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  perm: "bg-green-500/20 text-green-400 border-green-500/30",
  keratin: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  gloss: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  toner: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  bleach: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

export function ClientChemistry({ clientId, clientName, shopId }: ClientChemistryProps) {
  const [records, setRecords] = useState<ChemistryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchRecords()
  }, [clientId])

  async function fetchRecords() {
    setLoading(true)
    const { data, error } = await supabase
      .from("client_chemistry")
      .select(`
        *,
        profiles:applied_by (full_name)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setRecords(data)
    }
    setLoading(false)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function getRatingDisplay(rating: number | null) {
    if (!rating) return null
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating)
    return <span className="text-primary font-mono">{stars}</span>
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Beaker className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Chemistry Records</CardTitle>
            <p className="text-sm text-muted-foreground">
              Treatment history for {clientName}
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Treatment
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No chemistry records yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Add a treatment to start tracking formulas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="border border-border/50 rounded-lg overflow-hidden hover:border-primary/30 transition-colors"
              >
                {/* Main row */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${treatmentColors[record.treatment_type] || treatmentColors.other}`}
                        >
                          {record.treatment_type.replace("_", " ")}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(record.created_at)}
                        </span>
                        {record.patch_test_done && (
                          record.patch_test_result === "passed" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : record.patch_test_result === "failed" ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )
                        )}
                      </div>

                      {/* Quick info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {record.brand && (
                          <span className="text-foreground font-medium">
                            {record.brand}
                            {record.product_line && ` - ${record.product_line}`}
                          </span>
                        )}
                        {record.color_code && (
                          <span className="text-primary font-mono">
                            {record.color_code}
                          </span>
                        )}
                        {record.developer_volume && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Droplets className="w-3.5 h-3.5" />
                            {record.developer_volume} Vol
                          </span>
                        )}
                        {record.mix_ratio && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Percent className="w-3.5 h-3.5" />
                            {record.mix_ratio}
                          </span>
                        )}
                        {record.processing_time && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {record.processing_time} min
                          </span>
                        )}
                        {record.heat_applied && (
                          <span className="flex items-center gap-1 text-orange-400">
                            <Thermometer className="w-3.5 h-3.5" />
                            Heat
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {record.result_rating && getRatingDisplay(record.result_rating)}
                      {expandedRecord === record.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedRecord === record.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/30 bg-secondary/20">
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      {record.formula_notes && (
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                            Formula Notes
                          </h4>
                          <p className="text-sm text-foreground bg-secondary/50 rounded-md p-3">
                            {record.formula_notes}
                          </p>
                        </div>
                      )}
                      {record.result_notes && (
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                            Result Notes
                          </h4>
                          <p className="text-sm text-foreground bg-secondary/50 rounded-md p-3">
                            {record.result_notes}
                          </p>
                        </div>
                      )}
                    </div>
                    {record.profiles?.full_name && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Applied by: {record.profiles.full_name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <NewChemistryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        clientId={clientId}
        shopId={shopId}
        onSuccess={fetchRecords}
      />
    </Card>
  )
}
