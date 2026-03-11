"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quoteItems = [
  { title: "Vidange + révision", sub: "Martin Dupont", badge: "Approuvé", badgeClass: "bg-green-500/20 text-green-400" },
  { title: "Remplacement freins", sub: "Sophie Leroy", badge: "En attente", badgeClass: "bg-yellow-500/20 text-yellow-400" },
  { title: "Diagnostic moteur", sub: "Pierre Bernard", badge: "Terminé", badgeClass: "bg-blue-500/20 text-blue-400" },
];

const invoiceItems = [
  { title: "FAC-2024-087", sub: "1 240 €", badge: "Payée", badgeClass: "bg-green-500/20 text-green-400" },
  { title: "FAC-2024-088", sub: "890 €", badge: "En attente", badgeClass: "bg-yellow-500/20 text-yellow-400" },
  { title: "FAC-2024-085", sub: "2 100 €", badge: "En retard", badgeClass: "bg-red-500/20 text-red-400" },
];

const clientItems = [
  { title: "Martin Dupont", sub: "martin@email.fr", badge: "Pro", badgeClass: "bg-blue-500/20 text-blue-400" },
  { title: "Sophie Leroy", sub: "s.leroy@gmail.com", badge: "Client", badgeClass: "bg-dark-border text-text-tertiary" },
  { title: "Garage Renault", sub: "contact@renault.eu", badge: "Pro", badgeClass: "bg-blue-500/20 text-blue-400" },
];

const screens = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Pilotez votre activité en temps réel",
    description:
      "Vue d'ensemble instantanée : CA du mois, revenus en attente, nombre de clients et rendez-vous, graphique des 6 derniers mois.",
    preview: <DashboardPreview />,
  },
  {
    id: "quotes",
    label: "Devis",
    title: "Créez et gérez vos devis en 30 secondes",
    description:
      "Liste complète avec statuts colorés, création rapide avec photo, changement de statut en un tap.",
    preview: <ListPreview icon="📄" title="Devis" items={quoteItems} />,
  },
  {
    id: "invoices",
    label: "Factures",
    title: "Suivez chaque facture jusqu'au paiement",
    description:
      "Tracking complet payé/en attente/en retard/annulé. Plus jamais une facture oubliée.",
    preview: <ListPreview icon="🧾" title="Factures" items={invoiceItems} />,
  },
  {
    id: "clients",
    label: "Clients",
    title: "Votre base clients toujours à portée de main",
    description:
      "Recherchez, créez et modifiez des fiches clients directement depuis votre téléphone.",
    preview: <ListPreview icon="👥" title="Clients" items={clientItems} />,
  },
];

export default function Screenshots() {
  const [active, setActive] = useState(0);

  return (
    <section id="screenshots" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-red font-michroma text-xs tracking-widest uppercase mb-4">
            Aperçu
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            L'interface que vos équipes vont adorer
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Conçue pour être utilisée d'une main, sous n'importe quelle luminosité.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {screens.map((screen, i) => (
            <button
              key={screen.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                i === active
                  ? "bg-brand-red text-white"
                  : "bg-dark-surface border border-dark-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 max-w-md"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              {screens[active].title}
            </h3>
            <p className="text-text-secondary leading-relaxed text-lg mb-8">
              {screens[active].description}
            </p>

            <div className="flex flex-wrap gap-3">
              {["Temps réel", "iOS & Android", "Synchronisé"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-dark-surface border border-dark-border text-text-secondary text-xs px-3 py-1.5 rounded-full"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-red" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-red/10 blur-3xl rounded-full scale-75" />
              <div className="relative w-64 h-[520px] bg-dark-surface border border-dark-border rounded-[44px] overflow-hidden shadow-2xl shadow-black/60">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-dark-base rounded-b-2xl z-10" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {screens[active].preview}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="p-4 pt-10 h-full flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center">
          <span className="font-michroma text-white text-xs">MT</span>
        </div>
        <div>
          <div className="text-text-tertiary text-xs">Bonjour,</div>
          <div className="text-text-primary font-bold text-xs">Admin</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { l: "CA Mois", v: "12 840 €", c: "text-green-400" },
          { l: "En attente", v: "3 200 €", c: "text-red-400" },
          { l: "Clients", v: "247", c: "text-text-primary" },
          { l: "RDV", v: "18", c: "text-text-primary" },
        ].map((k) => (
          <div key={k.l} className="bg-dark-elevated rounded-xl p-2.5 border border-dark-border">
            <div className="text-text-tertiary text-xs">{k.l}</div>
            <div className={`font-bold text-sm mt-0.5 ${k.c}`}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-dark-elevated rounded-xl p-3 border border-dark-border flex-1">
        <div className="text-text-tertiary text-xs mb-2">6 derniers mois</div>
        <div className="flex items-end gap-1 h-16">
          {[40, 65, 50, 80, 70, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${h}%`,
                background: i === 5
                  ? "linear-gradient(180deg, #DC2626 0%, rgba(220,38,38,0.3) 100%)"
                  : "rgba(220,38,38,0.25)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-around pt-1 pb-2 border-t border-dark-border">
        {["📊", "📄", "🧾", "📅", "👥"].map((icon, i) => (
          <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${i === 0 ? "bg-brand-red" : ""}`}>
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}

function ListPreview({ icon, title, items }: { icon: string; title: string; items: any[] }) {
  return (
    <div className="p-4 pt-10 h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-text-primary font-bold text-sm">{title}</span>
        <div className="w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center">
          <span className="text-white text-sm">+</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="bg-dark-elevated rounded-xl p-3 border border-dark-border flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-red/10 rounded-lg flex items-center justify-center text-sm">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-text-primary text-xs font-semibold truncate">{item.title}</div>
              <div className="text-text-tertiary text-xs">{item.sub}</div>
            </div>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
              {item.badge}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around pt-1 pb-2 border-t border-dark-border">
        {["📊", "📄", "🧾", "📅", "👥"].map((ic, i) => (
          <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${ic === icon ? "bg-brand-red" : ""}`}>
            {ic}
          </div>
        ))}
      </div>
    </div>
  );
}
