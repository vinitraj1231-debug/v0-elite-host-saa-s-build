// Auth utilities for EliteHost

import type { JWTPayload, AuthTokens } from '@/lib/types'

// Constants
export const ACCESS_TOKEN_EXPIRY = 15 * 60 // 15 minutes in seconds
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 // 7 days in seconds

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Username validation
export function validateUsername(username: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long')
  }
  if (username.length > 30) {
    errors.push('Username must be at most 30 characters long')
  }
  if (!/^[a-z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain lowercase letters, numbers, underscores, and hyphens')
  }
  if (/^[_-]/.test(username) || /[_-]$/.test(username)) {
    errors.push('Username cannot start or end with underscore or hyphen')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

// Generate random string for tokens/codes
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomArray = new Uint8Array(length)
  crypto.getRandomValues(randomArray)
  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length]
  }
  return result
}

// Generate referral code
export function generateReferralCode(username: string): string {
  const suffix = generateRandomString(6)
  return `${username.slice(0, 8).toUpperCase()}-${suffix}`
}

// Parse JWT without verification (for client-side use)
export function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload as JWTPayload
  } catch {
    return null
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload) return true
  
  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

// Get device info from user agent
export function getDeviceInfo(userAgent: string): {
  browser: string
  os: string
  device: string
  isMobile: boolean
} {
  const ua = userAgent.toLowerCase()
  
  // Browser detection
  let browser = 'Unknown'
  if (ua.includes('firefox')) browser = 'Firefox'
  else if (ua.includes('edg')) browser = 'Edge'
  else if (ua.includes('chrome')) browser = 'Chrome'
  else if (ua.includes('safari')) browser = 'Safari'
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera'
  
  // OS detection
  let os = 'Unknown'
  if (ua.includes('windows')) os = 'Windows'
  else if (ua.includes('mac')) os = 'macOS'
  else if (ua.includes('linux')) os = 'Linux'
  else if (ua.includes('android')) os = 'Android'
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
  
  // Device type
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)
  const device = isMobile ? 'Mobile' : 'Desktop'
  
  return { browser, os, device, isMobile }
}

// Hash string using Web Crypto API
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Generate device fingerprint hash
export async function generateDeviceFingerprint(
  userAgent: string,
  ip: string
): Promise<string> {
  const fingerprint = `${userAgent}|${ip}`
  return hashString(fingerprint)
}

// Cookie options for auth tokens
export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: ACCESS_TOKEN_EXPIRY,
}

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth/refresh',
  maxAge: REFRESH_TOKEN_EXPIRY,
}

// Rate limiting helpers
export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 min
  signup: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 signups per hour
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 resets per hour
  aiRequest: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 AI calls per minute
  deploy: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 deploys per minute
}

// Token storage keys (for client-side)
export const TOKEN_KEYS = {
  ACCESS: 'elitehost_access_token',
  REFRESH: 'elitehost_refresh_token',
  USER: 'elitehost_user',
} as const
