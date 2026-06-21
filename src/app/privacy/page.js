import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        
        <h1 className="text-4xl font-black mb-6">Kebijakan Privasi</h1>
        <p className="text-muted-foreground mb-8">Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID')}</p>

        <div className="prose prose-emerald dark:prose-invert max-w-none">
          <h3>1. Pengumpulan Data</h3>
          <p>Kami hanya mengumpulkan data yang relevan dengan operasional masjid, termasuk nama, email pengelola, dan data masjid yang ditampilkan di publik.</p>
          
          <h3>2. Penggunaan Data</h3>
          <p>Data yang dikumpulkan digunakan semata-mata untuk mengoperasikan layanan InfoMasjid TV, komunikasi terkait akun, dan penagihan.</p>
          
          <h3>3. Perlindungan Data</h3>
          <p>Kami menerapkan standar keamanan industri menggunakan infrastruktur Firebase dan Vercel untuk melindungi informasi Anda dari akses tidak sah.</p>
          
          <h3>4. Berbagi Data</h3>
          <p>Kami tidak akan pernah menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga manapun.</p>
        </div>
      </div>
    </div>
  );
}
