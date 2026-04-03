"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Download, Music, Image, FileText, Video, Filter } from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
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

const mockItems: DownloadItem[] = [
  {
    id: "1",
    title: "Jingle Oficial - Braide Governador",
    description: "Jingle oficial da pré-campanha para uso em eventos e redes sociais.",
    category: "jingles",
    fileType: "MP3",
    fileSize: "4.2 MB",
    downloads: 1250,
  },
  {
    id: "2",
    title: "Hino da Campanha - Maranhão Novo",
    description: "Versão completa do hino da campanha com letra e arranjo.",
    category: "musicas",
    fileType: "MP3",
    fileSize: "6.8 MB",
    downloads: 870,
  },
  {
    id: "3",
    title: "Foto Oficial - Braide 2026",
    description: "Foto oficial de alta resolução para uso em materiais gráficos.",
    category: "fotos",
    fileType: "JPG",
    fileSize: "2.1 MB",
    downloads: 2340,
  },
  {
    id: "4",
    title: "Pack de Fotos - Caravanas",
    description: "Pacote com 30 fotos das caravanas pelo interior do Maranhão.",
    category: "fotos",
    fileType: "ZIP",
    fileSize: "45 MB",
    downloads: 560,
  },
  {
    id: "5",
    title: "Santinho Digital",
    description: "Santinho digital para compartilhamento no WhatsApp e redes sociais.",
    category: "materiais",
    fileType: "PDF",
    fileSize: "1.5 MB",
    downloads: 3200,
  },
  {
    id: "6",
    title: "Banner para Redes Sociais",
    description: "Kit com banners otimizados para Facebook, Instagram e Twitter.",
    category: "materiais",
    fileType: "ZIP",
    fileSize: "8.3 MB",
    downloads: 1890,
  },
  {
    id: "7",
    title: "Vídeo Institucional - 1 min",
    description: "Vídeo institucional curto para compartilhamento rápido.",
    category: "videos",
    fileType: "MP4",
    fileSize: "25 MB",
    downloads: 950,
  },
  {
    id: "8",
    title: "Jingle Forró - Braide é do Povo",
    description: "Versão forró do jingle para eventos e festas.",
    category: "jingles",
    fileType: "MP3",
    fileSize: "3.9 MB",
    downloads: 1670,
  },
  {
    id: "9",
    title: "Plano de Governo - Resumo",
    description: "PDF resumido do plano de governo para distribuição.",
    category: "materiais",
    fileType: "PDF",
    fileSize: "3.2 MB",
    downloads: 4100,
  },
];

export function DownloadGrid() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? mockItems : mockItems.filter((item) => item.category === filter);

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
                    {item.fileType}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.fileSize}</span>
                </div>
                <h3 className="font-bold text-foreground mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.downloads.toLocaleString("pt-BR")} downloads
                  </span>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer">
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
