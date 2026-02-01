import { useCallback, useEffect, useState, useRef } from 'react'

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
  disabled?: boolean
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  disabled = false,
}: PullToRefreshOptions) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const isPullingRef = useRef(false)

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || isRefreshing || window.scrollY > 0) return
      startYRef.current = e.touches[0].clientY
      isPullingRef.current = true
      setIsDragging(true)
    },
    [disabled, isRefreshing]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPullingRef.current) return
      const currentY = e.touches[0].clientY
      const diff = currentY - startYRef.current

      if (diff > 0) {
        // Apply resistance (logarithmic-like pull)
        const distance = Math.min(diff * 0.5, threshold * 1.5)
        setPullDistance(distance)

        // Prevent default scrolling only if pulling down
        if (e.cancelable) e.preventDefault()
      } else {
        isPullingRef.current = false
        setIsDragging(false)
        setPullDistance(0)
      }
    },
    [threshold]
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return
    isPullingRef.current = false
    setIsDragging(false)

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      setPullDistance(threshold)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [onRefresh, pullDistance, threshold])

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    pullDistance,
    isRefreshing,
    isDragging,
    progress: Math.min(pullDistance / threshold, 1),
  }
}
