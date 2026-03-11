"use client";

import { motion } from "framer-motion";

const phases = [
  {
    phase: "Live",
    label: "Aujourd'hui",
    items: ["Devis · Factures · Clients", "Réservations · Services", "Dashboard KPI", "API REST — 40+ endpoints"],
    active: true,
  },
  {
    phase: "Q3 2026",
    label: "Intelligence Artificielle",
    items: ["Prédiction CA", "Chatbot client 24h/24", "Scan OCR carte grise", "Devis auto-généré"],
    active: false,
  },
  {
    phase: "Q4 2026",
    label: "Communication",
    items: ["Notifications push", "SMS & email auto", "Chat interne équipe", "Rappels RDV"],
    active: false,
  },
  {
    phase: "Q1 2027",
    label: "Documents",
    items: ["Export PDF natif", "Signature électronique", "Archivage cloud", "Template personnalisable"],
    active: false,
  },
  {
    phase: "2027",
    label: "Open Banking",
    items: ["Budget tracker intégré", "Rapprochement bancaire", "Prévisionnel CA", "Comptabilité automatisée"],
    active: false,
  },
];

export default function RoadmapTimeline() {
  return (
    <section id="roadmap" className="py-24 md:py-36 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <p className="font-michroma text-[#DC2626] text-[9px] tracking-widest uppercase mb-3">Vision</p>
          <h2 className="font-michroma text-3xl md:text-5xl lg:text-6xl text-white tracking-widest uppercase leading-none">
            La route
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop only */}
          <div className="hidden md:block absolute left-[140px] top-0 bottom-0 w-px bg-[#1A1A1A]" />

          <div className="flex flex-col gap-0">
            {phases.map((p, i) => (
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col md:flex-row gap-4 md:gap-0 border-b border-[#1A1A1A] py-8"
              >
                {/* Phase label */}
                <div className="md:w-[140px] shrink-0 flex md:flex-col gap-3 md:gap-1 md:pr-10">
                  <span className={`font-michroma text-xs tracking-widest uppercase ${p.active ? "text-[#DC2626]" : "text-[#333]"}`}>
                    {p.phase}
                  </span>
                  {p.active && (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-michroma text-green-500 text-[8px] tracking-widest uppercase">Live</span>
                    </span>
                  )}
                </div>

                {/* Dot — desktop */}
                <div className="hidden md:flex items-start justify-center w-8 shrink-0 relative">
                  <div className={`w-2 h-2 rounded-full mt-1 ${p.active ? "bg-[#DC2626] shadow-[0_0_8px_#DC2626]" : "bg-[#2A2A2A] border border-[#3A3A3A]"}`} />
                </div>

                {/* Content */}
                <div className="flex-1 md:pl-8">
                  <p className={`font-michroma text-sm md:text-base tracking-wide mb-4 ${p.active ? "text-white" : "text-[#555]"}`}>
                    {p.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.items.map((item) => (
                      <span
                        key={item}
                        className={`font-michroma text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full border ${
                          p.active
                            ? "border-[#DC2626]/30 text-[#888] bg-[#DC2626]/5"
                            : "border-[#1E1E1E] text-[#333]"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
