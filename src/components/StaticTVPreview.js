"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Clock, 
  Calendar, 
  Volume2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  MapPin, 
  Info, 
  CalendarDays,
  User,
  HeartHandshake,
  MoonStar,
  Megaphone
} from "lucide-react";

export default function StaticTVPreview() {
  // Static Mock Data
  const settings = {
    nama_aplikasi: "Masjid Da'watul Islam",
    auto_update: { city: "Balikpapan" },
    tema: "theme-emerald",
    rotation_interval: 5,
    rotation_enabled: true,
    running_text: "Harap menonaktifkan telepon genggam selama khutbah berlangsung... Kajian rutin dilaksanakan setiap hari Ahad ba'da Maghrib...",
    rotation_pages: [
      { url: "welcome", active: true },
      { url: "utama", active: true },
      { url: "pengumuman", active: true },
      { url: "qris", active: true },
      { url: "keuangan", active: true },
      { url: "idul-fitri", active: true }
    ],
    posters: []
  };

  const jadwal = {
    Subuh: "04:50",
    Dzuhur: "12:15",
    Ashar: "15:30",
    Maghrib: "18:20",
    Isya: "19:35"
  };

  const sholatJumat = {
    tanggal: "Jumat, 25 Jun 2026",
    khatib: "Ustadz H. Abdul Somad",
    imam: "KH. Zainuddin",
    muadzin: "Ust. Fulan"
  };

  const idulFitri = {
    tahun: "1447 H",
    tanggal: "Ahad, 14 Februari 2027",
    waktu: "07:00",
    khatib: "Ustadz Adi Hidayat",
    imam: "Syeikh Ali Jaber",
    keterangan: "1 Syawal 1447 H"
  };

  const qris = {
    atas_nama: "Masjid Da'watul Islam",
    nomor_rekening: "0123456789",
    bank: "BSI (Bank Syariah Indonesia)",
    keterangan: "Gunakan GoPay, OVO, Dana, LinkAja, atau Mobile Banking untuk memindai."
  };

  const pengumuman = [
    { id: 1, tanggal: "2026-06-25", isi: "Kajian rutin bulanan membahas Kitab Fiqih Sunnah." },
    { id: 2, tanggal: "2026-06-26", isi: "Kerja bakti membersihkan lingkungan masjid ba'da subuh." },
    { id: 3, tanggal: "2026-06-27", isi: "Penerimaan Zakat, Infaq, dan Shadaqah telah dibuka." }
  ];

  const keuangan = [
    { id: 1, tanggal: "21-06", deskripsi: "Kotak Amal Jumat", pemasukan: 1500000, pengeluaran: 0 },
    { id: 2, tanggal: "22-06", deskripsi: "Biaya Listrik PLN", pemasukan: 0, pengeluaran: 450000 },
    { id: 3, tanggal: "23-06", deskripsi: "Infak Hamba Allah", pemasukan: 500000, pengeluaran: 0 },
    { id: 4, tanggal: "24-06", deskripsi: "Operasional Kebersihan", pemasukan: 0, pengeluaran: 150000 }
  ];

  const totalPemasukan = 12500000;
  const totalPengeluaran = 4500000;
  const saldo = 8000000;

  // UI States
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [time, setTime] = useState("10:45:00");
  const [dateStr, setDateStr] = useState("Ahad, 21 Juni 2026");
  const [hijriDateStr, setHijriDateStr] = useState("6 Dzulhijjah 1447 H");
  const [countdown, setCountdown] = useState(settings.rotation_interval);
  
  const nextPrayer = { name: "Dzuhur", time: "12:15", minutesLeft: 90, secondsLeft: 5400 };
  const activeSlides = settings.rotation_pages.filter(p => p.active);

  // Time simulator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Slide Rotation Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentSlideIndex((curr) => (curr + 1) % activeSlides.length);
          return settings.rotation_interval;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const currentSlide = activeSlides[currentSlideIndex] || { url: "welcome" };

  return (
    <div className={`relative flex flex-col flex-1 w-full h-full bg-background text-foreground p-6 overflow-hidden font-sans ${settings.tema}`}>
      
      {/* Premium Luxury Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-accent/20 rounded-[100%] blur-[140px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '1s' }}></div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
        <span className="font-serif text-[45rem] text-foreground">بسم الله</span>
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-10 flex items-center justify-between border-b-2 border-border/60 pb-6 mb-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="h-28 w-28 flex items-center justify-center shrink-0 drop-shadow-xl bg-white/10 rounded-3xl p-3">
            <Image src="/icon.png" alt="Logo InfoMasjid" width={112} height={112} className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight text-foreground drop-shadow-sm">
              {settings.nama_aplikasi}
            </h1>
            <p className="text-foreground/70 font-bold flex items-center gap-2 text-2xl mt-2 uppercase tracking-widest">
              <MapPin className="h-7 w-7" /> {settings.auto_update.city}, Indonesia
            </p>
          </div>
        </div>

        {/* Global Countdown & Time */}
        <div className="flex items-center gap-4">
          {/* Next Prayer Countdown Widget */}
          <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/80 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-6 shadow-primary/5 mr-2 relative shrink-0 overflow-hidden">
            <div className="absolute left-0 inset-y-0 w-2 bg-gradient-to-b from-primary via-secondary to-primary"></div>
            <div className="flex flex-col items-end justify-center">
              <span className="text-sm font-black text-primary tracking-widest uppercase mb-1 whitespace-nowrap">
                Jadwal Berikutnya
              </span>
              <span className="text-3xl font-black text-foreground uppercase drop-shadow-sm leading-none whitespace-nowrap">
                {nextPrayer.name}
              </span>
            </div>
            <div className="h-16 w-1 bg-border/50 rounded-full mx-2"></div>
            <div className="flex items-center gap-4">
              <span className={`text-5xl font-mono font-black tabular-nums tracking-tighter drop-shadow-md transition-all duration-500 text-primary`}>
                {nextPrayer.time}
              </span>
              <div className="px-5 py-2 rounded-full text-base font-black tracking-widest uppercase shadow-inner whitespace-nowrap flex items-center justify-center transition-all duration-300 bg-muted/80 text-foreground border-2 border-border">
                {nextPrayer.minutesLeft > 60 
                  ? `${Math.floor(nextPrayer.minutesLeft / 60)}J ${nextPrayer.minutesLeft % 60}M`
                  : `${nextPrayer.minutesLeft} MNT`
                }
              </div>
            </div>
          </div>

          <div className="text-right mr-2">
            <div className="text-xl font-black text-foreground tracking-widest uppercase flex items-center justify-end gap-2 drop-shadow-sm">
              <Calendar className="h-6 w-6 text-primary" /> {dateStr}
            </div>
            {hijriDateStr && (
              <div className="text-sm font-bold text-foreground/70 tracking-widest uppercase mt-1 drop-shadow-sm">
                {hijriDateStr}
              </div>
            )}
          </div>
          
          <div className="bg-card/30 backdrop-blur-3xl border-4 border-border/80 px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-6 shadow-primary/10">
            <Clock className="h-12 w-12 text-primary animate-pulse" />
            <span className="text-7xl font-mono font-black tracking-tighter tabular-nums text-foreground drop-shadow-lg">
              {time}
            </span>
          </div>
        </div>
      </header>

      {/* DYNAMIC CONTENT CONTAINER */}
      <main className="relative z-10 flex-1 flex items-stretch min-h-0 w-full">
        <div className="w-full flex flex-col items-stretch justify-center relative min-h-0 h-full">

          {/* Slide 1: Welcome/Dashboard */}
          {currentSlide.url === "welcome" && (
            <div className="animate-fade-in flex flex-col gap-6 w-full h-full justify-between">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-card/20 backdrop-blur-3xl rounded-[2rem] p-6 border-2 border-border/60 flex flex-col justify-between shadow-xl shadow-emerald-500/30 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-primary text-2xl font-black flex items-center gap-3 mb-4 uppercase tracking-wider">
                      <Info className="h-7 w-7" /> Informasi Masjid
                    </h3>
                    <p className="text-foreground text-2xl font-semibold leading-snug font-serif italic py-2">
                      "Selamat datang di {settings.nama_aplikasi}. Mari jaga ketertiban, kebersihan, dan kekhusyukan jamaah selama berada di lingkungan masjid."
                    </p>
                  </div>
                  <div className="relative z-10 text-foreground/70 font-bold text-base mt-2 border-t-2 border-border/50 pt-3 flex items-center gap-3">
                    <Clock className="h-6 w-6"/> Layar otomatis terupdate secara realtime.
                  </div>
                </div>

                <div className="bg-card/20 backdrop-blur-3xl rounded-[2rem] p-8 border-2 border-border/60 flex flex-col justify-between items-center text-center shadow-xl shadow-emerald-500/30">
                  <span className="text-foreground/80 text-xl font-black tracking-widest uppercase">Jumat Terdekat</span>
                  <div className="my-4">
                    <p className="text-primary text-4xl font-black">{sholatJumat.khatib}</p>
                    <p className="text-lg text-foreground/70 font-bold mt-2 uppercase tracking-wide">Khatib & Imam</p>
                  </div>
                  <div className="bg-muted/80 px-6 py-3 rounded-2xl border-2 border-border text-lg text-foreground font-bold tabular-nums">
                    {sholatJumat.tanggal}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 flex-1 mt-4 min-h-0">
                <div className="bg-card/20 backdrop-blur-3xl rounded-[2rem] p-6 border-2 border-border/60 shadow-xl shadow-emerald-500/30 flex flex-col h-full overflow-hidden">
                  <h3 className="text-primary text-xl font-black flex items-center gap-3 mb-3 border-b-2 border-border/50 pb-2 uppercase tracking-wider shrink-0">
                    <Clock className="h-6 w-6" /> Waktu Sholat
                  </h3>
                  <div className="flex flex-col gap-2">
                    {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (
                      <div key={name} className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all border-2 ${nextPrayer.name === name ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary shadow-2xl shadow-primary/30 scale-[1.02]" : "bg-muted/40 border-transparent text-foreground"}`}>
                        <span className="text-xl font-bold tracking-wide uppercase">{name}</span>
                        <span className="text-3xl font-mono font-black tabular-nums tracking-tighter">{jadwal[name]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card/20 backdrop-blur-3xl rounded-[2rem] p-6 border-2 border-border/60 shadow-xl shadow-emerald-500/30 flex flex-col h-full overflow-hidden">
                  <h3 className="text-primary text-xl font-black flex items-center gap-3 mb-3 border-b-2 border-border/50 pb-2 uppercase tracking-wider shrink-0">
                    <Volume2 className="h-6 w-6" /> Pengumuman Utama
                  </h3>
                  <div className="flex flex-col gap-3 overflow-hidden flex-1 justify-start">
                    {pengumuman.slice(0, 3).map((item) => (
                      <div key={item.id} className="bg-muted/40 p-3 rounded-2xl border-l-[6px] border-primary flex items-start gap-4 shadow-sm">
                        <div className="bg-background border-2 border-border/80 h-12 w-12 flex items-center justify-center rounded-2xl text-primary shrink-0 text-base font-black font-mono shadow-sm mt-0.5">
                          {item.tanggal.substring(8,10)}
                        </div>
                        <p className="text-base text-foreground leading-snug font-semibold whitespace-pre-wrap">{item.isi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Utama (Big Prayer Cards) */}
          {currentSlide.url === "utama" && (
            <div className="animate-fade-in flex flex-col gap-10 w-full h-full justify-center">
              <div className="text-center mb-6">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Jadwal Sholat Hari Ini</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>
              <div className="grid grid-cols-5 gap-6">
                {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => {
                  const isActive = nextPrayer.name === name;
                  return (
                    <div key={name} className={`flex flex-col items-center justify-between p-6 rounded-[2rem] border-2 transition-all flex-1 ${isActive ? "bg-gradient-to-b from-primary to-primary/90 border-primary text-primary-foreground shadow-2xl shadow-primary/40 scale-105 z-10" : "bg-card/20 backdrop-blur-3xl border-border/60 text-foreground shadow-xl shadow-emerald-500/30"}`}>
                      <span className={`text-3xl font-black uppercase tracking-widest ${isActive ? "text-primary-foreground drop-shadow-md" : "text-foreground/70"}`}>{name}</span>
                      <div className={`flex justify-center items-center ${isActive ? "opacity-30" : "opacity-10"}`}>
                        <MoonStar className="h-16 w-16" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col items-center gap-4 w-full">
                        <span className="text-5xl font-mono font-black tracking-tighter tabular-nums drop-shadow-md">{jadwal[name]}</span>
                        {isActive && <span className="text-lg tracking-widest uppercase font-black text-primary-foreground bg-white/20 border-2 border-white/30 px-6 py-2 rounded-full animate-pulse mt-2 shadow-lg">Berikutnya</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Slide 3: Pengumuman (Tabel Full) */}
          {currentSlide.url === "pengumuman" && (
            <div className="animate-fade-in flex flex-col gap-8 w-full h-full justify-center max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Agenda & Pengumuman</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>
              <div className="flex flex-col gap-6 w-full mt-4">
                {pengumuman.map((item) => (
                  <div key={item.id} className="bg-card/20 backdrop-blur-3xl p-6 rounded-[2rem] border-2 border-border/60 flex items-center gap-8 shadow-xl shadow-emerald-500/30">
                    <div className="h-24 w-24 rounded-[1.5rem] bg-primary/10 border-2 border-primary/20 text-primary flex flex-col items-center justify-center font-bold tracking-tight text-center shrink-0 shadow-inner">
                      <span className="text-lg uppercase font-black opacity-80 tracking-widest">Tgl</span>
                      <span className="text-4xl font-mono font-black mt-1 leading-none flex items-center justify-center">{item.tanggal.substring(8, 10)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-3xl font-semibold leading-snug line-clamp-2">{item.isi}</p>
                      <div className="text-foreground/60 text-xl font-black mt-3 font-mono uppercase tracking-widest">Dipublikasikan pada: {item.tanggal}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 4: Keuangan (Ledger Table) */}
          {currentSlide.url === "keuangan" && (
            <div className="animate-fade-in flex flex-col gap-8 w-full h-full justify-between max-w-7xl mx-auto">
              <div className="text-center mb-2">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Rincian Keuangan Masjid</h2>
                <p className="text-2xl text-foreground/70 font-bold mt-2 tracking-wide">Laporan mutasi kas masuk dan kas keluar ter-update</p>
              </div>
              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 rounded-[2rem] overflow-hidden flex-1 flex flex-col shadow-xl shadow-emerald-500/30">
                <table className="w-full text-left border-collapse flex flex-col h-full">
                  <thead className="bg-muted/80 border-b-2 border-border/60 text-foreground font-black uppercase tracking-widest text-xl">
                    <tr className="flex w-full">
                      <th className="p-6 w-[15%]">Tanggal</th>
                      <th className="p-6 w-[45%]">Keterangan</th>
                      <th className="p-6 w-[20%] text-right">Pemasukan</th>
                      <th className="p-6 w-[20%] text-right">Pengeluaran</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col flex-1 text-2xl divide-y-2 divide-border/40">
                    {keuangan.map((item, index) => (
                      <tr key={item.id} className={`flex w-full items-center transition-colors flex-1 ${index % 2 === 1 ? 'bg-muted/30' : 'bg-transparent'}`}>
                        <td className="p-6 w-[15%] text-foreground/70 font-mono font-bold tabular-nums">{item.tanggal}</td>
                        <td className="p-6 w-[45%] font-bold text-foreground line-clamp-2 leading-snug">{item.deskripsi}</td>
                        <td className="p-6 w-[20%] text-right text-primary font-black font-mono tabular-nums tracking-tight">
                          {item.pemasukan ? `Rp ${Number(item.pemasukan).toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="p-8 w-[20%] text-right text-destructive font-black font-mono tabular-nums tracking-tight">
                          {item.pengeluaran ? `Rp ${Number(item.pengeluaran).toLocaleString("id-ID")}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl px-8 py-6 flex flex-col items-start justify-center gap-2 shadow-lg">
                  <span className="text-lg text-primary font-black uppercase tracking-widest">Total Pemasukan</span>
                  <span className="text-4xl font-black font-mono text-primary tabular-nums tracking-tighter">Rp {totalPemasukan.toLocaleString("id-ID")}</span>
                </div>
                <div className="bg-destructive/10 border-2 border-destructive/20 rounded-3xl px-8 py-6 flex flex-col items-start justify-center gap-2 shadow-lg">
                  <span className="text-lg text-destructive font-black uppercase tracking-widest">Total Pengeluaran</span>
                  <span className="text-4xl font-black font-mono text-destructive tabular-nums tracking-tighter">Rp {totalPengeluaran.toLocaleString("id-ID")}</span>
                </div>
                <div className="bg-secondary/20 border-2 border-secondary/30 rounded-3xl px-8 py-6 flex flex-col items-start justify-center gap-2 shadow-lg">
                  <span className="text-lg text-foreground font-black uppercase tracking-widest">Saldo Kas Bersih</span>
                  <span className="text-4xl font-black font-mono text-foreground tabular-nums tracking-tighter">Rp {saldo.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Slide: QRIS Donasi Cashless */}
          {currentSlide.url === "qris" && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-8 w-full h-full max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">QRIS Donasi Digital</h2>
                <p className="text-2xl text-foreground/70 font-bold mt-2">Salurkan infak terbaik Anda secara cashless melalui e-wallet / m-banking</p>
              </div>

              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-10 rounded-[3rem] w-full grid grid-cols-2 gap-10 items-center shadow-2xl shadow-emerald-500/30 mt-4">
                
                {/* QR Code Column (50%) */}
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-[2.5rem] border-4 border-border shadow-inner w-full">
                  <Image 
                    src="/qris_example.png" 
                    alt="QRIS Donasi" 
                    width={400}
                    height={400}
                    priority
                    className="rounded-2xl object-contain mix-blend-multiply w-[350px] h-[350px]"
                  />
                  <span className="text-2xl uppercase font-black text-slate-800 tracking-widest mt-6">
                    QRIS GPN INDONESIA
                  </span>
                </div>

                {/* Bank / Rekening Info Column */}
                <div className="flex flex-col gap-6">
                  <div className="bg-muted/60 p-8 rounded-[2rem] border-2 border-border">
                    <span className="text-xl text-foreground/70 block font-black uppercase tracking-widest">Nama Merchant</span>
                    <span className="text-4xl font-black text-foreground mt-2 block">{qris?.atas_nama || "DKM DA'WATUL ISLAM"}</span>
                  </div>

                  <div className="bg-muted/60 p-8 rounded-[2rem] border-2 border-border">
                    <span className="text-xl text-foreground/70 block font-black uppercase tracking-widest">Rekening Transfer</span>
                    <span className="text-5xl font-mono font-black text-primary mt-2 block tracking-tight">{qris?.nomor_rekening || "-"}</span>
                    <span className="text-2xl text-foreground font-bold uppercase tracking-widest block mt-3">{qris?.bank || "-"}</span>
                  </div>

                  <p className="text-xl text-foreground/60 leading-relaxed italic font-bold">
                    * {qris?.keterangan || "Gunakan GoPay, OVO, Dana, LinkAja, atau Mobile Banking untuk memindai."}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Slide: Idul Fitri */}
          {currentSlide.url === "idul-fitri" && idulFitri && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-10 w-full h-full">
              <div className="text-center">
                <span className="text-xl font-black tracking-widest text-primary bg-primary/10 border-2 border-primary/20 px-8 py-3 rounded-full uppercase shadow-inner">
                  Informasi Hari Raya
                </span>
                <h2 className="text-6xl font-black text-foreground tracking-widest uppercase mt-8 drop-shadow-md">Sholat Idul Fitri {idulFitri.tahun}</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-14 rounded-[3rem] w-full max-w-5xl grid grid-cols-2 gap-12 shadow-xl shadow-emerald-500/30 relative mt-6 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-black px-8 py-3 rounded-tr-[3rem] rounded-bl-[2.5rem] text-xl font-mono shadow-xl">
                  {idulFitri.keterangan || "1 Syawal"}
                </div>
                
                <div className="flex flex-col gap-10 justify-center mt-6">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-muted rounded-2xl text-primary border-2 border-border/50"><CalendarDays className="h-10 w-10" /></div>
                    <div>
                      <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Tanggal Pelaksanaan</p>
                      <p className="text-3xl font-black text-foreground mt-1">{idulFitri.tanggal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-muted rounded-2xl text-primary border-2 border-border/50"><Clock className="h-10 w-10" /></div>
                    <div>
                      <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Waktu Mulai</p>
                      <p className="text-3xl font-black font-mono text-foreground mt-1">{idulFitri.waktu} WITA</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-10 mt-6">
                  <div className="bg-muted/40 p-6 rounded-3xl border-2 border-border">
                    <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Imam Sholat</p>
                    <p className="text-4xl font-black text-foreground mt-2">{idulFitri.imam}</p>
                  </div>
                  <div className="bg-muted/40 p-6 rounded-3xl border-2 border-border">
                    <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Khatib Sholat</p>
                    <p className="text-4xl font-black text-foreground mt-2">{idulFitri.khatib}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* FOOTER SECTION: RUNNING TEXT MARQUEE */}
      <footer className="relative z-10 flex items-center gap-4 shrink-0 mt-2">
        <div className="bg-primary text-primary-foreground font-black px-8 py-5 rounded-[2rem] flex items-center gap-4 shrink-0 text-2xl tracking-widest uppercase shadow-xl shadow-primary/30 z-20">
          <Megaphone className="h-8 w-8 animate-pulse" /> INFORMASI MASJID
        </div>
        <div className="flex-1 bg-card/30 backdrop-blur-3xl border-4 border-border/80 rounded-[2.5rem] p-3 h-20 flex items-center overflow-hidden shadow-2xl relative -ml-8 pl-12">
          <div className="absolute inset-y-0 left-8 w-16 bg-gradient-to-r from-card/30 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card/80 to-transparent z-10"></div>
          <div className="animate-marquee text-foreground font-bold text-4xl tracking-widest flex items-center gap-16 whitespace-nowrap drop-shadow-md">
            <span className="text-primary font-black text-4xl">★</span>
            <span>{settings.running_text}</span>
            <span className="text-primary font-black text-4xl">★</span>
            <span>SELAMAT DATANG DI {settings.nama_aplikasi.toUpperCase()}</span>
            <span className="text-primary font-black text-4xl">★</span>
            <span>MARI JAGA KEBERSIHAN DAN KEKHUSYUKAN MASJID</span>
            <span className="text-primary font-black text-4xl">★</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
