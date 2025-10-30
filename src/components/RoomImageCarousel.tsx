"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomImageCarouselProps {
  images?: string[];
  fallbackImage?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function RoomImageCarousel({
  images,
  fallbackImage,
  alt,
  className = "h-64",
  priority = false,
}: RoomImageCarouselProps) {
  const imageList = useMemo(() => {
    const seen = new Set<string>();
    const ordered = [...(images ?? [])];

    if (fallbackImage) {
      ordered.push(fallbackImage);
    }

    const unique = ordered
      .map((src) => (typeof src === "string" ? src.trim() : ""))
      .filter((src) => {
        if (!src) {
          return false;
        }
        if (seen.has(src)) {
          return false;
        }
        seen.add(src);
        return true;
      });

    return unique.slice(0, 10);
  }, [images, fallbackImage]);

  const [current, setCurrent] = useState(0);

  if (imageList.length === 0) {
    return null;
  }

  const total = imageList.length;
  const goTo = (index: number) => {
    if (total === 0) {
      return;
    }

    const nextIndex = ((index % total) + total) % total;
    setCurrent(nextIndex);
  };

  const goPrev = () => goTo(current - 1);
  const goNext = () => goTo(current + 1);

  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${className}`}>
      <div className="relative h-full">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {imageList.map((src, index) => (
            <div
              key={src}
              className="relative h-full w-full flex-shrink-0"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                priority={priority && index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Önceki görsele geç"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Sonraki görsele geç"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {imageList.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Görsel ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  current === index ? "scale-110 bg-white" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
