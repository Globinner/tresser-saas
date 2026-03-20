"use client"

import { Scissors, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function Footer() {
  const { t, isRTL } = useLanguage()

  const footerLinks = {
    product: {
      title: t("footer.product"),
      links: [
        { label: t("nav.features"), href: "#features" },
        { label: t("nav.pricing"), href: "#pricing" },
        { label: t("footer.integrations"), href: "#" },
        { label: t("footer.changelog"), href: "#" },
        { label: t("footer.roadmap"), href: "#" },
      ],
    },
    resources: {
      title: t("footer.resources"),
      links: [
        { label: t("footer.blog"), href: "#" },
        { label: t("footer.helpCenter"), href: "#" },
        { label: t("footer.guides"), href: "#" },
        { label: t("footer.apiDocs"), href: "#" },
        { label: t("footer.community"), href: "#" },
      ],
    },
    company: {
      title: t("footer.company"),
      links: [
        { label: t("footer.about"), href: "#" },
        { label: t("footer.careers"), href: "#" },
        { label: t("footer.press"), href: "#" },
        { label: t("footer.partners"), href: "#" },
        { label: t("footer.contact"), href: "#" },
      ],
    },
    legal: {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: "#" },
        { label: t("footer.terms"), href: "#" },
        { label: t("footer.security"), href: "#" },
        { label: t("footer.gdpr"), href: "#" },
      ],
    },
  }

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <footer className="relative border-t border-border/30 bg-secondary/20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Glow line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="#" className={`flex items-center gap-3 mb-6 group ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:glow-amber-soft transition-all duration-300">
                <Scissors className="w-5 h-5 text-primary rotate-[-45deg]" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gradient">Tresser</span>
              </span>
            </a>
            <p className={`text-sm text-muted-foreground mb-6 max-w-xs ${isRTL ? 'text-right' : ''}`}>
              {t("footer.tagline")}
            </p>
            {/* Social Links */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className={`font-semibold text-foreground mb-4 ${isRTL ? 'text-right' : ''}`}>{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 block ${isRTL ? 'text-right' : ''}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.privacyPolicy")}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.termsOfService")}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.cookies")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
