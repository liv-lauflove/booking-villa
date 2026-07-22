import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutUs } from "@/components/AboutUs";
import { RecommendedVillas } from "@/components/RecommendedVillas";
import { Reviews } from "@/components/Reviews";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const recommendedVillas = await prisma.villa.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { images: true }
  });

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar isLoggedIn={!!session?.user} />
      <Hero />
      <AboutUs />
      <RecommendedVillas villas={recommendedVillas} />
      <Reviews />
      <Footer />
    </main>
  );
}
