import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarX2 } from "lucide-react";

export default async function ReservationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

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
        
        {/* Empty State */}
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
      </div>
    </div>
  );
}
