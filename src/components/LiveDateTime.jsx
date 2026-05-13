// /src/components/LiveDateTime.jsx
"use client";
import { useEffect, useState } from "react";

export default function LiveDateTime({ className = "" }) {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update(); // set immediately
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{dateTime}</span>;
}
