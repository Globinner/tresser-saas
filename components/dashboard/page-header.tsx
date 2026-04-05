"use client"

import { useLanguage } from "@/lib/i18n/language-context"

interface PageHeaderProps {
  titleKey: string
  subtitleKey: string
}

const translations: Record<string, Record<string, string>> = {
  en: {
    // Services
    "services.title": "Services",
    "services.subtitle": "Manage your service offerings and pricing",
    // Clients
    "clients.title": "Clients",
    "clients.subtitle": "Manage your client database",
    // Appointments
    "appointments.title": "Appointments",
    "appointments.subtitle": "Manage your schedule and bookings",
    // Queue
    "queue.title": "Walk-in Queue",
    "queue.subtitle": "Manage walk-in customers and wait times",
    // Team
    "team.title": "Team",
    "team.subtitle": "Manage your staff and barbers",
    // Inventory
    "inventory.title": "Inventory",
    "inventory.subtitle": "Manage your products and supplies",
    // Payroll
    "payroll.title": "Payroll",
    "payroll.subtitle": "Manage employee payments and commissions",
    // Analytics
    "analytics.title": "Analytics",
    "analytics.subtitle": "Track your business performance",
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Configure your business settings",
    // Business Details
    "business.title": "Business Details",
    "business.subtitle": "Manage your business information",
  },
  he: {
    // Services
    "services.title": "שירותים",
    "services.subtitle": "נהל את השירותים והמחירים שלך",
    // Clients
    "clients.title": "לקוחות",
    "clients.subtitle": "נהל את מאגר הלקוחות שלך",
    // Appointments
    "appointments.title": "תורים",
    "appointments.subtitle": "נהל את לוח הזמנים וההזמנות שלך",
    // Queue
    "queue.title": "תור המתנה",
    "queue.subtitle": "נהל לקוחות ללא תור וזמני המתנה",
    // Team
    "team.title": "צוות",
    "team.subtitle": "נהל את הצוות והספרים שלך",
    // Inventory
    "inventory.title": "מלאי",
    "inventory.subtitle": "נהל את המוצרים והאספקה שלך",
    // Payroll
    "payroll.title": "שכר",
    "payroll.subtitle": "נהל תשלומים ועמלות לעובדים",
    // Analytics
    "analytics.title": "ניתוחים",
    "analytics.subtitle": "עקוב אחר ביצועי העסק שלך",
    // Settings
    "settings.title": "הגדרות",
    "settings.subtitle": "הגדר את הגדרות העסק שלך",
    // Business Details
    "business.title": "פרטי העסק",
    "business.subtitle": "נהל את פרטי העסק שלך",
  }
}

export function PageHeader({ titleKey, subtitleKey }: PageHeaderProps) {
  const { locale, isRTL } = useLanguage()
  const dict = translations[locale] || translations.en
  
  const title = dict[titleKey] || titleKey
  const subtitle = dict[subtitleKey] || subtitleKey

  return (
    <div className={isRTL ? "text-right" : ""}>
      <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </div>
  )
}

// Export a simple title-only variant
export function PageTitle({ titleKey }: { titleKey: string }) {
  const { locale } = useLanguage()
  const dict = translations[locale] || translations.en
  return <>{dict[titleKey] || titleKey}</>
}
