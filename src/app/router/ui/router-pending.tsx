/**
 * Loading component shown while lazy-loaded routes are being fetched.
 * Displays centered spinner to indicate navigation is in progress.
 */
export function RouterPendingComponent() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  )
}
