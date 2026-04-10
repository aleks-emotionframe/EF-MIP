"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Inbox, Send, Sparkles, MessageSquare, Clock, Eye,
  Users, ChevronRight, Search, Loader2,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
type Platform = "instagram" | "facebook" | "linkedin" | "tiktok"
type FilterTab = "alle" | "ungelesen" | Platform

interface Message {
  id: string
  platform: Platform
  senderName: string
  senderHandle: string
  followerCount: string
  avatarInitials: string
  preview: string
  timestamp: string
  unread: boolean
  thread: ThreadMessage[]
}

interface ThreadMessage {
  id: string
  sender: "them" | "me"
  text: string
  timestamp: string
}

// ─── Platform Config ────────────────────────────────────────────
const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; icon: string }> = {
  instagram: { label: "Instagram", color: "#E4405F", icon: "IG" },
  facebook:  { label: "Facebook",  color: "#1877F2", icon: "FB" },
  linkedin:  { label: "LinkedIn",  color: "#0A66C2", icon: "LI" },
  tiktok:    { label: "TikTok",    color: "#000000", icon: "TT" },
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "alle",      label: "Alle" },
  { key: "ungelesen", label: "Ungelesen" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook",  label: "Facebook" },
  { key: "linkedin",  label: "LinkedIn" },
  { key: "tiktok",    label: "TikTok" },
]

// ─── AI Reply Templates ─────────────────────────────────────────
const AI_REPLIES: Record<string, string> = {
  m1: "Vielen Dank für deine Nachricht, Anna! 🙏 Unsere neue Kollektion ist ab dem 20. April verfügbar. Soll ich dich benachrichtigen, sobald sie online ist? Liebe Grüsse, dein EmotionFrame-Team",
  m2: "Hallo Marc! Danke für dein Interesse an einer Zusammenarbeit. Wir sind offen für Kooperationen mit Creators aus dem Lifestyle-Bereich. Ich sende dir gerne unsere Media-Kit zu – passt das?",
  m3: "Hi Lisa! Danke für dein Feedback zum Webinar – freut uns sehr! 🎉 Die Aufzeichnung findest du ab morgen in deinem Dashboard unter 'Ressourcen'. Bei Fragen melde dich jederzeit!",
  m4: "Vielen Dank für deine Nachricht, Thomas. Die Preise für unser Enterprise-Paket starten bei CHF 299/Monat. Gerne kann ich dir ein individuelles Angebot erstellen – wann passt ein kurzer Call?",
  m5: "Hallo Sandra! Danke für den Hinweis. Wir haben das Problem identifiziert und arbeiten bereits an einer Lösung. Du solltest innerhalb von 24 Stunden wieder vollen Zugriff haben. Sorry für die Unannehmlichkeiten!",
  m6: "Hi Peter! Mega cool, dass dir unser Content gefällt! 🔥 Wir posten jeden Dienstag und Donnerstag neue Reels. Folge uns, um nichts zu verpassen!",
  m7: "Hallo Julia! Herzlichen Dank für die Empfehlung. Wir schätzen das sehr! Als Dankeschön schenken wir dir einen Monat Premium kostenlos. Der Code wird dir per DM zugestellt.",
  m8: "Vielen Dank für deine Bewerbung, David! Dein Profil sieht sehr spannend aus. Unser HR-Team meldet sich innerhalb der nächsten Woche bei dir. Bis bald!",
  m9: "Hi Nina! Unsere Öffnungszeiten sind Mo–Fr 08:00–18:00 Uhr. Samstags sind wir von 09:00–14:00 erreichbar. Wie können wir dir weiterhelfen?",
  m10: "Hallo Simon! Ja, wir bieten einen Studentenrabatt von 30% an. Sende uns einfach einen Nachweis deiner Immatrikulation und wir aktivieren den Rabatt für dein Konto.",
}

// ─── Demo Data ──────────────────────────────────────────────────
const DEMO_MESSAGES: Message[] = [
  {
    id: "m1",
    platform: "instagram",
    senderName: "Anna Müller",
    senderHandle: "@anna.mueller",
    followerCount: "12.4K",
    avatarInitials: "AM",
    preview: "Hey! Wann kommt eure neue Kollektion raus? Bin mega gespannt! 😍",
    timestamp: "Vor 5 Min.",
    unread: true,
    thread: [
      { id: "t1a", sender: "them", text: "Hey! Wann kommt eure neue Kollektion raus? Bin mega gespannt! 😍", timestamp: "14:23" },
      { id: "t1b", sender: "me", text: "Hi Anna! Danke für dein Interesse! Wir haben bald News dazu 🎉", timestamp: "14:30" },
      { id: "t1c", sender: "them", text: "Cool! Kann ich schon irgendwo vorbestellen?", timestamp: "14:32" },
    ],
  },
  {
    id: "m2",
    platform: "linkedin",
    senderName: "Marc Steiner",
    senderHandle: "Marc Steiner",
    followerCount: "8.2K",
    avatarInitials: "MS",
    preview: "Guten Tag, ich würde gerne eine Kooperation mit Ihrem Unternehmen besprechen.",
    timestamp: "Vor 12 Min.",
    unread: true,
    thread: [
      { id: "t2a", sender: "them", text: "Guten Tag, ich würde gerne eine Kooperation mit Ihrem Unternehmen besprechen. Wir sind im Bereich Lifestyle-Content unterwegs und denken, dass eine Zusammenarbeit für beide Seiten spannend wäre.", timestamp: "14:16" },
      { id: "t2b", sender: "me", text: "Guten Tag Herr Steiner, vielen Dank für Ihre Nachricht. Das klingt interessant!", timestamp: "14:20" },
      { id: "t2c", sender: "them", text: "Freut mich! Hätten Sie diese Woche Zeit für einen kurzen Call?", timestamp: "14:22" },
    ],
  },
  {
    id: "m3",
    platform: "facebook",
    senderName: "Lisa Weber",
    senderHandle: "Lisa Weber",
    followerCount: "3.1K",
    avatarInitials: "LW",
    preview: "Tolles Webinar gestern! Gibt es eine Aufzeichnung davon?",
    timestamp: "Vor 28 Min.",
    unread: true,
    thread: [
      { id: "t3a", sender: "them", text: "Tolles Webinar gestern! Gibt es eine Aufzeichnung davon? Würde das gerne nochmal anschauen.", timestamp: "14:00" },
      { id: "t3b", sender: "them", text: "Vor allem der Teil über KI-gestützte Content-Planung war super spannend!", timestamp: "14:01" },
    ],
  },
  {
    id: "m4",
    platform: "linkedin",
    senderName: "Thomas Keller",
    senderHandle: "Thomas Keller",
    followerCount: "15.7K",
    avatarInitials: "TK",
    preview: "Wie sind die Preise für euer Enterprise-Paket? Wir evaluieren gerade Tools.",
    timestamp: "Vor 45 Min.",
    unread: true,
    thread: [
      { id: "t4a", sender: "them", text: "Wie sind die Preise für euer Enterprise-Paket? Wir evaluieren gerade Tools für unser Marketing-Team (15 Personen).", timestamp: "13:43" },
    ],
  },
  {
    id: "m5",
    platform: "instagram",
    senderName: "Sandra Huber",
    senderHandle: "@sandra_huber",
    followerCount: "5.8K",
    avatarInitials: "SH",
    preview: "Ich kann mich nicht mehr einloggen seit dem letzten Update 😢",
    timestamp: "Vor 1 Std.",
    unread: true,
    thread: [
      { id: "t5a", sender: "them", text: "Hallo! Ich kann mich nicht mehr einloggen seit dem letzten Update 😢 Habe schon das Passwort zurückgesetzt, aber es klappt trotzdem nicht.", timestamp: "13:28" },
      { id: "t5b", sender: "me", text: "Oh nein! Das tut mir leid. Kannst du mir deine E-Mail-Adresse schicken? Ich leite das weiter.", timestamp: "13:35" },
      { id: "t5c", sender: "them", text: "Klar, sandra.huber@beispiel.ch – Danke für die schnelle Antwort!", timestamp: "13:37" },
    ],
  },
  {
    id: "m6",
    platform: "tiktok",
    senderName: "Peter Brunner",
    senderHandle: "@peterbrunner",
    followerCount: "22.1K",
    avatarInitials: "PB",
    preview: "Euer letztes Reel war mega! 🔥 Wie macht ihr das?",
    timestamp: "Vor 2 Std.",
    unread: false,
    thread: [
      { id: "t6a", sender: "them", text: "Euer letztes Reel war mega! 🔥 Wie macht ihr das? Welche Tools nutzt ihr zum Schneiden?", timestamp: "12:28" },
      { id: "t6b", sender: "me", text: "Danke Peter! Wir nutzen hauptsächlich CapCut und unsere eigene KI für die Texte 😊", timestamp: "12:45" },
    ],
  },
  {
    id: "m7",
    platform: "facebook",
    senderName: "Julia Meier",
    senderHandle: "Julia Meier",
    followerCount: "1.9K",
    avatarInitials: "JM",
    preview: "Habe euch bei meinen Freunden empfohlen! Toller Service 👏",
    timestamp: "Vor 3 Std.",
    unread: false,
    thread: [
      { id: "t7a", sender: "them", text: "Habe euch bei meinen Freunden empfohlen! Toller Service 👏 Ihr habt mir wirklich geholfen, meine Social Media Strategie auf das nächste Level zu bringen.", timestamp: "11:15" },
      { id: "t7b", sender: "me", text: "Wow Julia, das freut uns riesig! Danke für deine Unterstützung! 💜", timestamp: "11:30" },
      { id: "t7c", sender: "them", text: "Gerne! Habt ihr vielleicht auch ein Referral-Programm?", timestamp: "11:32" },
    ],
  },
  {
    id: "m8",
    platform: "linkedin",
    senderName: "David Schmid",
    senderHandle: "David Schmid",
    followerCount: "4.5K",
    avatarInitials: "DS",
    preview: "Ich interessiere mich für die offene Stelle im Marketing-Team.",
    timestamp: "Vor 4 Std.",
    unread: false,
    thread: [
      { id: "t8a", sender: "them", text: "Ich interessiere mich für die offene Stelle im Marketing-Team. Wo kann ich meine Bewerbung einreichen?", timestamp: "10:05" },
      { id: "t8b", sender: "me", text: "Hallo David! Freut uns, dass du Interesse hast. Du kannst dich direkt über unser Karriereportal bewerben.", timestamp: "10:20" },
      { id: "t8c", sender: "them", text: "Perfekt, habe mich gerade beworben. Wie geht es nun weiter?", timestamp: "10:45" },
    ],
  },
  {
    id: "m9",
    platform: "tiktok",
    senderName: "Nina Fischer",
    senderHandle: "@nina.fischer",
    followerCount: "41.3K",
    avatarInitials: "NF",
    preview: "Wie sind eure Öffnungszeiten? Wollte mal vorbeikommen 😊",
    timestamp: "Vor 5 Std.",
    unread: false,
    thread: [
      { id: "t9a", sender: "them", text: "Wie sind eure Öffnungszeiten? Wollte mal vorbeikommen und euer Büro sehen 😊", timestamp: "09:15" },
    ],
  },
  {
    id: "m10",
    platform: "instagram",
    senderName: "Simon Baumann",
    senderHandle: "@simon.baumann",
    followerCount: "2.3K",
    avatarInitials: "SB",
    preview: "Gibt es einen Studentenrabatt bei euch?",
    timestamp: "Gestern",
    unread: false,
    thread: [
      { id: "t10a", sender: "them", text: "Hey! Gibt es einen Studentenrabatt bei euch? Bin noch an der Uni und würde euer Tool mega gerne nutzen.", timestamp: "Gestern, 18:30" },
      { id: "t10b", sender: "me", text: "Hi Simon! Gute Frage, ich kläre das kurz ab und melde mich!", timestamp: "Gestern, 18:45" },
    ],
  },
]

// ─── Page ───────────────────────────────────────────────────────
export default function SocialInboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>("m1")
  const [activeFilter, setActiveFilter] = useState<FilterTab>("alle")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAiReply, setShowAiReply] = useState<Record<string, boolean>>({})
  const [aiLoading, setAiLoading] = useState(false)
  const [replyText, setReplyText] = useState("")

  // ─── Filtering ────────────────────────────────────────────
  const filtered = useMemo(() => {
    return DEMO_MESSAGES.filter((m) => {
      if (activeFilter === "ungelesen" && !m.unread) return false
      if (activeFilter !== "alle" && activeFilter !== "ungelesen" && m.platform !== activeFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return m.senderName.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q)
      }
      return true
    })
  }, [activeFilter, searchQuery])

  const selected = DEMO_MESSAGES.find((m) => m.id === selectedId) ?? null
  const unreadCount = DEMO_MESSAGES.filter((m) => m.unread).length

  function handleAiSuggest() {
    if (!selectedId) return
    setAiLoading(true)
    setTimeout(() => {
      setShowAiReply((prev) => ({ ...prev, [selectedId]: true }))
      setAiLoading(false)
      setReplyText(AI_REPLIES[selectedId] ?? "Vielen Dank für deine Nachricht! Wir melden uns schnellstmöglich bei dir.")
    }, 1200)
  }

  function handleSelectMessage(id: string) {
    setSelectedId(id)
    setShowAiReply({})
    setReplyText("")
    setAiLoading(false)
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00CEC9]/10">
              <Inbox className="h-5 w-5 text-[#00CEC9]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Social Inbox</h1>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#00CEC9] px-2 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">
            Alle Nachrichten deiner Social-Media-Kanäle an einem Ort.
            <span className="ml-2 inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-200/60 ring-inset">
              Demo-Daten
            </span>
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { value: "128", label: "Nachrichten", icon: MessageSquare, accent: "#0F172A" },
          { value: "23", label: "Ungelesen", icon: Eye, accent: "#00CEC9" },
          { value: "4", label: "Plattformen", icon: Users, accent: "#6C5CE7" },
          { value: "Ø 12 Min.", label: "Antwortzeit", icon: Clock, accent: "#F59E0B" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 p-4 flex items-center gap-3"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${stat.accent}10` }}
            >
              <stat.icon className="h-5 w-5" style={{ color: stat.accent }} />
            </div>
            <div>
              <p className="text-[20px] font-extrabold text-[#0F172A] dark:text-white leading-tight">{stat.value}</p>
              <p className="text-[11px] text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key
          const platformKey = tab.key as Platform
          const platformColor = PLATFORM_CONFIG[platformKey]?.color
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "text-white shadow-sm"
                  : "bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/10"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor:
                        tab.key === "alle" || tab.key === "ungelesen"
                          ? "#00CEC9"
                          : platformColor,
                    }
                  : undefined
              }
            >
              {tab.key !== "alle" && tab.key !== "ungelesen" && (
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                  style={{
                    backgroundColor: isActive ? "white" : platformColor,
                  }}
                />
              )}
              {tab.label}
              {tab.key === "ungelesen" && (
                <span className="ml-1 text-[10px] opacity-80">{unreadCount}</span>
              )}
            </button>
          )
        })}

        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-48 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E293B] pl-8 pr-3 text-[12px] text-gray-700 dark:text-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00CEC9]/40 transition-all"
          />
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex gap-4 h-[calc(100vh-340px)] min-h-[500px]">
        {/* Left Panel – Message List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[40%] shrink-0 rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <p className="text-[12px] font-semibold text-gray-500 dark:text-white/50 uppercase tracking-wider">
              Konversationen
              <span className="ml-1.5 text-[11px] font-normal normal-case tracking-normal text-gray-400">
                ({filtered.length})
              </span>
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
            <AnimatePresence mode="popLayout">
              {filtered.map((msg) => {
                const platform = PLATFORM_CONFIG[msg.platform]
                const isSelected = selectedId === msg.id
                return (
                  <motion.button
                    key={msg.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`w-full text-left px-4 py-3.5 flex gap-3 transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-[#00CEC9]/[0.06] border-l-[3px] border-l-[#00CEC9]"
                        : "hover:bg-gray-50 dark:hover:bg-white/5 border-l-[3px] border-l-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-bold text-white"
                        style={{ backgroundColor: platform.color }}
                      >
                        {msg.avatarInitials}
                      </div>
                      {/* Platform badge */}
                      <div
                        className="absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full text-[7px] font-bold text-white ring-2 ring-white dark:ring-gray-900"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[13px] truncate ${msg.unread ? "font-bold text-[#0F172A] dark:text-white" : "font-medium text-gray-700 dark:text-white/80"}`}>
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{msg.timestamp}</span>
                      </div>
                      <p className={`text-[12px] mt-0.5 truncate ${msg.unread ? "text-gray-700 dark:text-white/70" : "text-gray-500 dark:text-white/40"}`}>
                        {msg.preview}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {msg.unread && (
                      <div className="flex items-center shrink-0">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#00CEC9]" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Inbox className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-[13px]">Keine Nachrichten gefunden</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Panel – Conversation View */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 rounded-2xl bg-white dark:bg-[#1E293B] shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col"
        >
          {selected ? (
            <>
              {/* Conversation Header */}
              <div className="px-5 py-3.5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-bold text-white shrink-0"
                  style={{ backgroundColor: PLATFORM_CONFIG[selected.platform].color }}
                >
                  {selected.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold text-[#0F172A] dark:text-white truncate">
                      {selected.senderName}
                    </h2>
                    <span
                      className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: PLATFORM_CONFIG[selected.platform].color }}
                    >
                      {PLATFORM_CONFIG[selected.platform].label}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-400 dark:text-white/40">
                    {selected.senderHandle} · {selected.followerCount} Follower
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {selected.thread.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        msg.sender === "me"
                          ? "bg-[#00CEC9] text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/90 rounded-bl-md"
                      }`}
                    >
                      <p className="text-[13px] leading-relaxed">{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.sender === "me" ? "text-white/60" : "text-gray-400 dark:text-white/30"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* AI Suggested Reply */}
                <AnimatePresence>
                  {showAiReply[selected.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-gradient-to-br from-[#6C5CE7]/10 to-[#00CEC9]/10 border border-[#6C5CE7]/20 rounded-br-md">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="h-3 w-3 text-[#6C5CE7]" />
                          <span className="text-[10px] font-semibold text-[#6C5CE7] uppercase tracking-wider">KI-Vorschlag</span>
                        </div>
                        <p className="text-[13px] leading-relaxed text-gray-700 dark:text-white/80">
                          {AI_REPLIES[selected.id]}
                        </p>
                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            onClick={() => setReplyText(AI_REPLIES[selected.id] ?? "")}
                            className="text-[11px] font-medium text-[#00CEC9] hover:text-[#00CEC9]/80 transition-colors"
                          >
                            Übernehmen
                          </button>
                          <span className="text-gray-300">·</span>
                          <button
                            onClick={() => setShowAiReply((prev) => ({ ...prev, [selected.id]: false }))}
                            className="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            Verwerfen
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Reply Area */}
              <div className="border-t border-gray-100 dark:border-white/10 px-5 py-3.5">
                {/* AI Suggest Button */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={handleAiSuggest}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#6C5CE7]/10 to-[#00CEC9]/10 border border-[#6C5CE7]/20 px-3 py-1.5 text-[11px] font-semibold text-[#6C5CE7] hover:from-[#6C5CE7]/15 hover:to-[#00CEC9]/15 transition-all disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    KI-Antwort vorschlagen
                  </button>
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nachricht schreiben..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1E293B] px-4 text-[13px] text-gray-700 dark:text-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00CEC9]/40 focus:border-[#00CEC9]/40 transition-all"
                  />
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 transition-all shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-[#1E293B] mb-4">
                <MessageSquare className="h-8 w-8 opacity-40" />
              </div>
              <p className="text-[15px] font-medium text-gray-500 dark:text-white/50">Wähle eine Konversation</p>
              <p className="text-[12px] text-gray-400 dark:text-white/30 mt-1">
                Klicke links auf eine Nachricht, um den Verlauf anzuzeigen.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
