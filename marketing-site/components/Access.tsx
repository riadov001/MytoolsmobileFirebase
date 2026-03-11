"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Access() {
  return (
    <section id="access" className="py-24 md:py-40 border-t border-[#1A1A1A] relative overflow-hidden">

      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DC2626]/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl">

          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-michroma text-[#DC2626] text-[9px] tracking-widest uppercase mb-6"
          >
            Accès
          </motion.p>

          {/* Main statement */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-michroma text-4xl md:text-6xl lg:text-7xl text-white tracking-widest uppercase leading-none mb-8"
          >
            Réservé aux<br />
            <span className="text-[#2A2A2A]">garages</span><br />
            partenaires.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-michroma text-[#555] text-xs md:text-sm tracking-wide leading-relaxed max-w-md mb-12"
          >
            MyTools Admin n'est pas une application publique. Elle est réservée aux administrateurs des garages intégrés à la plateforme MyTools Group.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <a
              href="https://saas.mytoolsgroup.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-michroma text-[10px] tracking-widest uppercase px-8 py-4 rounded-xl transition-all overflow-hidden shadow-xl shadow-[#DC2626]/15"
            >
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              Accéder à la PWA
              <span className="text-white/60">↗</span>
            </a>
            <a
              href="mailto:contact@mytoolsgroup.eu?subject=Demande%20d%27acc%C3%A8s%20MyTools%20Admin"
              className="inline-flex items-center gap-3 border border-[#2A2A2A] hover:border-[#444] text-[#666] hover:text-white font-michroma text-[10px] tracking-widest uppercase px-8 py-4 rounded-xl transition-all"
            >
              Demander l'accès
            </a>
          </motion.div>

          {/* Mobile app coming */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="h-px bg-[#1A1A1A] w-full" />
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <span className="font-michroma text-[#333] text-[9px] tracking-widest uppercase">Application mobile</span>
              <div className="flex items-center gap-3">
                <StoreBadge label="App Store" />
                <StoreBadge label="Google Play" />
              </div>
              <span className="font-michroma text-[#DC2626] text-[9px] tracking-widest uppercase">2026</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function StoreBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border border-[#1E1E1E] rounded-lg px-3 py-2 opacity-40">
      <span className="font-michroma text-[#555] text-[9px] tracking-widest uppercase">{label}</span>
    </div>
  );
}
