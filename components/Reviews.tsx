"use client";

import { motion } from "framer-motion";

const dummyReviews = [
  { id: 1, name: "Sarah Jenkins", comment: "Absolutely breathtaking! Umbu Houses gave us the perfect Mediterranean escape right in Bali. Will definitely come back.", rating: 5 },
  { id: 2, name: "Michael Chang", comment: "The design is flawless, and the ambiance is so peaceful. Highly recommended for anyone wanting a luxurious getaway.", rating: 5 },
  { id: 3, name: "Emma Robertson", comment: "We stayed in one of their 6 villas and the experience was top-notch. Great hospitality and beautiful interiors.", rating: 5 },
];

export function Reviews() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Guest Reviews</h2>
          <p className="text-lg text-foreground/70">See what our guests are saying about Umbu Houses.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dummyReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="bg-muted/50 p-8 rounded-2xl border border-border"
            >
              <div className="flex text-secondary mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 italic mb-6">"{review.comment}"</p>
              <p className="font-bold text-foreground">{review.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
