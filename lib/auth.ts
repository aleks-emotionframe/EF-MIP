import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/lib/auth.config"

// Demo user for development without database
const DEMO_USERS = [
  {
    id: "demo-admin-1",
    email: "admin@emotionframe.com",
    name: "Alex Admin",
    passwordHash: "$2a$10$demo", // checked below with direct compare
    password: "demo1234",
    image: null,
    globalRole: "SUPER_ADMIN" as const,
    memberships: [
      {
        organizationId: "demo-org-1",
        organizationName: "EmotionFrame Demo",
        organizationSlug: "emotionframe-demo",
        role: "OWNER",
      },
      {
        organizationId: "demo-org-2",
        organizationName: "TechVision GmbH",
        organizationSlug: "techvision",
        role: "ADMIN",
      },
    ],
  },
  {
    id: "demo-user-1",
    email: "user@emotionframe.com",
    name: "Maria Viewer",
    passwordHash: "$2a$10$demo",
    password: "demo1234",
    image: null,
    globalRole: "USER" as const,
    memberships: [
      {
        organizationId: "demo-org-1",
        organizationName: "EmotionFrame Demo",
        organizationSlug: "emotionframe-demo",
        role: "VIEWER",
      },
    ],
  },
]

async function authorizeWithDatabase(email: string, password: string) {
  if (!prisma) return null

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: { organization: true },
        where: { organization: { isActive: true } },
      },
    },
  })

  if (!user || !user.isActive) return null

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    globalRole: user.globalRole,
    memberships: user.memberships.map((m) => ({
      organizationId: m.organizationId,
      organizationName: m.organization.name,
      organizationSlug: m.organization.slug,
      role: m.role,
    })),
  }
}

function authorizeWithDemo(email: string, password: string) {
  const demoUser = DEMO_USERS.find(
    (u) => u.email === email && u.password === password
  )
  if (!demoUser) return null

  return {
    id: demoUser.id,
    email: demoUser.email,
    name: demoUser.name,
    image: demoUser.image,
    globalRole: demoUser.globalRole,
    memberships: demoUser.memberships,
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        // Try real database first, fall back to demo users
        if (prisma) {
          const dbUser = await authorizeWithDatabase(email, password)
          if (dbUser) return dbUser
        }

        return authorizeWithDemo(email, password)
      },
    }),
  ],
})
