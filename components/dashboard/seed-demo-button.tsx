"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface SeedDemoButtonProps {
  hasData?: boolean
}

export function SeedDemoButton({ hasData = false }: SeedDemoButtonProps) {
  const [loading, setLoading] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSeed = async () => {
    setLoading(true)
    setStatus("idle")
    
    try {
      const response = await fetch("/api/seed-demo-data", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus("success")
        setMessage(`Added: ${data.data.clients} clients, ${data.data.services} services, ${data.data.inventory_items} inventory items, ${data.data.queue_entries} queue entries, ${data.data.appointments} appointments`)
        router.refresh()
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to seed demo data")
      }
    } catch {
      setStatus("error")
      setMessage("An error occurred while seeding demo data")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }
    
    setClearing(true)
    setStatus("idle")
    
    try {
      const response = await fetch("/api/clear-demo-data", {
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus("success")
        setMessage("All data has been cleared successfully")
        router.refresh()
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to clear data")
      }
    } catch {
      setStatus("error")
      setMessage("An error occurred while clearing data")
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-card/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">Demo Data</h3>
          <p className="text-sm text-muted-foreground">
            Add sample clients, services, inventory, and appointments to test the app
          </p>
        </div>
        <div className="flex gap-2">
          {hasData && (
            <Button 
              onClick={handleClear} 
              disabled={loading || clearing}
              variant="destructive"
              size="sm"
              className="shrink-0"
            >
              {clearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </>
              )}
            </Button>
          )}
          <Button 
            onClick={handleSeed} 
            disabled={loading || clearing}
            variant={status === "success" ? "outline" : "default"}
            className="shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Done!
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Add Demo Data
              </>
            )}
          </Button>
        </div>
      </div>
      
      {message && (
        <div className={`mt-3 rounded-md p-3 text-sm ${
          status === "success" 
            ? "bg-green-500/10 text-green-500" 
            : "bg-destructive/10 text-destructive"
        }`}>
          <div className="flex items-start gap-2">
            {status === "success" ? (
              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
