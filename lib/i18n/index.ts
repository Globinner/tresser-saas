import { Locale, defaultLocale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  ar: () => import('./dictionaries/ar.json').then((module) => module.default),
  he: () => import('./dictionaries/he.json').then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]?.() ?? dictionaries[defaultLocale]()
}

// Get nested value from dictionary
export function t(dict: Dictionary, key: string): string {
  const keys = key.split('.')
  let value: unknown = dict
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key // Return key if not found
    }
  }
  
  return typeof value === 'string' ? value : key
}
