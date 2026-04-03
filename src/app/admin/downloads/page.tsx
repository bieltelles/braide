"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Download, Plus, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: number | null;
  downloads: number;
  isActive: boolean;
}

const categoryLabels: Record<string, string> = {
  musicas: "Músicas",
  jingles: "Jingles",
  fotos: "Fotos",
  materiais: "Materiais",
  videos: "Vídeos",
};

const fallbackItems: DownloadItem[] = [
  { id: "1", title: "Jingle Oficial - Braide Governador", description: null, category: "jingles", fileUrl: "#", fileType: "MP3", fileSize: 4200000, downloads: 1250, isActive: true },
  { id: "2", title: "Hino da Campanha - Maranhão Novo", description: null, category: "musicas", fileUrl: "#", fileType: "MP3", fileSize: 6800000, downloads: 870, isActive: true },
  { id: "3", title: "Foto Oficial - Braide 2026", description: null, category: "fotos", fileUrl: "#", fileType: "JPG", fileSize: 2100000, downloads: 2340, isActive: true },
  { id: "4", title: "Pack de Fotos - Caravanas", description: null, category: "fotos", fileUrl: "#", fileType: "ZIP", fileSize: 45000000, downloads: 560, isActive: true },
  { id: "5", title: "Santinho Digital", description: null, category: "materiais", fileUrl: "#", fileType: "PDF", fileSize: 1500000, downloads: 3200, isActive: true },
  { id: "6", title: "Banner para Redes Sociais", description: null, category: "materiais", fileUrl: "#", fileType: "ZIP", fileSize: 8300000, downloads: 1890, isActive: false },
];

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default function AdminDownloads() {
  const [items, setItems] = useState<DownloadItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", fileUrl: "", fileType: "", description: "" });

  const fetchItems = useCallback(() => {
    fetch("/api/downloads?includeInactive=true")
      .then((r) => r.json())
      .then((data) => { if (data.items?.length) setItems(data.items); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleCreate = async () => {
    if (!form.title || !form.category || !form.fileUrl) return;
    setSaving(true);
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          fileUrl: form.fileUrl,
          fileType: form.fileType || undefined,
          description: form.description || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [data.item, ...prev]);
        setForm({ title: "", category: "", fileUrl: "", fileType: "", description: "" });
        setShowForm(false);
      }
    } catch {}
    setSaving(false);
  };

  const toggleActive = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newActive = !item.isActive;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isActive: newActive } : i)));
    try {
      await fetch(`/api/downloads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/downloads/${id}`, { method: "DELETE" });
    } catch {}
  };

  const totalDownloads = items.reduce((sum, item) => sum + item.downloads, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Downloads</h1>
          <p className="text-muted-foreground">
            Gerencie os materiais disponíveis para download.
            <span className="text-primary font-semibold ml-1">{totalDownloads.toLocaleString("pt-BR")} downloads totais</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="w-4 h-4" />
            Novo Material
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-border/50 p-6 mb-6"
        >
          <h3 className="font-bold text-foreground mb-4">Novo Material</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nome do material"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Selecione...</option>
                {Object.entries(categoryLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">URL do arquivo</label>
              <input
                type="url"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Formato</label>
              <input
                type="text"
                value={form.fileType}
                onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                placeholder="PDF, MP3, ZIP..."
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Descrição</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descrição do material"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleCreate} disabled={saving || !form.title || !form.category || !form.fileUrl}>
              {saving && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
              Salvar Material
            </Button>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Material</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Categoria</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Formato</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Downloads</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={`border-b border-border/30 last:border-0 ${!item.isActive ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-muted-foreground">{item.fileType || "—"} · {formatSize(item.fileSize)}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-medium text-foreground">{item.downloads.toLocaleString("pt-BR")}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(item.id)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                        title={item.isActive ? "Desativar" : "Ativar"}
                      >
                        {item.isActive ? (
                          <Eye className="w-4 h-4 text-success" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Download className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhum material cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
