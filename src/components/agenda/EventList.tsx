"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Users, Loader2 } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  city: { id: string; name: string } | null;
  date: string;
  endDate?: string;
  location?: string;
  time?: string;
  type: string;
  status: string;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  visita: { label: "Visita", color: "bg-primary/10 text-primary" },
  carreata: { label: "Carreata", color: "bg-accent/10 text-accent-dark" },
  caminhada: { label: "Caminhada", color: "bg-success/10 text-success" },
  reuniao_liderancas: { label: "Reunião com Lideranças", color: "bg-purple-100 text-purple-700" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Agendado", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Realizado", color: "bg-success/10 text-success" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const fallbackEvents: EventItem[] = [
  { id: "1", title: "Carreata da Transformação - Região Tocantina", city: { id: "1", name: "Imperatriz" }, date: "2026-04-15", time: "09:00", location: "Praça Brasil, Centro", type: "carreata", status: "scheduled" },
  { id: "2", title: "Reunião com lideranças locais", city: { id: "2", name: "Balsas" }, date: "2026-04-12", time: "14:00", location: "Centro de Convenções", type: "reuniao_liderancas", status: "scheduled" },
  { id: "3", title: "Visita a obras e comunidades", city: { id: "3", name: "Timon" }, date: "2026-04-08", location: "Diversos pontos da cidade", type: "visita", status: "scheduled" },
  { id: "4", title: "Caminhada pelo Baixo Parnaíba", city: { id: "4", name: "Chapadinha" }, date: "2026-03-28", time: "07:00", location: "Praça Central", type: "caminhada", status: "completed" },
  { id: "5", title: "Reunião com lideranças da região", city: { id: "5", name: "Bacabal" }, date: "2026-03-22", location: "Câmara Municipal", type: "reuniao_liderancas", status: "completed" },
  { id: "6", title: "Visita a comunidades ribeirinhas", city: { id: "6", name: "Pinheiro" }, date: "2026-03-18", location: "Porto de Pinheiro", type: "visita", status: "completed" },
  { id: "7", title: "Carreata pelo centro histórico", city: { id: "7", name: "Caxias" }, date: "2026-03-10", time: "16:00", location: "Praça Gonçalves Dias", type: "carreata", status: "completed" },
  { id: "8", title: "Caminhada do Maranhão Novo", city: { id: "8", name: "Santa Inês" }, date: "2026-03-05", time: "07:30", location: "Ginásio Municipal", type: "caminhada", status: "completed" },
];

function formatDate(dateStr: string) {
  const normalized = dateStr.includes("T") ? dateStr : dateStr + "T12:00:00";
  const date = new Date(normalized);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface EventListProps {
  filter: string;
  onCityClick: (city: string) => void;
}

export function EventList({ filter, onCityClick }: EventListProps) {
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        if (data.events?.length) setEvents(data.events);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? events
      : filter === "upcoming"
      ? events.filter((e) => e.status === "scheduled")
      : events.filter((e) => e.status === "completed");

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando eventos...
        </div>
      )}

      {filtered.map((event, i) => {
        const type = typeLabels[event.type] || typeLabels.visita;
        const status = statusLabels[event.status] || statusLabels.scheduled;
        const cityName = typeof event.city === "object" && event.city ? event.city.name : "—";
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onCityClick(cityName)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${type.color}`}>
                  {type.label}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-foreground mb-2">{event.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {cityName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {formatDate(event.date)}
              </span>
              {event.time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {event.time}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                  {event.location}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Nenhum evento encontrado para este filtro.</p>
        </div>
      )}
    </div>
  );
}
