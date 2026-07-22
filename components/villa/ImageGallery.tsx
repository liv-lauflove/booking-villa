"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images }: { images: { url: string; title: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[50vh] bg-muted rounded-3xl flex items-center justify-center text-muted-foreground border border-border">
        Tidak ada gambar
      </div>
    );
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full">
      {/* Main Image Slider */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-slate-100/80 group border border-border shadow-sm flex items-center justify-center">
        <Image 
          src={images[currentIndex].url}
          alt={images[currentIndex].title || "Villa Image"}
          fill
          className="object-contain transition-all duration-700 p-2"
          priority
        />
        
        {/* Title Overlay */}
        {images[currentIndex].title && (
          <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium">
            {images[currentIndex].title}
          </div>
        )}

        {/* Controls */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-20 shrink-0 rounded-xl overflow-hidden transition-all ${idx === currentIndex ? 'ring-2 ring-primary ring-offset-2 scale-105' : 'opacity-60 hover:opacity-100'}`}
            >
              <Image src={img.url} alt={img.title} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
