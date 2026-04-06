"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "./language-switcher"

// Static navigation links - MUST match exactly on server and client  
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "/demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
]

export function Navigation() {
  const { t, isRTL, locale } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Only get translated labels after mount to prevent hydration mismatch
  const getLabel = (englishLabel: string, translationKey: string) => {
    if (!mounted) return englishLabel
    const translated = t(translationKey)
    // If translation returns the key itself, use English fallback
    return translated === translationKey ? englishLabel : translated
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "glass-strong py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Image 
            src="/tresserlogo.svg" 
            alt="Tresser" 
            width={40} 
            height={40} 
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient">{"Tresser"}</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
            >
              {getLabel(link.label, `nav.${link.label.toLowerCase()}`)}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className={`hidden md:flex items-center gap-4 ${isRTL && mounted ? 'flex-row-reverse' : ''}`}>
          <LanguageSwitcher />
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
            <a href="/auth/login">{getLabel("Sign In", "nav.signIn")}</a>
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft" asChild>
            <a href="/auth/sign-up">{getLabel("Start Free Trial", "nav.startFreeTrial")}</a>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong mt-2 mx-4 rounded-xl p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground py-2 border-b border-border/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {getLabel(link.label, `nav.${link.label.toLowerCase()}`)}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>
              <Button variant="outline" className="w-full border-border/50" asChild>
                <a href="/auth/login">{getLabel("Sign In", "nav.signIn")}</a>
              </Button>
              <Button className="w-full bg-primary text-primary-foreground" asChild>
                <a href="/auth/sign-up">{getLabel("Start Free Trial", "nav.startFreeTrial")}</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
