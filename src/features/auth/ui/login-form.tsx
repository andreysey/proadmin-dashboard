import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { tokenStorage } from '@/shared/lib/auth'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'
import { useAuthStore } from '../model/auth.store'
import { createLoginFormSchema, createRegisterSchema, type AuthFormValues } from '../model/schemas'
import { login, register as registerApi } from '../api/auth.api'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin (Full Access)' },
  { value: 'user', label: 'User (View Only)' },
  { value: 'moderator', label: 'Moderator (Manage Users)' },
] as const

export const LoginForm = () => {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(
      isRegister ? createRegisterSchema(t) : createLoginFormSchema(t)
    ) as Resolver<AuthFormValues>,
    defaultValues: {
      username: '',
      password: '',
      email: '',
      role: 'admin',
    },
  })

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isRegister) {
        await registerApi(data)
        setSuccess(t('auth.register.success'))
        setIsRegister(false)
        reset()
      } else {
        const user = await login(data)
        setAuth(user)
        void router.navigate({
          to: '/',
          search: { dateRange: '7d', autoRefresh: false },
        })
      }
    } catch (err: unknown) {
      if (import.meta.env.MODE !== 'test') {
        console.error('Auth action failed', err)
      }
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (isRegister ? t('auth.register.error') : t('auth.login.error_credentials'))
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle mode
  const toggleMode = () => {
    setIsRegister(!isRegister)
    setError(null)
    setSuccess(null)
    reset()
  }

  // Helper to get translated label for role
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return t('auth.login.roles.admin')
      case 'user':
        return t('auth.login.roles.user')
      case 'moderator':
        return t('auth.login.roles.moderator')
      default:
        return role
    }
  }

  return (
    <Card className="border-border/50 bg-background/60 w-full shadow-2xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle>{isRegister ? t('auth.register.title') : t('auth.login.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="username">{t('auth.login.username')}</Label>
            <Input
              id="username"
              placeholder="kminchelle"
              {...register('username')}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <span className="text-destructive text-sm">{errors.username.message}</span>
            )}
          </div>

          {isRegister && (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">{t('auth.register.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="text-destructive text-sm">{errors.email.message}</span>
              )}
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">{t('auth.login.password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="•••••••"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span className="text-destructive text-sm">{errors.password.message}</span>
            )}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="role">{t('auth.login.role_label')}</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder={t('auth.login.role_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {getRoleLabel(option.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {error && <div className="text-destructive text-sm font-medium">{error}</div>}
          {success && <div className="text-sm font-medium text-emerald-500">{success}</div>}

          <Button type="submit" disabled={isLoading} className="mt-2 w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {isRegister ? t('auth.register.submit') : t('auth.login.submit')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground mr-1">
              {isRegister ? t('auth.toggle.have_account') : t('auth.toggle.need_account')}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary font-medium hover:underline"
            >
              {isRegister ? t('auth.toggle.link_login') : t('auth.toggle.link_register')}
            </button>
          </div>

          {!isRegister && (
            <div className="border-border/50 mt-6 border-t pt-6">
              <div className="mb-4 text-center">
                <h4 className="text-sm font-semibold">{t('auth.login.demo_access.title')}</h4>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('auth.login.demo_access.description')}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-primary/20 bg-primary/5 hover:bg-primary/10 w-full"
                onClick={async () => {
                  const demoCredentials = {
                    username: 'andriibutsvin',
                    password: 'vawelrfn98rjh4',
                    role: 'admin',
                  }

                  setIsLoading(true)
                  try {
                    // Attempt real login first
                    const user = await login(demoCredentials as AuthFormValues)
                    setAuth(user)
                    void router.navigate({
                      to: '/',
                      search: { dateRange: '7d', autoRefresh: false },
                    })
                  } catch (err) {
                    // If real login fails (e.g. no backend), fall back to Guest Mode for recruiters
                    console.warn(
                      'Demo Login: Backend unavailable or rejected, entering Guest Mode.',
                      err
                    )
                    const guestUser = {
                      id: '0',
                      username: 'guest_recruiter',
                      firstName: 'Guest',
                      lastName: 'Recruiter',
                      email: 'recruiter@demo.proadmin',
                      role: 'admin' as const,
                      image: '',
                    }

                    // Set dummy token to pass auth guards
                    tokenStorage.setTokens({
                      accessToken: 'demo-guest-token',
                      refreshToken: 'demo-guest-refresh-token',
                    })

                    setAuth(guestUser)
                    void router.navigate({
                      to: '/',
                      search: { dateRange: '7d', autoRefresh: false },
                    })
                  } finally {
                    setIsLoading(false)
                  }
                }}
                disabled={isLoading}
              >
                {t('auth.login.demo_access.button')}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-xs">
          {t('about.footer', { version: __APP_VERSION__ })}
        </p>
      </CardFooter>
    </Card>
  )
}
