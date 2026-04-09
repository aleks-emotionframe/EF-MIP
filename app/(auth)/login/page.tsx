import { LoginForm } from "@/components/auth/login-form"
import { EFLogo } from "@/components/auth/ef-logo"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center animated-gradient">
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-light rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <EFLogo size={56} />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              EmotionFrame
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Melde dich an, um fortzufahren
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} EmotionFrame. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  )
}
