export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  role: 'amdin' | 'user' | 'moderator'
  image: string
}
