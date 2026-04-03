"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Send, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryOptions = [
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "seguranca", label: "Segurança" },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "economia", label: "Economia e Emprego" },
  { value: "meio_ambiente", label: "Meio Ambiente" },
];

export function SuggestionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !content.trim()) return;

    // In production, POST to /api/suggestions
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCategory("");
      setContent("");
    }, 3000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16"
    >
      <div className="bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-3xl border border-primary/10 p-8 sm:p-10 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
            Plano <span className="text-primary">Participativo</span>
          </h2>
          <p className="text-muted-foreground">
            Sua opinião é fundamental. Envie sugestões para o plano de governo e ajude a construir o Maranhão que você quer.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Sugestão enviada!</h3>
            <p className="text-sm text-muted-foreground">
              Obrigado pela sua contribuição. Sua sugestão será analisada pela equipe.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Área temática
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                <option value="">Selecione uma área...</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Sua sugestão
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                maxLength={1000}
                placeholder="Descreva sua sugestão para o plano de governo..."
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {content.length}/1000
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              <Send className="w-4 h-4" />
              Enviar Sugestão
            </Button>
          </form>
        )}
      </div>
    </motion.section>
  );
}
