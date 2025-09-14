import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

/**
 * NextAuth.js Configuration MonadAI
 * Restriction : SEULEMENT raph@monadai.fr
 */

const ADMIN_EMAIL = 'raph@monadai.fr'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 🔒 SÉCURITÉ : Seul votre email est autorisé
      if (user.email === ADMIN_EMAIL) {
        console.log(`✅ Admin login autorisé: ${user.email}`)
        return true
      }
      
      console.log(`❌ Accès refusé pour: ${user.email}`)
      return false // Refuse tous les autres comptes Google
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
    maxAge: 60 * 60, // 1 heure comme demandé (au lieu de 24h)
  },
  // Utiliser pages NextAuth.js par défaut (plus simple et sans bug)
  debug: process.env.NODE_ENV === 'development', // Debug en dev seulement
})

export { handler as GET, handler as POST }
