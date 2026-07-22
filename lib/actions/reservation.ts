"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
