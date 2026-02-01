import { Loader2 } from 'lucide-react'

interface RefreshIndicatorProps {
  pullDistance: number
  isRefreshing: boolean
  threshold?: number
}

export const RefreshIndicator = ({
  pullDistance,
  isRefreshing,
  threshold = 80,
}: RefreshIndicatorProps) => {
  if (pullDistance === 0 && !isRefreshing) return null

  const progress = Math.min(pullDistance / threshold, 1)
  const opacity = Math.min(pullDistance / (threshold / 2), 1)

  return (
    <div
      className="fixed top-20 left-1/2 z-[60] -translate-x-1/2 transition-transform duration-200"
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
