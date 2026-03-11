"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Numbers from "@/components/Numbers";
import Screenshots from "@/components/Screenshots";
import Capabilities from "@/components/Capabilities";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import Access from "@/components/Access";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Numbers />
      <Screenshots />
      <Capabilities />
      <RoadmapTimeline />
      <Access />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
