import { LoginForm } from '@/features/auth'
import { MeshGradient } from '@/shared/ui'

export const LoginPage = () => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden p-4">
      <MeshGradient className="absolute inset-0" />
      <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 relative z-10 w-full max-w-[450px] duration-700">
        <LoginForm />
      </div>
    </div>
  )
}
