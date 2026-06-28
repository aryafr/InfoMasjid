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
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm">A</span>
                Cara Khusus Android TV / STB (Paling Disarankan)
              </h3>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
                <p className="font-bold mb-2">Gunakan aplikasi "Fully Kiosk Browser" 🔥</p>
                <ol className="list-decimal list-outside pl-4 space-y-2">
                  <li>Instal aplikasi bernama <strong>Fully Kiosk Browser</strong> dari Google Play Store TV (atau sideload APK). Aplikasi ini dirancang khusus untuk layar informasi.</li>
                  <li>Masukkan URL InfoMasjid di bawah ini ke dalam pengaturannya sebagai <em>Start URL</em>.</li>
                  <li>Aktifkan pengaturan <strong>Auto-Start on Boot</strong> di dalam aplikasi tersebut.</li>
                  <li className="font-semibold text-primary">Hasilnya: Begitu marbot menyalakan TV, layar akan langsung otomatis membuka InfoMasjid Full Screen tanpa perlu disentuh sama sekali!</li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm">B</span>
                Cara Manual (Smart TV Biasa / Laptop)
              </h3>
              <ol className="space-y-3 text-muted-foreground list-decimal list-inside text-sm">
                <li className="pl-2">Buka Google Chrome atau browser bawaan TV Anda.</li>
                <li className="pl-2">Ketik alamat URL di bawah ini pada bar pencarian browser.</li>
                <li className="pl-2">Gunakan remote atau tekan <strong>F11</strong> di keyboard untuk masuk ke mode Layar Penuh (Fullscreen) agar alamat web hilang.</li>
              </ol>
            </div>
            
            <div className="pt-2 border-t border-border/50">
              <p className="font-semibold text-foreground mb-3 text-sm text-center">URL TV InfoMasjid Anda:</p>
              <div className="bg-background border-2 border-primary/30 px-4 py-4 rounded-xl font-mono text-primary text-center break-all select-all font-bold text-xl shadow-inner">
                https://infomasjid.cloud/{masjidId || "id-masjid-anda"}
              </div>
            </div>
          </div>
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
