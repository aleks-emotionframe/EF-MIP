import { LoginForm } from "@/components/auth/login-form"
import { EFLogo } from "@/components/auth/ef-logo"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F0F5F9]">
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <EFLogo size={48} />
            <p className="mt-4 text-[13px] text-gray-400">
              Melde dich an, um fortzufahren
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-[11px] text-gray-300">
            &copy; {new Date().getFullYear()} EmotionFrame. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  )
}
