"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Plus, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockEvent {
  id: string;
  title: string;
  city: string;
  date: string;
  location: string;
  type: string;
  status: string;
}

const typeLabels: Record<string, string> = {
  visita: "Visita",
  comicio: "Comício",
  reuniao: "Reunião",
  caravana: "Caravana",
};

const mockEvents: MockEvent[] = [
  { id: "1", title: "Caravana da Transformação - Tocantina", city: "Imperatriz", date: "2026-04-15", location: "Praça Brasil, Centro", type: "caravana", status: "scheduled" },
  { id: "2", title: "Reunião com lideranças", city: "Balsas", date: "2026-04-12", location: "Centro de Convenções", type: "reuniao", status: "scheduled" },
  { id: "3", title: "Visita a obras", city: "Timon", date: "2026-04-08", location: "Diversos pontos", type: "visita", status: "scheduled" },
  { id: "4", title: "Caravana pelo Baixo Parnaíba", city: "Chapadinha", date: "2026-03-28", location: "Praça Central", type: "caravana", status: "completed" },
  { id: "5", title: "Reunião com prefeitos", city: "Bacabal", date: "2026-03-22", location: "Câmara Municipal", type: "reuniao", status: "completed" },
];

export default function AdminEventos() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Eventos</h1>
          <p className="text-muted-foreground">Gerencie a agenda de eventos da campanha.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="w-4 h-4" />
          Novo Evento
        </Button>
      </div>

      {/* New Event Form */}
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
                placeholder="Nome do evento"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Selecione...</option>
                {Object.entries(typeLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cidade</label>
              <input
                type="text"
                placeholder="Cidade"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Data</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Local</label>
              <input
                type="text"
                placeholder="Endereço / local do evento"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button size="sm">Salvar Evento</Button>
          </div>
        </motion.div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {mockEvents.map((event, i) => (
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
                    {typeLabels[event.type]}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    event.status === "completed"
                      ? "bg-success/10 text-success"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {event.status === "completed" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {event.status === "completed" ? "Realizado" : "Agendado"}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {event.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.location}
                  </span>
                </div>
              </div>
              {event.status === "scheduled" && (
                <button className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
