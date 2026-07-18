"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/hero.jpg",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"
];

export function AboutUs() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full"
          >
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl relative bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIdx}
                  src={images[currentIdx]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Umbu Houses"
                />
              </AnimatePresence>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Your Mediterranean Haven in Bali
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              Welcome to Umbu Houses, where the timeless beauty of Mediterranean architecture meets the serene landscapes of Ubud. Our handpicked properties offer an unforgettable escape for those seeking luxury, peace, and unparalleled comfort.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Every corner is designed with natural earthy tones, sage greens, and rustic textures to bring you a sense of grounding and tranquility.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
