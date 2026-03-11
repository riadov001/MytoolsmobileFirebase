"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const items = [
  {
    n:    "01",
    id:   "devis",
    name: "DEVIS",
    en:   "Quotes",
    line: "Créez un devis en 30 secondes. Joignez des photos du véhicule. Suivez chaque statut en temps réel.",
    detail: [
      "Création avec immatriculation, marque, modèle",
      "Photos véhicule directement depuis l'app",
      "Statuts : En attente · Approuvé · Refusé · Terminé",
      "Notes internes visibles uniquement par l'admin",
    ],
  },
  {
    n:    "02",
    id:   "factures",
    name: "FACTURES",
    en:   "Invoices",
    line: "Suivi complet du cycle de paiement. Payée, en attente, en retard, annulée — plus aucun oubli possible.",
    detail: [
      "4 statuts : Payée · En attente · En retard · Annulée",
      "Total TTC calculé automatiquement",
      "Historique complet par client",
      "Alertes sur factures impayées",
    ],
  },
  {
    n:    "03",
    id:   "clients",
    name: "CLIENTS",
    en:   "Clients",
    line: "Votre base clients toujours à portée de main. Recherche instantanée, fiches complètes, édition sur le terrain.",
    detail: [
      "Fiche client : nom, email, téléphone, adresse",
      "Historique devis & factures par client",
      "Recherche par nom ou email en temps réel",
      "Création et mise à jour en mobilité",
    ],
  },
  {
    n:    "04",
    id:   "rdv",
    name: "RENDEZ-VOUS",
    en:   "Reservations",
    line: "Vue agenda ou liste. Confirmez, terminez, annulez — chaque rendez-vous maîtrisé depuis votre téléphone.",
    detail: [
      "Calendrier mensuel avec indicateurs de RDV",
      "Liste chronologique avec statuts colorés",
      "Statuts : Confirmé · Terminé · Annulé · En attente",
      "Création et modification à la volée",
    ],
  },
  {
    n:    "05",
    id:   "services",
    name: "SERVICES",
    en:   "Services",
    line: "Votre catalogue de prestations. Prix, durée, description. Toujours à jour, toujours synchronisé.",
    detail: [
      "Nom, description, prix HT/TTC, durée",
      "Recherche dans le catalogue en temps réel",
      "Ajout rapide lors de la création d'un devis",
      "Synchronisation API instantanée",
    ],
  },
];

export default function Capabilities() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="features" className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end gap-6 md:gap-20"
        >
          <div className="shrink-0">
            <p className="font-michroma text-[#DC2626] text-[9px] tracking-widest uppercase mb-3">Modules</p>
            <h2 className="font-michroma text-3xl md:text-5xl lg:text-6xl text-white tracking-widest uppercase leading-none">
              Cinq<br />modules.<br />
              <span className="text-[#333]">Un seul outil.</span>
            </h2>
          </div>
          <p className="font-michroma text-[#555] text-xs md:text-sm tracking-wide leading-relaxed max-w-sm">
            Chaque module est relié à l'API MyTools Group en temps réel. Aucune synchronisation manuelle. Aucune donnée locale.
          </p>
        </motion.div>

        {/* Spec list */}
        <div className="border-t border-[#1A1A1A]">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-[#1A1A1A]"
            >
              <button
                onClick={() => setOpen(open === item.id ? null : item.id)}
                className="w-full flex items-start md:items-center gap-6 md:gap-12 py-6 md:py-8 text-left group"
              >
                <span className="font-michroma text-[#2A2A2A] text-xs tracking-widest shrink-0 pt-0.5 md:pt-0 group-hover:text-[#DC2626] transition-colors duration-300">
                  {item.n}
                </span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
                  <span className="font-michroma text-white text-lg md:text-2xl tracking-widest group-hover:text-[#DC2626] transition-colors duration-300 shrink-0">
                    {item.name}
                  </span>
                  <span className="font-michroma text-[#444] text-[10px] md:text-xs tracking-wide leading-relaxed">
                    {item.line}
                  </span>
                </div>
                <span className={`font-michroma text-[#444] text-[10px] tracking-widest shrink-0 transition-transform duration-300 ${open === item.id ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>

              {/* Expanded detail */}
              <motion.div
                initial={false}
                animate={open === item.id ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pl-[3.25rem] md:pl-[6.5rem] pb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.detail.map((d) => (
                    <div key={d} className="flex items-start gap-3">
                      <div className="w-px h-4 bg-[#DC2626] shrink-0 mt-0.5" />
                      <span className="font-michroma text-[#666] text-[10px] tracking-widest leading-relaxed">{d}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
