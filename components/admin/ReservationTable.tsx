"use client";

import { useState } from "react";
import { updateReservationStatus } from "@/lib/actions/reservation";
import { format } from "date-fns";
import { Calendar, User, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type ReservationTableProps = {
  reservations: any[];
};

export default function ReservationTable({ reservations: initialReservations }: ReservationTableProps) {
  const [reservations, setReservations] = useState(initialReservations);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    setUpdatingId(id);
    setOpenDropdownId(null);
    const result = await updateReservationStatus(id, newStatus);
    if (result.success) {
      setReservations((prev) => 
        prev.map((res) => res.id === id ? { ...res, status: newStatus } : res)
      );
    } else {
      alert(result.error || "Gagal mengubah status");
    }
    setUpdatingId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-100 text-green-700 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      case "COMPLETED": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-visible">
      {reservations.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground">
          <p>Belum ada transaksi atau reservasi saat ini.</p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 font-medium text-slate-700">ID & Tanggal Order</th>
                <th className="px-6 py-4 font-medium text-slate-700">Pemesan</th>
                <th className="px-6 py-4 font-medium text-slate-700">Detail Villa & Inap</th>
                <th className="px-6 py-4 font-medium text-slate-700">Total Biaya</th>
                <th className="px-6 py-4 font-medium text-slate-700">Status Booking</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs text-slate-500 mb-1">#{res.id.slice(0,8).toUpperCase()}</p>
                    <p className="text-sm font-medium">{format(new Date(res.createdAt), "dd MMM yyyy, HH:mm")}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{res.user?.name || "User Tidak Diketahui"}</p>
                        <p className="text-xs text-muted-foreground">{res.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary text-sm">{res.villa?.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(res.startDate), "dd MMM")} - {format(new Date(res.endDate), "dd MMM yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">Rp {res.price.toLocaleString("id-ID")}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <CreditCard className="w-3 h-3 text-slate-400" />
                      <span className={res.payment?.status === "PAID" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
                        {res.payment?.status || "UNPAID"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 relative">
                    <div className="relative inline-block text-left">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={updatingId === res.id}
                        onClick={() => setOpenDropdownId(openDropdownId === res.id ? null : res.id)}
                        className={`border rounded-full flex items-center gap-2 h-8 px-3 text-xs font-semibold ${getStatusColor(res.status)}`}
                      >
                        {updatingId === res.id ? "Updating..." : res.status}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                      
                      {openDropdownId === res.id && (
                        <div className="absolute z-50 right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-2">
                          <button onClick={() => handleUpdateStatus(res.id, "PENDING")} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">Mark as PENDING</button>
                          <button onClick={() => handleUpdateStatus(res.id, "CONFIRMED")} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-green-700">Mark as CONFIRMED</button>
                          <button onClick={() => handleUpdateStatus(res.id, "COMPLETED")} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-blue-700">Mark as COMPLETED</button>
                          <button onClick={() => handleUpdateStatus(res.id, "CANCELLED")} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-red-700">Mark as CANCELLED</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
