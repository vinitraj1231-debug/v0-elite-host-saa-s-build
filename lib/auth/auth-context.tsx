'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { User, LoginCredentials, SignupData } from '@/lib/types'
import { parseJWT, isTokenExpired, TOKEN_KEYS } from './utils'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<boolean>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Safe localStorage access for SSR
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch {
      console.error('Failed to save to localStorage')
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      console.error('Failed to remove from localStorage')
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure we only access localStorage after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setError(null)
    safeLocalStorage.removeItem(TOKEN_KEYS.ACCESS)
    safeLocalStorage.removeItem(TOKEN_KEYS.USER)
  }, [])

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    if (!isMounted) return false
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        clearAuth()
        return false
      }

      const data = await response.json()
      if (data.accessToken && data.user) {
        safeLocalStorage.setItem(TOKEN_KEYS.ACCESS, data.accessToken)
        safeLocalStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user))
        setUser(data.user)
        return true
      }

      return false
    } catch (err) {
      console.error('Auth refresh failed:', err)
      clearAuth()
      return false
    }
  }, [clearAuth, isMounted])

  // Initialize auth state - only after component mounts
  useEffect(() => {
    if (!isMounted) return

    const initAuth = async () => {
      try {
        const storedToken = safeLocalStorage.getItem(TOKEN_KEYS.ACCESS)
        const storedUser = safeLocalStorage.getItem(TOKEN_KEYS.USER)

        if (storedToken && storedUser) {
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            // Try to refresh
            const refreshed = await refreshAuth()
            if (!refreshed) {
              clearAuth()
            }
          } else {
            try {
              setUser(JSON.parse(storedUser))
            } catch {
              clearAuth()
            }
          }
        }
      } catch {
        clearAuth()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [clearAuth, refreshAuth, isMounted])

  // Set up token refresh interval - only when mounted and authenticated
  useEffect(() => {
    if (!user || !isMounted) return

    // Refresh token 1 minute before expiry
    const interval = setInterval(async () => {
      const token = safeLocalStorage.getItem(TOKEN_KEYS.ACCESS)
      if (token) {
        const payload = parseJWT(token)
        if (payload) {
          const expiresIn = payload.exp - Math.floor(Date.now() / 1000)
          if (expiresIn < 60) {
            await refreshAuth()
          }
        }
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [user, refreshAuth, isMounted])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error?.message || 'Login failed. Please check your credentials.'
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      safeLocalStorage.setItem(TOKEN_KEYS.ACCESS, data.accessToken)
      safeLocalStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user))
      setUser(data.user)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.error?.message || 'Signup failed. Please try again.'
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      safeLocalStorage.setItem(TOKEN_KEYS.ACCESS, result.accessToken)
      safeLocalStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(result.user))
      setUser(result.user)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout request failed:', err)
    } finally {
      clearAuth()
      setIsLoading(false)
    }
  }, [clearAuth])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    signup,
    logout,
    refreshAuth,
    clearError,
  }), [user, isLoading, error, login, signup, logout, refreshAuth, clearError])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
