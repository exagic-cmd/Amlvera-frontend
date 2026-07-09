import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card } from '../../components/ui/Card'
import { Logo } from '../../components/ui/Logo'
import { loginSchema } from './login-schema'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  // Static stub until the auth endpoints are wired up — no network call yet.
  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Login submitted (static):', data)
  }

  return (
    <div className="flex min-h-screen w-full bg-surface-alt">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 p-10 text-white lg:flex">
        <div className="inline-flex w-fit items-center rounded-lg bg-white px-3 py-2">
          <Logo className="h-6" />
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">Analytics that keeps you ahead.</h1>
          <p className="mt-3 text-navy-100">
            Track KPIs, manage your team, and stay on top of every metric that matters — all from one dashboard.
          </p>
        </div>
        <p className="text-sm text-navy-200">© {new Date().getFullYear()} Amlvera. All rights reserved.</p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <Logo className="mb-8 h-7 lg:hidden" />

          <h2 className="text-2xl font-semibold text-text">Welcome back</h2>
          <p className="mt-1 text-sm text-text-muted">Sign in to your account to continue.</p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                error={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="rounded-sm text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-10"
                  error={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                {...register('remember')}
              />
              Remember me
            </label>

            <Button type="submit" className="w-full" loading={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="rounded-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
