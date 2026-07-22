import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { format } from "date-fns";
import Image from "next/image";
import { Calendar, CreditCard, Users, FileText, CheckCircle2 } from "lucide-react";
import CheckoutButton from "@/components/villa/CheckoutButton";

export const dynamic = "force-dynamic";

export default async function CheckoutPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: params.id },
    include: {
      villa: {
        include: { images: true }
      },
      payment: true,
      user: true,
    }
  });

  if (!reservation || reservation.user.email !== session.user.email) {
    notFound();
  }

  if (reservation.payment?.status === "PAID") {
    redirect("/reservations");
  }

  return (
    <div className="min-h-screen pt-28 pb-20 flex flex-col bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-8 text-center">
          Complete Your Payment
        </h1>

        <div className="bg-white border border-border rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left - Order Summary */}
          <div className="w-full md:w-5/12 bg-slate-100 p-8 flex flex-col border-b md:border-b-0 md:border-r border-border">
            <h2 className="font-serif font-bold text-xl text-primary mb-6">Order Summary</h2>
            
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6 shadow-sm">
              <Image 
                src={reservation.villa.images[0]?.url || "/images/placeholder.jpg"} 
                alt={reservation.villa.name} 
                fill 
                className="object-cover"
              />
            </div>

            <h3 className="font-bold text-lg text-slate-800 mb-1">{reservation.villa.name}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{reservation.villa.description}</p>

            <div className="space-y-4 text-sm text-slate-600 flex-1">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium text-slate-800">Stay Dates</p>
                  <p>{format(new Date(reservation.startDate), "dd MMM yyyy")} - {format(new Date(reservation.endDate), "dd MMM yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium text-slate-800">Number of Guests</p>
                  <p>{reservation.guestCount} Guests</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-end">
                <span className="text-slate-600 font-medium">Total Price</span>
                <span className="text-2xl font-bold text-primary">Rp {reservation.price.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* Right - Guest Details & Payment */}
          <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-primary mb-6">Guest Details</h2>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-medium text-slate-800">{reservation.guestName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="font-medium text-slate-800">{reservation.guestPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Email Address</p>
                    <p className="font-medium text-slate-800 truncate" title={reservation.guestEmail || ""}>{reservation.guestEmail}</p>
                  </div>
                </div>
                {reservation.notes && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><FileText className="w-3 h-3"/> Additional Notes</p>
                    <p className="font-medium text-slate-600 italic text-sm">"{reservation.notes}"</p>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <h3 className="font-semibold text-slate-800">Payment Method (Midtrans)</h3>
                <p className="text-sm text-slate-500">You will be redirected to the secure Midtrans pop-up to select your payment method (Virtual Account, Credit Card, GoPay, OVO, etc).</p>
                <div className="flex gap-2 items-center text-xs text-green-600 font-medium bg-green-50 p-3 rounded-lg border border-green-100">
                  <CheckCircle2 className="w-4 h-4" /> Payment is protected by 256-bit encryption
                </div>
              </div>
            </div>

            <div className="mt-10">
              <CheckoutButton reservationId={reservation.id} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
