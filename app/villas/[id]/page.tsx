import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/villa/ImageGallery";
import BookingForm from "@/components/villa/BookingForm";
import Link from "next/link";
import { MapPin, Users, Sparkles, CheckCircle, ArrowLeft } from "lucide-react";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function VillaDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  const villa = await prisma.villa.findUnique({
    where: { id: params.id },
    include: { images: true }
  });

  if (!villa) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-28 pb-20 flex flex-col bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/villas" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Villas
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">{villa.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Bali, Indonesia</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Up to {villa.capacity} Guests</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          <ImageGallery images={villa.images} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
                <Sparkles className="text-secondary w-6 h-6" /> About this Villa
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                {villa.description}
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {["Private Pool", "Free WiFi", "Air Conditioning", "Kitchen", "Free Parking", "Daily Housekeeping"].map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingForm villaId={villa.id} pricePerNight={villa.price} isLoggedIn={!!session?.user} />
          </div>

        </div>
      </div>
    </div>
  );
}
