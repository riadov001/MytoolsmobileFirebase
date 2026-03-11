"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const categories = [
  {
    id: "ai",
    label: "Intelligence Artificielle",
    icon: "🤖",
    color: "#DC2626",
    tagline: "L'IA au cœur de chaque décision",
    features: [
      {
        icon: "🧠",
        title: "Analyse IA",
        desc: "Prédiction CA, détection de tendances, alertes intelligentes — votre tableau de bord pense à votre place.",
        badge: "Bientôt",
      },
      {
        icon: "💬",
        title: "Chatbot IA",
        desc: "Réponses clients, prise de RDV, qualification automatique. 24h/24, sans intervention humaine.",
        badge: "Bientôt",
      },
      {
        icon: "🔍",
        title: "Scan OCR",
        desc: "Photographiez une carte grise ou une facture. L'IA lit, extrait et intègre tout en 3 secondes.",
        badge: "Bientôt",
      },
      {
        icon: "⚙️",
        title: "Configurateur IA",
        desc: "Devis générés automatiquement selon le profil client, l'historique et les tarifs du marché.",
        badge: "Bientôt",
      },
      {
        icon: "📈",
        title: "Analyse Commerciale",
        desc: "Réduisez vos coûts, augmentez votre CA. Des recommandations IA actionnables chaque semaine.",
        badge: "Bientôt",
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: "📡",
    color: "#3B82F6",
    tagline: "Connecté à vos clients, en tout instant",
    features: [
      {
        icon: "💬",
        title: "Chat interne",
        desc: "Messagerie instantanée entre collaborateurs. Devis, photos, notes — sans quitter l'app.",
        badge: "Bientôt",
      },
      {
        icon: "🗣️",
        title: "Chat client",
        desc: "Échangez directement avec vos clients. Photos du véhicule, mises à jour, validations en temps réel.",
        badge: "Bientôt",
      },
      {
        icon: "✉️",
        title: "Emails automatisés",
        desc: "Devis, confirmations, rappels et factures envoyés automatiquement avec votre logo.",
        badge: "Bientôt",
      },
      {
        icon: "📱",
        title: "SMS automatiques",
        desc: "Confirmation, rappel RDV, suivi intervention. Vos clients informés à chaque étape.",
        badge: "Bientôt",
      },
      {
        icon: "⏰",
        title: "Rappels intelligents",
        desc: "Relances automatiques : devis non signés, factures impayées, RDV à confirmer.",
        badge: "Bientôt",
      },
    ],
  },
  {
    id: "planning",
    label: "Planning & Opérations",
    icon: "📅",
    color: "#8B5CF6",
    tagline: "Pilotez votre atelier comme un pro",
    features: [
      {
        icon: "🗓️",
        title: "Agenda interactif",
        desc: "Drag & drop, vue jour/semaine/mois. Techniciens assignés, postes de travail, durées estimées.",
        badge: "Bientôt",
      },
      {
        icon: "🔄",
        title: "Réservations intelligentes",
        desc: "L'IA optimise vos créneaux selon la charge atelier et les compétences disponibles.",
        badge: "Bientôt",
      },
      {
        icon: "📊",
        title: "Rapport quotidien",
        desc: "Chaque matin : RDV du jour, CA prévisionnel, alertes prioritaires. 100% configurable.",
        badge: "Bientôt",
      },
      {
        icon: "🔴",
        title: "Suivi temps réel",
        desc: "Live : statut de chaque intervention, technicien actif, temps restant estimé.",
        badge: "Bientôt",
      },
    ],
  },
  {
    id: "documents",
    label: "Documents & Finance",
    icon: "📋",
    color: "#10B981",
    tagline: "La gestion financière sans friction",
    features: [
      {
        icon: "📄",
        title: "Modèles de documents",
        desc: "Devis, factures, CGV, bons de travaux — vos modèles à votre image, en un clic.",
        badge: "Bientôt",
      },
      {
        icon: "🧾",
        title: "Factures électroniques",
        desc: "Conformité 2026. Format Factur-X, envoi direct au Portail Public de Facturation.",
        badge: "Bientôt",
      },
      {
        icon: "📒",
        title: "Expert Comptabilité",
        desc: "Journal, FEC, bilan simplifié. Votre expert-comptable récupère tout en un clic.",
        badge: "Bientôt",
      },
    ],
  },
  {
    id: "openbanking",
    label: "OpenBanking & Finance IA",
    icon: "🏦",
    color: "#06B6D4",
    tagline: "Propulsé par MyTools Budget Tracker — PWA disponible dès maintenant",
    features: [
      {
        icon: "⚡",
        title: "MyTools Budget Tracker",
        desc: "Notre module comptabilité. PWA déjà disponible — App Store & Google Play bientôt.",
        badge: "PWA Live",
      },
      {
        icon: "🏦",
        title: "OpenBanking",
        desc: "Comptes bancaires pros connectés en direct. Flux synchronisés, zéro ressaisie.",
        badge: "Bientôt",
      },
      {
        icon: "📸",
        title: "Scan IA — Relevés & Tickets",
        desc: "Photo d'un relevé ou ticket → l'IA lit, extrait et catégorise chaque ligne en secondes.",
        badge: "Bientôt",
      },
      {
        icon: "🗂️",
        title: "Catégorisation automatique",
        desc: "Carburant, pièces, sous-traitance, charges — votre comptabilité se constitue seule.",
        badge: "Bientôt",
      },
      {
        icon: "🔗",
        title: "Intégration MyTools Admin",
        desc: "Budget Tracker ↔ MyTools Admin. Devis et factures alimentent le dossier comptable.",
        badge: "Bientôt",
      },
      {
        icon: "🧮",
        title: "TVA & Dossier comptable",
        desc: "Déclarations TVA préremplies, journal, bilan — prêt pour votre expert-comptable.",
        badge: "Bientôt",
      },
    ],
  },
  {
    id: "immersive",
    label: "Expérience Immersive",
    icon: "🥽",
    color: "#F59E0B",
    tagline: "Le futur de l'automobile, dès aujourd'hui",
    features: [
      {
        icon: "🎮",
        title: "Simulateur 3D",
        desc: "Visualisez les réparations en 3D avant intervention. Montrez exactement ce qui sera fait.",
        badge: "Vision",
      },
      {
        icon: "🥽",
        title: "Réalité Virtuelle",
        desc: "Visite immersive de votre garage, configurateur VR — directement depuis l'app.",
        badge: "Vision",
      },
      {
        icon: "🖼️",
        title: "Galerie Médias",
        desc: "Photos avant/après de chaque véhicule. Partagez en un tap avec vos clients.",
        badge: "Bientôt",
      },
    ],
  },
];

const badgeStyle: Record<string, string> = {
  "Bientôt": "border-[#DC2626]/40 text-[#DC2626]",
  "Vision": "border-[#F59E0B]/40 text-[#F59E0B]",
  "PWA Live": "border-green-500/40 text-green-400 bg-green-500/5",
};

export default function Roadmap() {
  const [activecat, setActivecat] = useState(0);
  const cat = categories[activecat];

  return (
    <section id="roadmap" className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Dynamic background glow per category */}
      <motion.div
        key={activecat}
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: `radial-gradient(ellipse 1000px 500px at 30% 60%, ${cat.color}08 0%, transparent 65%)`,
        }}
      />

      {/* Horizontal speed line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DC2626]/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="h-px w-12 bg-[#DC2626]" />
            <span className="font-michroma text-[#DC2626] text-xs tracking-[0.3em] uppercase">Roadmap & Vision</span>
            <div className="h-px w-12 bg-[#DC2626]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-michroma text-3xl md:text-5xl text-white tracking-widest uppercase mb-4 leading-tight"
          >
            La plateforme du<br />
            <span className="text-[#DC2626]">futur automobile</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-michroma text-[#666] text-xs md:text-sm tracking-widest leading-relaxed max-w-2xl mx-auto"
          >
            MyTools Group ne s'arrête pas à la gestion du quotidien.<br />
            Chaque trimestre, de nouvelles fonctionnalités repoussent les limites de ce qu'un garage peut accomplir.
          </motion.p>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => setActivecat(i)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-michroma text-[9px] tracking-widest uppercase"
              style={{
                borderColor: i === activecat ? c.color : "#2A2A2A",
                background: i === activecat ? `${c.color}15` : "#161616",
                color: i === activecat ? "#fff" : "#666",
                boxShadow: i === activecat ? `0 0 20px ${c.color}20` : "none",
              }}
            >
              <span className="text-sm">{c.icon}</span>
              <span className="hidden sm:inline">{c.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Category tagline */}
        <motion.div
          key={`tag-${activecat}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 justify-center mb-10"
        >
          <div className="h-px w-8" style={{ background: cat.color }} />
          <span className="font-michroma text-xs tracking-widest uppercase" style={{ color: cat.color }}>
            {cat.tagline}
          </span>
          <div className="h-px w-8" style={{ background: cat.color }} />
        </motion.div>

        {/* Features grid */}
        <motion.div
          key={`grid-${activecat}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {cat.features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="group relative bg-[#161616] border border-[#2A2A2A] rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:border-opacity-50"
              style={{ ["--hover-color" as string]: cat.color }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at top left, ${cat.color}08 0%, transparent 60%)` }}
              />
              {/* Bottom line */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(to right, ${cat.color}60, transparent)` }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border"
                    style={{ background: `${cat.color}12`, borderColor: `${cat.color}25` }}
                  >
                    {f.icon}
                  </div>
                  <span
                    className={`font-michroma text-[8px] tracking-widest uppercase px-2 py-1 rounded border ${badgeStyle[f.badge]}`}
                  >
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-michroma text-white text-xs tracking-widest uppercase mb-2">{f.title}</h3>
                <p className="font-michroma text-[#666] text-[10px] tracking-wide leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature count banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 relative bg-gradient-to-r from-[#161616] via-[#1A1A1A] to-[#161616] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid opacity-20" />

          {/* Animated speed lines */}
          {[25, 50, 75].map((top, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#DC2626]/20 to-transparent"
              style={{ top: `${top}%`, width: "100%" }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 5 + i * 1.5, delay: i * 0.8, ease: "linear" }}
            />
          ))}

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-michroma text-white text-lg md:text-xl tracking-widest uppercase mb-1">
                26+ fonctionnalités en développement
              </div>
              <div className="font-michroma text-[#666] text-[10px] tracking-widest">
                IA · OpenBanking · Communication · Finance · Immersif · Planning
              </div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
              {[
                { n: "5", label: "Modules IA" },
                { n: "6", label: "OpenBanking" },
                { n: "5", label: "Com." },
                { n: "4", label: "Planning" },
                { n: "3", label: "Finance" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-michroma text-[#DC2626] text-2xl">{s.n}</div>
                  <div className="font-michroma text-[#444] text-[8px] tracking-widest uppercase">{s.label}</div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="group relative flex-shrink-0 inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-michroma text-[10px] tracking-widest uppercase px-6 py-3 rounded-lg transition-all overflow-hidden"
            >
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              Accès anticipé →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
