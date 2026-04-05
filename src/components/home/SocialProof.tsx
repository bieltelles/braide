"use client";

import { motion } from "motion/react";
import { Users, Heart, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const SupportersMap = dynamic(
  () => import("./SupportersMap").then((mod) => mod.SupportersMap),
  { ssr: false, loading: () => <div className="w-full h-[500px] rounded-2xl bg-muted animate-pulse" /> }
);

interface Supporter {
  id: string;
  name: string | null;
  image: string | null;
  city: string | null;
}

interface CityGroup {
  name: string;
  lat: number;
  lng: number;
  count: number;
  supporters: { id: string; name: string | null; image: string | null }[];
}

interface SocialProofProps {
  supporters: Supporter[];
  totalCount: number;
  cities: CityGroup[];
  userLat: number;
  userLng: number;
}

export function SocialProof({ supporters, totalCount, cities, userLat, userLng }: SocialProofProps) {
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
            <span className="text-sm font-semibold">#SouBraide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            <span className="text-primary">{totalCount.toLocaleString("pt-BR")}</span> pessoas já apoiam Braide
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Maranhenses de todo o estado já declararam seu apoio. Veja no mapa e junte-se ao movimento!
          </p>
        </motion.div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <SupportersMap cities={cities} userLat={userLat} userLng={userLng} />
        </motion.div>

        {/* Supporter Avatars Row */}
        {supporters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Apoiadores recentes</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {supporters.slice(0, 30).map((supporter, i) => (
                <motion.div
                  key={supporter.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02, type: "spring", stiffness: 200 }}
                  className="group relative"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-md hover:border-primary transition-colors hover:scale-110 duration-200">
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
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">
                    +{(totalCount - 30).toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-border/50 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Apareça no mapa!</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Declare seu apoio com <span className="font-semibold text-accent">#SouBraide</span> e sua foto
            aparecerá no mapa junto a apoiadores da sua região.
          </p>
          <a
            href="#apoie"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-accent/25 hover:bg-accent-dark transition-all"
          >
            <Heart className="w-4 h-4" />
            #SouBraide
          </a>
        </motion.div>
      </div>
    </section>
  );
}
