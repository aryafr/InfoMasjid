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
  Wallet,
  Camera,
  MessageCircle
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import StaticTVPreview from "@/components/StaticTVPreview";
import { useRouter } from "next/navigation";
import { subscribeToGlobalPricing } from "@/lib/firestoreService";

export default function LandingPage() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pricing, setPricing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribeToGlobalPricing(setPricing);
    return () => unsub();
  }, []);

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
        <div className="container mx-auto px-6 h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center shrink-0">
              <Image src="/icon.png" alt="Logo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight">InfoMasjid</span>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#harga" className="hover:text-foreground transition-colors">Harga</a>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <Link href="/login" className="flex text-sm font-bold hover:text-primary transition-colors">Masuk</Link>
            <button 
              onClick={() => router.push("/#harga")}
              className="bg-primary text-primary-foreground font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Daftar <span className="hidden md:inline">Sekarang</span>
            </button>
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
                  <StaticTVPreview />
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

          {/* Social Proof Marquee */}
          <div className="mt-16 overflow-hidden relative w-full opacity-80 animate-fade-in" style={{ animationDelay: '700ms' }}>
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
            <div className="flex animate-marquee whitespace-nowrap items-center gap-16 py-4">
              <span className="text-xl font-semibold text-muted-foreground">🌟 Dipercaya oleh lebih dari <span className="text-foreground font-black">50+ Masjid</span> di Seluruh Indonesia</span>
              <span className="text-xl font-semibold text-muted-foreground">🌟 Dipercaya oleh lebih dari <span className="text-foreground font-black">50+ Masjid</span> di Seluruh Indonesia</span>
              <span className="text-xl font-semibold text-muted-foreground">🌟 Dipercaya oleh lebih dari <span className="text-foreground font-black">50+ Masjid</span> di Seluruh Indonesia</span>
              <span className="text-xl font-semibold text-muted-foreground">🌟 Dipercaya oleh lebih dari <span className="text-foreground font-black">50+ Masjid</span> di Seluruh Indonesia</span>
              <span className="text-xl font-semibold text-muted-foreground">🌟 Dipercaya oleh lebih dari <span className="text-foreground font-black">50+ Masjid</span> di Seluruh Indonesia</span>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION (BENTO BOX STYLE) */}
        <section id="fitur" className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold mb-4 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Fitur Premium
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Kendalikan Sepenuhnya dari Admin Panel</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Dirancang layaknya sistem profesional dengan antarmuka yang sangat mudah dipahami oleh siapa saja.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
            
            {/* 1. Pengaturan Tampilan & Tema (Spans 2 columns on lg) */}
            <div className="lg:col-span-2 bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 pb-0 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Pengaturan Tampilan Visual</h3>
                <p className="text-muted-foreground">Ubah tema layar, atur durasi rotasi slide, tambahkan poster kegiatan, dan jalankan running text dari satu tempat.</p>
              </div>
              <div className="mt-8 flex-1 bg-card rounded-t-2xl border-x border-t border-border/50 shadow-2xl relative translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-4">
                <div className="flex gap-4 mb-4 border-b border-border pb-2">
                  <div className="text-xs font-bold text-primary flex items-center gap-1"><Monitor className="w-3.5 h-3.5"/> Tampilan TV</div>
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1 opacity-50"><Smartphone className="w-3.5 h-3.5"/> Ponsel</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tema Warna</div>
                    <div className="h-10 w-full bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center px-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2 shadow-sm"></div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Emerald</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rotasi Slide</div>
                    <div className="h-10 w-full bg-input/50 border border-border/50 rounded-lg flex items-center px-3">
                       <RefreshCw className="w-3.5 h-3.5 text-muted-foreground mr-2"/>
                       <span className="text-xs font-mono font-bold">12 Detik</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-24 w-full bg-gradient-to-br from-primary/10 to-primary/5 border border-dashed border-primary/40 rounded-xl flex flex-col items-center justify-center text-primary transition-all hover:bg-primary/20 cursor-pointer">
                  <Camera className="w-6 h-6 mb-1 opacity-80" />
                  <span className="text-sm font-bold opacity-90">Upload Poster Slide</span>
                </div>
              </div>
            </div>

            {/* 2. Jadwal Sholat */}
            <div className="bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 pb-0 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Sync Jadwal Otomatis</h3>
                <p className="text-muted-foreground">Otomatis sinkron dengan API Global sesuai nama kota atau atur manual.</p>
              </div>
              <div className="mt-8 flex-1 bg-card rounded-t-2xl border-x border-t border-border/50 shadow-2xl relative translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-5 flex flex-col gap-3">
                {['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'].map((time, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-card border border-border/50 shadow-sm relative overflow-hidden group-hover:border-primary/30 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40"></div>
                    <span className="text-sm font-bold text-foreground/80 pl-2">{time}</span>
                    <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{`04:${10 + i * 3}`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Laporan Keuangan */}
            <div className="bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 pb-0 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Laporan Kas Digital</h3>
                <p className="text-muted-foreground">Catat pemasukan & pengeluaran. Saldo otomatis terhitung transparan.</p>
              </div>
              <div className="mt-8 flex-1 bg-card rounded-t-2xl border-x border-t border-border/50 shadow-2xl relative translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-4">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2"><Wallet className="w-5 h-5 text-emerald-500"/><span className="font-bold text-sm">Saldo Total</span></div>
                  <div className="font-mono font-black text-lg tracking-tight">Rp 12.500.000</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-border/50">
                    <div className="flex flex-col"><span className="text-sm font-bold text-foreground">Infaq Jumat</span><span className="text-[10px] text-muted-foreground uppercase font-bold">12 Okt 2026</span></div>
                    <div className="text-emerald-500 text-sm font-black bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">+ Rp 500.000</div>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <div className="flex flex-col"><span className="text-sm font-bold text-foreground">Operasional Listrik</span><span className="text-[10px] text-muted-foreground uppercase font-bold">14 Okt 2026</span></div>
                    <div className="text-red-500 text-sm font-black bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">- Rp 150.000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Pengumuman Masjid (Spans 2 columns on lg) */}
            <div className="lg:col-span-2 bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 pb-0 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Pengumuman & Kajian</h3>
                <p className="text-muted-foreground">Buat pengumuman kajian atau kegiatan lainnya dengan mudah. Layar akan otomatis menampilkannya berurutan sesuai tanggal.</p>
              </div>
              <div className="mt-8 flex-1 bg-card rounded-t-2xl border-x border-t border-border/50 shadow-2xl relative translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-5 flex gap-4">
                <div className="flex-1 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-4 shadow-sm relative overflow-hidden group-hover:border-primary/40 transition-colors">
                  <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">Kajian Rutin</div>
                  <h4 className="text-sm font-bold text-foreground mb-1 mt-2">Kajian Fiqih Muamalah</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">Bersama Ustadz Dr. Ahmad, membahas kitab Bulughul Maram bab Muamalah.</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                    <Clock className="w-3 h-3" /> Ba'da Maghrib
                  </div>
                </div>
                <div className="flex-1 bg-card border border-border/50 rounded-xl p-4 opacity-50 scale-95 origin-left">
                  <div className="h-3 w-20 bg-muted rounded-full mb-3"></div>
                  <div className="h-2 w-full bg-muted/50 rounded-full mb-2"></div>
                  <div className="h-2 w-4/5 bg-muted/50 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 5. Jadwal Jumat */}
            <div className="bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 pb-0 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Jadwal Jumat</h3>
                <p className="text-muted-foreground">Atur Khatib, Imam, Muadzin & Bilal dengan rapi.</p>
              </div>
              <div className="mt-8 flex-1 bg-card rounded-t-2xl border-x border-t border-border/50 shadow-2xl relative translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-b from-card to-muted/20 p-4 rounded-xl border border-border/50 shadow-sm relative overflow-hidden group-hover:border-primary/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                       <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Khatib</div>
                    <div className="text-sm font-bold text-foreground">Ust. Abdul Somad</div>
                  </div>
                  <div className="bg-gradient-to-b from-card to-muted/20 p-4 rounded-xl border border-border/50 shadow-sm relative overflow-hidden group-hover:border-primary/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                       <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Imam</div>
                    <div className="text-sm font-bold text-foreground">Syekh Ali Jaber</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. QRIS Infaq */}
            <div className="bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">QRIS & Rekening</h3>
                <p className="text-muted-foreground">Tampilkan barcode QRIS dan rekening untuk jamaah.</p>
              </div>
              <div className="mt-6 flex flex-1 items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-xl shadow-primary/10 relative translate-y-2 group-hover:translate-y-0 group-hover:scale-105 transition-all duration-500 border border-border">
                  <div className="w-full h-full border-4 border-black rounded-xl relative flex items-center justify-center">
                    <div className="absolute top-2 left-2 w-6 h-6 border-2 border-black"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 border-2 border-black"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 border-2 border-black"></div>
                    <div className="w-8 h-8 bg-primary rounded-md shadow-inner flex items-center justify-center">
                       <Wallet className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Sholat Ied (Fitri & Adha) */}
            <div className="bg-card/20 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-8 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Sholat Ied</h3>
                <p className="text-muted-foreground">Atur jadwal, Imam, dan Khatib untuk Idul Fitri & Idul Adha.</p>
              </div>
              <div className="mt-8 flex-1 bg-card rounded-t-2xl border-x border-t border-border/50 shadow-2xl relative translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-5">
                <div className="space-y-3">
                  <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm flex items-center gap-4 group-hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black text-sm">IF</div>
                    <div>
                      <div className="text-sm font-bold text-foreground mb-0.5">Idul Fitri 1447 H</div>
                      <div className="text-xs text-muted-foreground">Khatib: Ust. Hanan Attaki</div>
                    </div>
                  </div>
                  <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm flex items-center gap-4 group-hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-sm">IA</div>
                    <div>
                      <div className="text-sm font-bold text-foreground mb-0.5">Idul Adha 1447 H</div>
                      <div className="text-xs text-muted-foreground">Khatib: Ust. Adi Hidayat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                {pricing?.is_discount_active ? (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-extrabold tracking-tight">Rp {Math.ceil(pricing.berkah.discounted_price / 12 / 1000)}rb</span>
                      <span className="text-muted-foreground font-medium mb-1">/ bulan</span>
                    </div>
                    <div className="text-sm font-medium mt-2 flex items-center gap-2">
                      <span className="text-muted-foreground line-through">Rp {pricing.berkah.original_price.toLocaleString('id-ID')}</span>
                      <span className="text-primary font-bold">Ditagih Rp {pricing.berkah.discounted_price.toLocaleString('id-ID')} / tahun</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-extrabold tracking-tight">Rp {pricing?.berkah?.original_price ? Math.ceil(pricing.berkah.original_price / 12 / 1000) : 21}rb</span>
                      <span className="text-muted-foreground font-medium mb-1">/ bulan</span>
                    </div>
                    <div className="text-sm text-primary font-medium mt-2">
                      Ditagih Rp {(pricing?.berkah?.original_price || 250000).toLocaleString('id-ID')} / tahun
                    </div>
                  </>
                )}
              </div>
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {[
                  "Tampilan Jadwal Sholat Pintar",
                  "Teks Pengumuman Berjalan",
                  "Informasi Khotib Jumat",
                  "Dasbor Admin Web Terpusat",
                  "Sinkronisasi Cloud Real-time",
                  "Tema Gelap & Terang"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => router.push("/checkout?pkg=berkah")}
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
                {pricing?.is_discount_active ? (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-extrabold tracking-tight text-foreground">Rp {Math.ceil(pricing.premium.discounted_price / 12 / 1000)}rb</span>
                      <span className="text-foreground/70 font-medium mb-1">/ bulan</span>
                    </div>
                    <div className="text-sm font-medium mt-2 flex items-center gap-2">
                      <span className="text-foreground/60 line-through">Rp {pricing.premium.original_price.toLocaleString('id-ID')}</span>
                      <span className="text-primary font-bold">Ditagih Rp {pricing.premium.discounted_price.toLocaleString('id-ID')} / tahun</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-extrabold tracking-tight text-foreground">Rp {pricing?.premium?.original_price ? Math.ceil(pricing.premium.original_price / 12 / 1000) : 46}rb</span>
                      <span className="text-foreground/70 font-medium mb-1">/ bulan</span>
                    </div>
                    <div className="text-sm text-primary font-bold mt-2">
                      Ditagih Rp {(pricing?.premium?.original_price || 550000).toLocaleString('id-ID')} / tahun
                    </div>
                  </>
                )}
              </div>
              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {[
                  "Semua fitur Paket Berkah",
                  "Upload Slide Gambar/Poster",
                  "Tabel Laporan Keuangan",
                  "Tampilan QRIS Donasi Digital",
                  "Hitung Mundur Hari Raya",
                  "Custom Logo & Identitas Masjid"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => router.push("/checkout?pkg=premium")}
                className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-colors shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Langganan via Midtrans
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Suara dari DKM</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Alhamdulillah, InfoMasjid telah membantu banyak pengurus masjid menjadi lebih modern dan transparan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { text: "Sangat membantu transparansi dana jamaah. Layar TV terlihat elegan dan jamaah lebih percaya dengan laporan kas real-time.", author: "H. Abdullah", role: "Ketua DKM Masjid Raya" },
              { text: "Dulu repot ubah jadwal jumat manual setiap minggu, sekarang cukup dari HP langsung tersinkron ke TV. Sangat praktis!", author: "Ust. Furqon", role: "Takmir Masjid Al-Ikhlas" },
              { text: "Jamaah senang dengan desain layarnya. Sangat premium dan mewah, padahal biaya langganannya cuma seharga dua porsi bakso.", author: "Bpk. Rahmat", role: "Bendahara Masjid" }
            ].map((t, i) => (
              <div key={i} className="bg-card/40 backdrop-blur-sm border border-border/60 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl hover:shadow-primary/5">
                <div className="mb-6 relative">
                  <div className="text-5xl text-primary/20 font-serif absolute -top-4 -left-2">"</div>
                  <p className="text-foreground/80 italic relative z-10 pl-6">{t.text}</p>
                </div>
                <div className="flex items-center gap-3 border-t border-border/50 pt-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{t.author[0]}</div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground font-medium">
            <p>© {new Date().getFullYear()} InfoMasjid. Karya Anak Bangsa.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <Camera className="w-5 h-5" />
            </a>
            <a href="https://wa.me/6282220788248" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
