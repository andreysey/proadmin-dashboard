import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useDeleteUser } from '../model/useDeleteUser'

interface DeleteUserButtonProps {
  userId: number
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const { mutate, isPending } = useDeleteUser()

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      mutate(userId)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete User"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  )
}
