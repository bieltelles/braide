"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Award, MapPin, Users, TrendingUp } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

function StatItem({ icon: Icon, value, suffix, label, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-lg shadow-primary/5 border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <span className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">
        <AnimatedCounter value={value} suffix={suffix} />
      </span>
      <span className="text-sm text-muted-foreground text-center font-medium">{label}</span>
    </motion.div>
  );
}

export function Stats() {
  const stats = [
    { icon: Award, value: 70, suffix: "%", label: "Votos na reeleição 2024", delay: 0 },
    { icon: Users, value: 403981, suffix: "", label: "Votos em 2024", delay: 0.1 },
    { icon: MapPin, value: 217, suffix: "", label: "Municípios do Maranhão", delay: 0.2 },
    { icon: TrendingUp, value: 20, suffix: "+", label: "Anos de vida pública", delay: 0.3 },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            Uma trajetória de resultados comprovados e reconhecimento popular.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
