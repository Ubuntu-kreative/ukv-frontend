"use client";
import TiltCard from "@/components/TiltCard";
import ZoomText from "@/components/ZoomText";
import NeonButton from "@/components/NeonButton";
import GoldButton from "@/components/GoldButton";
import ScrollReveal from "@/components/ScrollReveal";
import DashboardCard from "@/components/DashboardCard";
import LiveClock from "@/components/LiveClock";
import LiveDateTime from "@/components/LiveDateTime";

export default function DemoShowcase() {
  return (
    <main className="p-10 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-obsidian text-cream">
      
      {/* Hero Section */}
      <ScrollReveal direction="up">
        <h1 className="font-display neon-text text-4xl mb-6">
          Ubuntu Kreative Village
        </h1>
      </ScrollReveal>

      {/* Live Clock + Date */}
      <ScrollReveal direction="right">
        <div className="flex flex-col gap-2">
          <LiveClock className="gold-text text-2xl font-bold" />
          <LiveDateTime className="text-grow text-sm" />
        </div>
      </ScrollReveal>

      {/* Tilt Card Showcase */}
      <ScrollReveal direction="left">
        <TiltCard className="glass p-6">
          <ZoomText text="Innovation" className="text-2xl font-display" />
          <p className="mt-4 text-sm">
            Creativity meets technology — the Ubuntu way.
          </p>
        </TiltCard>
      </ScrollReveal>

      {/* Buttons Showcase */}
      <ScrollReveal direction="up">
        <div className="flex gap-6">
          <NeonButton>Explore</NeonButton>
          <GoldButton>Join Us</GoldButton>
        </div>
      </ScrollReveal>

      {/* Dashboard Cards */}
      <ScrollReveal direction="right">
        <DashboardCard title="Community Hub" />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <DashboardCard title="Creative Projects" />
      </ScrollReveal>
    </main>
  );
}
