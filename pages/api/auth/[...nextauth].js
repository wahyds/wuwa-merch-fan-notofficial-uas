// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.email = user.email
        token.role = user.email === 'admin@gmail.com' ? 'admin' : 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (token?.email) {
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
    async redirect({ baseUrl }) {
      return baseUrl + '/Dashboard'
    },
  },
})
