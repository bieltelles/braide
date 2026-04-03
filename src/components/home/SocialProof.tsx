"use client";

import { motion } from "motion/react";
import { Users, Heart, Share2 } from "lucide-react";

interface Supporter {
  id: string;
  name: string | null;
  image: string | null;
  city: string | null;
}

interface SocialProofProps {
  supporters: Supporter[];
  totalCount: number;
}

export function SocialProof({ supporters, totalCount }: SocialProofProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-success/10 text-success rounded-full px-4 py-1.5 mb-4">
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">Movimento popular crescendo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            <span className="text-primary">{totalCount.toLocaleString("pt-BR")}</span> pessoas já apoiam Braide
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Maranhenses de todo o estado já declararam seu apoio. Junte-se a esse movimento!
          </p>
        </motion.div>

        {/* Supporter Avatars Grid */}
        {supporters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {supporters.slice(0, 30).map((supporter, i) => (
              <motion.div
                key={supporter.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 200 }}
                className="group relative"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-md hover:border-primary transition-colors hover:scale-110 duration-200">
                  {supporter.image ? (
                    <img
                      src={supporter.image}
                      alt={supporter.name || "Apoiador"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold">
                      {supporter.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {supporter.name}
                  {supporter.city && <span className="text-white/60"> - {supporter.city}</span>}
                </div>
              </motion.div>
            ))}

            {totalCount > 30 && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  +{(totalCount - 30).toLocaleString("pt-BR")}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Friends who support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-border/50 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Amigos que apoiam</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Faça login para ver quais dos seus amigos já declararam apoio a Eduardo Braide.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhe e amplie o movimento</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
