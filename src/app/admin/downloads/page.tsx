"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Download, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockDownload {
  id: string;
  title: string;
  category: string;
  fileType: string;
  fileSize: string;
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

const mockItems: MockDownload[] = [
  { id: "1", title: "Jingle Oficial - Braide Governador", category: "jingles", fileType: "MP3", fileSize: "4.2 MB", downloads: 1250, isActive: true },
  { id: "2", title: "Hino da Campanha - Maranhão Novo", category: "musicas", fileType: "MP3", fileSize: "6.8 MB", downloads: 870, isActive: true },
  { id: "3", title: "Foto Oficial - Braide 2026", category: "fotos", fileType: "JPG", fileSize: "2.1 MB", downloads: 2340, isActive: true },
  { id: "4", title: "Pack de Fotos - Caravanas", category: "fotos", fileType: "ZIP", fileSize: "45 MB", downloads: 560, isActive: true },
  { id: "5", title: "Santinho Digital", category: "materiais", fileType: "PDF", fileSize: "1.5 MB", downloads: 3200, isActive: true },
  { id: "6", title: "Banner para Redes Sociais", category: "materiais", fileType: "ZIP", fileSize: "8.3 MB", downloads: 1890, isActive: false },
];

export default function AdminDownloads() {
  const [items, setItems] = useState(mockItems);
  const [showForm, setShowForm] = useState(false);

  const toggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
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
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="w-4 h-4" />
          Novo Material
        </Button>
      </div>

      {/* New Item Form */}
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
                placeholder="Nome do material"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
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
                placeholder="Descrição do material"
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">URL do arquivo</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button size="sm">Salvar Material</Button>
          </div>
        </motion.div>
      )}

      {/* Table */}
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
                      {categoryLabels[item.category]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-muted-foreground">{item.fileType} · {item.fileSize}</span>
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
                      <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
