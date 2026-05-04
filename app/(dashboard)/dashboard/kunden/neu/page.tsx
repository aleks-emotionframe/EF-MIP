"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Share2,
  Briefcase,
  Video,
  Crown,
  Check,
  Save,
} from "lucide-react"

const BRANCHEN = [
  "Technologie",
  "Mode & Retail",
  "Gastronomie",
  "Tourismus",
  "Finanzdienstleistungen",
  "Gesundheit",
  "Bildung",
  "Immobilien",
  "Medien",
  "Sonstige",
]

const PLANS = [
  {
    key: "FREE",
    name: "Free",
    description: "Grundfunktionen für den Einstieg",
  },
  {
    key: "STARTER",
    name: "Starter",
    description: "Ideal für kleine Unternehmen",
  },
  {
    key: "PROFESSIONAL",
    name: "Professional",
    description: "Erweiterte Analysen & Automatisierung",
  },
  {
    key: "ENTERPRISE",
    name: "Enterprise",
    description: "Massgeschneiderte Lösung für Grossunternehmen",
  },
]

const SOCIAL_FIELDS = [
  {
    field: "instagram" as const,
    icon: Camera,
    placeholder: "@benutzername oder URL",
    color: "text-[#E4405F]",
  },
  {
    field: "facebook" as const,
    icon: Share2,
    placeholder: "Share2 URL oder Seitenname",
    color: "text-[#1877F2]",
  },
  {
    field: "linkedin" as const,
    icon: Briefcase,
    placeholder: "LinkedIn URL oder Firmenname",
    color: "text-[#0A66C2]",
  },
  {
    field: "tiktok" as const,
    icon: Globe,
    placeholder: "@benutzername oder URL",
    color: "text-[#000000] dark:text-white",
  },
  {
    field: "youtube" as const,
    icon: Video,
    placeholder: "YouTube Kanal-URL",
    color: "text-[#FF0000]",
  },
]

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
}

interface FormData {
  firmenname: string
  branche: string
  website: string
  adresse: string
  plz: string
  ort: string
  land: string
  kontaktName: string
  kontaktEmail: string
  kontaktTelefon: string
  instagram: string
  facebook: string
  linkedin: string
  tiktok: string
  youtube: string
  plan: string
  aktiv: boolean
}

export default function NeuerKundePage() {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState<FormData>({
    firmenname: "",
    branche: "",
    website: "",
    adresse: "",
    plz: "",
    ort: "",
    land: "Schweiz",
    kontaktName: "",
    kontaktEmail: "",
    kontaktTelefon: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
    plan: "FREE",
    aktiv: true,
  })

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, boolean> = {}
    if (!form.firmenname.trim()) newErrors.firmenname = true
    if (!form.kontaktName.trim()) newErrors.kontaktName = true
    if (!form.kontaktEmail.trim()) newErrors.kontaktEmail = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    console.log("Neuer Kunde:", form)
    setShowToast(true)
    setTimeout(() => {
      router.push("/dashboard/kunden")
    }, 1500)
  }

  const inputBase =
    "w-full rounded border border-gray-200 dark:border-white/10 bg-[#F8FAFC] dark:bg-white/[0.05] px-4 py-3 text-[13px] text-[#0F172A] dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#00CEC9]/20 focus:border-[#00CEC9] placeholder:text-gray-300 dark:placeholder:text-white/20"

  const inputError =
    "border-red-400 dark:border-red-400 focus:ring-red-400/20 focus:border-red-400"

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/kunden"
              className="flex items-center justify-center w-10 h-10 rounded border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-white/50" />
            </Link>
            <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">
              Neuen Kunden registrieren
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/kunden"
              className="border border-gray-200 dark:border-white/10 rounded px-6 py-3 text-[13px] font-medium text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white rounded px-6 py-3 text-[13px] font-semibold shadow-md shadow-[#00CEC9]/20 flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Kunde speichern
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="h-5 w-5 text-[#6C5CE7]" />
              <h2 className="text-[15px] font-semibold text-[#0F172A] dark:text-white">
                Unternehmensdaten
              </h2>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  Firmenname <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.firmenname}
                  onChange={(e) => update("firmenname", e.target.value)}
                  placeholder="z.B. Muster GmbH"
                  className={`${inputBase} ${errors.firmenname ? inputError : ""}`}
                />
                {errors.firmenname && (
                  <p className="text-[12px] text-red-400 mt-1">
                    Firmenname ist erforderlich
                  </p>
                )}
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  Branche
                </label>
                <select
                  value={form.branche}
                  onChange={(e) => update("branche", e.target.value)}
                  className={`${inputBase} appearance-none`}
                >
                  <option value="">Branche auswählen...</option>
                  {BRANCHEN.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 dark:text-white/20" />
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                    placeholder="https://www.beispiel.ch"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 dark:text-white/20" />
                  <input
                    type="text"
                    value={form.adresse}
                    onChange={(e) => update("adresse", e.target.value)}
                    placeholder="Strasse und Hausnummer"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                    PLZ
                  </label>
                  <input
                    type="text"
                    value={form.plz}
                    onChange={(e) => update("plz", e.target.value)}
                    placeholder="8000"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                    Ort
                  </label>
                  <input
                    type="text"
                    value={form.ort}
                    onChange={(e) => update("ort", e.target.value)}
                    placeholder="Zürich"
                    className={inputBase}
                  />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  Land
                </label>
                <input
                  type="text"
                  value={form.land}
                  onChange={(e) => update("land", e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <User className="h-5 w-5 text-[#00CEC9]" />
              <h2 className="text-[15px] font-semibold text-[#0F172A] dark:text-white">
                Kontaktperson
              </h2>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 dark:text-white/20" />
                  <input
                    type="text"
                    value={form.kontaktName}
                    onChange={(e) => update("kontaktName", e.target.value)}
                    placeholder="Vor- und Nachname"
                    className={`${inputBase} pl-10 ${errors.kontaktName ? inputError : ""}`}
                  />
                </div>
                {errors.kontaktName && (
                  <p className="text-[12px] text-red-400 mt-1">
                    Name ist erforderlich
                  </p>
                )}
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  E-Mail <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 dark:text-white/20" />
                  <input
                    type="email"
                    value={form.kontaktEmail}
                    onChange={(e) => update("kontaktEmail", e.target.value)}
                    placeholder="name@firma.ch"
                    className={`${inputBase} pl-10 ${errors.kontaktEmail ? inputError : ""}`}
                  />
                </div>
                {errors.kontaktEmail && (
                  <p className="text-[12px] text-red-400 mt-1">
                    E-Mail ist erforderlich
                  </p>
                )}
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block">
                  Telefon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 dark:text-white/20" />
                  <input
                    type="tel"
                    value={form.kontaktTelefon}
                    onChange={(e) => update("kontaktTelefon", e.target.value)}
                    placeholder="+41 44 123 45 67"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Camera className="h-5 w-5 text-[#E4405F]" />
              <h2 className="text-[15px] font-semibold text-[#0F172A] dark:text-white">
                Social Media
              </h2>
            </div>
            <div className="grid gap-4">
              {SOCIAL_FIELDS.map(({ field, icon: Icon, placeholder, color }) => (
                <div key={field}>
                  <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-1.5 block capitalize">
                    {field === "tiktok" ? "TikTok" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="relative">
                    <Icon
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${color}`}
                    />
                    <input
                      type="text"
                      value={form[field]}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={placeholder}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white dark:bg-[#1E293B] rounded shadow-sm border border-gray-100 dark:border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Crown className="h-5 w-5 text-[#F59E0B]" />
              <h2 className="text-[15px] font-semibold text-[#0F172A] dark:text-white">
                Plan & Einstellungen
              </h2>
            </div>
            <div className="mb-5">
              <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-3 block">
                Plan auswählen
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PLANS.map((p) => {
                  const selected = form.plan === p.key
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => update("plan", p.key)}
                      className={`relative rounded border-2 p-4 text-left transition-all cursor-pointer ${
                        selected
                          ? "border-[#00CEC9] bg-[#00CEC9]/5 dark:bg-[#00CEC9]/10"
                          : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00CEC9] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <p
                        className={`text-[13px] font-semibold mb-1 ${
                          selected
                            ? "text-[#00CEC9]"
                            : "text-[#0F172A] dark:text-white"
                        }`}
                      >
                        {p.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-white/50 leading-snug">
                        {p.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="text-[13px] font-medium text-gray-700 dark:text-white/70 mb-3 block">
                Status
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update("aktiv", !form.aktiv)}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    form.aktiv ? "bg-[#00CEC9]" : "bg-gray-300 dark:bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      form.aktiv ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-[13px] text-[#0F172A] dark:text-white">
                  {form.aktiv ? "Aktiv" : "Inaktiv"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Link
            href="/dashboard/kunden"
            className="border border-gray-200 dark:border-white/10 rounded px-6 py-3 text-[13px] font-medium text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white rounded px-6 py-3 text-[13px] font-semibold shadow-md shadow-[#00CEC9]/20 flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Kunde speichern
          </button>
        </div>
      </form>

      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white dark:bg-[#1E293B] rounded shadow-lg border border-gray-100 dark:border-white/[0.06] px-5 py-4"
        >
          <div className="w-8 h-8 rounded-full bg-[#00CEC9]/10 flex items-center justify-center">
            <Check className="h-4 w-4 text-[#00CEC9]" />
          </div>
          <p className="text-[13px] font-medium text-[#0F172A] dark:text-white">
            Kunde wurde erfolgreich gespeichert
          </p>
        </motion.div>
      )}
    </div>
  )
}
