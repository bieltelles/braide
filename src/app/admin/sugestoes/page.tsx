"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, X, Clock, MessageSquare, Filter } from "lucide-react";

interface MockSuggestion {
  id: string;
  userName: string;
  userCity: string;
  category: string;
  content: string;
  status: string;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  saude: "Saúde",
  educacao: "Educação",
  seguranca: "Segurança",
  infraestrutura: "Infraestrutura",
  economia: "Economia",
  meio_ambiente: "Meio Ambiente",
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Aprovada", color: "bg-success/10 text-success", icon: Check },
  rejected: { label: "Rejeitada", color: "bg-red-100 text-red-700", icon: X },
};

const mockSuggestions: MockSuggestion[] = [
  { id: "1", userName: "Maria Silva", userCity: "São Luís", category: "saude", content: "Construir um hospital regional na baixada maranhense para atender a população que precisa viajar horas para atendimento médico.", status: "pending", createdAt: "2026-04-02" },
  { id: "2", userName: "João Santos", userCity: "Imperatriz", category: "educacao", content: "Criar um programa de bolsas para alunos do ensino médio participarem de intercâmbios em outros estados.", status: "pending", createdAt: "2026-04-01" },
  { id: "3", userName: "Ana Costa", userCity: "Timon", category: "infraestrutura", content: "Pavimentar a estrada entre Timon e Caxias que está em péssimo estado, prejudicando o comércio regional.", status: "approved", createdAt: "2026-03-30" },
  { id: "4", userName: "Pedro Oliveira", userCity: "Caxias", category: "seguranca", content: "Instalar câmeras de segurança no centro de Caxias e criar um centro de monitoramento integrado.", status: "approved", createdAt: "2026-03-28" },
  { id: "5", userName: "Lucia Ferreira", userCity: "Bacabal", category: "economia", content: "Criar feiras de empreendedorismo mensais nos municípios do interior para incentivar o comércio local.", status: "pending", createdAt: "2026-03-27" },
  { id: "6", userName: "Carlos Souza", userCity: "Balsas", category: "meio_ambiente", content: "Criar programa de reflorestamento nas áreas de cerrado degradadas na região de Balsas.", status: "rejected", createdAt: "2026-03-25" },
];

export default function AdminSugestoes() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  const filtered = filterStatus === "all"
    ? suggestions
    : suggestions.filter((s) => s.status === filterStatus);

  const handleModerate = (id: string, newStatus: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const pendingCount = suggestions.filter((s) => s.status === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Sugestões</h1>
          <p className="text-muted-foreground">
            Modere as sugestões do plano participativo.
            <span className="text-accent font-semibold ml-1">{pendingCount} pendentes</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {[
          { value: "all", label: "Todas" },
          { value: "pending", label: "Pendentes" },
          { value: "approved", label: "Aprovadas" },
          { value: "rejected", label: "Rejeitadas" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filterStatus === f.value
                ? "bg-primary text-white"
                : "bg-white text-muted-foreground border border-border/50 hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((suggestion, i) => {
          const status = statusConfig[suggestion.status] || statusConfig.pending;
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-border/50 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                    {categoryLabels[suggestion.category] || suggestion.category}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{suggestion.createdAt}</span>
              </div>

              <p className="text-sm text-foreground mb-3">{suggestion.content}</p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">{suggestion.userName}</span> - {suggestion.userCity}
                </div>

                {suggestion.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerate(suggestion.id, "approved")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success rounded-lg text-xs font-semibold hover:bg-success/20 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleModerate(suggestion.id, "rejected")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhuma sugestão neste filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}
