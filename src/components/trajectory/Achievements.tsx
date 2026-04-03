"use client";

import { motion } from "motion/react";
import { Building2, GraduationCap, Heart, Landmark, Road, ShieldCheck } from "lucide-react";

interface Achievement {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

const achievements: Achievement[] = [
  { icon: Road, value: "1.500+", label: "Ruas pavimentadas em São Luís", color: "from-primary to-primary-light" },
  { icon: GraduationCap, value: "50+", label: "Creches e escolas construídas/reformadas", color: "from-success to-success-light" },
  { icon: Heart, value: "30+", label: "UBS reformadas e equipadas", color: "from-red-500 to-red-400" },
  { icon: Landmark, value: "R$ 2B+", label: "Em investimentos na cidade", color: "from-accent to-amber-400" },
  { icon: Building2, value: "100%", label: "Centro Histórico revitalizado", color: "from-purple-500 to-purple-400" },
  { icon: ShieldCheck, value: "70%", label: "Aprovação popular na reeleição", color: "from-primary to-accent" },
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
          Conquistas como <span className="text-primary">Prefeito</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Resultados concretos que transformaram São Luís e que agora serão levados a todo o Maranhão.
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
    </section>
  );
}
