import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { api } from '@/shared/api'
import { tokenStorage } from '@/shared/lib/auth'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui'
import { useAuthStore } from '../model/auth.store'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'andriibutsvin', // Default for easy testing
      password: 'vawelrfn98rjh4',
    },
  })

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/login', data)
      const { token } = response.data

      if (token) {
        tokenStorage.set(token)
        setAuth(response.data)
        navigate({ to: '/' })
      }
    } catch (err: unknown) {
      console.error('Login failed', err)
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid credentials'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="kminchelle" {...register('username')} />
            {errors.username && (
              <span className="text-destructive text-sm">{errors.username.message}</span>
            )}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="•••••••" {...register('password')} />
            {errors.password && (
              <span className="text-destructive text-sm">{errors.password.message}</span>
            )}
          </div>

          {error && <div className="text-destructive text-sm font-medium">{error}</div>}

          <Button type="submit" disabled={isLoading} className="mt-2 w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground text-xs">ProAdmin Dashboard v0.1</p>
      </CardFooter>
    </Card>
  )
}
