"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-muted">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero.jpg" 
          alt="Umbu Houses in Bali" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 drop-shadow-lg"
        >
          Escape to Paradise
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl text-white/90 mb-10 font-light drop-shadow-md"
        >
          Experience the perfect blend of Mediterranean elegance and Ubud's lush tropical charm at Umbu Houses.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/villas">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 rounded-full shadow-xl transition-transform hover:scale-105">
              Discover Our Villas
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
