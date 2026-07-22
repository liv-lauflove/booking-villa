"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getPaymentToken, updatePaymentSuccess } from "@/lib/actions/payment";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function CheckoutButton({ reservationId }: { reservationId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await getPaymentToken(reservationId);
      if (!res.success || !res.token) {
        alert(res.error || "Failed to get payment token");
        setLoading(false);
        return;
      }

      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(res.token, {
          onSuccess: async function (result: any) {
            await updatePaymentSuccess(reservationId);
            router.push("/reservations");
          },
          onPending: function (result: any) {
            alert("Waiting for your payment.");
            router.push("/reservations");
          },
          onError: function (result: any) {
            alert("Payment failed!");
            setLoading(false);
          },
          onClose: function () {
            setLoading(false);
          },
        });
      } else {
        // Fallback for mock token
        if (res.token === "mock-token-for-testing") {
          alert("Midtrans Keys are not configured. Simulating successful payment!");
          await updatePaymentSuccess(reservationId);
          router.push("/reservations");
        } else {
          alert("Snap.js is not loaded correctly");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      alert("A system error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-dummy"} 
      />
      <Button 
        onClick={handlePay} 
        disabled={loading}
        className="w-full py-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold shadow-xl transition-all hover:-translate-y-1"
      >
        {loading ? "Processing..." : "Pay Now with Midtrans"}
      </Button>
    </>
  );
}
