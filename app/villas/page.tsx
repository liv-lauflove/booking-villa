import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VillasPage() {
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

      {/* Villas Grid / Empty State */}
      <section className="container mx-auto px-6 max-w-6xl py-20 flex-1 flex flex-col">
        {/* Future Grid will go here when Admin adds villas */}
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
      </section>
    </div>
  );
}
