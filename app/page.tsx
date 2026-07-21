

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutUs } from "@/components/AboutUs";
import { RecommendedVillas } from "@/components/RecommendedVillas";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <AboutUs />
      <RecommendedVillas />
      <Reviews />
      <Footer />
    </main>
  );
}
