import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function daysUntilExpiration(expirationDate: string | null): number | null {
  if (!expirationDate) return null
  const today = new Date()
  const expDate = new Date(expirationDate)
  const diffTime = expDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function isExpired(expirationDate: string | null): boolean {
  const days = daysUntilExpiration(expirationDate)
  return days !== null && days < 0
}

export function isExpiringSoon(expirationDate: string | null, daysThreshold: number = 3): boolean {
  const days = daysUntilExpiration(expirationDate)
  return days !== null && days >= 0 && days <= daysThreshold
}

export function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    verduras: '🥬',
    frutas: '🍎',
    lacteos: '🧀',
    carnes: '🥩',
    granos: '🌾',
    condimentos: '🌶️',
    otros: '📦',
  }
  return emojis[category.toLowerCase()] || '📦'
}
