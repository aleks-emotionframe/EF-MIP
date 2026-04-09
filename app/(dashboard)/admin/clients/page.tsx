"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Building2,
} from "lucide-react"

interface Client {
  id: string
  name: string
  industry: string
  contactEmail: string
  website: string
  isActive: boolean
}

// Demo data
const initialClients: Client[] = [
  { id: "1", name: "TechVision GmbH", industry: "Technologie", contactEmail: "info@techvision.de", website: "techvision.de", isActive: true },
  { id: "2", name: "GreenLeaf AG", industry: "Nachhaltigkeit", contactEmail: "kontakt@greenleaf.de", website: "greenleaf.de", isActive: true },
  { id: "3", name: "MediaPulse", industry: "Medien", contactEmail: "hello@mediapulse.de", website: "mediapulse.de", isActive: false },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  )

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      industry: form.get("industry") as string,
      contactEmail: form.get("contactEmail") as string,
      website: form.get("website") as string,
      isActive: true,
    }

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) => (c.id === editingClient.id ? { ...c, ...data } : c))
      )
    } else {
      setClients((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...data },
      ])
    }
    setShowModal(false)
    setEditingClient(null)
  }

  function handleDelete(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirm(null)
  }

  function openEdit(client: Client) {
    setEditingClient(client)
    setShowModal(true)
  }

  function openCreate() {
    setEditingClient(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Verwalte deine Kunden</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-ef-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-ef-primary-dark transition-colors glow-primary"
        >
          <Plus className="h-4 w-4" />
          Neuer Client
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Suche nach Name oder Branche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ef-primary/50 focus:border-ef-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Branche</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">E-Mail</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Website</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>Keine Clients gefunden</p>
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{client.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{client.industry}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{client.contactEmail}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{client.website}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          client.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {client.isActive ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(client)}
                          className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Bearbeiten"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {deleteConfirm === client.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="rounded-lg px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              Ja
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-lg px-2 py-1 text-xs bg-muted text-foreground hover:bg-muted/80 transition-colors"
                            >
                              Nein
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(client.id)}
                            className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowModal(false); setEditingClient(null) }}
          />
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">
                {editingClient ? "Client bearbeiten" : "Neuer Client"}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingClient(null) }}
                className="rounded-lg p-1 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={editingClient?.name ?? ""}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ef-primary/50 focus:border-ef-primary"
                  placeholder="Firmenname"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">Branche</label>
                <input
                  name="industry"
                  defaultValue={editingClient?.industry ?? ""}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ef-primary/50 focus:border-ef-primary"
                  placeholder="z.B. Technologie"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">E-Mail</label>
                <input
                  name="contactEmail"
                  type="email"
                  defaultValue={editingClient?.contactEmail ?? ""}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ef-primary/50 focus:border-ef-primary"
                  placeholder="kontakt@firma.de"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground/80">Website</label>
                <input
                  name="website"
                  defaultValue={editingClient?.website ?? ""}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ef-primary/50 focus:border-ef-primary"
                  placeholder="firma.de"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingClient(null) }}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-ef-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-ef-primary-dark transition-colors"
                >
                  {editingClient ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
