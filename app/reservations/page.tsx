import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarX2, Calendar, CreditCard, ChevronRight, CheckCircle, Clock, XCircle, Home } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!dbUser) {
    redirect("/signin");
  }

  const reservations = await prisma.reservation.findMany({
    where: { userId: dbUser.id },
    include: {
      villa: {
        include: { images: { take: 1 } }
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"><CheckCircle className="w-3 h-3"/> {status}</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold"><Clock className="w-3 h-3"/> {status}</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"><XCircle className="w-3 h-3"/> {status}</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 bg-background flex flex-col">
      <div className="container mx-auto px-6 max-w-5xl flex-1 flex flex-col">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            My Reservations
          </h1>
          <p className="text-lg text-foreground/70">
            Welcome back, <span className="font-semibold text-primary">{session.user.name}</span>. Here is the history of your bookings.
          </p>
        </header>
        
        {reservations.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center py-24 bg-card/50 rounded-[2.5rem] shadow-sm border border-border text-center px-4">
            <div className="w-24 h-24 mb-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <CalendarX2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              No Reservations Yet
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10">
              You haven&apos;t made any bookings yet. Start exploring our exclusive villas and plan your next perfect getaway.
            </p>
            <Link href="/villas">
              <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-all hover:-translate-y-1">
                Explore Villas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((res) => (
              <div key={res.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                {/* Villa Image */}
                <div className="w-full sm:w-64 h-48 sm:h-auto relative bg-muted shrink-0">
                  {res.villa.images[0] ? (
                    <Image 
                      src={res.villa.images[0].url} 
                      alt={res.villa.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Home className="w-10 h-10 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(res.status)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-serif font-bold text-primary line-clamp-1">{res.villa.name}</h3>
                      <p className="text-sm font-mono text-muted-foreground">#{res.id.slice(0,8).toUpperCase()}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Check-in — Check-out</p>
                          <p className="font-medium text-sm">{format(new Date(res.startDate), "dd MMM yyyy")} - {format(new Date(res.endDate), "dd MMM yyyy")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Total Price</p>
                          <p className="font-medium text-sm">Rp {res.price.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Payment Status:</span>
                      <span className={`text-sm font-bold ${res.payment?.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {res.payment?.status || "UNPAID"}
                      </span>
                    </div>
                    
                    <Link href={`/villas/${res.villa.id}`}>
                      <Button variant="outline" className="rounded-full flex items-center gap-2">
                        View Villa <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
