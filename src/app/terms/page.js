import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        
        <h1 className="text-4xl font-black mb-6">Syarat & Ketentuan Layanan</h1>
        <p className="text-muted-foreground mb-8">Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID')}</p>

        <div className="prose prose-emerald dark:prose-invert max-w-none">
          <h3>1. Penerimaan Syarat</h3>
          <p>Dengan mengakses dan menggunakan InfoMasjid TV, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan ini.</p>
          
          <h3>2. Deskripsi Layanan</h3>
          <p>InfoMasjid TV menyediakan layanan Smart Signage berbasis web untuk menampilkan jadwal sholat, pengumuman, keuangan, dan konten digital lainnya di layar TV masjid.</p>
          
          <h3>3. Kewajiban Pengguna</h3>
          <p>Pengguna bertanggung jawab atas konten yang diunggah ke dalam sistem. Kami tidak mentolerir konten yang melanggar hukum, SARA, atau norma kesusilaan.</p>
          
          <h3>4. Pembayaran & Berlangganan</h3>
          <p>Biaya layanan dibayarkan per tahun melalui gateway pembayaran resmi. Layanan akan dihentikan otomatis jika masa berlangganan berakhir dan tidak diperpanjang.</p>
        </div>
      </div>
    </div>
  );
}
