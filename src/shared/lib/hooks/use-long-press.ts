import { useCallback, useRef } from 'react'

interface LongPressOptions {
  threshold?: number
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void
}

export const useLongPress = ({ onLongPress, threshold = 500 }: LongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isTargetTouch = useRef(false)

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // Prevent context menu from appearing if we want to handle long press
      // but only if it's a touch event to avoid breaking right-clicks on desktop
      if (event.type === 'touchstart') {
        isTargetTouch.current = true
      }

      timerRef.current = setTimeout(() => {
        onLongPress(event)
      }, threshold)
    },
    [onLongPress, threshold]
  )

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: stop,
  }
}
