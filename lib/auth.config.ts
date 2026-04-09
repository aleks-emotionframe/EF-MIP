import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Providers added in auth.ts (full config with Prisma)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.globalRole = (user as any).globalRole
        token.memberships = (user as any).memberships
        if ((user as any).memberships?.length > 0) {
          token.activeOrganizationId = (user as any).memberships[0].organizationId
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.globalRole = token.globalRole as string
        session.user.memberships = token.memberships as any[]
        session.user.activeOrganizationId = token.activeOrganizationId as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user
      const isPublicRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/api/auth")

      if (isPublicRoute) {
        if (isAuthenticated && nextUrl.pathname === "/login") {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
        return true
      }

      if (!isAuthenticated) {
        const loginUrl = new URL("/login", nextUrl)
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
        return Response.redirect(loginUrl)
      }

      // Admin routes protection
      if (nextUrl.pathname.startsWith("/admin")) {
        const globalRole = auth?.user?.globalRole
        const memberships = (auth?.user as any)?.memberships ?? []
        const activeOrgId = (auth?.user as any)?.activeOrganizationId

        const isSuperAdmin = globalRole === "SUPER_ADMIN"
        const isOrgAdmin = memberships.some(
          (m: any) =>
            m.organizationId === activeOrgId &&
            (m.role === "OWNER" || m.role === "ADMIN")
        )

        if (!isSuperAdmin && !isOrgAdmin) {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
      }

      return true
    },
  },
}
