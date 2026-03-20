"use client"

import { useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface InviteTeamModalProps {
  shopId: string | null
  children: ReactNode
}

export function InviteTeamModal({
  shopId,
  children,
}: InviteTeamModalProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Generate an invite link (in production, this would be a proper invite system)
  const inviteLink = typeof window !== "undefined" 
    ? `${window.location.origin}/join/${shopId}`
    : ""

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-strong border-border sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invite Team Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="text-center py-8 px-4 rounded-xl bg-secondary/30 border border-border">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Share Invite Link</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Send this link to invite team members to join your shop
            </p>
            
            <div className="flex gap-2">
              <Input
                readOnly
                value={inviteLink}
                className="bg-input border-border text-sm"
              />
              <Button
                onClick={copyLink}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Team members will need to create an account and</p>
            <p>use this link to join your shop.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
