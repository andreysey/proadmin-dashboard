import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface RefreshIndicatorProps {
  pullDistance: number
  isRefreshing: boolean
  isDragging?: boolean
  threshold?: number
}

export const RefreshIndicator = ({
  pullDistance,
  isRefreshing,
  isDragging = false,
  threshold = 80,
}: RefreshIndicatorProps) => {
  if (pullDistance === 0 && !isRefreshing) return null

  const progress = Math.min(pullDistance / threshold, 1)
  const opacity = Math.min(pullDistance / (threshold / 2), 1)

  return (
    <div
      className={cn(
        'fixed top-20 left-1/2 z-[60] -translate-x-1/2 transform-gpu will-change-transform',
        !isDragging && 'transition-all duration-300'
      )}
      style={{
        transform: `translateX(-50%) translateY(${pullDistance}px)`,
        opacity,
      }}
    >
      <div className="bg-background border-border flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md">
        {isRefreshing ? (
          <Loader2 className="text-primary h-5 w-5 animate-spin" />
        ) : (
          <div
            className="bg-primary/20 border-primary h-5 w-5 rounded-full border-2 border-t-transparent"
            style={{ transform: `rotate(${progress * 360}deg)` }}
          />
        )}
      </div>
    </div>
  )
}
