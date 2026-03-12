'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User, LoginCredentials, SignupData, AuthTokens } from '@/lib/types'
import { parseJWT, isTokenExpired, TOKEN_KEYS } from './utils'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = useCallback(() => {
    setUser(null)
    localStorage.removeItem(TOKEN_KEYS.ACCESS)
    localStorage.removeItem(TOKEN_KEYS.USER)
  }, [])

  const refreshAuth = useCallback(async (): Promise<boolean> => {
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
        localStorage.setItem(TOKEN_KEYS.ACCESS, data.accessToken)
        localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user))
        setUser(data.user)
        return true
      }

      return false
    } catch {
      clearAuth()
      return false
    }
  }, [clearAuth])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEYS.ACCESS)
        const storedUser = localStorage.getItem(TOKEN_KEYS.USER)

        if (storedToken && storedUser) {
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            // Try to refresh
            const refreshed = await refreshAuth()
            if (!refreshed) {
              clearAuth()
            }
          } else {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch {
        clearAuth()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [clearAuth, refreshAuth])

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return

    // Refresh token 1 minute before expiry
    const interval = setInterval(async () => {
      const token = localStorage.getItem(TOKEN_KEYS.ACCESS)
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
  }, [user, refreshAuth])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed')
      }

      localStorage.setItem(TOKEN_KEYS.ACCESS, data.accessToken)
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user))
      setUser(data.user)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Signup failed')
      }

      localStorage.setItem(TOKEN_KEYS.ACCESS, result.accessToken)
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(result.user))
      setUser(result.user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      clearAuth()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshAuth,
      }}
    >
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
