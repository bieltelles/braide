"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Download, Music, Image, FileText, Video, Filter, Loader2 } from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string;
  fileType: string | null;
  fileSize: number | null;
  downloads: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  musicas: Music,
  fotos: Image,
  materiais: FileText,
  jingles: Music,
  videos: Video,
};

const categoryLabels: Record<string, string> = {
  all: "Todos",
  musicas: "Músicas",
  jingles: "Jingles",
  fotos: "Fotos",
  materiais: "Materiais",
  videos: "Vídeos",
};

const fallbackItems: DownloadItem[] = [
  { id: "1", title: "Jingle Oficial - Braide Governador", description: "Jingle oficial da pré-campanha para uso em eventos e redes sociais.", category: "jingles", fileUrl: "#", fileType: "MP3", fileSize: 4200000, downloads: 1250 },
  { id: "2", title: "Hino da Campanha - Maranhão Novo", description: "Versão completa do hino da campanha com letra e arranjo.", category: "musicas", fileUrl: "#", fileType: "MP3", fileSize: 6800000, downloads: 870 },
  { id: "3", title: "Foto Oficial - Braide 2026", description: "Foto oficial de alta resolução para uso em materiais gráficos.", category: "fotos", fileUrl: "#", fileType: "JPG", fileSize: 2100000, downloads: 2340 },
  { id: "4", title: "Pack de Fotos - Caravanas", description: "Pacote com 30 fotos das caravanas pelo interior do Maranhão.", category: "fotos", fileUrl: "#", fileType: "ZIP", fileSize: 45000000, downloads: 560 },
  { id: "5", title: "Santinho Digital", description: "Santinho digital para compartilhamento no WhatsApp e redes sociais.", category: "materiais", fileUrl: "#", fileType: "PDF", fileSize: 1500000, downloads: 3200 },
  { id: "6", title: "Banner para Redes Sociais", description: "Kit com banners otimizados para Facebook, Instagram e Twitter.", category: "materiais", fileUrl: "#", fileType: "ZIP", fileSize: 8300000, downloads: 1890 },
  { id: "7", title: "Vídeo Institucional - 1 min", description: "Vídeo institucional curto para compartilhamento rápido.", category: "videos", fileUrl: "#", fileType: "MP4", fileSize: 25000000, downloads: 950 },
  { id: "8", title: "Jingle Forró - Braide é do Povo", description: "Versão forró do jingle para eventos e festas.", category: "jingles", fileUrl: "#", fileType: "MP3", fileSize: 3900000, downloads: 1670 },
  { id: "9", title: "Plano de Governo - Resumo", description: "PDF resumido do plano de governo para distribuição.", category: "materiais", fileUrl: "#", fileType: "PDF", fileSize: 3200000, downloads: 4100 },
];

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function DownloadGrid() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<DownloadItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/downloads")
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) {
          setItems(data.items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? items : items.filter((item) => item.category === filter);

  const handleDownload = async (item: DownloadItem) => {
    if (item.fileUrl && item.fileUrl !== "#") {
      // Increment download counter
      try {
        await fetch(`/api/downloads/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ downloads: item.downloads + 1 }),
        });
      } catch {}
      window.open(item.fileUrl, "_blank");
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {Object.entries(categoryLabels).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === value
                ? "bg-primary text-white shadow-md"
                : "bg-white text-muted-foreground border border-border/50 hover:bg-muted"
            }`}
          >
            {label}
          </button>
        ))}
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item, i) => {
          const Icon = categoryIcons[item.category] || FileText;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Thumbnail placeholder */}
              <div className="h-32 bg-gradient-to-br from-primary/5 to-primary-light/10 flex items-center justify-center">
                <Icon className="w-12 h-12 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                    {item.fileType || "—"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatSize(item.fileSize)}</span>
                </div>
                <h3 className="font-bold text-foreground mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description || ""}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.downloads.toLocaleString("pt-BR")} downloads
                  </span>
                  <button
                    onClick={() => handleDownload(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Download className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Nenhum material encontrado para esta categoria.</p>
        </div>
      )}
    </>
  );
}
