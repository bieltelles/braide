"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Plus, Clock, Check, X, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  cityId: string;
  city: { id: string; name: string };
  date: string;
  endDate: string | null;
  location: string | null;
  type: string;
  status: string;
}

const typeLabels: Record<string, string> = {
  visita: "Visita",
  comicio: "Comício",
  reuniao: "Reunião",
  caravana: "Caravana",
};

const fallbackEvents: EventItem[] = [
  { id: "1", title: "Caravana da Transformação - Tocantina", description: null, cityId: "1", city: { id: "1", name: "Imperatriz" }, date: "2026-04-15", endDate: null, location: "Praça Brasil, Centro", type: "caravana", status: "scheduled" },
  { id: "2", title: "Reunião com lideranças", description: null, cityId: "2", city: { id: "2", name: "Balsas" }, date: "2026-04-12", endDate: null, location: "Centro de Convenções", type: "reuniao", status: "scheduled" },
  { id: "3", title: "Visita a obras", description: null, cityId: "3", city: { id: "3", name: "Timon" }, date: "2026-04-08", endDate: null, location: "Diversos pontos", type: "visita", status: "scheduled" },
  { id: "4", title: "Caravana pelo Baixo Parnaíba", description: null, cityId: "4", city: { id: "4", name: "Chapadinha" }, date: "2026-03-28", endDate: null, location: "Praça Central", type: "caravana", status: "completed" },
  { id: "5", title: "Reunião com prefeitos", description: null, cityId: "5", city: { id: "5", name: "Bacabal" }, date: "2026-03-22", endDate: null, location: "Câmara Municipal", type: "reuniao", status: "completed" },
];

export default function AdminEventos() {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", cityId: "", date: "", location: "", description: "" });
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);

  const fetchEvents = useCallback(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => { if (data.events?.length) setEvents(data.events); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((data) => { if (data.cities?.length) setCities(data.cities); })
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.type || !form.date) return;
    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          cityId: form.cityId || undefined,
          date: form.date,
          location: form.location || undefined,
          description: form.description || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents((prev) => [data.event, ...prev]);
        setForm({ title: "", type: "", cityId: "", date: "", location: "", description: "" });
        setShowForm(false);
      }
    } catch {}
    setSaving(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    try {
      await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Eventos</h1>
          <p className="text-muted-foreground">Gerencie a agenda de eventos da campanha.</p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-border/50 p-6 mb-6"
        >
          <h3 className="font-bold text-foreground mb-4">Novo Evento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nome do evento"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Selecione...</option>
                {Object.entries(typeLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cidade</label>
              {cities.length > 0 ? (
                <select
                  value={form.cityId}
                  onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Selecione...</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={form.cityId}
                  onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                  placeholder="ID da cidade"
                  className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Data</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Local</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Endereço / local do evento"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleCreate} disabled={saving || !form.title || !form.type || !form.date}>
              {saving && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
              Salvar Evento
            </Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl border border-border/50 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                    {typeLabels[event.type] || event.type}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    event.status === "completed"
                      ? "bg-success/10 text-success"
                      : event.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                  }`}>
                    {event.status === "completed" ? <Check className="w-3 h-3" /> : event.status === "cancelled" ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {event.status === "completed" ? "Realizado" : event.status === "cancelled" ? "Cancelado" : "Agendado"}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {event.city?.name || "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(event.date).toLocaleDateString("pt-BR")}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {event.location}
                    </span>
                  )}
                </div>
              </div>
              {event.status === "scheduled" && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStatusChange(event.id, "completed")}
                    className="p-1.5 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                    title="Marcar como realizado"
                  >
                    <Check className="w-4 h-4 text-success" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(event.id, "cancelled")}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Cancelar evento"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Excluir evento"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {events.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhum evento cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
