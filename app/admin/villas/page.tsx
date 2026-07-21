import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getVillas } from "@/lib/actions/villa";
import { Plus } from "lucide-react";
import VillaTable from "@/components/admin/VillaTable";

export default async function AdminVillasPage() {
  const result = await getVillas();
  const villas = result.success && result.data ? result.data : [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Villa</h1>
          <p className="text-muted-foreground mt-1">Kelola data villa yang akan ditampilkan di website.</p>
        </div>
        <Link href="/admin/villas/create">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Villa
          </Button>
        </Link>
      </div>

      <VillaTable villas={villas} />
    </div>
  );
}
