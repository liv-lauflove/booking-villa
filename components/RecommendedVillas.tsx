"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type VillaProps = {
  villas: any[];
}

export function RecommendedVillas({ villas }: VillaProps) {
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
          <p className="text-lg text-foreground/70">Explore our recommended stays from the beautiful villas at Umbu Houses.</p>
        </motion.div>

        {villas.length === 0 ? (
          <div className="text-center text-muted-foreground p-12 border-2 border-dashed border-border rounded-2xl">
            <p>Admin has not added any villas yet. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {villas.map((villa, idx) => (
              <motion.div
                key={villa.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border group flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-64 bg-muted relative overflow-hidden">
                  {villa.images && villa.images.length > 0 ? (
                    <Image 
                      src={villa.images[0].url} 
                      alt={villa.images[0].title || villa.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary font-bold px-3 py-1.5 rounded-full text-xs shadow-sm">
                    Rp {villa.price.toLocaleString("id-ID")} <span className="font-normal text-xs text-muted-foreground">/ night</span>
                  </div>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">{villa.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{villa.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Up to {villa.capacity} Guests
                    </span>
                    <Link href={`/villas/${villa.id}`}>
                      <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground rounded-full h-8 px-4 text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <Link href="/villas">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 rounded-full shadow-lg">
              View All Villas
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
