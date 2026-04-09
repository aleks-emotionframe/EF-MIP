import { LoginForm } from "@/components/auth/login-form"
import { EFLogo } from "@/components/auth/ef-logo"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center animated-gradient">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-light rounded-2xl p-8 shadow-2xl">
          {/* Logo & Branding */}
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

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Demo-Zugangsdaten</p>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span className="font-mono">admin@emotionframe.com / demo1234</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User:</span>
                <span className="font-mono">user@emotionframe.com / demo1234</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} EmotionFrame. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  )
}
