"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Shield, User } from "lucide-react"

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    icon: Shield,
    email: "admin@emotionframe.com",
    password: "demo1234",
  },
  {
    label: "User",
    icon: User,
    email: "user@emotionframe.com",
    password: "demo1234",
  },
]

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  async function doLogin(email: string, password: string, key: string) {
    setLoading(key)
    setError(null)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Login fehlgeschlagen")
      setLoading(null)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await doLogin(
      formData.get("email") as string,
      formData.get("password") as string,
      "form"
    )
  }

  return (
    <div className="space-y-5">
      {/* Quick Login Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase text-center">Schnell-Login</p>
        <div className="grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              onClick={() => doLogin(account.email, account.password, account.email)}
              disabled={loading !== null}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-ef-primary/20 bg-ef-primary/5 px-4 py-3 text-sm font-semibold text-[#00CEC9] transition-all hover:bg-ef-primary/10 hover:border-ef-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === account.email ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <account.icon className="h-4 w-4" />
              )}
              {account.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">oder manuell</span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ef-primary/50 focus:border-ef-primary placeholder:text-muted-foreground"
          placeholder="E-Mail"
        />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ef-primary/50 focus:border-ef-primary placeholder:text-muted-foreground"
          placeholder="Passwort"
        />
        <button
          type="submit"
          disabled={loading !== null}
          className="w-full rounded-lg bg-ef-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-ef-primary-dark focus:outline-none focus:ring-2 focus:ring-ef-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "form" ? "Anmelden..." : "Anmelden"}
        </button>
      </form>
    </div>
  )
}
