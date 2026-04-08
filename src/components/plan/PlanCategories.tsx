"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  Heart,
  TrendingUp,
  TreePine,
  Landmark,
  ChevronDown,
  Target,
  Users,
} from "lucide-react";

interface PlanGoal {
  text: string;
  confirmed?: boolean; // true = meta definida; false/undefined = em elaboração
}

interface PlanCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  description: string;
  goals: PlanGoal[];
}

const categories: PlanCategory[] = [
  {
    id: "social",
    icon: Heart,
    title: "Gente em Primeiro Lugar",
    color: "from-red-500 to-red-400",
    description:
      "Saúde, educação, habitação e segurança para reduzir as desigualdades e melhorar a qualidade de vida de todos os maranhenses.",
    goals: [],
  },
  {
    id: "economia",
    icon: TrendingUp,
    title: "Maranhão que Gera Oportunidades",
    color: "from-purple-500 to-purple-400",
    description:
      "Emprego, renda, empreendedorismo, inovação e turismo para um crescimento econômico que chegue a todos os cantos do estado.",
    goals: [],
  },
  {
    id: "infraestrutura",
    icon: TreePine,
    title: "Território Sustentável",
    color: "from-emerald-500 to-emerald-400",
    description:
      "Infraestrutura, mobilidade, saneamento e proteção ambiental para um Maranhão moderno e resiliente.",
    goals: [],
  },
  {
    id: "gestao",
    icon: Landmark,
    title: "Gestão Eficiente e Transparente",
    color: "from-primary to-primary-light",
    description:
      "Transparência, desburocratização, responsabilidade fiscal e combate ao desperdício — um governo que faz mais com menos.",
    goals: [
      { text: "Reduzir o ICMS do Estado do Maranhão", confirmed: true },
    ],
  },
];

export function PlanCategories() {
  const [expanded, setExpanded] = useState<string | null>("gestao");

  return (
    <div className="space-y-8">
      {/* Participação banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/15 rounded-2xl p-6 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Plano Participativo</h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Este plano está sendo construído de forma participativa com a população do Maranhão.
          As metas de cada eixo serão definidas a partir das contribuições e sugestões do povo maranhense.
        </p>
      </motion.div>

      {/* Eixos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((cat, i) => {
          const isExpanded = expanded === cat.id;
          const hasGoals = cat.goals.length > 0;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-primary/30 shadow-lg"
                    : "border-border/50 hover:shadow-md"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : cat.id)}
                  className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{cat.description}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Content */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 border-t border-border/50 pt-4">
                    <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>

                    {hasGoals && (
                      <>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                          <Target className="w-4 h-4 text-primary" />
                          Metas
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {cat.goals.map((goal, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {j + 1}
                              </span>
                              <span className="font-medium">{goal.text}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* Em elaboração */}
                    <div className="flex items-center gap-2 bg-accent/5 border border-accent/15 rounded-xl px-4 py-3">
                      <Users className="w-4 h-4 text-accent flex-shrink-0" />
                      <p className="text-sm text-accent-dark font-medium">
                        {hasGoals ? "Demais metas em" : "Em"} elaboração junto com o povo do Maranhão
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
