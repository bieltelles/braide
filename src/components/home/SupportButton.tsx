"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Heart, LogIn, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface SupportButtonProps {
  isAuthenticated: boolean;
  isSupporter: boolean;
  onSupport: () => Promise<void>;
  onSignIn: (provider: string) => void;
}

export function SupportButton({
  isAuthenticated,
  isSupporter,
  onSupport,
  onSignIn,
}: SupportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showProviders, setShowProviders] = useState(false);

  const handleSupport = async () => {
    if (!isAuthenticated) {
      setShowProviders(true);
      return;
    }
    setLoading(true);
    try {
      await onSupport();
    } finally {
      setLoading(false);
    }
  };

  if (isSupporter) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-2xl border border-success/20">
          <Check className="w-5 h-5" />
          <span className="font-semibold">Você já declarou seu apoio!</span>
        </div>
      </motion.div>
    );
  }

  return (
    <section id="apoie" className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
            <Heart className="w-10 h-10 text-accent" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Declare seu <span className="text-accent">apoio</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
            Faça parte desse movimento. Sua foto aparecerá no mural de apoiadores e seus amigos
            poderão ver que você apoia Eduardo Braide.
          </p>

          {!showProviders ? (
            <Button
              size="xl"
              variant="accent"
              onClick={handleSupport}
              disabled={loading}
              className="text-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
              Eu Apoio Braide
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <p className="text-sm text-muted-foreground mb-2 sm:mb-0 w-full sm:w-auto">
                <LogIn className="w-4 h-4 inline mr-1" />
                Entre com:
              </p>
              <Button
                onClick={() => onSignIn("google")}
                className="bg-white border border-border text-foreground hover:bg-muted shadow-sm w-full sm:w-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button
                onClick={() => onSignIn("facebook")}
                className="bg-[#1877F2] text-white hover:bg-[#166FE5] shadow-sm w-full sm:w-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </motion.div>
          )}

          <p className="mt-6 text-xs text-muted-foreground">
            Ao clicar, você concorda em ter sua foto exibida no mural de apoiadores.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
