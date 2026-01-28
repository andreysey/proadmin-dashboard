import axios from 'axios'
import { config } from '../config'
import { tokenStorage } from '../lib/auth'
import { toast } from 'sonner'

let onUnauthorized: (() => void) | null = null
let onForbidden: (() => void) | null = null

let isRefreshing = false
interface FailedRequest {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}
let failedQueue: FailedRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler
}

export const setForbiddenHandler = (handler: () => void) => {
  onForbidden = handler
}

export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      console.log('Interceptor: 401 detected. Attempting silent refresh...')
      const originalRequest = error.config

      // If we are already refreshing, join the queue
      if (isRefreshing) {
        console.log('Interceptor: Refresh already in progress, adding request to queue.')
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      // 2. Mark this request as "in progress of retry" so we don't loop
      originalRequest._retry = true
      isRefreshing = true

      const refreshPromise = (async () => {
        try {
          const refreshToken = tokenStorage.getRefreshToken()

          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          const response = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
            refreshToken,
          })

          const { token, refreshToken: newRefreshToken } = response.data

          console.log('Interceptor: Token refreshed successfully!')
          tokenStorage.setTokens({ accessToken: token, refreshToken: newRefreshToken })
          processQueue(null, token)

          console.log('Interceptor: Retrying original request...')
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        } catch (refreshError) {
          console.error('Interceptor: Refresh failed. Redirecting to login.')
          toast.error('Session expired', {
            description: 'Please sign in again to continue.',
          })
          processQueue(refreshError, null)
          onUnauthorized?.()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      })()

      return refreshPromise
    }

    if (error.response?.status === 403) {
      // Handle forbidden (e.g., redirect to home/dashboard)
      onForbidden?.()
    }

    return Promise.reject(error)
  }
)
