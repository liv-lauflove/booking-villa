"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.push(`/villas?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-card p-3 rounded-2xl shadow-xl border border-border flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari berdasarkan nama atau deskripsi villa..." 
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-foreground"
        />
      </div>
      <Button type="submit" className="py-4 h-auto px-10 rounded-xl bg-secondary text-secondary-foreground text-lg hover:bg-secondary/90 hover:scale-105 transition-all shadow-md font-semibold">
        Cari Villa
      </Button>
    </form>
  );
}
