import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { NextResponse } from 'next/server'
import { User } from 'next-auth'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: User
    githubToken?: string
    githubUserName?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends User {
    githubToken?: string
    githubUserName?: string
    error?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async authorized({ request: req, auth }) {
      const PUBLIC_ROUTES = ['/login', '/']
      const { pathname } = req.nextUrl
      const token = auth?.githubToken
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route)
      const isPrivateRoute = pathname.startsWith('/dashboard')
      if (!token && isPrivateRoute) {
        const url = new URL('/login', req.url)
        return NextResponse.redirect(url)
      }
      if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return true
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token = { ...token, ...user }
      }
      if (account?.provider === 'github') {
        token.githubUserName = profile?.login as string
        token.githubToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.githubToken = token.githubToken
      session.githubUserName = token.githubUserName
      return session
    },
  },
  pages: {
    signIn: `/login`,
    newUser: `/dashboard`,
    signOut: `/`,
    error: `/login`,
  },
})
