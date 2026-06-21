"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Tv, Settings, ArrowRight } from "lucide-react";

import { Suspense } from "react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const masjidId = searchParams.get("masjidId");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center border border-border">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Pendaftaran Berhasil!
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Terima kasih telah bergabung dengan InfoMasjid. Akun Anda sedang diproses dan siap digunakan dalam beberapa saat.
        </p>

        <div className="bg-primary/5 rounded-xl p-6 text-left mb-10 border border-primary/10">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Tv className="text-primary w-5 h-5" />
            Langkah Pemasangan TV Masjid
          </h2>
          <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
            <li className="pl-2">
              <span className="font-semibold text-foreground">Siapkan Smart TV atau Android TV Box.</span> Pastikan perangkat terhubung ke koneksi internet (Wi-Fi).
            </li>
            <li className="pl-2">
              <span className="font-semibold text-foreground">Buka Browser Web</span> (misalnya Google Chrome atau browser bawaan TV) di perangkat TV Anda.
            </li>
            <li className="pl-2">
              <span className="font-semibold text-foreground">Ketik alamat URL ini di layar TV Anda:</span>
              <div className="bg-background border border-border px-4 py-3 rounded-lg mt-2 font-mono text-primary text-center break-all select-all">
                https://infomasjid.cloud/{masjidId || "id-masjid-anda"}
              </div>
            </li>
            <li className="pl-2">
              <span className="font-semibold text-foreground">Tekan F11 atau tombol Fullscreen</span> pada remote untuk membuat tampilan menjadi layar penuh (menghilangkan bar alamat browser).
            </li>
          </ol>
        </div>

        <button 
          onClick={() => router.push(`/${masjidId}/admin`)}
          className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 w-full md:w-auto mx-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Masuk ke Dasbor Admin Masjid
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
