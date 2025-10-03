import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

/**
 * Configuration NextAuth.js centralisée - MonadAI
 * Exporté pour réutilisation dans middleware et API routes
 */

export const ADMIN_EMAIL = 'raph@monadai.fr'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 🔒 SÉCURITÉ : Seul l'email admin est autorisé
      return user.email === ADMIN_EMAIL
    },
    
    async session({ session, token }) {
      // Enrichir session avec rôle admin
      if (session.user?.email === ADMIN_EMAIL) {
        session.user.role = 'admin'
      }
      return session
    },
    
    async jwt({ token, user }) {
      // Ajouter rôle au JWT
      if (user && user.email === ADMIN_EMAIL) {
        token.role = 'admin'
        token.email = user.email
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 heure
  },
  debug: false
}

