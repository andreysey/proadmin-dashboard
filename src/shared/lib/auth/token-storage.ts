const TOKEN_KEY = 'auth_token'

// NOTE: In production, tokens should be stored in httpOnly cookies
// to prevent XSS attacks. localStorage is used here for development
// simplicity with MSW mock server.
export const tokenStorage = {
  get: () => {
    return localStorage.getItem(TOKEN_KEY)
  },
  set: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
  },
  remove: () => {
    localStorage.removeItem(TOKEN_KEY)
  },
}
