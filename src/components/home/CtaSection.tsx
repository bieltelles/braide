"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FileText, Calendar, MapPin, Download, ArrowRight } from "lucide-react";

const ctaItems = [
  {
    href: "/trajetoria",
    icon: FileText,
    title: "Trajetória",
    description: "Conheça a história e as conquistas de Eduardo Braide",
    color: "from-primary to-primary-light",
  },
  {
    href: "/agenda",
    icon: Calendar,
    title: "Agenda",
    description: "Veja onde Braide esteve e para onde está indo",
    color: "from-success to-success-light",
  },
  {
    href: "/plano-de-governo",
    icon: MapPin,
    title: "Plano de Governo",
    description: "Participe do plano participativo para o Maranhão",
    color: "from-accent to-amber-400",
  },
  {
    href: "/downloads",
    icon: Download,
    title: "Downloads",
    description: "Baixe músicas, fotos e materiais da campanha",
    color: "from-purple-500 to-purple-400",
  },
];

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Explore e <span className="text-primary">participe</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Descubra tudo sobre a pré-candidatura e como você pode fazer parte dessa mudança.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ctaItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={item.href}
                className="group block p-6 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Saiba mais
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
