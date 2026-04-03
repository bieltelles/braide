"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  Heart,
  GraduationCap,
  ShieldCheck,
  Building2,
  TrendingUp,
  Leaf,
  ChevronDown,
  Target,
} from "lucide-react";

interface PlanCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  description: string;
  goals: string[];
}

const categories: PlanCategory[] = [
  {
    id: "saude",
    icon: Heart,
    title: "Saúde",
    color: "from-red-500 to-red-400",
    description:
      "Saúde de qualidade e acessível para todos os maranhenses, com hospitais regionais, telemedicina e valorização dos profissionais.",
    goals: [
      "Construir 5 novos hospitais regionais no interior do estado",
      "Implementar programa de telemedicina em todos os 217 municípios",
      "Zerar a fila de cirurgias eletivas em 4 anos",
      "Criar programa de atração de médicos especialistas para o interior",
      "Reformar e equipar 100% das UBS do estado",
    ],
  },
  {
    id: "educacao",
    icon: GraduationCap,
    title: "Educação",
    color: "from-success to-success-light",
    description:
      "Educação como ferramenta de transformação social, com escolas em tempo integral, capacitação tecnológica e valorização dos professores.",
    goals: [
      "Ampliar para 50% as escolas estaduais em tempo integral",
      "Criar programa de capacitação digital para alunos e professores",
      "Implementar programa de bolsas universitárias estaduais",
      "Construir 10 centros de formação profissional em polos regionais",
      "Garantir transporte escolar de qualidade em todo o estado",
    ],
  },
  {
    id: "seguranca",
    icon: ShieldCheck,
    title: "Segurança",
    color: "from-primary to-primary-light",
    description:
      "Segurança pública integrada e inteligente, com tecnologia, valorização do policial e presença do estado em todas as regiões.",
    goals: [
      "Instalar sistema de videomonitoramento em todas as cidades-polo",
      "Criar programa de policiamento comunitário em 100 bairros",
      "Valorizar e capacitar as forças de segurança com plano de carreira",
      "Implementar delegacias digitais em todo o estado",
      "Reduzir em 30% os índices de criminalidade violenta",
    ],
  },
  {
    id: "infraestrutura",
    icon: Building2,
    title: "Infraestrutura",
    color: "from-accent to-amber-400",
    description:
      "Infraestrutura moderna que conecta o Maranhão e gera desenvolvimento, com rodovias, saneamento e moradia digna.",
    goals: [
      "Pavimentar 3.000 km de estradas estaduais",
      "Universalizar o acesso à água tratada em 4 anos",
      "Construir 50.000 unidades habitacionais populares",
      "Ampliar o saneamento básico para 80% da população",
      "Modernizar os terminais rodoviários das cidades-polo",
    ],
  },
  {
    id: "economia",
    icon: TrendingUp,
    title: "Economia e Emprego",
    color: "from-purple-500 to-purple-400",
    description:
      "Desenvolvimento econômico sustentável com geração de emprego e renda, apoio ao empreendedorismo e atração de investimentos.",
    goals: [
      "Criar programa de microcrédito para empreendedores maranhenses",
      "Atrair R$ 10 bilhões em investimentos privados para o estado",
      "Implementar programa de primeiro emprego para jovens",
      "Criar polos de tecnologia e inovação em 5 cidades",
      "Fortalecer o turismo como vetor de desenvolvimento regional",
    ],
  },
  {
    id: "meio_ambiente",
    icon: Leaf,
    title: "Meio Ambiente",
    color: "from-emerald-500 to-emerald-400",
    description:
      "Preservação ambiental aliada ao desenvolvimento sustentável, proteção dos biomas maranhenses e combate às mudanças climáticas.",
    goals: [
      "Zerar o desmatamento ilegal no Maranhão",
      "Criar programa de pagamento por serviços ambientais",
      "Proteger os Lençóis Maranhenses e patrimônios naturais",
      "Implementar programa de energia solar em comunidades rurais",
      "Reflorestar 100 mil hectares de áreas degradadas",
    ],
  },
];

export function PlanCategories() {
  const [expanded, setExpanded] = useState<string | null>("saude");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
        >
          <div
            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
              expanded === cat.id
                ? "border-primary/30 shadow-lg"
                : "border-border/50 hover:shadow-md"
            }`}
          >
            {/* Header */}
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
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
                  expanded === cat.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Content */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                expanded === cat.id ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-5 border-t border-border/50 pt-4">
                <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                  <Target className="w-4 h-4 text-primary" />
                  Metas principais
                </h4>
                <ul className="space-y-2">
                  {cat.goals.map((goal, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
