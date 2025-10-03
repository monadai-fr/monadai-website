import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * NextAuth.js Route Handler - MonadAI
 * Configuration centralisée dans @/lib/auth.ts
 */

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
