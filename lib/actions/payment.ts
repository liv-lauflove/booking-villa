"use server";

import { prisma } from "@/lib/prisma";
import { snap } from "@/lib/midtrans";
import { revalidatePath } from "next/cache";

export async function getPaymentToken(reservationId: string) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true, villa: true }
    });

    if (!reservation) {
      return { success: false, error: "Reservation not found" };
    }

    if (reservation.status === "CANCELLED") {
      return { success: false, error: "This reservation has been cancelled" };
    }

    // Periksa apakah server key sudah di-set
    if (!process.env.MIDTRANS_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY === "SB-Mid-server-dummy") {
      console.warn("MIDTRANS_SERVER_KEY is missing or dummy. Returning mock token for development.");
      return { success: true, token: "mock-token-for-testing" };
    }

    const parameter = {
      transaction_details: {
        order_id: reservation.id + "_" + Date.now(),
        gross_amount: reservation.price,
      },
      customer_details: {
        first_name: reservation.guestName || reservation.user.name || "Guest",
        email: reservation.guestEmail || reservation.user.email,
        phone: reservation.guestPhone || "081234567890",
      },
      item_details: [
        {
          id: reservation.villa.id,
          price: reservation.price,
          quantity: 1,
          name: reservation.villa.name.substring(0, 50),
        }
      ]
    };

    const transaction = await snap.createTransaction(parameter);
    return { success: true, token: transaction.token };

  } catch (error) {
    console.error("Failed to generate payment token:", error);
    return { success: false, error: "Failed to create payment transaction" };
  }
}

export async function updatePaymentSuccess(reservationId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // Update Payment status
      await tx.payment.update({
        where: { reservationId },
        data: { status: "PAID" }
      });
      
      // Update Reservation status (optional, usually admin confirms it later, but we can set it to PAID or keep PENDING)
      // The instruction says "admin memverifikasi dan mengubah ke CONFIRMED", so we leave Reservation status as PENDING or add a PAID state.
      // Wait, we can just let Payment=PAID, Reservation=PENDING.
    });

    revalidatePath("/reservations");
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch (error) {
    console.error("Update payment success failed:", error);
    return { success: false, error: "Failed to process payment" };
  }
}
