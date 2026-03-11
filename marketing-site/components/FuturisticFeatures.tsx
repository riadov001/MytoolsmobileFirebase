"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const modules = [
  {
    id: "analytics",
    label: "Analytics",
    color: "#DC2626",
    icon: "📊",
    title: "Intelligence en temps réel",
    pitch: "Votre tableau de bord s'actualise en permanence. CA encaissé, CA en attente, tendances mensuelles — chaque décision s'appuie sur de vraies données.",
    endpoints: [
      { method: "GET", path: "/analytics", desc: "Indicateurs clés du garage" },
      { method: "GET", path: "/advanced-analytics", desc: "Analyse avancée & tendances" },
    ],
    metrics: ["CA mensuel", "CA en attente", "Taux de conversion", "Évolution 6 mois"],
  },
  {
    id: "quotes",
    label: "Devis",
    color: "#3B82F6",
    icon: "📄",
    title: "Devis instantanés",
    pitch: "Créez, modifiez, acceptez ou refusez un devis en quelques secondes. Export PDF automatique, envoi client direct depuis votre mobile.",
    endpoints: [
      { method: "GET", path: "/quotes", desc: "Liste de tous les devis" },
      { method: "GET", path: "/quotes/:id", desc: "Détail d'un devis" },
      { method: "POST", path: "/quotes", desc: "Créer un devis" },
      { method: "PATCH", path: "/quotes/:id", desc: "Modifier un devis" },
      { method: "DELETE", path: "/quotes/:id", desc: "Supprimer un devis" },
      { method: "POST", path: "/quotes/:id/accept", desc: "Accepter un devis" },
      { method: "POST", path: "/quotes/:id/reject", desc: "Refuser un devis" },
    ],
    metrics: ["Création < 30s", "Export PDF", "Statuts en temps réel", "Historique complet"],
  },
  {
    id: "invoices",
    label: "Factures",
    color: "#10B981",
    icon: "🧾",
    title: "Facturation automatisée",
    pitch: "Transformez un devis en facture en un tap. Suivez vos encaissements, téléchargez les PDFs et gérez votre trésorerie depuis votre poche.",
    endpoints: [
      { method: "GET", path: "/invoices", desc: "Toutes les factures" },
      { method: "GET", path: "/invoices/:id", desc: "Détail facture" },
      { method: "POST", path: "/invoices", desc: "Créer une facture" },
      { method: "PATCH", path: "/invoices/:id", desc: "Modifier une facture" },
      { method: "DELETE", path: "/invoices/:id", desc: "Archiver une facture" },
      { method: "GET", path: "/proxy/invoice-pdf/:token", desc: "Télécharger le PDF" },
    ],
    metrics: ["PDF sécurisé", "Statut paiement", "Numérotation auto", "Export comptable"],
  },
  {
    id: "reservations",
    label: "Planning",
    color: "#8B5CF6",
    icon: "📅",
    title: "Planning atelier intelligent",
    pitch: "Visualisez et gérez votre planning en temps réel. Confirmez, annulez ou reprogrammez un rendez-vous en un geste, sans paperasse.",
    endpoints: [
      { method: "GET", path: "/reservations", desc: "Calendrier complet" },
      { method: "GET", path: "/reservations/:id", desc: "Détail du rendez-vous" },
      { method: "POST", path: "/reservations", desc: "Créer un RDV" },
      { method: "PUT", path: "/reservations/:id", desc: "Modifier un RDV" },
      { method: "DELETE", path: "/reservations/:id", desc: "Supprimer un RDV" },
      { method: "POST", path: "/reservations/:id/confirm", desc: "Confirmer un RDV" },
      { method: "POST", path: "/reservations/:id/cancel", desc: "Annuler un RDV" },
    ],
    metrics: ["Vue journalière", "Vue semaine", "Confirmation client", "Anti double-booking"],
  },
  {
    id: "clients",
    label: "Clients",
    color: "#F59E0B",
    icon: "👥",
    title: "CRM automobile 360°",
    pitch: "Fiche client complète avec historique devis, factures, et véhicules. Retrouvez n'importe quel client en un instant et anticipez ses besoins.",
    endpoints: [
      { method: "GET", path: "/users", desc: "Base clients complète" },
      { method: "GET", path: "/users/:id", desc: "Profil client 360°" },
      { method: "POST", path: "/users", desc: "Créer un client" },
      { method: "PATCH", path: "/users/:id", desc: "Mettre à jour" },
      { method: "DELETE", path: "/users/:id", desc: "Archiver un client" },
    ],
    metrics: ["Historique complet", "Véhicules liés", "Notes & alertes", "Recherche instantanée"],
  },
  {
    id: "services",
    label: "Services",
    color: "#EC4899",
    icon: "🔧",
    title: "Catalogue de prestations",
    pitch: "Gérez votre catalogue de services et tarifs. Ajoutez, modifiez ou désactivez une prestation en temps réel depuis votre téléphone.",
    endpoints: [
      { method: "GET", path: "/services", desc: "Catalogue des prestations" },
      { method: "GET", path: "/services/:id", desc: "Détail d'une prestation" },
      { method: "POST", path: "/services", desc: "Ajouter une prestation" },
      { method: "PATCH", path: "/services/:id", desc: "Modifier le tarif" },
      { method: "DELETE", path: "/services/:id", desc: "Désactiver une prestation" },
    ],
    metrics: ["Tarifs en temps réel", "Catégories", "TVA automatique", "Historique prix"],
  },
  {
    id: "notifications",
    label: "Notifications",
    color: "#06B6D4",
    icon: "🔔",
    title: "Alertes push intelligentes",
    pitch: "Ne ratez plus rien. Nouvelles réservations, devis acceptés, factures réglées — chaque événement déclenche une alerte instantanée sur votre téléphone.",
    endpoints: [
      { method: "GET", path: "/notifications", desc: "Centre de notifications" },
      { method: "GET", path: "/notifications/unread-count", desc: "Compteur non-lus" },
      { method: "POST", path: "/notifications/:id/read", desc: "Marquer comme lu" },
      { method: "POST", path: "/notifications/read-all", desc: "Tout marquer comme lu" },
    ],
    metrics: ["Push iOS & Android", "Temps réel", "Tri par priorité", "Badge dynamique"],
  },
  {
    id: "settings",
    label: "Paramètres",
    color: "#64748B",
    icon: "⚙️",
    title: "Configuration du garage",
    pitch: "Personnalisez votre espace : informations du garage, logo, horaires, équipe. Tout est synchronisé instantanément avec la PWA et l'app mobile.",
    endpoints: [
      { method: "GET", path: "/settings", desc: "Paramètres du garage" },
      { method: "PATCH", path: "/settings", desc: "Mettre à jour les infos" },
    ],
    metrics: ["Profil garage", "Gestion équipe", "Horaires d'ouverture", "Sync instantanée"],
  },
];

const methodColors: Record<string, string> = {
  GET: "#10B981",
  POST: "#3B82F6",
  PATCH: "#F59E0B",
  PUT: "#8B5CF6",
  DELETE: "#EF4444",
};

export default function FuturisticFeatures() {
  const [active, setActive] = useState(0);
  const mod = modules[active];

  return (
    <section id="architecture" className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 1200px 600px at 70% 50%, ${mod.color}07 0%, transparent 70%)`,
        }}
      />

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
            <span className="font-michroma text-[#DC2626] text-xs tracking-[0.3em] uppercase">Architecture</span>
            <div className="h-px w-12 bg-[#DC2626]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-michroma text-3xl md:text-5xl text-white tracking-widest uppercase mb-4 leading-tight"
          >
            Une plateforme<br />
            <span className="text-[#DC2626]">de niveau industriel</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-michroma text-[#666] text-xs md:text-sm tracking-widest leading-relaxed max-w-xl mx-auto"
          >
            8 modules connectés. Des dizaines d'endpoints. Une API robuste derrière chaque fonctionnalité.<br />
            Pensée pour les pros, construite pour durer.
          </motion.p>
        </div>

        {/* Module tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 font-michroma text-[9px] tracking-widest uppercase"
              style={{
                borderColor: i === active ? m.color : "#2A2A2A",
                background: i === active ? `${m.color}12` : "transparent",
                color: i === active ? "#fff" : "#666",
              }}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
        >
          {/* Left — Info card */}
          <div
            className="bg-[#161616] rounded-2xl p-6 md:p-8 border flex flex-col gap-6"
            style={{ borderColor: `${mod.color}30` }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border"
                style={{ background: `${mod.color}12`, borderColor: `${mod.color}25` }}
              >
                {mod.icon}
              </div>
              <div>
                <div
                  className="font-michroma text-[9px] tracking-[0.3em] uppercase mb-1"
                  style={{ color: mod.color }}
                >
                  Module — {mod.label}
                </div>
                <h3 className="font-michroma text-white text-sm md:text-base tracking-widest uppercase">{mod.title}</h3>
              </div>
            </div>

            <p className="font-michroma text-[#A8A8A8] text-xs tracking-wide leading-relaxed">{mod.pitch}</p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2">
              {mod.metrics.map((m) => (
                <div
                  key={m}
                  className="flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2"
                >
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: mod.color }} />
                  <span className="font-michroma text-[#A8A8A8] text-[9px] tracking-widest uppercase">{m}</span>
                </div>
              ))}
            </div>

            {/* Endpoint count */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#2A2A2A]">
              <span className="font-michroma text-[#444] text-[9px] tracking-widest uppercase">Endpoints disponibles</span>
              <span
                className="font-michroma text-sm font-bold"
                style={{ color: mod.color }}
              >
                {mod.endpoints.length}
              </span>
            </div>
          </div>

          {/* Right — API Terminal */}
          <div className="bg-[#0D0D0D] rounded-2xl border border-[#2A2A2A] overflow-hidden flex flex-col">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2A2A2A] bg-[#161616]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex-1 text-center">
                <span className="font-michroma text-[#444] text-[9px] tracking-widest uppercase">
                  API — /mobile/admin{mod.endpoints[0]?.path.replace(/:id/, ":id")}
                </span>
              </div>
            </div>

            {/* Endpoint list */}
            <div className="flex-1 p-4 flex flex-col gap-1 overflow-auto">
              <div className="font-michroma text-[#444] text-[9px] tracking-widest uppercase mb-3">
                # Routes disponibles
              </div>
              {mod.endpoints.map((ep, i) => (
                <motion.div
                  key={ep.path + ep.method}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 py-2 border-b border-[#1A1A1A] group hover:bg-[#161616] rounded px-2 transition-colors"
                >
                  <span
                    className="font-michroma text-[9px] tracking-widest uppercase flex-shrink-0 w-12 text-right"
                    style={{ color: methodColors[ep.method] ?? "#fff" }}
                  >
                    {ep.method}
                  </span>
                  <span className="font-michroma text-[#666] text-[9px] tracking-widest flex-1 break-all">
                    <span className="text-[#3A3A3A]">/mobile/admin</span>
                    <span className="text-[#A8A8A8]">{ep.path}</span>
                  </span>
                  <span className="font-michroma text-[#444] text-[9px] tracking-wide hidden sm:block flex-shrink-0 text-right max-w-[120px]">
                    {ep.desc}
                  </span>
                </motion.div>
              ))}

              {/* Fake status line */}
              <div className="mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-michroma text-green-500 text-[9px] tracking-widest uppercase">
                  Connecté — sync live
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "8", label: "Modules" },
            { value: "40+", label: "Endpoints API" },
            { value: "REST", label: "Architecture" },
            { value: "100%", label: "Temps réel" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-4 text-center"
            >
              <div className="font-michroma text-[#DC2626] text-2xl md:text-3xl mb-1">{s.value}</div>
              <div className="font-michroma text-[#666] text-[9px] tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
