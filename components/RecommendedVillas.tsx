"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";

const dummyVillas = [
  { id: 1, name: "Villa Casa Blanca", price: "Dynamic Pricing", location: "Ubud, Bali" },
  { id: 2, name: "Olive Grove Villa", price: "Dynamic Pricing", location: "Canggu, Bali" },
  { id: 3, name: "Terracotta Retreat", price: "Dynamic Pricing", location: "Uluwatu, Bali" },
];

export function RecommendedVillas() {
  return (
    <section id="villas" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Our Villas</h2>
          <p className="text-lg text-foreground/70">Explore our recommended stays from the 6 beautiful villas at Umbu Houses.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dummyVillas.map((villa, idx) => (
            <motion.div
              key={villa.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border group flex flex-col"
            >
              <div className="h-64 bg-muted relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Image (To be provided)
                </div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-foreground mb-2">{villa.name}</h3>
                  <p className="text-muted-foreground mb-4">{villa.location}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-semibold text-secondary italic">*Price based on date</span>
                  <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground rounded-full">
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <Link href="/villas">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 rounded-full shadow-lg">
              View All 6 Villas
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
