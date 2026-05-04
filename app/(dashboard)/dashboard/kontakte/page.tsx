"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Plus, Search, Pencil, Trash2, X, Check, Tag,
  Upload, Download, ChevronDown, UserPlus, Mail, Filter,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────
interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
  groups: string[]
  status: "active" | "unsubscribed" | "bounced"
  createdAt: string
}

interface Group {
  id: string
  name: string
  color: string
}

// ─── Demo Data ──────────────────────────────────────────────────
const COLORS = ["#6C5CE7", "#00CEC9", "#FD79A8", "#FDCB6E", "#00B894", "#E17055", "#74b9ff", "#a29bfe"]

const INITIAL_GROUPS: Group[] = [
  { id: "g1", name: "Alle Kunden", color: "#6C5CE7" },
  { id: "g2", name: "Premium Kunden", color: "#00CEC9" },
  { id: "g3", name: "Neue Kunden", color: "#FD79A8" },
  { id: "g4", name: "Beta-Tester", color: "#FDCB6E" },
  { id: "g5", name: "Newsletter", color: "#00B894" },
]

const INITIAL_CONTACTS: Contact[] = [
  { id: "k1", email: "anna.mueller@techvision.ch", firstName: "Anna", lastName: "Müller", groups: ["g1", "g2"], status: "active", createdAt: "12.01.2026" },
  { id: "k2", email: "marc.steiner@greenleaf.ch", firstName: "Marc", lastName: "Steiner", groups: ["g1", "g3"], status: "active", createdAt: "28.02.2026" },
  { id: "k3", email: "lisa.weber@mediapulse.de", firstName: "Lisa", lastName: "Weber", groups: ["g1", "g5"], status: "active", createdAt: "05.03.2026" },
  { id: "k4", email: "thomas.keller@urbanbrands.ch", firstName: "Thomas", lastName: "Keller", groups: ["g1", "g2", "g4"], status: "active", createdAt: "18.11.2025" },
  { id: "k5", email: "sandra.huber@beispiel.ch", firstName: "Sandra", lastName: "Huber", groups: ["g1", "g5"], status: "unsubscribed", createdAt: "03.09.2025" },
  { id: "k6", email: "peter.brunner@firma.ch", firstName: "Peter", lastName: "Brunner", groups: ["g1", "g3"], status: "active", createdAt: "22.03.2026" },
  { id: "k7", email: "julia.meier@startup.io", firstName: "Julia", lastName: "Meier", groups: ["g1", "g4"], status: "active", createdAt: "01.04.2026" },
  { id: "k8", email: "david.schmid@agentur.ch", firstName: "David", lastName: "Schmid", groups: ["g1", "g2"], status: "active", createdAt: "14.02.2026" },
  { id: "k9", email: "nina.fischer@brand.de", firstName: "Nina", lastName: "Fischer", groups: ["g1", "g5"], status: "bounced", createdAt: "08.01.2026" },
  { id: "k10", email: "simon.baumann@corp.ch", firstName: "Simon", lastName: "Baumann", groups: ["g1", "g3", "g5"], status: "active", createdAt: "19.03.2026" },
  { id: "k11", email: "laura.zimmermann@shop.ch", firstName: "Laura", lastName: "Zimmermann", groups: ["g1"], status: "active", createdAt: "25.03.2026" },
  { id: "k12", email: "michael.graf@media.ch", firstName: "Michael", lastName: "Graf", groups: ["g1", "g2", "g5"], status: "active", createdAt: "02.12.2025" },
]

const STATUS_CONFIG = {
  active: { label: "Aktiv", color: "text-emerald-700", bg: "bg-emerald-100" },
  unsubscribed: { label: "Abgemeldet", color: "text-gray-600", bg: "bg-gray-100" },
  bounced: { label: "Bounced", color: "text-red-600", bg: "bg-red-100" },
}

// ─── Page ───────────────────────────────────────────────────────
export default function KontaktePage() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGroup, setFilterGroup] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // New contact form
  const [formEmail, setFormEmail] = useState("")
  const [formFirst, setFormFirst] = useState("")
  const [formLast, setFormLast] = useState("")
  const [formGroups, setFormGroups] = useState<string[]>([])

  // New group form
  const [newGroupName, setNewGroupName] = useState("")

  // ─── Filtering ────────────────────────────────────────────
  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch = !searchQuery ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGroup = filterGroup === "all" || c.groups.includes(filterGroup)
      const matchesStatus = filterStatus === "all" || c.status === filterStatus
      return matchesSearch && matchesGroup && matchesStatus
    })
  }, [contacts, searchQuery, filterGroup, filterStatus])

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    groups.forEach((g) => {
      counts[g.id] = contacts.filter((c) => c.groups.includes(g.id) && c.status === "active").length
    })
    return counts
  }, [contacts, groups])

  // ─── Handlers ─────────────────────────────────────────────
  function openCreate() {
    setEditingContact(null)
    setFormEmail(""); setFormFirst(""); setFormLast(""); setFormGroups(["g1"])
    setShowModal(true)
  }

  function openEdit(contact: Contact) {
    setEditingContact(contact)
    setFormEmail(contact.email); setFormFirst(contact.firstName); setFormLast(contact.lastName); setFormGroups([...contact.groups])
    setShowModal(true)
  }

  function handleSave() {
    if (!formEmail) return
    if (editingContact) {
      setContacts((prev) => prev.map((c) => c.id === editingContact.id ? { ...c, email: formEmail, firstName: formFirst, lastName: formLast, groups: formGroups } : c))
    } else {
      setContacts((prev) => [{ id: `k-${Date.now()}`, email: formEmail, firstName: formFirst, lastName: formLast, groups: formGroups, status: "active" as const, createdAt: new Date().toLocaleDateString("de-CH") }, ...prev])
    }
    setShowModal(false)
  }

  function handleDelete(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setDeleteConfirm(null)
  }

  function handleBulkDelete() {
    setContacts((prev) => prev.filter((c) => !selected.has(c.id)))
    setSelected(new Set())
  }

  function handleBulkAssign(groupId: string) {
    setContacts((prev) => prev.map((c) => selected.has(c.id) && !c.groups.includes(groupId) ? { ...c, groups: [...c.groups, groupId] } : c))
    setShowAssignModal(false)
    setSelected(new Set())
  }

  function handleCreateGroup() {
    if (!newGroupName.trim()) return
    const color = COLORS[groups.length % COLORS.length]
    setGroups((prev) => [...prev, { id: `g-${Date.now()}`, name: newGroupName, color }])
    setNewGroupName("")
    setShowGroupModal(false)
  }

  function handleDeleteGroup(id: string) {
    setGroups((prev) => prev.filter((g) => g.id !== id))
    setContacts((prev) => prev.map((c) => ({ ...c, groups: c.groups.filter((g) => g !== id) })))
    if (filterGroup === id) setFilterGroup("all")
  }

  function toggleSelect(id: string) {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((c) => c.id)))
  }

  const activeCount = contacts.filter((c) => c.status === "active").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#00CEC9]" />
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">Kontakte</h1>
          </div>
          <p className="text-[14px] text-gray-500 dark:text-white/50 mt-1">Verwalte deine Empfänger und Gruppen.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowGroupModal(true)} className="flex items-center gap-1.5 rounded border border-gray-200 dark:border-white/[0.06] px-3 py-2.5 text-[12px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors">
            <Tag className="h-3.5 w-3.5" />Neue Gruppe
          </button>
          <button onClick={openCreate} className="flex items-center gap-1.5 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] px-4 py-2.5 text-[12px] font-semibold text-white hover:shadow-lg hover:shadow-[#00CEC9]/30 transition-all">
            <UserPlus className="h-3.5 w-3.5" />Kontakt hinzufügen
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-4">
          <p className="text-[24px] font-extrabold text-[#0F172A] dark:text-white">{contacts.length}</p>
          <p className="text-[11px] text-gray-400">Gesamt</p>
        </div>
        <div className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-4">
          <p className="text-[20px] font-bold text-emerald-600">{activeCount}</p>
          <p className="text-[11px] text-gray-400">Aktiv</p>
        </div>
        <div className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-4">
          <p className="text-[24px] font-extrabold text-[#0F172A] dark:text-white">{groups.length}</p>
          <p className="text-[11px] text-gray-400">Gruppen</p>
        </div>
        <div className="rounded bg-white dark:bg-[#1E293B] shadow-sm p-4">
          <p className="text-[24px] font-extrabold text-[#0F172A] dark:text-white">{contacts.filter((c) => c.status === "unsubscribed").length}</p>
          <p className="text-[11px] text-gray-400">Abgemeldet</p>
        </div>
      </div>

      {/* Groups */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setFilterGroup("all")}
          className={`rounded px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${filterGroup === "all" ? "bg-[#00CEC9] text-white" : "bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]"}`}>
          Alle <span className="text-[10px] ml-1 opacity-70">{contacts.length}</span>
        </button>
        {groups.map((g) => (
          <div key={g.id} className="relative group/tag">
            <button onClick={() => setFilterGroup(g.id)}
              className={`rounded px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${filterGroup === g.id ? "text-white" : "bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]"}`}
              style={filterGroup === g.id ? { backgroundColor: g.color } : {}}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: filterGroup === g.id ? "white" : g.color }} />
              {g.name}
              <span className="text-[10px] opacity-70">{groupCounts[g.id] ?? 0}</span>
            </button>
            <button onClick={() => handleDeleteGroup(g.id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white items-center justify-center text-[10px] hidden group-hover/tag:flex">
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Search + Filters + Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Name oder E-Mail suchen..."
            className="w-full rounded border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] dark:text-white pl-10 pr-4 py-2.5 text-[13px] focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] px-3 py-2.5 text-[12px] text-gray-600 dark:text-gray-300 focus:border-[#00CEC9] focus:outline-none appearance-none pr-8">
          <option value="all">Alle Status</option>
          <option value="active">Aktiv</option>
          <option value="unsubscribed">Abgemeldet</option>
          <option value="bounced">Bounced</option>
        </select>
        {selected.size > 0 && (
          <div className="flex gap-2">
            <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-1.5 rounded border border-[#00CEC9]/30 bg-[#00CEC9]/[0.06] px-3 py-2.5 text-[12px] font-medium text-[#00CEC9]">
              <Tag className="h-3.5 w-3.5" />{selected.size} → Gruppe zuweisen
            </button>
            <button onClick={handleBulkDelete} className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] font-medium text-red-600">
              <Trash2 className="h-3.5 w-3.5" />Löschen
            </button>
          </div>
        )}
      </div>

      {/* Contact Table */}
      <div className="rounded bg-white dark:bg-[#1E293B] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.04]">
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded border-gray-300 text-[#00CEC9] focus:ring-[#00CEC9]" /></th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">E-Mail</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Gruppen</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => {
                const sc = STATUS_CONFIG[contact.status]
                return (
                  <tr key={contact.id} className="border-b border-gray-50 dark:border-white/[0.06] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.06] transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(contact.id)} onChange={() => toggleSelect(contact.id)} className="rounded border-gray-300 text-[#00CEC9] focus:ring-[#00CEC9]" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00CEC9] to-[#6C5CE7] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0F172A] dark:text-white">{contact.firstName} {contact.lastName}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 md:hidden">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{contact.email}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {contact.groups.slice(0, 3).map((gId) => {
                          const g = groups.find((gr) => gr.id === gId)
                          if (!g) return null
                          return <span key={gId} className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: g.color }}>{g.name}</span>
                        })}
                        {contact.groups.length > 3 && <span className="text-[10px] text-gray-400">+{contact.groups.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(contact)} className="rounded p-2 text-gray-400 hover:text-[#00CEC9] hover:bg-[#00CEC9]/[0.06] transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                        {deleteConfirm === contact.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleDelete(contact.id)} className="rounded px-2 py-1 text-[10px] bg-red-500 text-white">Ja</button>
                            <button onClick={() => setDeleteConfirm(null)} className="rounded px-2 py-1 text-[10px] bg-gray-100 text-gray-600">Nein</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(contact.id)} className="rounded p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-[13px]">Keine Kontakte gefunden</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between text-[12px] text-gray-400 dark:text-gray-500">
          <span>{filtered.length} von {contacts.length} Kontakten</span>
          {selected.size > 0 && <span className="text-[#00CEC9] font-medium">{selected.size} ausgewählt</span>}
        </div>
      </div>

      {/* ─── Modal: Kontakt erstellen/bearbeiten ─────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg mx-4 rounded bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/[0.06] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-gray-900 dark:text-white">{editingContact ? "Kontakt bearbeiten" : "Neuer Kontakt"}</h2>
                <button onClick={() => setShowModal(false)} className="rounded p-1 hover:bg-gray-100 transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vorname</label>
                    <input value={formFirst} onChange={(e) => setFormFirst(e.target.value)} className="w-full rounded border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] dark:text-white px-4 py-2.5 text-[13px] mt-1.5 focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none" placeholder="Anna" /></div>
                  <div><label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nachname</label>
                    <input value={formLast} onChange={(e) => setFormLast(e.target.value)} className="w-full rounded border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] dark:text-white px-4 py-2.5 text-[13px] mt-1.5 focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none" placeholder="Müller" /></div>
                </div>
                <div><label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">E-Mail</label>
                  <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full rounded border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] dark:text-white px-4 py-2.5 text-[13px] mt-1.5 focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none" placeholder="anna@beispiel.ch" /></div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Gruppen</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {groups.map((g) => (
                      <button key={g.id} onClick={() => setFormGroups((prev) => prev.includes(g.id) ? prev.filter((x) => x !== g.id) : [...prev, g.id])}
                        className={`rounded px-3 py-1.5 text-[12px] font-medium transition-all flex items-center gap-1.5 ${formGroups.includes(g.id) ? "text-white" : "bg-gray-50 text-gray-600 border border-gray-200"}`}
                        style={formGroups.includes(g.id) ? { backgroundColor: g.color } : {}}>
                        {formGroups.includes(g.id) && <Check className="h-3 w-3" />}
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 rounded border border-gray-200 dark:border-white/[0.06] py-2.5 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors">Abbrechen</button>
                  <button onClick={handleSave} disabled={!formEmail} className="flex-1 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] py-2.5 text-[13px] font-semibold text-white hover:bg-[#00B4A3] disabled:opacity-50 transition-colors">{editingContact ? "Speichern" : "Erstellen"}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Modal: Neue Gruppe ──────────────────────────────── */}
      <AnimatePresence>
        {showGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowGroupModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm mx-4 rounded bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/[0.06] p-6 shadow-2xl">
              <h2 className="text-[16px] font-bold text-gray-900 mb-4">Neue Gruppe</h2>
              <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
                placeholder="Gruppenname..." autoFocus
                className="w-full rounded border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#1E293B] dark:text-white px-4 py-2.5 text-[13px] focus:border-[#00CEC9] focus:ring-2 focus:ring-[#00CEC9]/20 focus:outline-none" />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowGroupModal(false)} className="flex-1 rounded border border-gray-200 dark:border-white/[0.06] py-2.5 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors">Abbrechen</button>
                <button onClick={handleCreateGroup} disabled={!newGroupName.trim()} className="flex-1 rounded bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] py-2.5 text-[13px] font-semibold text-white hover:bg-[#00B4A3] disabled:opacity-50 transition-colors">Erstellen</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Modal: Gruppe zuweisen ──────────────────────────── */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm mx-4 rounded bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/[0.06] p-6 shadow-2xl">
              <h2 className="text-[16px] font-bold text-gray-900 mb-1">Gruppe zuweisen</h2>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4">{selected.size} Kontakt(e) einer Gruppe zuweisen</p>
              <div className="space-y-2">
                {groups.map((g) => (
                  <button key={g.id} onClick={() => handleBulkAssign(g.id)}
                    className="w-full flex items-center gap-3 rounded border border-gray-200 dark:border-white/[0.06] p-3 text-left hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                    <span className="text-[13px] font-semibold text-[#0F172A] dark:text-white">{g.name}</span>
                    <span className="text-[11px] text-gray-400 ml-auto">{groupCounts[g.id] ?? 0} Kontakte</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAssignModal(false)} className="w-full rounded border border-gray-200 py-2.5 mt-4 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">Abbrechen</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
