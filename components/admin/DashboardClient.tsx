"use client";

import { useState, useMemo, useEffect } from "react";
import { format, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { CalendarDays, Wallet, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

type DashboardProps = {
  reservations: any[];
  villas: any[];
};

export default function DashboardClient({ reservations, villas }: DashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedVillaId, setSelectedVillaId] = useState<string>(villas.length > 0 ? villas[0].id : "");

  // Prevent Hydration errors by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Data Calculation
  const today = new Date();
  
  // Minggu ini
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
  
  // Bulan ini (berdasarkan filter kalender/bulan yang dipilih user)
  const startOfSelectedMonth = startOfMonth(currentDate);
  const endOfSelectedMonth = endOfMonth(currentDate);

  // Revenue & Booking Minggu Ini
  const thisWeekReservations = reservations.filter(res => 
    (res.status === "CONFIRMED" || res.status === "COMPLETED") &&
    isWithinInterval(new Date(res.createdAt), { start: startOfThisWeek, end: endOfThisWeek })
  );
  
  const revenueThisWeek = thisWeekReservations.reduce((sum, res) => sum + res.price, 0);
  const bookingsThisWeek = thisWeekReservations.length;

  // Revenue Bulan Ini
  const thisMonthReservations = reservations.filter(res => 
    (res.status === "CONFIRMED" || res.status === "COMPLETED") &&
    isWithinInterval(new Date(res.createdAt), { start: startOfSelectedMonth, end: endOfSelectedMonth })
  );
  
  const revenueThisMonth = thisMonthReservations.reduce((sum, res) => sum + res.price, 0);

  // 2. Custom Chart Data (Monthly Revenue)
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = currentDate.getFullYear();
    
    return months.map((monthName, index) => {
      const monthReservations = reservations.filter(res => {
        const d = new Date(res.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === index && (res.status === "CONFIRMED" || res.status === "COMPLETED");
      });
      const total = monthReservations.reduce((sum, res) => sum + res.price, 0);
      return { name: monthName, total };
    });
  }, [reservations, currentDate]);

  const maxChartValue = Math.max(...chartData.map(d => d.total), 1); // fallback to 1 to avoid / 0

  // 3. Calendar Logic
  const monthDays = eachDayOfInterval({ start: startOfSelectedMonth, end: endOfSelectedMonth });
  const startDayOfWeek = getDay(startOfSelectedMonth);
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const getDayStatus = (day: Date) => {
    if (!selectedVillaId) return "available";

    const overlappingRes = reservations.find(res => {
      if (res.villaId !== selectedVillaId) return false;
      if (res.status === "CANCELLED") return false;
      
      const start = new Date(res.startDate);
      const end = new Date(res.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      
      return day >= start && day <= end;
    });

    if (overlappingRes) return "booked";
    if (day.getDate() === 15) return "maintenance"; // Mock maintenance

    return "available";
  };

  if (!mounted) {
    return <div className="h-96 flex items-center justify-center text-slate-400">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500 truncate">Pendapatan Minggu Ini</p>
            <p className="text-2xl font-bold text-slate-800 truncate">Rp {revenueThisWeek.toLocaleString("id-ID")}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500 truncate">Pendapatan Bulan Ini</p>
            <p className="text-2xl font-bold text-slate-800 truncate">Rp {revenueThisMonth.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500 truncate">Total Booking Minggu Ini</p>
            <p className="text-2xl font-bold text-slate-800 truncate">{bookingsThisWeek} Booking</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Custom Bar Chart (Bulletproof, No Library Needed) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Grafik Pendapatan ({currentDate.getFullYear()})</h2>
              <p className="text-sm text-muted-foreground">Tren pendapatan per bulan sepanjang tahun</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 h-64 mt-auto">
            {chartData.map((data, idx) => {
              const heightPercent = data.total > 0 ? (data.total / maxChartValue) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-full flex justify-center h-full items-end pb-2">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg pointer-events-none whitespace-nowrap transition-opacity shadow-lg z-10">
                      Rp {data.total.toLocaleString("id-ID")}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-blue-100 group-hover:bg-blue-200 transition-colors rounded-t-md overflow-hidden relative flex items-end"
                      style={{ height: '100%' }}
                    >
                      <div 
                        className="w-full bg-blue-500 group-hover:bg-blue-600 transition-colors rounded-t-md" 
                        style={{ height: `${heightPercent}%`, minHeight: data.total > 0 ? '4px' : '0' }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 mt-2">{data.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-slate-800">Kalender Ketersediaan</h2>
            <div className="mt-3">
              <select 
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedVillaId}
                onChange={(e) => setSelectedVillaId(e.target.value)}
              >
                {villas.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
                {villas.length === 0 && <option value="">Belum ada villa</option>}
              </select>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-slate-800">
                  {format(currentDate, "MMMM yyyy")}
                </h3>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-slate-400 py-1">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map(empty => (
                  <div key={`empty-${empty}`} className="h-8 sm:h-10"></div>
                ))}
                
                {monthDays.map(day => {
                  const status = getDayStatus(day);
                  
                  let bgColor = "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
                  if (status === "booked") bgColor = "bg-red-100 text-red-700 border-red-200 opacity-60 line-through";
                  if (status === "maintenance") bgColor = "bg-slate-200 text-slate-600 border-slate-300";

                  return (
                    <div 
                      key={day.toISOString()} 
                      className={`h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-medium rounded-lg border transition-colors cursor-pointer ${bgColor}`}
                      title={status === "available" ? "Available" : status === "booked" ? "Booked" : "Maintenance"}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 text-xs font-medium text-slate-600 bg-slate-50 py-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div> Available
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div> Booked
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-400 shadow-sm"></div> Maint.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
