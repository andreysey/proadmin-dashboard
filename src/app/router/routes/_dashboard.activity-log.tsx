import { createFileRoute } from '@tanstack/react-router'
import { ActivityLogPageLazy } from '@/pages/activity-log'

export const Route = createFileRoute('/_dashboard/activity-log')({
  component: ActivityLogPageLazy,
})
