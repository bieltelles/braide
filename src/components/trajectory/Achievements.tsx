"use client";

import { motion } from "motion/react";
import { GraduationCap, Landmark, ShieldCheck, Users, Award, Car, PiggyBank } from "lucide-react";

interface Achievement {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

const achievements: Achievement[] = [
  { icon: GraduationCap, value: "170+", label: "Escolas reformadas e entregues", color: "from-success to-success-light" },
  { icon: Car, value: "250+", label: "Obras simultâneas: Trânsito Livre e drenagem profunda", color: "from-red-500 to-red-400" },
  { icon: Landmark, value: "+36%", label: "Reajuste acumulado aos servidores (2023–2026)", color: "from-accent to-amber-400" },
  { icon: Award, value: "82%", label: "Aprovação como prefeito (AtlasIntel, dez/2025)", color: "from-primary to-primary-light" },
  { icon: Users, value: "403.981", label: "Votos na reeleição (70,12%) em 1° turno", color: "from-purple-500 to-purple-400" },
  { icon: ShieldCheck, value: "20+", label: "Anos de vida pública dedicados ao Maranhão", color: "from-primary to-accent" },
];

export function Achievements() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Números que <span className="text-primary">falam por si</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Resultados concretos de uma trajetória dedicada ao Maranhão.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {achievements.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-border/50 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
          >
            <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground block mb-1">
              {item.value}
            </span>
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Destaque: Recursos Próprios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-10 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/15 rounded-2xl p-6 sm:p-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success-light flex items-center justify-center shadow-lg">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
            R$ 1,6 bilhão em investimentos
          </h3>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Todas as obras e investimentos realizados durante a gestão foram feitos com{" "}
          <span className="font-bold text-primary">recursos próprios da Prefeitura</span>,{" "}
          <span className="font-bold text-foreground">sem empréstimos e sem aumento de impostos</span>{" "}
          — um exemplo de responsabilidade fiscal e gestão eficiente do dinheiro público.
        </p>
      </motion.div>
    </section>
  );
}
