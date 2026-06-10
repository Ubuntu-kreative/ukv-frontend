// /src/components/LiveClock.jsx
"use client";
import { useEffect, useState } from "react";

export default function LiveClock({ className = "" }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update(); // set immediately
    const interval = setInterval(update, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{time}</span>;
}
