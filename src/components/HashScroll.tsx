"use client";

import { useEffect } from "react";

export default function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const el = document.getElementById(hash);
      if (el) {
        window.clearInterval(timer);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts >= 25) {
        window.clearInterval(timer);
      }
    }, 150);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
