"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-8">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      
      <h1 className="text-4xl font-black mb-4 text-center">Terjadi Kesalahan</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Maaf, sistem mengalami gangguan tidak terduga saat memuat halaman ini.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
          Coba Lagi
        </button>
        
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all"
        >
          <Home className="w-5 h-5" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
