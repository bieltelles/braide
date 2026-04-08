"use client";

import { motion } from "motion/react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Check, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { maranhaoCities } from "@/data/maranhao-cities";

const categoryOptions = [
  { value: "social", label: "Gente em Primeiro Lugar (Saúde, Educação, Segurança, Habitação)" },
  { value: "economia", label: "Maranhão que Gera Oportunidades (Economia, Emprego, Turismo)" },
  { value: "infraestrutura", label: "Território Sustentável (Infraestrutura, Meio Ambiente)" },
  { value: "gestao", label: "Gestão Eficiente e Transparente" },
  { value: "outro", label: "Outro" },
];

const allCityNames = maranhaoCities.map((c) => c.name);

/** Remove accents for fuzzy matching */
function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function SuggestionForm() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // Pre-fill name from session
  useEffect(() => {
    if (user?.name && !name) setName(user.name);
  }, [user, name]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCities = useMemo(() => {
    if (!citySearch) return allCityNames.slice(0, 10);
    const q = normalize(citySearch);
    return allCityNames
      .filter((c) => normalize(c).includes(q))
      .slice(0, 10);
  }, [citySearch]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !content.trim()) return;
    setSending(true);

    try {
      await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          content: content.trim(),
          name: name.trim() || undefined,
          city: selectedCity || undefined,
        }),
      });
    } catch {}

    setSending(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCategory("");
      setContent("");
      setCitySearch("");
      setSelectedCity("");
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
            {/* Nome e Cidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Seu nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como quer ser chamado(a)"
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div ref={cityRef} className="relative">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Sua cidade
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setSelectedCity("");
                      setShowCityDropdown(true);
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="Digite sua cidade..."
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-border/50 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                {showCityDropdown && filteredCities.length > 0 && !selectedCity && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-border/50 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Área temática */}
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
                <option value="">Selecione um eixo...</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sugestão */}
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

            <Button type="submit" size="lg" className="w-full" disabled={sending}>
              <Send className="w-4 h-4" />
              {sending ? "Enviando..." : "Enviar Sugestão"}
            </Button>
          </form>
        )}
      </div>
    </motion.section>
  );
}
