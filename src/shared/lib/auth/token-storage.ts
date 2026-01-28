export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

// NOTE: In production, tokens should be stored in httpOnly cookies
// to prevent XSS attacks. localStorage is used here for development
// simplicity with MSW mock server.
export const tokenStorage = {
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN)
  },
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN)
  },
  setTokens: (tokens: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN, tokens.refreshToken)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
  },
}
