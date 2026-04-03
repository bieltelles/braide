"use client";

import { motion } from "motion/react";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  city: string;
  date: string;
  endDate?: string;
  location?: string;
  type: string;
  status: string;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  visita: { label: "Visita", color: "bg-primary/10 text-primary" },
  comicio: { label: "Comício", color: "bg-accent/10 text-accent-dark" },
  reuniao: { label: "Reunião", color: "bg-purple-100 text-purple-700" },
  caravana: { label: "Caravana", color: "bg-success/10 text-success" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Agendado", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Realizado", color: "bg-success/10 text-success" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Caravana da Transformação - Região Tocantina",
    city: "Imperatriz",
    date: "2026-04-15",
    location: "Praça Brasil, Centro",
    type: "caravana",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Reunião com lideranças locais",
    city: "Balsas",
    date: "2026-04-12",
    location: "Centro de Convenções",
    type: "reuniao",
    status: "scheduled",
  },
  {
    id: "3",
    title: "Visita a obras e comunidades",
    city: "Timon",
    date: "2026-04-08",
    location: "Diversos pontos da cidade",
    type: "visita",
    status: "scheduled",
  },
  {
    id: "4",
    title: "Caravana pelo Baixo Parnaíba",
    city: "Chapadinha",
    date: "2026-03-28",
    location: "Praça Central",
    type: "caravana",
    status: "completed",
  },
  {
    id: "5",
    title: "Reunião com prefeitos da região",
    city: "Bacabal",
    date: "2026-03-22",
    location: "Câmara Municipal",
    type: "reuniao",
    status: "completed",
  },
  {
    id: "6",
    title: "Visita a comunidades ribeirinhas",
    city: "Pinheiro",
    date: "2026-03-18",
    location: "Porto de Pinheiro",
    type: "visita",
    status: "completed",
  },
  {
    id: "7",
    title: "Comício da Esperança",
    city: "Caxias",
    date: "2026-03-10",
    location: "Praça Gonçalves Dias",
    type: "comicio",
    status: "completed",
  },
  {
    id: "8",
    title: "Caravana do Maranhão Novo",
    city: "Santa Inês",
    date: "2026-03-05",
    location: "Ginásio Municipal",
    type: "caravana",
    status: "completed",
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
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
  const filtered =
    filter === "all"
      ? mockEvents
      : filter === "upcoming"
      ? mockEvents.filter((e) => e.status === "scheduled")
      : mockEvents.filter((e) => e.status === "completed");

  return (
    <div className="space-y-4">
      {filtered.map((event, i) => {
        const type = typeLabels[event.type] || typeLabels.visita;
        const status = statusLabels[event.status] || statusLabels.scheduled;
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onCityClick(event.city)}
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
                {event.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {formatDate(event.date)}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {event.location}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Nenhum evento encontrado para este filtro.</p>
        </div>
      )}
    </div>
  );
}
