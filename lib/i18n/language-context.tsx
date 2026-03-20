"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, defaultLocale, isRTL, locales } from './config'
import { Dictionary, getDictionary, t } from './index'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  dict: Dictionary | null
  t: (key: string) => string
  isRTL: boolean
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'blade-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Set mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load saved locale on mount
  useEffect(() => {
    if (!mounted) return
    
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && locales.includes(saved)) {
      setLocaleState(saved)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Locale
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang)
      }
    }
  }, [mounted])

  // Load dictionary when locale changes
  useEffect(() => {
    if (!mounted) return
    
    setIsLoading(true)
    getDictionary(locale).then((dictionary) => {
      setDict(dictionary)
      setIsLoading(false)
      
      // Update document direction for RTL languages
      const rtl = isRTL(locale)
      document.documentElement.dir = rtl ? 'rtl' : 'ltr'
      document.documentElement.lang = locale
      
      // Apply appropriate font family based on language
      const body = document.body
      body.classList.remove('font-hebrew', 'font-arabic', 'font-sans')
      
      if (locale === 'he') {
        body.classList.add('font-hebrew')
      } else if (locale === 'ar') {
        body.classList.add('font-arabic')
      } else {
        body.classList.add('font-sans')
      }
    })
  }, [locale, mounted])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  const translate = (key: string): string => {
    if (!dict) return key
    return t(dict, key)
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        dict,
        t: translate,
        isRTL: isRTL(locale),
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
