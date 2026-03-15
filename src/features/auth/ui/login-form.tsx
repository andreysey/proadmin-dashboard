import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Eye, EyeOff } from 'lucide-react'
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
import { ROLES } from '@/entities/user'
import type { TFunction } from 'i18next'

const getRoleOptions = (t: TFunction) =>
  [
    { value: ROLES.ADMIN, label: t('auth.login.roles.admin') },
    { value: ROLES.USER, label: t('auth.login.roles.user') },
    { value: ROLES.MODERATOR, label: t('auth.login.roles.moderator') },
  ] as const

export const LoginForm = () => {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(
      isRegister ? createRegisterSchema(t) : createLoginFormSchema(t)
    ) as Resolver<AuthFormValues>,
    defaultValues: {
      username: '',
      password: '',
      email: '',
      role: ROLES.ADMIN,
    },
  })

  const queryClient = useQueryClient()
  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isRegister) {
        await registerApi(data)
        queryClient.invalidateQueries({ queryKey: ['analytics', 'recent'] })
        queryClient.invalidateQueries({ queryKey: ['activity-log'] })
        setSuccess(t('auth.register.success'))
        setIsRegister(false)
        reset()
      } else {
        const user = await login(data)
        setAuth(user)
        // Invalidate analytics to show login event immediately
        await queryClient.invalidateQueries({ queryKey: ['analytics', 'recent'] })
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
              placeholder="username"
              {...register('username')}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <span className="text-destructive text-sm">{errors.username.message}</span>
            )}
          </div>

          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">{t('auth.register.firstName')}</Label>
                  <Input id="firstName" placeholder="John" {...register('firstName')} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">{t('auth.register.lastName')}</Label>
                  <Input id="lastName" placeholder="Doe" {...register('lastName')} />
                </div>
              </div>

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
            </>
          )}

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">{t('auth.login.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="•••••••"
                className="pr-10"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
              </button>
            </div>
            {errors.password && (
              <span className="text-destructive text-sm">{errors.password.message}</span>
            )}
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

              <div className="mb-4 flex flex-col space-y-1.5 text-left">
                <Label
                  htmlFor="role"
                  className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                >
                  {t('auth.login.role_label')}
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="role" className="border-primary/20 bg-primary/5 w-full">
                        <SelectValue placeholder={t('auth.login.role_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {getRoleOptions(t).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-primary/20 bg-primary/5 hover:bg-primary/10 w-full"
                onClick={async () => {
                  const selectedRole = getValues('role') || ROLES.ADMIN
                  const demoCredentials = {
                    username: 'andriibutsvin',
                    password: '12345678',
                    role: selectedRole,
                  }

                  setIsLoading(true)
                  try {
                    // Attempt real login first
                    const user = await login(demoCredentials as AuthFormValues)
                    // Force the selected role for demo purposes
                    setAuth({ ...user, role: selectedRole })
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
                      displayId: 0,
                      username: `guest_${selectedRole.toLowerCase()}`,
                      firstName: 'Guest',
                      lastName:
                        selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).toLowerCase(),
                      email: `recruiter+${selectedRole.toLowerCase()}@demo.proadmin`,
                      role: selectedRole,
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
