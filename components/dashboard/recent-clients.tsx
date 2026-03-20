"use client"

import { User, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Client {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  created_at: string
}

interface RecentClientsProps {
  clients: Client[]
}

export function RecentClients({ clients }: RecentClientsProps) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Clients</h2>
        <Link href="/dashboard/clients">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View all
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No clients yet</p>
          <Link href="/dashboard/clients">
            <Button variant="outline" size="sm" className="mt-4">
              Add your first client
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const fullName = `${client.first_name} ${client.last_name || ""}`.trim()
                return (
                <tr 
                  key={client.id} 
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <Link href={`/dashboard/clients/${client.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {client.first_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{fullName}</span>
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {client.phone}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
