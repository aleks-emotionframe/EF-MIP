import "next-auth"
import "@auth/core/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      globalRole: string
      memberships: {
        organizationId: string
        organizationName: string
        organizationSlug: string
        role: string
      }[]
      activeOrganizationId?: string
    }
  }

  interface User {
    globalRole?: string
    memberships?: {
      organizationId: string
      organizationName: string
      organizationSlug: string
      role: string
    }[]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    globalRole: string
    memberships: {
      organizationId: string
      organizationName: string
      organizationSlug: string
      role: string
    }[]
    activeOrganizationId?: string
  }
}
