"use client";

import { useEffect, useState } from "react";
import useEffects from "@/hooks/useEffects";
import Cursor from "@/components/Cursor";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffects();
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    // ✅ Always reset scroll to top on mount
    window.scrollTo(0, 0);

    // 1. Sync Theme to Kenya Time (GMT+3)
    const updateEnvironment = () => {
      const now = new Date();
      const kenyaTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      const hour = kenyaTime.getUTCHours();

      const root = document.documentElement;
      if (hour >= 17 && hour <= 19) {
        // Sunset: Transition Gold to Warm Amber
        root.style.setProperty("--gold", "#E69342");
        root.style.setProperty("--neon", "#00FF65");
      } else if (hour >= 20 || hour <= 5) {
        // Night: Deeper Obsidian and Dimmer Neon
        root.style.setProperty("--obsidian", "#050505");
        root.style.setProperty("--neon", "#00C832");
      } else {
        // Day: Standard Brand Colors
        root.style.setProperty("--gold", "#D4A853");
        root.style.setProperty("--neon", "#00FF41");
      }
    };

    // 2. Fetch Live Farm Temperature
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=-0.1022&longitude=39.2764&current_weather=true`
        );
        const data = await res.json();
        const currentTemp = Math.round(data.current_weather.temperature);
        setTemp(currentTemp);
        // Store temp in a global window variable for the Nav to access without re-fetching
        (window as any).__FARM_TEMP = currentTemp;
      } catch (e) {
        console.error("Weather sync failed", e);
      }
    };

    updateEnvironment();
    fetchWeather();
    const interval = setInterval(updateEnvironment, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Cursor />
      {children}
    </>
  );
}
