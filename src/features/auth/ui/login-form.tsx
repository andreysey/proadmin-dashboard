import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
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
} from '@/shared/ui'
import { useAuthStore } from '../model/auth.store'
import { loginFormSchema, type LoginFormValues } from '../model/schemas'
import { login } from '../api/auth.api'

export const LoginForm = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: 'andriibutsvin', // Default for easy testing
      password: 'vawelrfn98rjh4',
      role: 'admin',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const user = await login(data)
      setAuth(user)
      navigate({ to: '/' })
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
    <Card className="border-border/50 bg-background/60 w-[380px] shadow-2xl backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Login</CardTitle>
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

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="role">Dev: Login As Role</Label>
            <Select id="role" {...register('role')}>
              <option value="admin">Admin (Full Access)</option>
              <option value="user">User (View Only)</option>
              <option value="moderator">Moderator (Manage Users)</option>
            </Select>
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
