"use client";

import { useState, useRef, useCallback } from "react";
import { Maximize, X, Play, Box } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  videoUrl?: string;
  model3DUrl?: string;
}

export default function ProductGallery({ images, videoUrl, model3DUrl }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    [isZoomed]
  );

  const currentSrc = showVideo
    ? videoUrl
    : images[selectedIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        ref={containerRef}
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsFullscreen(true)}
      >
        {showVideo && videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            muted
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-200"
            style={{
              backgroundImage: `url(${currentSrc})`,
              transform: isZoomed ? "scale(2.5)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        )}

        {/* Actions overlay */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {model3DUrl && (
            <button
              onClick={() => setShow3D(true)}
              className="rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm hover:bg-white dark:bg-black/80 dark:hover:bg-black"
              aria-label="View in 3D"
            >
              <Box className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(true)}
            className="rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm hover:bg-white dark:bg-black/80 dark:hover:bg-black"
            aria-label="Fullscreen"
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>

        {/* Video toggle */}
        {videoUrl && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="absolute left-3 top-3 rounded-lg bg-white/90 p-2 shadow-lg backdrop-blur-sm hover:bg-white dark:bg-black/80 dark:hover:bg-black"
            aria-label={showVideo ? "Show image" : "Play video"}
          >
            {showVideo ? (
              <X className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={img + idx}
            onClick={() => setSelectedIndex(idx)}
            className={`h-20 w-20 flex-shrink-0 rounded-lg border-2 bg-cover bg-center transition-all ${
              selectedIndex === idx && !showVideo
                ? "border-foreground opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="h-[90vh] w-[90vw] bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSrc})` }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 3D Viewer */}
      {show3D && model3DUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 z-10"
            onClick={() => setShow3D(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="h-[90vh] w-[90vw]">
            <iframe
              src={model3DUrl}
              className="h-full w-full border-0"
              title="3D Product Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
