import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function VillasPage() {
  // Ambil data villa beserta gambarnya dari database
  const villas = await prisma.villa.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true }
  });

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-background">
      {/* Hero Section */}
      <section className="bg-muted py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
            Discover Our Villas
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">
            Explore our exclusive collection of luxurious properties designed for your perfect getaway in Bali.
          </p>
        </div>
      </section>

      {/* Filter & Search Placeholder */}
      <section className="container mx-auto px-6 max-w-6xl -mt-8 relative z-20">
        <div className="bg-card p-3 rounded-2xl shadow-xl border border-border flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, location, or amenities..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-foreground"
            />
          </div>
          <Button className="py-4 h-auto px-10 rounded-xl bg-secondary text-secondary-foreground text-lg hover:bg-secondary/90 hover:scale-105 transition-all shadow-md font-semibold">
            Search
          </Button>
        </div>
      </section>

      {/* Villas Grid */}
      <section className="container mx-auto px-6 max-w-6xl py-20 flex-1 flex flex-col">
        {villas.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-border rounded-3xl bg-muted/30">
            <div className="w-24 h-24 mb-8 rounded-full bg-background shadow-sm flex items-center justify-center text-5xl border border-border">
              🌴
            </div>
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Curating Our Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              We are currently hand-picking the most exquisite villas for you. Please check back soon once our properties are listed by the admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {villas.map((villa) => (
              <Link href={`/villas/${villa.id}`} key={villa.id} className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-64 w-full bg-muted overflow-hidden">
                  {villa.images && villa.images.length > 0 ? (
                    <Image 
                      src={villa.images[0].url} 
                      alt={villa.images[0].title || villa.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                      No Image Available
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary font-bold px-3 py-1.5 rounded-full text-sm shadow-sm">
                    Rp {villa.price.toLocaleString("id-ID")} <span className="font-normal text-xs text-muted-foreground">/ night</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
                    {villa.name}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 flex-1 mb-4">
                    {villa.description}
                  </p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Up to {villa.capacity} Guests
                    </span>
                    <span className="text-secondary font-semibold group-hover:underline">View Details &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
