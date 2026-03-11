"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const screens = [
  { id: "login",        n: "01", label: "Connexion",    caption: "Authentification sécurisée — réservée aux administrateurs." },
  { id: "dashboard",   n: "02", label: "Dashboard",    caption: "Tous vos indicateurs clés en un coup d'œil." },
  { id: "reservations",n: "03", label: "Rendez-vous",  caption: "Agenda mensuel et liste. Chaque rendez-vous maîtrisé." },
  { id: "services",    n: "04", label: "Services",     caption: "Votre catalogue de prestations, synchronisé en temps réel." },
  { id: "devis",       n: "05", label: "Devis",        caption: "Modifiez un devis depuis le terrain — en quelques secondes." },
];

/* ── Logo MyTools ── */
function Logo({ size = 24 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center bg-[#DC2626] rounded-lg shrink-0"
      style={{ width: size, height: size }}
    >
      <span style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: size * 0.35, letterSpacing: "0.05em" }}>MT</span>
    </div>
  );
}

/* ── Screen: Login ── */
function LoginMockup() {
  return (
    <div className="w-full h-full bg-[#0A0A0A] flex flex-col items-center justify-center px-5 gap-4">
      <Logo size={40} />
      <div className="text-center">
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 11, letterSpacing: "0.2em" }}>MY<span style={{ color: "#DC2626" }}>TOOLS</span></div>
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#555", fontSize: 7, letterSpacing: "0.3em" }}>ADMIN</div>
      </div>
      <div className="w-full flex flex-col gap-2 mt-2">
        <div className="w-full bg-[#161616] border border-[#2A2A2A] rounded-xl px-3 py-2.5">
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#333", fontSize: 7, letterSpacing: "0.2em" }}>EMAIL</div>
          <div style={{ fontFamily: "sans-serif", color: "#666", fontSize: 9 }}>admin@garage.fr</div>
        </div>
        <div className="w-full bg-[#161616] border border-[#2A2A2A] rounded-xl px-3 py-2.5">
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#333", fontSize: 7, letterSpacing: "0.2em" }}>MOT DE PASSE</div>
          <div style={{ fontFamily: "sans-serif", color: "#666", fontSize: 9 }}>••••••••</div>
        </div>
        <div className="w-full bg-[#DC2626] rounded-xl py-2.5 flex items-center justify-center gap-1.5">
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 8, letterSpacing: "0.2em" }}>CONNEXION</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#2d9e5f", fontSize: 6, letterSpacing: "0.2em" }}>ACCÈS SÉCURISÉ</div>
      </div>
    </div>
  );
}

/* ── Screen: Dashboard ── */
function DashboardMockup() {
  return (
    <div className="w-full h-full bg-[#0A0A0A] flex flex-col px-3 pt-8 pb-3 gap-2">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#555", fontSize: 6, letterSpacing: "0.2em" }}>BONJOUR</div>
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 9 }}>Admin</div>
        </div>
        <Logo size={22} />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { l: "CA MOIS",    v: "12 840€", c: "#4ade80" },
          { l: "EN ATTENTE", v: "3 200€",  c: "#DC2626" },
          { l: "CLIENTS",    v: "247",     c: "#fff" },
          { l: "RDV",        v: "18",      c: "#fff" },
        ].map((k) => (
          <div key={k.l} className="bg-[#161616] border border-[#1E1E1E] rounded-xl p-2">
            <div style={{ fontFamily: "Michroma, sans-serif", color: "#444", fontSize: 6, letterSpacing: "0.15em" }}>{k.l}</div>
            <div style={{ fontFamily: "Michroma, sans-serif", color: k.c, fontSize: 10, fontWeight: 700, marginTop: 2 }}>{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#161616] border border-[#1E1E1E] rounded-xl p-2 flex-1">
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#444", fontSize: 6, letterSpacing: "0.15em", marginBottom: 6 }}>6 MOIS</div>
        <div className="flex items-end gap-1 h-10">
          {[35, 60, 45, 75, 65, 100].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              style={{ background: i === 5 ? "linear-gradient(180deg,#DC2626,rgba(220,38,38,0.15))" : "rgba(220,38,38,0.2)" }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
            />
          ))}
        </div>
      </div>
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shrink-0" />
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#4ade80", fontSize: 6, letterSpacing: "0.15em" }}>PWA EN LIGNE</div>
      </div>
      <div className="flex justify-around border-t border-[#1A1A1A] pt-1.5">
        {["📊","📄","🧾","📅","👥"].map((ico, i) => (
          <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${i === 0 ? "bg-[#DC2626]" : ""}`}>{ico}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Screen: Reservations ── */
function ReservationsMockup() {
  const rdvs = [
    { h: "09:00", name: "M. Bernard",   svc: "Vidange", c: "#DC2626" },
    { h: "10:30", name: "Mme. Dupont",  svc: "Freins",  c: "#4ade80" },
    { h: "14:00", name: "M. Laurent",   svc: "Révision",c: "#f59e0b" },
    { h: "16:00", name: "M. Martin",    svc: "Pneus",   c: "#DC2626" },
  ];
  return (
    <div className="w-full h-full bg-[#0A0A0A] flex flex-col px-3 pt-8 pb-3 gap-2">
      <div className="flex items-center justify-between mb-1">
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 9, letterSpacing: "0.1em" }}>RENDEZ-VOUS</div>
        <Logo size={18} />
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["L","M","M","J","V","S","D"].map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div style={{ fontFamily: "Michroma, sans-serif", color: "#444", fontSize: 6 }}>{d}</div>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i === 2 ? "bg-[#DC2626]" : ""}`}>
              <div style={{ fontFamily: "Michroma, sans-serif", color: i === 2 ? "#fff" : "#666", fontSize: 7 }}>{10 + i}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        {rdvs.map((r, i) => (
          <div key={i} className="flex items-center gap-2 bg-[#161616] border border-[#1E1E1E] rounded-xl px-2 py-1.5">
            <div className="w-0.5 h-6 rounded-full shrink-0" style={{ background: r.c }} />
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 7 }}>{r.name}</div>
              <div style={{ fontFamily: "sans-serif", color: "#555", fontSize: 7 }}>{r.svc}</div>
            </div>
            <div style={{ fontFamily: "Michroma, sans-serif", color: "#444", fontSize: 7 }}>{r.h}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-around border-t border-[#1A1A1A] pt-1.5">
        {["📊","📄","🧾","📅","👥"].map((ico, i) => (
          <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${i === 3 ? "bg-[#DC2626]" : ""}`}>{ico}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Screen: Services ── */
function ServicesMockup() {
  const svcs = [
    { name: "Vidange complète",  price: "89€",  cat: "ENTRETIEN" },
    { name: "Révision 30 000km", price: "249€", cat: "RÉVISION" },
    { name: "Freinage AV/AR",    price: "180€", cat: "FREINAGE" },
    { name: "Géométrie 4 roues", price: "120€", cat: "GÉOMÉTRIE" },
  ];
  return (
    <div className="w-full h-full bg-[#0A0A0A] flex flex-col px-3 pt-8 pb-3 gap-2">
      <div className="flex items-center justify-between mb-1">
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 9, letterSpacing: "0.1em" }}>SERVICES</div>
        <Logo size={18} />
      </div>
      <div className="bg-[#161616] border border-[#1E1E1E] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="#444" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
        <div style={{ fontFamily: "sans-serif", color: "#333", fontSize: 8 }}>Rechercher un service...</div>
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        {svcs.map((s, i) => (
          <div key={i} className="flex items-center justify-between bg-[#161616] border border-[#1E1E1E] rounded-xl px-2.5 py-2">
            <div>
              <div style={{ fontFamily: "Michroma, sans-serif", color: "#DC2626", fontSize: 6, letterSpacing: "0.15em" }}>{s.cat}</div>
              <div style={{ fontFamily: "sans-serif", color: "#ccc", fontSize: 8 }}>{s.name}</div>
            </div>
            <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 10, fontWeight: 700 }}>{s.price}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#DC2626] rounded-xl py-2 flex items-center justify-center">
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 7, letterSpacing: "0.2em" }}>+ AJOUTER UN SERVICE</div>
      </div>
      <div className="flex justify-around border-t border-[#1A1A1A] pt-1.5">
        {["📊","📄","🧾","📅","👥"].map((ico, i) => (
          <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${i === 2 ? "bg-[#DC2626]" : ""}`}>{ico}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Screen: Devis ── */
function DevisMockup() {
  return (
    <div className="w-full h-full bg-[#0A0A0A] flex flex-col px-3 pt-8 pb-3 gap-2">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 9, letterSpacing: "0.1em" }}>DEVIS #0042</div>
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#555", fontSize: 6, letterSpacing: "0.15em" }}>M. DUPONT MARC</div>
        </div>
        <Logo size={18} />
      </div>
      <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-xl px-2.5 py-1.5">
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#DC2626", fontSize: 6, letterSpacing: "0.15em" }}>STATUT: EN ATTENTE</div>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div style={{ fontFamily: "Michroma, sans-serif", color: "#444", fontSize: 6, letterSpacing: "0.15em", marginBottom: 4 }}>PRESTATIONS</div>
        {[
          { l: "Vidange complète", p: "89€" },
          { l: "Filtre à huile",   p: "18€" },
          { l: "Main d'œuvre",     p: "60€" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between border-b border-[#1A1A1A] py-1.5">
            <div style={{ fontFamily: "sans-serif", color: "#888", fontSize: 8 }}>{item.l}</div>
            <div style={{ fontFamily: "Michroma, sans-serif", color: "#ccc", fontSize: 8 }}>{item.p}</div>
          </div>
        ))}
        <div className="flex items-center justify-between mt-1">
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#555", fontSize: 7, letterSpacing: "0.1em" }}>TOTAL HT</div>
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 11, fontWeight: 700 }}>167€</div>
        </div>
        <div className="flex items-center justify-between">
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#555", fontSize: 7, letterSpacing: "0.1em" }}>TOTAL TTC</div>
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#DC2626", fontSize: 13, fontWeight: 700 }}>200€</div>
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="flex-1 border border-[#2A2A2A] rounded-xl py-2 flex items-center justify-center">
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#555", fontSize: 6, letterSpacing: "0.15em" }}>MODIFIER</div>
        </div>
        <div className="flex-1 bg-[#DC2626] rounded-xl py-2 flex items-center justify-center">
          <div style={{ fontFamily: "Michroma, sans-serif", color: "#fff", fontSize: 6, letterSpacing: "0.15em" }}>VALIDER</div>
        </div>
      </div>
      <div className="flex justify-around border-t border-[#1A1A1A] pt-1.5">
        {["📊","📄","🧾","📅","👥"].map((ico, i) => (
          <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${i === 1 ? "bg-[#DC2626]" : ""}`}>{ico}</div>
        ))}
      </div>
    </div>
  );
}

const mockups: Record<string, React.ReactNode> = {
  login:        <LoginMockup />,
  dashboard:    <DashboardMockup />,
  reservations: <ReservationsMockup />,
  services:     <ServicesMockup />,
  devis:        <DevisMockup />,
};

export default function Screenshots() {
  const [active, setActive] = useState(1);

  return (
    <section id="screenshots" className="py-20 md:py-28 border-t border-[#1A1A1A]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-michroma text-[#DC2626] text-[9px] tracking-widest uppercase mb-3">Aperçu de l'interface</p>
          <h2 className="font-michroma text-2xl md:text-3xl text-white tracking-widest uppercase">
            L'interface en production
          </h2>
        </motion.div>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {screens.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`font-michroma text-[9px] tracking-widest uppercase px-4 py-2 rounded-lg border transition-all ${
                i === active
                  ? "border-[#DC2626] text-white bg-[#DC2626]/10"
                  : "border-[#1E1E1E] text-[#444] hover:text-[#888] hover:border-[#2A2A2A]"
              }`}
            >
              {s.n} — {s.label}
            </button>
          ))}
        </div>

        {/* Phone frame — centré */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#DC2626]/8 blur-3xl rounded-full pointer-events-none" />
            <div
              className="relative w-[200px] sm:w-[220px] md:w-[240px] bg-[#0A0A0A] rounded-[44px] overflow-hidden border border-[#1E1E1E] shadow-2xl shadow-black"
              style={{ aspectRatio: "9/19.5" }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0A0A0A] rounded-b-xl z-20" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  {mockups[screens[active].id]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Caption + navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActive((a) => (a - 1 + screens.length) % screens.length)}
              className="w-8 h-8 border border-[#2A2A2A] rounded-lg flex items-center justify-center font-michroma text-[#555] hover:text-white hover:border-[#444] transition-all text-sm"
            >←</button>

            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="font-exo text-[#555] text-xs md:text-sm leading-relaxed text-center max-w-xs"
              >
                {screens[active].caption}
              </motion.p>
            </AnimatePresence>

            <button
              onClick={() => setActive((a) => (a + 1) % screens.length)}
              className="w-8 h-8 border border-[#2A2A2A] rounded-lg flex items-center justify-center font-michroma text-[#555] hover:text-white hover:border-[#444] transition-all text-sm"
            >→</button>
          </div>

          <span className="font-michroma text-[#2A2A2A] text-[9px] tracking-widest">
            {active + 1} / {screens.length}
          </span>
        </div>

      </div>
    </section>
  );
}
