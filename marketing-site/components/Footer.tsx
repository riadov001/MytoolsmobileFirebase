"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1A1A1A] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">

        {/* Logo + copyright */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="MyTools"
            width={24}
            height={24}
            className="shrink-0"
          />
          <span className="font-michroma text-[#333] text-[8px] tracking-widest uppercase">
            © {year} MyTools Group
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="font-michroma text-[#444] hover:text-[#888] text-[8px] tracking-widest uppercase transition-colors">
            Mentions légales
          </Link>
          <Link href="/support" className="font-michroma text-[#444] hover:text-[#888] text-[8px] tracking-widest uppercase transition-colors">
            Support
          </Link>
          <a
            href="https://saas.mytoolsgroup.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-michroma text-[#444] hover:text-green-400 text-[8px] tracking-widest uppercase transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            PWA Live
          </a>
        </div>

      </div>
    </footer>
  );
}
