"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#2A2A2A] bg-[#0A0A0A]">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="MyTools" fill className="object-contain" />
              </div>
              <span className="font-michroma text-white text-sm tracking-[0.2em] uppercase">MYTOOLS ADMIN</span>
            </div>
            <p className="font-michroma text-[#666] text-[10px] tracking-widest leading-relaxed">
              L'application de gestion de garage réservée aux administrateurs des garages partenaires MyTools Group.
            </p>
            <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="font-michroma text-green-400 text-[9px] tracking-widest uppercase">PWA en ligne — saas.mytoolsgroup.eu</span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-michroma text-white text-[10px] tracking-[0.3em] uppercase mb-4">Produit</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { href: "/#screenshots", label: "L'interface" },
                  { href: "/#features", label: "Modules" },
                  { href: "/#access", label: "Demander l'accès" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="font-michroma text-[#666] hover:text-white text-[10px] tracking-widest uppercase transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-michroma text-white text-[10px] tracking-[0.3em] uppercase mb-4">Application</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { href: "https://saas.mytoolsgroup.eu", label: "Accès PWA", ext: true },
                  { href: "#", label: "App Store (bientôt)" },
                  { href: "#", label: "Google Play (bientôt)" },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.ext ? "_blank" : undefined}
                      rel={l.ext ? "noopener noreferrer" : undefined}
                      className="font-michroma text-[#666] hover:text-white text-[10px] tracking-widest uppercase transition-colors"
                    >
                      {l.label} {l.ext && "↗"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-michroma text-white text-[10px] tracking-[0.3em] uppercase mb-4">Légal</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { href: "/privacy", label: "Confidentialité" },
                  { href: "/support", label: "Support" },
                  { href: "mailto:contact@mytoolsgroup.eu", label: "Contact" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="font-michroma text-[#666] hover:text-white text-[10px] tracking-widest uppercase transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2A2A2A] px-4 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-michroma text-[#444] text-[9px] tracking-widest uppercase">
            © {year} MyTools Group. Tous droits réservés.
          </span>
          <div className="flex items-center gap-4">
            <span className="font-michroma text-[#444] text-[9px] tracking-widest uppercase">Application réservée aux garages partenaires</span>
            <div className="h-3 w-px bg-[#2A2A2A]" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-michroma text-green-500 text-[9px] tracking-widest uppercase">PWA Live</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
