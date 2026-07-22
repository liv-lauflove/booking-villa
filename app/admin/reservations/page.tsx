import { getReservations } from "@/lib/actions/reservation";
import ReservationTable from "@/components/admin/ReservationTable";

export default async function AdminReservationsPage() {
  const result = await getReservations();
  const reservations = result.success && result.data ? result.data : [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Transaksi & Reservasi</h1>
        <p className="text-muted-foreground mt-1">Pantau seluruh pesanan, status pembayaran, dan ubah status booking secara manual.</p>
      </div>

      <ReservationTable reservations={reservations} />
    </div>
  );
}
