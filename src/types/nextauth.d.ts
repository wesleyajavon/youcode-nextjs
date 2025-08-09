// types/next-auth.d.ts
import type { DefaultSession, DefaultUser } from 'next-auth'


declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN"
      name: string
      email: string
      image: string
    } 
  }


  interface User extends DefaultUser {
    role?: 'USER' | 'ADMIN' // 👈 Needed for callbacks.user
  }
}
