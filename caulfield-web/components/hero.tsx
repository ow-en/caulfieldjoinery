"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed hero: 4K video background, dark gradient for legibility,
 * and an oversized wordmark treated as the main graphic element rather
 * than a headline sitting on top of an image.
 *
 * Footage lives at /public/videos/hero.mp4 — replace that file directly
 * to swap it again later (same filename, no code change needed).
 */
const VIDEO_SRC = "/videos/hero.mp4";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: pause the video and let the
    // static gradient + poster color stand in instead of autoplaying
    // motion for people who've asked for less of it.
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      videoRef.current?.pause();
    }
  }, []);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 -mt-14 h-[92vh] min-h-[560px] overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        // A dark placeholder color shows immediately while the video
        // loads, so there's no flash of white behind light text.
        style={{ backgroundColor: "#141414" }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Legibility gradient — darker at the bottom, where the type sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

      {/* Type-as-graphic content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-16 sm:px-12 sm:pb-20">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#e0a06e] mb-5">
          Custom furniture & joinery
        </p>

        <h1 className="font-[family-name:var(--font-display)] font-black uppercase leading-[0.85] tracking-tight text-white select-none">
          <span className="block text-[clamp(3.5rem,13vw,11rem)]">Caulfield</span>
          <span className="block text-[clamp(3.5rem,13vw,11rem)]">Joinery</span>
        </h1>

        <div className="mt-8 flex items-center gap-6">
          <a
            href="#modules"
            className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-medium text-[#141414] transition-opacity hover:opacity-90"
          >
            See what we build
          </a>
          <span className="font-[family-name:var(--font-mono)] text-xs text-white/60">
            Built one piece at a time
          </span>
        </div>
      </div>
    </section>
  );
}
