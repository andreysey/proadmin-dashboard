'use client'

import { cn } from '@/shared/lib'

export function MeshGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-background relative h-full w-full overflow-hidden transition-colors duration-500',
        className
      )}
    >
      {/* Animated Blobs */}
      <div className="absolute inset-0 z-0">
        <div
          className={cn(
            'absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full opacity-40 blur-[100px]',
            'bg-primary animate-pulse duration-[10000ms]'
          )}
        />
        <div
          className={cn(
            'absolute top-[20%] -right-[10%] h-[60%] w-[60%] rounded-full opacity-30 blur-[120px]',
            'bg-accent animate-pulse delay-1000 duration-[12000ms]'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-[20%] left-[20%] h-[50%] w-[50%] rounded-full opacity-30 blur-[130px]',
            'bg-primary animate-pulse delay-2000 duration-[15000ms]'
          )}
        />
        <div
          className={cn(
            'absolute top-[40%] left-[30%] h-[40%] w-[40%] rounded-full opacity-20 blur-[100px]',
            'animate-pulse bg-indigo-300 delay-3000 duration-[8000ms] dark:bg-indigo-500'
          )}
        />
      </div>

      {/* Grid Pattern Overlay (Optional for subtle texture) */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  )
}
