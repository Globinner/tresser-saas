import Link from "next/link"
import { Scissors, AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 grain">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 text-center">
        {/* Error card */}
        <div className="glass-strong rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-amber-soft">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Tresser</span>
          </div>

          {/* Error icon */}
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">
            {message || "Something went wrong during authentication."}
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            If you keep seeing this error, try clearing your session below.
          </p>

          <div className="space-y-3">
            <Link href="/auth/logout">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Session & Try Again
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full border-border hover:bg-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
