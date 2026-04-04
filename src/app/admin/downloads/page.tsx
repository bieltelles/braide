"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { Download, Plus, Trash2, Eye, EyeOff, Loader2, Upload, FileIcon, X, CheckCircle } from "lucide-react";
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
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function getFileExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toUpperCase();
  return ext || "";
}

export default function AdminDownloads() {
  const [items, setItems] = useState<DownloadItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", description: "" });
  const [error, setError] = useState("");

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(() => {
    fetch("/api/downloads?includeInactive=true")
      .then((r) => r.json())
      .then((data) => { if (data.items?.length) setItems(data.items); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress for UX (actual upload is a single request)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (res.ok) {
        const data = await res.json();
        setUploadProgress(100);
        setUploadedFile({
          url: data.url,
          name: file.name,
          size: data.size,
          type: file.type,
        });

        // Auto-fill title from filename if empty
        if (!form.title) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setForm((prev) => ({ ...prev, title: nameWithoutExt }));
        }
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Erro ao enviar arquivo");
        setUploadProgress(0);
      }
    } catch {
      clearInterval(progressInterval);
      alert("Erro de conexão ao enviar arquivo");
      setUploadProgress(0);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeUploadedFile = async () => {
    if (uploadedFile?.url) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: uploadedFile.url }),
        });
      } catch {}
    }
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreate = async () => {
    if (!form.title || !form.category || !uploadedFile) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          fileUrl: uploadedFile.url,
          fileType: getFileExtension(uploadedFile.name),
          fileSize: uploadedFile.size,
          description: form.description || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [data.item, ...prev]);
        setForm({ title: "", category: "", description: "" });
        setUploadedFile(null);
        setUploadProgress(0);
        setShowForm(false);
        setError("");
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || `Erro ao salvar (${res.status})`);
      }
    } catch (e) {
      setError("Erro de conexão ao salvar material");
    }
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
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      // Delete the blob file too
      if (item?.fileUrl && item.fileUrl !== "#") {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: item.fileUrl }),
        });
      }
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

          {/* File Upload Area */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-2">Arquivo</label>
            {!uploadedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="*/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {uploading ? (
                  <div className="space-y-3">
                    <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Enviando arquivo...</p>
                    <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
                  </div>
                ) : (
                  <>
                    <Upload className={`w-8 h-8 mx-auto mb-3 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="text-sm font-medium text-foreground">
                      Arraste e solte o arquivo aqui
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ou clique para selecionar - PDF, MP3, ZIP, JPG, MP4, etc.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-success/5 border border-success/20 rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getFileExtension(uploadedFile.name)} · {formatSize(uploadedFile.size)} · Upload concluído
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeUploadedFile(); }}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remover arquivo"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            )}
          </div>

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
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setError(""); if (uploadedFile) removeUploadedFile(); }}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={saving || !form.title || !form.category || !uploadedFile}>
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
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                      {item.fileUrl && item.fileUrl !== "#" && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-primary hover:underline mt-0.5 truncate max-w-[200px]"
                        >
                          Ver arquivo
                        </a>
                      )}
                    </div>
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
