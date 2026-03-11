"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const screens = [
  {
    id: "login",
    n: "01",
    label: "Connexion",
    img: "/screenshots/login.png",
    caption: "Authentification sécurisée — réservée aux administrateurs.",
  },
  {
    id: "dashboard",
    n: "02",
    label: "Dashboard",
    img: "/screenshots/dashboard.png",
    caption: "Tous vos indicateurs clés en un coup d'œil.",
  },
  {
    id: "reservations",
    n: "03",
    label: "Rendez-vous",
    img: "/screenshots/reservations.png",
    caption: "Agenda mensuel et liste. Chaque rendez-vous maîtrisé.",
  },
  {
    id: "services",
    n: "04",
    label: "Services",
    img: "/screenshots/services.png",
    caption: "Votre catalogue de prestations, synchronisé en temps réel.",
  },
  {
    id: "devis",
    n: "05",
    label: "Devis",
    img: "/screenshots/devis.png",
    caption: "Modifiez un devis depuis le terrain — en quelques secondes.",
  },
];

export default function Screenshots() {
  const [active, setActive] = useState(1);

  return (
    <section id="screenshots" className="py-24 md:py-36 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="font-michroma text-[#DC2626] text-[9px] tracking-widest uppercase mb-3">Captures réelles</p>
            <h2 className="font-michroma text-3xl md:text-5xl lg:text-6xl text-white tracking-widest uppercase leading-none">
              L'interface.
            </h2>
          </div>
          <p className="font-michroma text-[#444] text-[10px] tracking-widest uppercase max-w-xs md:text-right">
            Captures d'écran réelles de l'application en production.
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">

          {/* Left — nav list */}
          <div className="lg:w-64 shrink-0">
            <div className="flex lg:flex-col gap-2 flex-wrap">
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-4 text-left w-full py-4 border-b border-[#1A1A1A] last:border-b-0 transition-all group ${
                    i === active ? "" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <span className={`font-michroma text-[9px] tracking-widest shrink-0 transition-colors ${i === active ? "text-[#DC2626]" : "text-[#333]"}`}>
                    {s.n}
                  </span>
                  <span className={`font-michroma text-xs tracking-widest uppercase transition-colors ${i === active ? "text-white" : "text-[#555]"}`}>
                    {s.label}
                  </span>
                  {i === active && (
                    <motion.div layoutId="activeLine" className="hidden lg:block ml-auto w-4 h-px bg-[#DC2626]" />
                  )}
                </button>
              ))}
            </div>

            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="font-michroma text-[#444] text-[10px] tracking-wide leading-relaxed mt-8 hidden lg:block"
              >
                {screens[active].caption}
              </motion.p>
            </AnimatePresence>

            {/* Arrows */}
            <div className="hidden lg:flex items-center gap-3 mt-8">
              <button
                onClick={() => setActive((a) => (a - 1 + screens.length) % screens.length)}
                className="w-9 h-9 border border-[#2A2A2A] rounded-lg flex items-center justify-center font-michroma text-[#555] hover:text-white hover:border-[#444] transition-all text-sm"
              >
                ←
              </button>
              <span className="font-michroma text-[#333] text-[9px] tracking-widest">
                {active + 1} / {screens.length}
              </span>
              <button
                onClick={() => setActive((a) => (a + 1) % screens.length)}
                className="w-9 h-9 border border-[#2A2A2A] rounded-lg flex items-center justify-center font-michroma text-[#555] hover:text-white hover:border-[#444] transition-all text-sm"
              >
                →
              </button>
            </div>
          </div>

          {/* Right — phone frame */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-[#DC2626]/8 blur-3xl rounded-full pointer-events-none scale-75" />
              <div
                className="relative w-[200px] sm:w-[220px] md:w-[250px] bg-[#0A0A0A] rounded-[44px] overflow-hidden border border-[#1E1E1E] shadow-2xl shadow-black"
                style={{ aspectRatio: "9/19.5" }}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0A0A0A] rounded-b-xl z-20" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={screens[active].img}
                      alt={screens[active].label}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile caption + arrows */}
        <div className="lg:hidden mt-8 flex items-start justify-between gap-4">
          <p className="font-michroma text-[#444] text-[10px] tracking-wide leading-relaxed flex-1">
            {screens[active].caption}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActive((a) => (a - 1 + screens.length) % screens.length)}
              className="w-8 h-8 border border-[#2A2A2A] rounded-lg flex items-center justify-center font-michroma text-[#555] hover:text-white transition-all text-xs"
            >
              ←
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % screens.length)}
              className="w-8 h-8 border border-[#2A2A2A] rounded-lg flex items-center justify-center font-michroma text-[#555] hover:text-white transition-all text-xs"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
