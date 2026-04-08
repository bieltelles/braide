"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Check, X, Clock, MessageSquare, Filter, Loader2, Pencil, Undo2 } from "lucide-react";

interface Suggestion {
  id: string;
  category: string;
  content: string;
  status: string;
  createdAt: string;
  authorName: string | null;
  authorCity: string | null;
  user: { name: string | null; image: string | null; city: string | null } | null;
}

const categoryLabels: Record<string, string> = {
  social: "Gente em Primeiro Lugar", economia: "Oportunidades",
  infraestrutura: "Território Sustentável", gestao: "Gestão Eficiente",
  outro: "Outro",
  // legacy
  saude: "Saúde", educacao: "Educação", seguranca: "Segurança",
  meio_ambiente: "Meio Ambiente",
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Aprovada", color: "bg-success/10 text-success", icon: Check },
  rejected: { label: "Rejeitada", color: "bg-red-100 text-red-700", icon: X },
};

const fallbackSuggestions: Suggestion[] = [
  { id: "1", category: "social", content: "Construir um hospital regional na baixada maranhense.", status: "pending", createdAt: "2026-04-02T00:00:00Z", authorName: "Maria Silva", authorCity: "São Luís", user: null },
  { id: "2", category: "social", content: "Criar programa de bolsas para alunos do ensino medio.", status: "pending", createdAt: "2026-04-01T00:00:00Z", authorName: "João Santos", authorCity: "Imperatriz", user: null },
  { id: "3", category: "infraestrutura", content: "Pavimentar a estrada entre Timon e Caxias.", status: "approved", createdAt: "2026-03-30T00:00:00Z", authorName: "Ana Costa", authorCity: "Timon", user: null },
  { id: "4", category: "gestao", content: "Reduzir os impostos estaduais para micro e pequenas empresas.", status: "pending", createdAt: "2026-03-28T00:00:00Z", authorName: "Pedro Oliveira", authorCity: "Caxias", user: null },
];

export default function AdminSugestoes() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [suggestions, setSuggestions] = useState<Suggestion[]>(fallbackSuggestions);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = useCallback(() => {
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("status", filterStatus);
    fetch(`/api/suggestions?${params}`)
      .then((r) => r.json())
      .then((data) => { if (data.suggestions?.length) setSuggestions(data.suggestions); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filterStatus]);

  useEffect(() => { fetchSuggestions(); }, [fetchSuggestions]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleModerate = async (id: string, newStatus: string) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    try {
      await fetch(`/api/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
  };

  const startEdit = (s: Suggestion) => {
    setEditingId(s.id);
    setEditContent(s.content);
  };

  const saveEdit = async (id: string) => {
    if (!editContent.trim()) return;
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, content: editContent.trim() } : s)));
    setEditingId(null);
    try {
      await fetch(`/api/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });
    } catch {}
  };

  const filtered = filterStatus === "all" ? suggestions : suggestions.filter((s) => s.status === filterStatus);
  const pendingCount = suggestions.filter((s) => s.status === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Sugestoes</h1>
          <p className="text-muted-foreground">
            Modere as sugestoes do plano participativo.
            <span className="text-accent font-semibold ml-1">{pendingCount} pendentes</span>
          </p>
        </div>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
      </div>

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
                <span className="text-xs text-muted-foreground">
                  {new Date(suggestion.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              {/* Content — inline edit */}
              {editingId === suggestion.id ? (
                <div className="mb-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-primary/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Cancelar</button>
                    <button onClick={() => saveEdit(suggestion.id)} className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">Salvar</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground mb-3">{suggestion.content}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">{suggestion.authorName || suggestion.user?.name || "Anônimo"}</span>
                  {(suggestion.authorCity || suggestion.user?.city) && (
                    <> — {suggestion.authorCity || suggestion.user?.city}</>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {editingId !== suggestion.id && (
                    <button
                      onClick={() => startEdit(suggestion)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Editar texto"
                    >
                      <Pencil className="w-3.5 h-3.5 text-blue-500" />
                    </button>
                  )}
                  {suggestion.status !== "pending" && (
                    <button
                      onClick={() => handleModerate(suggestion.id, "pending")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      <Undo2 className="w-3 h-3" /> Pendente
                    </button>
                  )}
                  {suggestion.status !== "approved" && (
                    <button
                      onClick={() => handleModerate(suggestion.id, "approved")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-success/10 text-success rounded-lg text-xs font-semibold hover:bg-success/20 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Aprovar
                    </button>
                  )}
                  {suggestion.status !== "rejected" && (
                    <button
                      onClick={() => handleModerate(suggestion.id, "rejected")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Rejeitar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhuma sugestao neste filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}
