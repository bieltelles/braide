"use client";

import { motion } from "motion/react";
import {
  Users,
  MessageSquare,
  Calendar,
  Download,
  MapPin,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

const stats: StatCard[] = [
  { label: "Apoiadores", value: "1.247", change: "+32 hoje", icon: Users, color: "from-primary to-primary-light" },
  { label: "Sugestões", value: "328", change: "12 pendentes", icon: MessageSquare, color: "from-accent to-amber-400" },
  { label: "Eventos", value: "42", change: "3 agendados", icon: Calendar, color: "from-success to-success-light" },
  { label: "Downloads", value: "15.420", change: "+210 esta semana", icon: Download, color: "from-purple-500 to-purple-400" },
  { label: "Cidades", value: "40", change: "217 no MA", icon: MapPin, color: "from-red-500 to-red-400" },
  { label: "Pontos de Apoio", value: "8", change: "em 5 cidades", icon: TrendingUp, color: "from-emerald-500 to-emerald-400" },
];

const recentActivity = [
  { type: "supporter", text: "Maria Silva declarou apoio", city: "São Luís", time: "2 min" },
  { type: "suggestion", text: "Nova sugestão em Saúde", city: "Imperatriz", time: "15 min" },
  { type: "supporter", text: "João Santos declarou apoio", city: "Timon", time: "30 min" },
  { type: "event", text: "Caravana Tocantina agendada", city: "Imperatriz", time: "1h" },
  { type: "suggestion", text: "Nova sugestão em Educação", city: "Caxias", time: "2h" },
  { type: "supporter", text: "Ana Costa declarou apoio", city: "Bacabal", time: "3h" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão geral da campanha e gestão de conteúdo.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-border/50 p-6">
        <h2 className="font-bold text-foreground mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "supporter"
                      ? "bg-primary"
                      : activity.type === "suggestion"
                      ? "bg-accent"
                      : "bg-success"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.city}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
