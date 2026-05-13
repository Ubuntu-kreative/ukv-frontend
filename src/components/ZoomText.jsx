// /src/components/ZoomText.jsx
"use client";
import React, { useEffect, useRef } from "react";

export default function ZoomText({ text, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && !ref.current.dataset.split) {
      const chars = text.split("");
      ref.current.innerHTML = "";
      chars.forEach(letter => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = letter;
        ref.current.appendChild(span);
      });
      ref.current.dataset.split = "true";
    }
  }, [text]);

  return <span ref={ref} className={`zoom-text ${className}`}></span>;
}
