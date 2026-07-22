"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        villa: true,
        payment: true,
      },
    });
    return { success: true, data: reservations };
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    return { success: false, error: "Gagal mengambil data reservasi" };
  }
}

export async function updateReservationStatus(id: string, status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") {
  try {
    await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch (error) {
    console.error("Failed to update reservation status:", error);
    return { success: false, error: "Gagal mengupdate status reservasi" };
  }
}

export async function getVillaAvailability() {
  try {
    // We fetch reservations that are not cancelled
    const activeReservations = await prisma.reservation.findMany({
      where: {
        status: {
          not: "CANCELLED"
        }
      },
      include: {
        villa: true,
        user: true,
      },
      orderBy: {
        startDate: "asc"
      }
    });
    return { success: true, data: activeReservations };
  } catch (error) {
    console.error("Failed to fetch availability:", error);
    return { success: false, error: "Gagal mengambil data ketersediaan" };
  }
}

export async function createReservation(
  villaId: string, 
  startDate: Date, 
  endDate: Date, 
  totalPrice: number,
  guestDetails: {
    name: string;
    phone: string;
    email: string;
    guests: number;
    notes?: string;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Anda harus login untuk melakukan pemesanan" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: "User tidak ditemukan" };
    }

    // Cek ketersediaan tanggal
    const overlappingReservations = await prisma.reservation.findMany({
      where: {
        villaId,
        status: { not: "CANCELLED" },
        OR: [
          {
            startDate: { lt: endDate },
            endDate: { gt: startDate }
          }
        ]
      }
    });

    if (overlappingReservations.length > 0) {
      return { success: false, error: "Villa sudah dipesan pada tanggal tersebut. Silakan pilih tanggal lain." };
    }

    // Buat Reservasi & Data Payment sekaligus (Transaction)
    const reservation = await prisma.$transaction(async (tx) => {
      const res = await tx.reservation.create({
        data: {
          villaId,
          userId: user.id,
          startDate,
          endDate,
          price: totalPrice,
          status: "PENDING",
          guestName: guestDetails.name,
          guestPhone: guestDetails.phone,
          guestEmail: guestDetails.email,
          guestCount: guestDetails.guests,
          notes: guestDetails.notes || null,
        }
      });

      await tx.payment.create({
        data: {
          reservationId: res.id,
          amount: totalPrice,
          status: "UNPAID"
        }
      });

      return res;
    });

    revalidatePath(`/villas/${villaId}`);
    return { success: true, data: reservation };

  } catch (error) {
    console.error("Failed to create reservation:", error);
    return { success: false, error: "Terjadi kesalahan sistem saat membuat pemesanan" };
  }
}
