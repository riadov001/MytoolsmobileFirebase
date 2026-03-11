"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-14 md:pt-16 px-4 md:px-8">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 hero-glow" />
      <SpeedLines />

      <div className="relative z-10 w-full max-w-7xl mx-auto py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* ── LEFT: Text ── */}
          <div className="flex-1 w-full flex flex-col items-center text-center">

            {/* PWA badge */}
            <motion.a
              href="https://saas.mytoolsgroup.eu"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 hover:border-green-400/60 rounded-full px-3 py-1.5 mb-5 transition-all group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              <span className="font-michroma text-green-400 text-[9px] md:text-[10px] tracking-widest uppercase">
                PWA disponible — Accédez maintenant →
              </span>
            </motion.a>

            {/* MYTOOLS */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-michroma text-3xl sm:text-4xl text-white leading-none tracking-[0.15em] text-center w-full"
            >
              MY<span className="text-[#DC2626]">TOOLS</span>
            </motion.h1>

            {/* ADMIN + speed line */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 mb-6 mt-1"
            >
              <div className="h-px w-10 bg-[#DC2626] speedbar" />
              <span className="font-michroma text-sm sm:text-base md:text-lg text-[#A8A8A8] tracking-[0.3em] uppercase">
                ADMIN
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="font-exo text-[#888] text-xs sm:text-sm md:text-base leading-relaxed max-w-sm md:max-w-lg tracking-wide mb-6"
            >
              Votre garage dans votre poche.<br />
              <span className="text-white">Devis · Factures · Clients · Réservations.</span><br />
              Tout en temps réel, partout.
            </motion.p>

            {/* Bullet points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-1.5 mb-8"
            >
              {[
                "Zéro paperasse. 100% digital.",
                "Gérez depuis n'importe où.",
                "Conçu pour les pros de l'automobile.",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2.5 justify-center">
                  <div className="w-3 h-px bg-[#DC2626] shrink-0" />
                  <span className="font-michroma text-[#555] text-[9px] sm:text-[10px] tracking-widest uppercase">{line}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8"
            >
              <a
                href="https://saas.mytoolsgroup.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-michroma text-[10px] tracking-widest uppercase px-6 py-3.5 rounded-xl transition-all overflow-hidden shadow-lg shadow-[#DC2626]/20"
              >
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
                Utiliser la PWA
              </a>

              <div className="relative inline-flex items-center justify-center gap-2 border border-[#2A2A2A] text-[#666] font-michroma text-[10px] tracking-widest uppercase px-6 py-3.5 rounded-xl cursor-default">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                App Mobile
                <span className="absolute -top-2.5 -right-1.5 bg-[#DC2626] text-white font-michroma text-[8px] tracking-widest px-1.5 py-0.5 rounded-full uppercase">
                  Bientôt
                </span>
              </div>
            </motion.div>

            {/* Store badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap items-center gap-2 justify-center"
            >
              <span className="font-michroma text-[#444] text-[9px] tracking-widest uppercase">Bientôt sur</span>
              <StoreBadge icon="🍎" label="App Store" />
              <StoreBadge icon="▶" label="Google Play" />
            </motion.div>
          </div>

          {/* ── RIGHT: Phone ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 flex justify-center items-center w-full"
          >
            <div className="relative w-full max-w-[220px] sm:max-w-[240px] md:max-w-[260px]">
              <div className="absolute inset-0 bg-[#DC2626]/15 blur-3xl rounded-full" />
              <PhoneMockup />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
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

/* ── Speed lines ── */
function SpeedLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { top: "18%", w: 100, delay: 0 },
        { top: "38%", w: 70, delay: 0.4 },
        { top: "60%", w: 130, delay: 0.8 },
        { top: "75%", w: 55, delay: 0.2 },
      ].map((l, i) => (
        <motion.div
          key={i}
          className="absolute right-0 h-px bg-gradient-to-l from-transparent via-[#DC2626]/30 to-transparent"
          style={{ top: l.top, width: l.w }}
          animate={{ x: [0, -400, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, delay: l.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── Store badge ── */
function StoreBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#161616] border border-[#2A2A2A] rounded-lg px-2.5 py-1.5 opacity-50">
      <span className="text-sm">{icon}</span>
      <span className="font-michroma text-[#666] text-[8px] tracking-widest uppercase">{label}</span>
    </div>
  );
}

/* ── Phone mockup ── */
function PhoneMockup() {
  return (
    <div className="relative w-full aspect-[9/19.5] bg-[#161616] border border-[#2A2A2A] rounded-[40px] overflow-hidden shadow-2xl shadow-black/80">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0A0A0A] rounded-b-xl z-10" />
      <div className="p-3 pt-9 h-full flex flex-col gap-2.5">

        <div className="flex items-center justify-between">
          <div>
            <div className="font-michroma text-[#555] text-[7px] tracking-widest uppercase">Bonjour</div>
            <div className="font-exo text-white text-[10px] tracking-wide">Admin</div>
          </div>
          <div className="w-6 h-6 bg-[#DC2626] rounded-lg flex items-center justify-center">
            <span className="font-michroma text-white text-[7px]">MT</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-[#0A0A0A] rounded-xl p-2 border border-[#2A2A2A]">
              <div className="font-michroma text-[#555] text-[6px] tracking-widest uppercase">{kpi.label}</div>
              <div className={`font-michroma font-bold text-xs mt-0.5 ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0A0A0A] rounded-xl p-2 border border-[#2A2A2A] flex-1">
          <div className="font-michroma text-[#555] text-[6px] tracking-widest uppercase mb-1.5">6 mois</div>
          <div className="flex items-end gap-1 h-12">
            {[35, 60, 45, 75, 65, 100].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  background: i === 5
                    ? "linear-gradient(180deg,#DC2626 0%,rgba(220,38,38,0.15) 100%)"
                    : "rgba(220,38,38,0.18)",
                }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
              />
            ))}
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-1.5 flex items-center gap-1.5">
          <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse shrink-0" />
          <span className="font-michroma text-green-400 text-[6px] tracking-widest uppercase">PWA en ligne</span>
        </div>

        <div className="flex justify-around border-t border-[#2A2A2A] pt-2 pb-0.5">
          {["📊", "📄", "🧾", "📅", "👥"].map((icon, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${i === 0 ? "bg-[#DC2626]" : ""}`}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const kpis = [
  { label: "CA Mois", value: "12 840€", color: "text-green-400" },
  { label: "En attente", value: "3 200€", color: "text-[#DC2626]" },
  { label: "Clients", value: "247", color: "text-white" },
  { label: "RDV", value: "18", color: "text-white" },
];
