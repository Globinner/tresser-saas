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
  const [localeInitialized, setLocaleInitialized] = useState(false)

  // Initialize locale from localStorage FIRST, then load dictionary
  useEffect(() => {
    // Get saved locale or detect from browser
    let initialLocale: Locale = defaultLocale
    
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && locales.includes(saved)) {
      initialLocale = saved
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Locale
      if (locales.includes(browserLang)) {
        initialLocale = browserLang
      }
    }
    
    setLocaleState(initialLocale)
    setLocaleInitialized(true)
  }, [])

  // Load dictionary ONLY after locale is initialized
  useEffect(() => {
    if (!localeInitialized) return
    
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
  }, [locale, localeInitialized])

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

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  
  // CRITICAL: Return safe defaults if context unavailable (prevents crash)
  if (context === undefined || context === null) {
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      dict: null,
      t: (key: string) => key,
      isRTL: false,
      isLoading: true,
    }
  }
  return context
}
