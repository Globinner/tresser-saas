"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function SeedDemoButton() {
  const [loading, setLoading] = useState(false)
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

  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-card/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">Demo Data</h3>
          <p className="text-sm text-muted-foreground">
            Add sample clients, services, inventory, and appointments to test the app
          </p>
        </div>
        <Button 
          onClick={handleSeed} 
          disabled={loading}
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
