"use client";

import { motion } from "framer-motion";

export function AboutUs() {
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
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Dummy Image for now */}
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                 <span className="text-muted-foreground font-medium">Image (To be provided)</span>
              </div>
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
              Welcome to Liv Villa, where the timeless beauty of Mediterranean architecture meets the serene landscapes of Ubud. Our handpicked properties offer an unforgettable escape for those seeking luxury, peace, and unparalleled comfort.
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
