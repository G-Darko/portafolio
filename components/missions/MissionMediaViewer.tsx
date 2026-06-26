"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MissionMediaViewerProps {
  images: string[];
  video?: string;
  title: string;
}

export default function MissionMediaViewer({
  images,
  video,
  title,
}: MissionMediaViewerProps) {
  const slides = video
    ? [{ type: "video" as const, src: video }, ...images.map((src) => ({ type: "image" as const, src }))]
    : images.map((src) => ({ type: "image" as const, src }));

  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex((next + count) % count);
    },
    [count]
  );

  if (count === 0) return null;

  const current = slides[index];

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-hud-border bg-card">
        {current.type === "video" ? (
          <iframe
            src={current.src}
            title={`${title} demo`}
            className="h-full w-full"
            allowFullScreen
          />
        ) : (
          <Image src={current.src} alt={title} fill className="object-cover" />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-hud-border/60 bg-hud-bg/80 text-hud-cyan backdrop-blur-sm transition-colors hover:bg-hud-cyan/10"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-hud-border/60 bg-hud-bg/80 text-hud-cyan backdrop-blur-sm transition-colors hover:bg-hud-cyan/10"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-1">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-hud-cyan" : "w-1.5 bg-hud-cyan/30"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {count > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded border transition-colors ${
                i === index ? "border-hud-cyan" : "border-hud-border/50 opacity-60"
              }`}
            >
              {slide.type === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-hud-bg font-mono text-sm text-hud-cyan">
                  VIDEO
                </div>
              ) : (
                <Image src={slide.src} alt="" fill className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
