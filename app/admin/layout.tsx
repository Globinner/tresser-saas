import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, LayoutDashboard, CreditCard } from "lucide-react"

// Add your admin email(s) here
const ADMIN_EMAILS = [
  "globinner@gmail.com",
  // Add more admin emails as needed
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is authenticated and is an admin
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold text-primary">
              Tresser Admin
            </Link>
            <nav className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/admin/referrals" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Users className="w-4 h-4" />
                Referrals
              </Link>
              <Link 
                href="/admin/subscriptions" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Subscriptions
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Link href="/dashboard" className="text-sm text-primary hover:underline">
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main>
        {children}
      </main>
    </div>
  )
}
