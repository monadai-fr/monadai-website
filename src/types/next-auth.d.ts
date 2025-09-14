/**
 * Types NextAuth.js pour TypeScript
 * Extension des interfaces pour MonadAI
 */

import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: 'admin' | 'user'
    }
  }

  interface User {
    role?: 'admin' | 'user'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: 'admin' | 'user'
    email?: string
  }
}
