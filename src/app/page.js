"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Monitor, 
  LayoutDashboard, 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  Smartphone, 
  ShieldCheck,
  ChevronRight,
  Play,
  Wallet
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const MockTVSlider = () => {
  const [slideIdx, setSlideIdx] = useState(0);
  const slides = [
    { title: "Selamat Datang di InfoMasjid", desc: "Sistem Manajemen Digital Modern untuk Masjid Anda." },
    { title: "Kajian Rutin Ba'da Maghrib", desc: "Bersama Ustadz Abdul Somad. Tema: Fiqih Ibadah." },
    { title: "Laporan Keuangan Bulan Ini", desc: "Saldo Kas Masjid: Rp 15.450.000" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full h-full bg-zinc-900 text-white flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-12 py-8 bg-zinc-950/80 shadow-md border-b border-white/10">
         <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center p-3 shrink-0">
             <img src="/icon.png" className="w-full h-full object-contain" alt="logo" />
           </div>
           <div>
             <h1 className="text-4xl font-black tracking-tight text-white">Masjid Da'watul Islam</h1>
             <p className="text-xl text-zinc-400 font-medium mt-1">Balikpapan, Indonesia</p>
           </div>
         </div>
         <div className="flex gap-10 items-center">
           <div className="text-right">
             <p className="text-xl font-bold tracking-widest text-emerald-500 mb-1">DZUHUR</p>
             <p className="text-4xl font-black text-white">12:15</p>
           </div>
           <div className="h-16 w-1 bg-white/20"></div>
           <div className="text-right">
             <p className="text-6xl font-black text-white">10:45</p>
           </div>
         </div>
      </div>
      
      {/* Body / Slider */}
      <div className="flex-1 flex items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-zinc-900">
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform">
           <div key={slideIdx} className="text-center p-16 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl max-w-5xl w-full mx-12 animate-fade-in">
             <h2 className="text-6xl font-black text-white mb-8 leading-tight">{slides[slideIdx].title}</h2>
             <p className="text-4xl text-emerald-400 font-medium leading-relaxed">{slides[slideIdx].desc}</p>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-emerald-950 text-emerald-400 py-6 overflow-hidden flex items-center border-t border-emerald-900/50">
        <div className="text-3xl font-semibold tracking-wide px-12 truncate w-full">
          PENGUMUMAN: Harap menonaktifkan telepon genggam selama khutbah berlangsung... Kajian rutin dilaksanakan setiap hari Ahad...
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // The original TV layout is exactly 1920x1080
        const containerWidth = entry.contentRect.width;
        setScale(containerWidth / 1920);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-primary/30">
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center shrink-0">
              <Image src="/icon.png" alt="Logo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight">InfoMasjid</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
              <a href="#harga" className="hover:text-foreground transition-colors">Harga</a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/demo-masjid/admin" className="hidden md:flex items-center justify-center px-5 py-2.5 text-sm font-bold bg-muted hover:bg-muted/80 text-foreground rounded-full transition-all">
                Login Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 py-16 md:py-24 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold mb-8 animate-fade-in">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Sistem Cloud TV Masjid Modern #1
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in" style={{ animationDelay: '100ms' }}>
            Digitalisasi Layar Masjid Anda. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Lebih Mewah, Tanpa Ribet.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Tinggalkan TV masjid model lama yang kaku dan rawan <strong>error</strong>. Beralih ke platform <strong>Cloud</strong> pintar dengan antarmuka <strong>Glassmorphism</strong> kelas dunia, jadwal sholat otomatis, dan manajemen kas terintegrasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link 
              href="/demo-masjid" 
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-all"
            >
              <Play className="h-5 w-5 fill-current" />
              Lihat Live Demo TV
            </Link>
            <Link 
              href="/demo-masjid/admin" 
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-card/40 backdrop-blur-md border border-border/60 hover:bg-card/60 text-foreground font-bold px-8 py-4 rounded-full text-lg transition-all shadow-sm"
            >
              <LayoutDashboard className="h-5 w-5" />
              Coba Dasbor Admin
            </Link>
          </div>

          {/* Hero Preview Image (TV Mockup) */}
          <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in" style={{ animationDelay: '500ms' }}>
            {/* TV Screen Frame */}
            <div 
              className="bg-black border-[12px] md:border-[20px] border-zinc-900 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative flex items-start justify-start w-full"
            >
              {/* TV Screen Surface (where the iframe sits) */}
              <div ref={containerRef} className="w-full aspect-video relative bg-zinc-950 overflow-hidden flex items-start justify-start">
                <div 
                  style={{ 
                    width: '1920px', 
                    height: '1080px',
                    transform: `scale(${scale})`,
                    transformOrigin: '0 0',
                    flexShrink: 0
                  }}
                >
                  <MockTVSlider />
                </div>
              </div>

              {/* Power LED Indicator on TV */}
              <div className="absolute bottom-[-16px] md:bottom-[-20px] left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-800 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              </div>
            </div>

            {/* TV Stand / Base */}
            <div className="relative mx-auto w-32 md:w-64 h-8 md:h-12 bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-b-xl flex flex-col items-center">
              <div className="w-full h-2 bg-zinc-700"></div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="fitur" className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Dirancang Untuk Kemudahan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Kami mengerti pengurus masjid butuh sistem yang praktis. Tidak perlu teknisi IT untuk menjalankannya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Jadwal Sholat Otomatis",
                desc: "Terhubung langsung dengan API kemenag/global. Jam sholat menyesuaikan lokasi masjid secara otomatis tanpa di-setting.",
                icon: Clock
              },
              {
                title: "Admin Berbasis Cloud",
                desc: "Ubah pengumuman, laporan kas, atau jadwal khatib dari HP atau laptop Anda kapan pun dan di mana pun.",
                icon: Smartphone
              },
              {
                title: "Real-time Sync",
                desc: "Selesai mengetik pengumuman di HP, detik itu juga layar TV di masjid langsung berubah tanpa perlu di-refresh.",
                icon: RefreshCw
              },
              {
                title: "Desain Premium",
                desc: "Tampilan Glassmorphism transparan layaknya aplikasi MacOS. Membuat jamaah betah membaca informasi masjid.",
                icon: Monitor
              },
              {
                title: "Laporan Kas Digital",
                desc: "Tampilkan tabel neraca keuangan secara transparan dan berkelas kepada jamaah secara otomatis berotasi.",
                icon: Wallet
              },
              {
                title: "Aman Terenkripsi",
                desc: "Database masing-masing masjid dikunci menggunakan aturan keamanan Google Firebase yang ketat.",
                icon: ShieldCheck
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-card/20 backdrop-blur-3xl border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:shadow-emerald-500/10 transition-all hover:-translate-y-1">
                <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="harga" className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Investasi Akhirat yang Ringan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Kami menggunakan skema bisnis berlangganan terjangkau agar masjid tidak perlu mengeluarkan dana jutaan rupiah di awal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Package */}
            <div className="bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-10 flex flex-col relative overflow-hidden shadow-lg">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Paket Berkah</h3>
                <p className="text-muted-foreground">Untuk masjid skala kecil & menengah</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">Rp 25rb</span>
                  <span className="text-muted-foreground font-medium mb-1">/ bulan</span>
                </div>
                <div className="text-sm text-primary font-medium mt-2">Ditagih Rp 250.000 / tahun</div>
              </div>
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {[
                  "Tampilan Layar TV Pintar",
                  "Jadwal Sholat Otomatis",
                  "Teks Berjalan (Running Text)",
                  "Dasbor Admin Web",
                  "Tanpa Biaya Server Tambahan"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => alert("Sistem Payment Gateway Midtrans akan segera diintegrasikan disini.")}
                className="w-full py-4 rounded-full bg-card/50 border border-border/80 font-bold hover:bg-card transition-colors text-foreground flex items-center justify-center gap-2 group cursor-pointer"
              >
                Langganan Sekarang
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Premium Package */}
            <div className="bg-gradient-to-br from-primary/20 via-card/20 to-secondary/20 backdrop-blur-3xl border-2 border-primary/40 rounded-[3rem] p-10 flex flex-col relative overflow-hidden shadow-2xl shadow-primary/20 transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                PALING LAKU
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Paket Premium</h3>
                <p className="text-foreground/70">Solusi lengkap untuk masjid raya</p>
              </div>
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">Rp 55rb</span>
                  <span className="text-foreground/70 font-medium mb-1">/ bulan</span>
                </div>
                <div className="text-sm text-primary font-bold mt-2">Ditagih Rp 550.000 / tahun</div>
              </div>
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {[
                  "Semua fitur Paket Berkah",
                  "Slide Gambar & Pengumuman",
                  "Modul Laporan Keuangan",
                  "Custom Logo Masjid",
                  "Prioritas Support WhatsApp"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => alert("Sistem Payment Gateway Midtrans akan segera diintegrasikan disini.")}
                className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-colors shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Langganan via Midtrans
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-card/10 backdrop-blur-lg relative z-10">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              <Image src="/icon.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight">InfoMasjid</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            © {new Date().getFullYear()} InfoMasjid. Karya Anak Bangsa.
          </p>
          <div className="flex gap-4">
            {/* Social icons placeholders */}
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              IG
            </div>
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              WA
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
