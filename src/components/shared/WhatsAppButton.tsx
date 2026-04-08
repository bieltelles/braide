"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Send } from "lucide-react";
import { BraideAvatar } from "./BraideAvatar";

const WHATSAPP_NUMBER = "5598999999999";
const DEFAULT_MESSAGE = "Olá! Quero saber mais sobre a pré-candidatura de Eduardo Braide ao Governo do Maranhão.";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const handleSend = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden mb-2"
          >
            {/* Header */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BraideAvatar size="sm" rounded="full" />
                <div>
                  <p className="text-white text-sm font-semibold">Eduardo Braide</p>
                  <p className="text-white/70 text-xs">Responde em minutos</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat area */}
            <div className="p-4 bg-[#ECE5DD] min-h-[80px]">
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm max-w-[85%]">
                <p className="text-sm text-gray-800">
                  Olá! 👋 Tem alguma dúvida ou quer participar da campanha? Mande sua mensagem!
                </p>
                <span className="text-[10px] text-gray-400 float-right mt-1">agora</span>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 rounded-full border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/30"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:bg-[#20BA5C] transition-colors cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl transition-shadow cursor-pointer"
        aria-label="Abrir WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Pulse animation */}
      {!isOpen && (
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]" />
        </span>
      )}
    </div>
  );
}
