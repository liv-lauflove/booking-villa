import { getReservations } from "@/lib/actions/reservation";
import { getVillas } from "@/lib/actions/villa";
import DashboardClient from "@/components/admin/DashboardClient";

export default async function AdminDashboardPage() {
  const [resReservations, resVillas] = await Promise.all([
    getReservations(),
    getVillas()
  ]);

  const reservations = resReservations.success && resReservations.data ? resReservations.data : [];
  const villas = resVillas.success && resVillas.data ? resVillas.data : [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Utama</h1>
        <p className="text-muted-foreground mt-1">Ringkasan statistik, pendapatan, dan ketersediaan villa.</p>
      </div>

      <DashboardClient reservations={reservations} villas={villas} />
    </div>
  );
}
