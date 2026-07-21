import VillaForm from "@/components/admin/VillaForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateVillaPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/villas" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-slate-800 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Tambah Villa Baru</h1>
        <p className="text-muted-foreground mt-1">Masukkan detail properti villa baru ke dalam katalog.</p>
      </div>
      
      <VillaForm />
    </div>
  );
}
