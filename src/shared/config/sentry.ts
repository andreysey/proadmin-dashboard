import * as Sentry from '@sentry/react'

export const initSentry = () => {
  if (import.meta.env.DEV) {
    console.log('Sentry disabled in development mode')
    return
  }

  Sentry.init({
    dsn: 'https://b380c629183455b3872da1226bb9bea7@o4510811216805888.ingest.de.sentry.io/4510811234762832',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, always sample the session when an error occurs.
    sendDefaultPii: true,
  })
}
