"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  MessageSquare,
  Calendar,
  Download,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface Stats {
  supporters: number;
  suggestions: number;
  events: number;
  downloads: number;
  cities: number;
  locations: number;
  pendingSuggestions: number;
  scheduledEvents: number;
  recentSupporters: { name: string | null; city: string | null; supportedAt: string | null }[];
}

const fallbackStats: Stats = {
  supporters: 1247, suggestions: 328, events: 42, downloads: 15420,
  cities: 40, locations: 8, pendingSuggestions: 12, scheduledEvents: 3,
  recentSupporters: [
    { name: "Maria Silva", city: "Sao Luis", supportedAt: "2026-04-03" },
    { name: "Joao Santos", city: "Imperatriz", supportedAt: "2026-04-03" },
    { name: "Ana Costa", city: "Timon", supportedAt: "2026-04-02" },
  ],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(fallbackStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats({ ...fallbackStats, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Apoiadores", value: stats.supporters.toLocaleString("pt-BR"), change: `${stats.pendingSuggestions} sugestoes pendentes`, icon: Users, color: "from-primary to-primary-light" },
    { label: "Sugestoes", value: stats.suggestions.toLocaleString("pt-BR"), change: `${stats.pendingSuggestions} pendentes`, icon: MessageSquare, color: "from-accent to-amber-400" },
    { label: "Eventos", value: stats.events.toLocaleString("pt-BR"), change: `${stats.scheduledEvents} agendados`, icon: Calendar, color: "from-success to-success-light" },
    { label: "Downloads", value: stats.downloads.toLocaleString("pt-BR"), change: "materiais disponiveis", icon: Download, color: "from-purple-500 to-purple-400" },
    { label: "Cidades", value: stats.cities.toLocaleString("pt-BR"), change: "217 no MA", icon: MapPin, color: "from-red-500 to-red-400" },
    { label: "Pontos de Apoio", value: stats.locations.toLocaleString("pt-BR"), change: "ativos", icon: TrendingUp, color: "from-emerald-500 to-emerald-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visao geral da campanha e gestao de conteudo.</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando dados...
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <span className="text-2xl font-extrabold text-foreground block">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <span className="block text-xs text-success font-medium mt-1">{stat.change}</span>
          </motion.div>
        ))}
      </div>

      {/* Recent Supporters */}
      <div className="bg-white rounded-xl border border-border/50 p-6">
        <h2 className="font-bold text-foreground mb-4">Apoiadores Recentes</h2>
        <div className="space-y-3">
          {stats.recentSupporters.map((supporter, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{supporter.name || "Anonimo"}</p>
                  <p className="text-xs text-muted-foreground">{supporter.city || "MA"}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {supporter.supportedAt ? new Date(supporter.supportedAt).toLocaleDateString("pt-BR") : ""}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
