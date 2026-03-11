"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 px-4 md:px-8">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 hero-glow" />
      <SpeedLines />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-6">

        {/* PWA badge */}
        <motion.a
          href="https://saas.mytoolsgroup.eu"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 hover:border-green-400/60 rounded-full px-3 py-1.5 transition-all group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="font-michroma text-green-400 text-[9px] tracking-widest uppercase">
            PWA disponible — Accédez maintenant →
          </span>
        </motion.a>

        {/* MYTOOLS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center gap-1"
        >
          <h1 className="font-michroma text-3xl sm:text-4xl md:text-5xl text-white leading-none tracking-[0.15em]">
            MY<span className="text-[#DC2626]">TOOLS</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#DC2626] speedbar" />
            <span className="font-michroma text-xs md:text-sm text-[#A8A8A8] tracking-[0.35em] uppercase">ADMIN</span>
            <div className="h-px w-8 bg-[#DC2626]" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="font-exo text-[#777] text-sm md:text-base leading-relaxed max-w-md"
        >
          Votre garage dans votre poche.<br />
          <span className="text-[#CCC]">Devis · Factures · Clients · Réservations.</span><br />
          Tout en temps réel, partout.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <a
            href="https://saas.mytoolsgroup.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-michroma text-[10px] tracking-widest uppercase px-8 py-3.5 rounded-xl transition-all overflow-hidden shadow-lg shadow-[#DC2626]/20"
          >
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            Utiliser la PWA
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-[#2A2A2A] hover:border-[#DC2626]/40 text-[#666] hover:text-white font-michroma text-[10px] tracking-widest uppercase px-8 py-3.5 rounded-xl transition-all"
          >
            Demander l'accès
          </a>
        </motion.div>

        {/* Bullet points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {["Zéro paperasse", "100% digital", "Temps réel", "Pros de l'automobile"].map((line) => (
            <div key={line} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#DC2626]" />
              <span className="font-michroma text-[#444] text-[9px] tracking-widest uppercase">{line}</span>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <div className="w-4 h-7 border border-[#2A2A2A] rounded-full flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1 bg-[#DC2626] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

function SpeedLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { top: "15%", w: 90, delay: 0 },
        { top: "40%", w: 60, delay: 0.5 },
        { top: "65%", w: 110, delay: 0.9 },
        { top: "80%", w: 50, delay: 0.2 },
      ].map((l, i) => (
        <motion.div
          key={i}
          className="absolute right-0 h-px bg-gradient-to-l from-transparent via-[#DC2626]/25 to-transparent"
          style={{ top: l.top, width: l.w }}
          animate={{ x: [0, -400, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: l.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
