import { lazy } from 'react'

export const ActivityLogPageLazy = lazy(() =>
  import('./activity-log-page').then((m) => ({ default: m.ActivityLogPage }))
)
