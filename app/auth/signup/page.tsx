'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Rocket, Github, Mail, Eye, EyeOff, Loader2, Check, X } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { validatePassword, validateUsername, validateEmail } from '@/lib/auth/utils'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    referralCode: searchParams.get('ref') || '',
  })

  const [validation, setValidation] = useState({
    email: { valid: false, touched: false },
    username: { valid: false, touched: false, errors: [] as string[] },
    password: { valid: false, touched: false, errors: [] as string[] },
  })

  // Real-time validation
  useEffect(() => {
    if (validation.email.touched) {
      setValidation(prev => ({
        ...prev,
        email: { ...prev.email, valid: validateEmail(formData.email) }
      }))
    }
  }, [formData.email, validation.email.touched])

  useEffect(() => {
    if (validation.username.touched) {
      const result = validateUsername(formData.username)
      setValidation(prev => ({
        ...prev,
        username: { ...prev.username, valid: result.valid, errors: result.errors }
      }))
    }
  }, [formData.username, validation.username.touched])

  useEffect(() => {
    if (validation.password.touched) {
      const result = validatePassword(formData.password)
      setValidation(prev => ({
        ...prev,
        password: { ...prev.password, valid: result.valid, errors: result.errors }
      }))
    }
  }, [formData.password, validation.password.touched])

  const handleBlur = (field: 'email' | 'username' | 'password') => {
    setValidation(prev => ({
      ...prev,
      [field]: { ...prev[field], touched: true }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate all fields
    const emailValid = validateEmail(formData.email)
    const usernameResult = validateUsername(formData.username)
    const passwordResult = validatePassword(formData.password)

    if (!emailValid || !usernameResult.valid || !passwordResult.valid) {
      setError('Please fix the validation errors before submitting')
      return
    }

    try {
      await signup(formData)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  const handleOAuthSignup = (provider: 'google' | 'github') => {
    const refCode = formData.referralCode ? `?ref=${formData.referralCode}` : ''
    window.location.href = `/api/auth/oauth/${provider}${refCode}`
  }

  const passwordChecks = [
    { label: '8+ characters', met: formData.password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Number', met: /[0-9]/.test(formData.password) },
    { label: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <Card className="relative w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">EliteHost</span>
          </Link>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Start deploying in seconds with 2 free credits
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignup('github')}
              disabled={isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignup('google')}
              disabled={isLoading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => handleBlur('email')}
                required
                disabled={isLoading}
                className={validation.email.touched && !validation.email.valid ? 'border-destructive' : ''}
              />
              {validation.email.touched && !validation.email.valid && (
                <p className="text-xs text-destructive">Please enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="cooldev"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                onBlur={() => handleBlur('username')}
                required
                disabled={isLoading}
                className={validation.username.touched && !validation.username.valid ? 'border-destructive' : ''}
              />
              {validation.username.touched && validation.username.errors.length > 0 && (
                <p className="text-xs text-destructive">{validation.username.errors[0]}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Your deploys will be at slug.{formData.username || 'username'}.elitehost.app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => handleBlur('password')}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              {/* Password strength indicators */}
              {formData.password && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5 text-xs">
                      {check.met ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className={check.met ? 'text-green-500' : 'text-muted-foreground'}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code (optional)</Label>
              <Input
                id="referralCode"
                type="text"
                placeholder="Enter referral code"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
