"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ConfirmDeleteModalProps = {
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
};

export function ConfirmDeleteModal({ title, message, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-border p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
        </div>

        <h3 className="text-xl font-bold text-slate-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-8">{message}</p>

        <div className="flex gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel} 
            disabled={loading}
            className="flex-1 rounded-xl py-5"
          >
            Batal
          </Button>
          <Button 
            type="button"
            onClick={handleConfirm} 
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-5"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </div>
      </div>
    </div>
  );
}
