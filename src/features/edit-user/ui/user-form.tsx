import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { ROLES, type User } from '@/entities/user/model/types'

type UserFormData = {
  firstName: string
  lastName: string
  email: string
  username: string
  role: User['role']
}

interface UserFormProps {
  initialData?: Partial<User>
  onSubmit: (data: UserFormData) => void
  isLoading?: boolean
  onCancel?: () => void
}

export const UserForm = ({ initialData, onSubmit, isLoading, onCancel }: UserFormProps) => {
  const { t } = useTranslation()

  const userSchema = z.object({
    firstName: z.string().min(2, t('validation.min_length', { count: 2 })),
    lastName: z.string().min(2, t('validation.min_length', { count: 2 })),
    email: z.email(t('validation.email')),
    username: z.string().min(3, t('validation.username_min')),
    role: z.enum(ROLES),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      email: initialData?.email ?? '',
      username: initialData?.username ?? '',
      role: initialData?.role ?? 'user',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('users.edit.first_name')}</Label>
          <Input id="firstName" {...register('firstName')} placeholder="John" />
          {errors.firstName && (
            <p className="text-destructive text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t('users.edit.last_name')}</Label>
          <Input id="lastName" {...register('lastName')} placeholder="Doe" />
          {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('users.columns.email')}</Label>
        <Input id="email" type="email" {...register('email')} placeholder="john.doe@example.com" />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">{t('users.edit.username')}</Label>
        <Input id="username" {...register('username')} placeholder="johndoe" />
        {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">{t('users.columns.role')}</Label>
        <select
          id="role"
          {...register('role')}
          className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {t(`users.roles.${role}`)}
            </option>
          ))}
        </select>
        {errors.role && <p className="text-destructive text-xs">{errors.role.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {t('users.edit.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('users.edit.saving') : t('users.edit.save')}
        </Button>
      </div>
    </form>
  )
}
