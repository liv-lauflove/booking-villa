"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteVilla } from "@/lib/actions/villa";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type VillaTableProps = {
  villas: any[];
};

export default function VillaTable({ villas: initialVillas }: VillaTableProps) {
  const router = useRouter();
  const [villas, setVillas] = useState(initialVillas);
  const [villaToDelete, setVillaToDelete] = useState<{id: string, name: string} | null>(null);

  const handleDeleteVilla = async () => {
    if (!villaToDelete) return;
    const result = await deleteVilla(villaToDelete.id);
    if (result.success) {
      setVillas((prev) => prev.filter((v) => v.id !== villaToDelete.id));
      router.refresh();
    }
    setVillaToDelete(null);
  };

  return (
    <>
      {villaToDelete && (
        <ConfirmDeleteModal
          title="Hapus Villa?"
          message={`Yakin ingin menghapus villa "${villaToDelete.name}"? Semua data dan gambar villa ini akan ikut terhapus secara permanen.`}
          onConfirm={handleDeleteVilla}
          onCancel={() => setVillaToDelete(null)}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {villas.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p>Belum ada data villa. Silakan tambahkan data pertama Anda.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 font-medium text-slate-700">Info Villa</th>
                <th className="px-6 py-4 font-medium text-slate-700">Harga / Malam</th>
                <th className="px-6 py-4 font-medium text-slate-700">Kapasitas</th>
                <th className="px-6 py-4 font-medium text-slate-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {villas.map((villa) => (
                <tr key={villa.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-md overflow-hidden bg-muted">
                        {villa.images && villa.images.length > 0 ? (
                          <Image src={villa.images[0].url} alt={villa.images[0].title} fill className="object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-[10px] text-center px-1 leading-tight text-muted-foreground">No img</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{villa.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">{villa.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{villa.images?.length || 0} Gambar</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">Rp {villa.price.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4">{villa.capacity} Orang</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/villas/${villa.id}/edit`}>
                        <Button variant="outline" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setVillaToDelete({ id: villa.id, name: villa.name })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
