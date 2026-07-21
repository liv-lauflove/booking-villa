"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createVilla, updateVilla } from "@/lib/actions/villa";

type VillaFormProps = {
  initialData?: any;
};

type SelectedImage = {
  id: string;
  file: File;
  preview: string;
  title: string;
};

export default function VillaForm({ initialData }: VillaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  const isEdit = !!initialData;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        title: "Kamar Utama", // Default title
      }));
      setSelectedImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeSelectedImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const updateImageTitle = (id: string, newTitle: string) => {
    setSelectedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, title: newTitle } : img))
    );
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.delete("imagesInput"); // Remove the raw input from formData

    // Append our manually managed files and their titles
    selectedImages.forEach((img) => {
      formData.append("images", img.file);
      formData.append("imageTitles", img.title);
    });

    const result = isEdit
      ? await updateVilla(initialData.id, formData)
      : await createVilla(formData);

    if (result.success) {
      router.push("/admin/villas");
      router.refresh();
    } else {
      setError(result.error || "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl bg-white p-8 rounded-xl border border-border shadow-sm">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">Nama Villa</label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          defaultValue={initialData?.name}
          required
          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Misal: Umbu Royal Suite"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">Deskripsi Lengkap</label>
        <textarea 
          id="description" 
          name="description" 
          defaultValue={initialData?.description}
          required
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Ceritakan keistimewaan villa ini..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-slate-700">Harga per Malam (Rp)</label>
          <input 
            id="price" 
            name="price" 
            type="number" 
            defaultValue={initialData?.price}
            required
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="5000000"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="capacity" className="text-sm font-medium text-slate-700">Kapasitas (Orang)</label>
          <input 
            id="capacity" 
            name="capacity" 
            type="number" 
            defaultValue={initialData?.capacity || 2}
            required
            min="1"
            className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      
      <div className="space-y-4 border border-border p-6 rounded-xl bg-slate-50">
        <div>
          <label htmlFor="imagesInput" className="text-sm font-medium text-slate-700">Upload Gambar Villa & Judul</label>
          <input 
            id="imagesInput" 
            name="imagesInput" 
            type="file" 
            multiple 
            accept="image/png, image/jpeg, image/jpg, image/avif"
            onChange={handleFileChange}
            className="block w-full mt-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-2">Format didukung: JPG, PNG, JPEG, AVIF. Kamu bisa mengunggah sebanyak mungkin gambar.</p>
        </div>

        {/* Dynamic Image List with Titles */}
        {selectedImages.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-semibold text-slate-700">Gambar yang akan diunggah:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedImages.map((img) => (
                <div key={img.id} className="flex gap-3 bg-white p-3 rounded-lg border border-border shadow-sm items-center relative group">
                  <div className="w-16 h-16 rounded-md bg-muted overflow-hidden shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-muted-foreground">Judul Gambar (Opsional)</label>
                    <input 
                      type="text" 
                      value={img.title} 
                      onChange={(e) => updateImageTitle(img.id, e.target.value)}
                      placeholder="e.g. Bedroom 1"
                      className="w-full text-sm px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeSelectedImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Existing Images in DB (For Edit Mode) */}
        {isEdit && initialData?.images && initialData.images.length > 0 && (
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Gambar Tersimpan di Database:</p>
            <div className="flex gap-4 flex-wrap">
              {initialData.images.map((img: any) => (
                <div key={img.id} className="relative group rounded-md overflow-hidden bg-white border border-border shadow-sm">
                  <div className="w-24 h-24 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-xs font-medium text-slate-700 text-center truncate w-24">
                    {img.title}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Gambar baru yang diunggah akan ditambahkan ke koleksi ini.</p>
          </div>
        )}
      </div>
      
      <div className="pt-4 flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
        >
          {loading ? "Menyimpan..." : isEdit ? "Update Villa" : "Simpan Villa"}
        </Button>
      </div>
    </form>
  );
}
