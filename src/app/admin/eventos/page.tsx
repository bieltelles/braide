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
  city: { id: string; name: string } | null;
  date: string;
  endDate: string | null;
  location: string | null;
  type: string;
  status: string;
}

interface CityOption {
  id: string;
  name: string;
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
];

export default function AdminEventos() {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [cities, setCities] = useState<CityOption[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [form, setForm] = useState({ title: "", type: "", cityId: "", date: "", location: "", description: "" });

  const fetchEvents = useCallback(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => { if (data.events) setEvents(data.events); })
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

  const filteredCities = citySearch
    ? cities.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 15)
    : cities.slice(0, 15);

  const selectedCityName = cities.find((c) => c.id === form.cityId)?.name || "";

  const setupAndRetry = async (body: Record<string, unknown>) => {
    setError("Configurando banco de dados...");
    await fetch("/api/setup", { method: "POST" });
    return fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  const handleCreate = async () => {
    if (!form.title || !form.type || !form.date || !form.cityId) return;
    setSaving(true);
    setError("");

    const body = {
      title: form.title,
      type: form.type,
      cityId: form.cityId,
      date: form.date,
      location: form.location || undefined,
      description: form.description || undefined,
    };

    try {
      let res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok && res.status === 500) {
        res = await setupAndRetry(body);
      }

      if (res.ok) {
        const data = await res.json();
        setEvents((prev) => [data.event, ...prev]);
        setForm({ title: "", type: "", cityId: "", date: "", location: "", description: "" });
        setCitySearch("");
        setShowForm(false);
        setError("");
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || `Erro ao salvar (${res.status})`);
      }
    } catch {
      setError("Erro de conexão");
    }
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
                <option value="">Selecione o tipo...</option>
                {Object.entries(typeLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-1">
                Município {selectedCityName && <span className="text-primary font-normal">— {selectedCityName}</span>}
              </label>
              <input
                type="text"
                value={citySearch}
                onChange={(e) => { setCitySearch(e.target.value); setForm({ ...form, cityId: "" }); }}
                placeholder="Buscar município..."
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {citySearch && !form.cityId && filteredCities.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-border/50 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => { setForm({ ...form, cityId: city.id }); setCitySearch(city.name); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
              {citySearch && !form.cityId && filteredCities.length === 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-border/50 rounded-lg shadow-lg p-3 text-xs text-muted-foreground">
                  Nenhum município encontrado
                </div>
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
              <label className="block text-sm font-medium text-foreground mb-1">Local (endereço)</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ex: Praça Central, Centro"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setError(""); }}>Cancelar</Button>
            <Button size="sm" onClick={handleCreate} disabled={saving || !form.title || !form.type || !form.date || !form.cityId}>
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
                  <button onClick={() => handleStatusChange(event.id, "completed")} className="p-1.5 rounded-lg hover:bg-green-50 transition-colors cursor-pointer" title="Marcar como realizado">
                    <Check className="w-4 h-4 text-success" />
                  </button>
                  <button onClick={() => handleStatusChange(event.id, "cancelled")} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer" title="Cancelar evento">
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer" title="Excluir evento">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {events.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhum evento cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
