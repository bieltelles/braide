"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { MapPin, Navigation, CalendarCheck } from "lucide-react";

function AnimatedNumber({ value }: { value: number }) {
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
    <span ref={ref}>{count.toLocaleString("pt-BR")}</span>
  );
}

export function KmCounter() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-border/50 p-4 text-center"
      >
        <Navigation className="w-6 h-6 text-primary mx-auto mb-2" />
        <span className="text-2xl sm:text-3xl font-extrabold text-primary block">
          <AnimatedNumber value={2847} />
        </span>
        <span className="text-xs text-muted-foreground">km percorridos</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-border/50 p-4 text-center"
      >
        <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
        <span className="text-2xl sm:text-3xl font-extrabold text-accent block">
          <AnimatedNumber value={42} />
        </span>
        <span className="text-xs text-muted-foreground">cidades visitadas</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-border/50 p-4 text-center"
      >
        <CalendarCheck className="w-6 h-6 text-success mx-auto mb-2" />
        <span className="text-2xl sm:text-3xl font-extrabold text-success block">
          <AnimatedNumber value={8} />
        </span>
        <span className="text-xs text-muted-foreground">eventos realizados</span>
      </motion.div>
    </div>
  );
}
