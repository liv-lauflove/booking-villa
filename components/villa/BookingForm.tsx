"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type BookingFormProps = {
  villaId: string;
  pricePerNight: number;
};

export default function BookingForm({ villaId, pricePerNight }: BookingFormProps) {
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error'|'success', text: string } | null>(null);

  const nights = date.from && date.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = nights > 0 ? nights * pricePerNight : 0;

  const handleBooking = async () => {
    if (!date.from || !date.to) {
      setMessage({ type: 'error', text: 'Tentukan tanggal Check-in dan Check-out terlebih dahulu.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    // TODO: Connect to actual server action (Issue #4)
    // Mocking for now since Issue #4 server action will be implemented next or alongside
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Reservasi berhasil! Menunggu pembayaran...' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-xl sticky top-28">
      <div className="mb-6 pb-6 border-b border-border">
        <p className="text-3xl font-bold text-primary">
          Rp {pricePerNight.toLocaleString("id-ID")}
        </p>
        <p className="text-muted-foreground text-sm">per malam</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-slate-700">Pilih Tanggal Menginap</label>
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
              <span>Check-in — Check-out</span>
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

        {nights > 0 && (
          <div className="bg-muted p-4 rounded-xl mt-6 space-y-2 text-sm text-slate-700 animate-in fade-in">
            <div className="flex justify-between">
              <span>Rp {pricePerNight.toLocaleString("id-ID")} x {nights} malam</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-border mt-2">
              <span>Total Estimasi</span>
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

        <Button 
          onClick={handleBooking}
          disabled={loading || !date.from || !date.to}
          className="w-full py-6 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg font-bold shadow-md mt-6"
        >
          {loading ? "Memproses..." : "Pesan Sekarang"}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Anda belum dikenakan biaya.
        </p>
      </div>
    </div>
  );
}
