"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed hero: 4K video background, dark gradient for legibility,
 * and an oversized wordmark treated as the main graphic element rather
 * than a headline sitting on top of an image.
 *
 * The background plays as a chained sequence of clips rather than
 * looping a single one — each clip plays once, then the next one
 * starts, looping back to the first after the last. To add, remove,
 * or reorder footage, just edit this array; drop new files in
 * /public/videos/.
 */
const VIDEO_CLIPS = ["/videos/hero.mp4", "/videos/hero-workshop.mp4"];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clipIndex, setClipIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect prefers-reduced-motion: pause on the first clip and let
    // the static gradient stand in, rather than autoplaying a chain
    // of motion for people who've asked for less of it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    // Advance to the next clip when the current one finishes, wrapping
    // back to the start — this is what turns two separate files into
    // one continuous background loop.
    const handleEnded = () => {
      setClipIndex((i) => (i + 1) % VIDEO_CLIPS.length);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  // Whenever the active clip changes, load and play it — swapping
  // `src` on an existing <video> and calling play() is how you chain
  // clips, since a single <video> can only play one file at a time.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = VIDEO_CLIPS[clipIndex];
    video.play().catch(() => {
      // Autoplay can be blocked before any user interaction — harmless
      // here since the poster color still gives a reasonable fallback.
    });
  }, [clipIndex]);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 -mt-14 h-[92vh] min-h-[560px] overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        // A dark placeholder color shows immediately while the video
        // loads, so there's no flash of white behind light text.
        style={{ backgroundColor: "#141414" }}
      />

      {/* Legibility gradient — darker at the bottom, where the type sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

      {/* Type-as-graphic content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-16 sm:px-12 sm:pb-20">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#e0a06e] mb-5">
          Custom furniture & joinery
        </p>

        <h1
          className="font-[family-name:var(--font-display)] font-black uppercase leading-[0.85] tracking-tight bg-clip-text text-transparent select-none"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #ffffff 0%, #f5d9b8 30%, #e0a06e 65%, #d97a52 100%)",
          }}
        >
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
