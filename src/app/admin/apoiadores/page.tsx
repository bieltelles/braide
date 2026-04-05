"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Users, Search, Trash2, Loader2, MapPin, Calendar } from "lucide-react";

interface Supporter {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  city: string | null;
  supportedAt: string | null;
}

export default function AdminApoiadores() {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchSupporters = useCallback(() => {
    setLoading(true);
    fetch("/api/supporters?limit=500")
      .then((r) => r.json())
      .then((data) => {
        if (data.supporters) setSupporters(data.supporters);
        if (data.count) setTotal(data.count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchSupporters(); }, [fetchSupporters]);

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      const res = await fetch(`/api/supporters/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSupporters((prev) => prev.filter((s) => s.id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch {}
    setRemoving(null);
    setConfirmId(null);
  };

  const filtered = supporters.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Apoiadores</h1>
          <p className="text-muted-foreground">
            {loading ? "Carregando..." : `${total.toLocaleString("pt-BR")} apoiadores cadastrados`}
          </p>
        </div>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou cidade..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
        />
      </div>

      {search && (
        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &quot;{search}&quot;
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((supporter, i) => (
          <motion.div
            key={supporter.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-white rounded-xl border border-border/50 px-4 py-3 flex items-center gap-4"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              {supporter.image ? (
                <img src={supporter.image} alt={supporter.name || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold">
                  {(supporter.name || "?").charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">
                {supporter.name || "—"}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                {supporter.email && <span className="truncate">{supporter.email}</span>}
                {supporter.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {supporter.city}
                  </span>
                )}
                {supporter.supportedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(supporter.supportedAt).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </div>

            {/* Remove button / confirm */}
            {confirmId === supporter.id ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-red-600 font-medium">Confirmar?</span>
                <button
                  onClick={() => handleRemove(supporter.id)}
                  disabled={removing === supporter.id}
                  className="px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {removing === supporter.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sim"}
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-2.5 py-1 bg-muted text-foreground text-xs font-semibold rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(supporter.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                title="Remover apoio"
              >
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
              </button>
            )}
          </motion.div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>{search ? "Nenhum apoiador encontrado para essa busca." : "Nenhum apoiador cadastrado."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
