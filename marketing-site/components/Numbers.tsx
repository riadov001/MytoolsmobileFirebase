"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "40+",   label: "Endpoints API" },
  { value: "5",     label: "Modules" },
  { value: "100%",  label: "REST" },
  { value: "PWA",   label: "Disponible maintenant" },
  { value: "iOS",   label: "App Store — Bientôt" },
];

export default function Numbers() {
  return (
    <section className="border-t border-b border-[#1A1A1A] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 md:px-8"
      >
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#1A1A1A]">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="flex-1 flex flex-col gap-0.5 py-6 px-6 sm:px-8 group"
            >
              <span className="font-michroma text-2xl md:text-3xl text-white tracking-tight group-hover:text-[#DC2626] transition-colors duration-300">
                {s.value}
              </span>
              <span className="font-michroma text-[#444] text-[9px] tracking-widest uppercase">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
