import { Search, Home } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute -top-4 -right-4 bg-background px-3 py-1 rounded-full border border-border/50 text-xl font-black text-primary shadow-sm">
          404
        </div>
        <Search className="w-16 h-16 text-primary" />
      </div>
      
      <h1 className="text-4xl font-black mb-4 text-center">Halaman Tidak Ditemukan</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Halaman atau rute yang Anda cari tidak tersedia. Mungkin sudah dipindahkan atau dihapus.
      </p>

      <Link 
        href="/"
        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
      >
        <Home className="w-5 h-5" />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
