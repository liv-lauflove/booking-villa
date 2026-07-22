"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createReservation } from "@/lib/actions/reservation";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BookingFormProps = {
  villaId: string;
  pricePerNight: number;
  isLoggedIn: boolean;
};

export default function BookingForm({ villaId, pricePerNight, isLoggedIn }: BookingFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error'|'success', text: string } | null>(null);

  const [guestDetails, setGuestDetails] = useState({
    name: "",
    phone: "",
    email: "",
    guests: 1,
    notes: ""
  });
  const [countryCode, setCountryCode] = useState("+62");

  const nights = date.from && date.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights > 0 ? nights * pricePerNight : 0;

  const handleBooking = async () => {
    if (!date.from || !date.to) {
      setMessage({ type: 'error', text: 'Tentukan tanggal Check-in dan Check-out terlebih dahulu.' });
      return;
    }

    if (!guestDetails.name || !guestDetails.phone || !guestDetails.email) {
      setMessage({ type: 'error', text: 'Please complete all guest details (Name, Phone, Email).' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const fullPhoneNumber = `${countryCode}${guestDetails.phone}`;
    const finalGuestDetails = { ...guestDetails, phone: fullPhoneNumber };

    const result = await createReservation(villaId, date.from, date.to, totalPrice, finalGuestDetails);

    if (result.success && result.data) {
      setMessage({ type: 'success', text: 'Reservation successful! Redirecting to checkout...' });
      setTimeout(() => {
        router.push(`/checkout/${result.data.id}`);
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.error || 'A system error occurred.' });
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-xl sticky top-28">
      <div className="mb-6 pb-6 border-b border-border">
        <p className="text-3xl font-bold text-primary">
          Rp {pricePerNight.toLocaleString("id-ID")}
        </p>
        <p className="text-muted-foreground text-sm">per night</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-slate-700">Select Dates</label>
        <Popover>
          <PopoverTrigger
            className={cn(
              "w-full flex items-center justify-start text-left font-normal py-3 px-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors",
              !date.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-secondary" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select Check-in Dates</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="range"
              defaultMonth={date.from || new Date()}
              selected={{ from: date.from, to: date.to }}
              onSelect={(range) => setDate({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
              disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
            />
          </PopoverContent>
        </Popover>

        {/* Form Data Tamu */}
        <div className="space-y-3 pt-4 border-t border-border mt-4">
          <label className="text-sm font-semibold text-slate-700">Guest Details</label>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={guestDetails.name}
            onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex">
              <select 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-2 rounded-l-xl border border-r-0 border-border bg-muted/50 text-sm focus:outline-none cursor-pointer"
              >
                <option value="+62">🇮🇩 +62</option>
                <option value="+1">🇺🇸/🇨🇦 +1</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+82">🇰🇷 +82</option>
                <option value="+60">🇲🇾 +60</option>
                <option value="+86">🇨🇳 +86</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+39">🇮🇹 +39</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+31">🇳🇱 +31</option>
                <option value="+41">🇨🇭 +41</option>
                <option value="+64">🇳🇿 +64</option>
                <option value="+353">🇮🇪 +353</option>
              </select>
              <input 
                type="tel" 
                placeholder="8123456789" 
                value={guestDetails.phone}
                onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value.replace(/[^0-9]/g, '')})}
                className="w-full px-4 py-2 rounded-r-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={guestDetails.email}
              onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600 flex-1">Number of Guests</label>
            <input 
              type="number" 
              min="1"
              value={guestDetails.guests}
              onChange={(e) => setGuestDetails({...guestDetails, guests: parseInt(e.target.value) || 1})}
              className="w-20 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 text-center"
            />
          </div>
          <textarea 
            placeholder="Additional Notes (Optional)" 
            value={guestDetails.notes}
            onChange={(e) => setGuestDetails({...guestDetails, notes: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 min-h-[80px]"
          />
        </div>

        {nights > 0 && (
          <div className="bg-muted p-4 rounded-xl mt-6 space-y-2 text-sm text-slate-700 animate-in fade-in">
            <div className="flex justify-between">
              <span>Rp {pricePerNight.toLocaleString("id-ID")} x {nights} nights</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900 border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
        )}

        {message && (
          <div className={`p-3 rounded-xl text-sm flex gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{message.text}</span>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          {isLoggedIn ? (
            <Button 
              className="w-full py-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold shadow-xl transition-all hover:-translate-y-1"
              onClick={handleBooking}
              disabled={loading || !date.from || !date.to}
            >
              {loading ? "Processing..." : "Book Now"}
            </Button>
          ) : (
            <Link href="/signin">
              <Button className="w-full py-6 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-lg font-bold shadow-xl">
                Login to Book
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
