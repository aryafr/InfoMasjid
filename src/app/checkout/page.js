"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Loader2, Building, MapPin, Mail, Lock, CheckCircle, ChevronRight, ArrowLeft, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkg = searchParams.get("pkg") || "berkah"; // 'berkah' or 'premium'
  
  const [formData, setFormData] = useState({
    nama_masjid: "",
    city: "",
    email: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", type: "info", onConfirm: null });
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [locating, setLocating] = useState(false);

  const price = pkg === "premium" ? 550000 : 250000;
  const packageName = pkg === "premium" ? "Paket Premium (1 Tahun)" : "Paket Berkah (1 Tahun)";

  // Load Midtrans Snap JS
  useEffect(() => {
    // Production Mode
    const snapScript = "https://app.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch Cities (simple mock or real API)
  // We removed the hardcoded list to avoid confusing the user.

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setCustomAlert({ show: true, message: "Browser Anda tidak mendukung deteksi lokasi.", type: "error", onConfirm: null });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Gunakan Nominatim OpenStreetMap untuk Reverse Geocoding gratis
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        // Ambil nama kota/kabupaten
        const city = data.address.city || data.address.town || data.address.county || data.address.state;
        if (city) {
          // Bersihkan kata "Kabupaten" atau "Kota" agar lebih rapi untuk API AlAdhan
          let cleanCity = city.replace(/Kabupaten /g, "").replace(/Kota /g, "");
          setFormData({ ...formData, city: cleanCity });
        } else {
          setCustomAlert({ show: true, message: "Gagal menemukan nama kota dari lokasi Anda.", type: "error", onConfirm: null });
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        setCustomAlert({ show: true, message: "Gagal mendeteksi lokasi.", type: "error", onConfirm: null });
      } finally {
        setLocating(false);
      }
    }, (error) => {
      setLocating(false);
      setCustomAlert({ show: true, message: "Izin lokasi ditolak atau gagal mengambil lokasi.", type: "error", onConfirm: null });
    });
  };

  const handleRegisterAndPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Generate a clean masjid ID (e.g. masjid-dawatul-islam)
      const cleanName = formData.nama_masjid.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const masjidId = `${cleanName}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 3. Save to Firestore with pending status
      // Save root document
      await setDoc(doc(db, "masjids", masjidId), {
        ownerUid: user.uid,
        email: formData.email,
        nama_aplikasi: formData.nama_masjid,
        subscription_status: "pending_payment",
        payment_status: "pending",
        subscription_package: pkg,
        created_at: new Date().toISOString()
      });

      // Save Settings to correct subcollection
      await setDoc(doc(db, "masjids", masjidId, "settings", "global"), {
        nama_aplikasi: formData.nama_masjid,
        auto_update: { enabled: true, city: formData.city, country: "Indonesia", method: 11 },
        tema: "theme-emerald",
        rotation_interval: 10,
        rotation_enabled: true,
        jeda_iqamah: 10,
        durasi_sholat: 15,
        murottal: { enabled: false, url: "" },
        posters: [],
        running_text: "Selamat datang di " + formData.nama_masjid + ". Lurus dan rapatkan shaf.",
        rotation_pages: [
          { id: 0, url: "welcome", active: true },
          { id: 1, url: "utama", active: true },
          { id: 2, url: "pengumuman", active: true },
          { id: 3, url: "keuangan", active: true },
          { id: 4, url: "jumat", active: true },
          { id: 5, url: "qris", active: true }
        ]
      });

      // Attempt to auto-fetch and save Jadwal Sholat for the chosen city
      try {
        const cityRes = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(formData.city)}`);
        const cityData = await cityRes.json();
        if (cityData.status && cityData.data && cityData.data.length > 0) {
          const cityId = cityData.data[0].id;
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          
          const scheduleRes = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${yyyy}/${mm}/${dd}`);
          const scheduleData = await scheduleRes.json();
          if (scheduleData.status && scheduleData.data && scheduleData.data.jadwal) {
            const jadwal = scheduleData.data.jadwal;
            await setDoc(doc(db, "masjids", masjidId, "jadwal", "sholat"), {
              Subuh: jadwal.subuh,
              Dzuhur: jadwal.dzuhur,
              Ashar: jadwal.ashar,
              Maghrib: jadwal.maghrib,
              Isya: jadwal.isya
            });
          }
        }
      } catch (err) {
        console.error("Gagal auto-fetch jadwal sholat:", err);
      }

      // Also save a mapping of UID to Masjid ID for the superadmin/admin logic
      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        masjidId: masjidId,
        role: "admin"
      });

      // 4. Call our Backend API to get Midtrans Snap Token
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: `ORDER-${masjidId}-${Date.now()}`,
          gross_amount: price,
          masjidId: masjidId,
          customer_details: {
            first_name: formData.nama_masjid,
            email: formData.email,
          }
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat transaksi pembayaran");
      }

      // 5. Trigger Midtrans Snap Popup
      window.snap.pay(data.token, {
        onSuccess: function(result){
          // Diarahkan ke halaman terima kasih & panduan TV
          router.push(`/thank-you?masjidId=${masjidId}`);
        },
        onPending: function(result){
          setCustomAlert({
            show: true,
            message: "Menunggu pembayaran Anda!",
            type: "info",
            onConfirm: () => router.push(`/thank-you?masjidId=${masjidId}`)
          });
        },
        onError: function(result) {
          setError("Pembayaran gagal atau dibatalkan.");
        },
        onClose: function() {
          setCustomAlert({
            show: true,
            message: "Anda menutup popup sebelum menyelesaikan pembayaran.",
            type: "warning",
            onConfirm: () => router.push(`/${masjidId}/admin`)
          });
        }
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Custom Alert Modal */}
      {customAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-border animate-fade-in text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              customAlert.type === 'error' ? 'bg-destructive/10 text-destructive' :
              customAlert.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
              'bg-primary/10 text-primary'
            }`}>
              {customAlert.type === 'error' || customAlert.type === 'warning' ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-bold mb-2">Informasi</h3>
            <p className="text-muted-foreground mb-6 text-sm">{customAlert.message}</p>
            <button
              onClick={() => {
                const action = customAlert.onConfirm;
                setCustomAlert({ show: false, message: "", type: "info", onConfirm: null });
                if (action) action();
              }}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        
        {/* Left Side: Summary */}
        <div className="flex flex-col gap-6 justify-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors w-fit bg-card/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          
          <div className="flex items-center gap-3 mb-2 mt-4">
            <Image src="/icon.png" alt="Logo" width={48} height={48} />
            <span className="font-black text-2xl tracking-tight">InfoMasjid</span>
          </div>
          
          <h1 className="text-4xl font-black text-foreground">Selesaikan Pendaftaran Anda</h1>
          <p className="text-lg text-muted-foreground">Anda selangkah lagi untuk mendigitalkan manajemen masjid Anda secara otomatis.</p>
          
          <div className="bg-card/40 backdrop-blur-xl border-2 border-border/60 p-6 rounded-3xl mt-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Ringkasan Pesanan</h3>
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="font-bold text-lg">{packageName}</span>
              <span className="font-black text-xl text-primary">Rp {price.toLocaleString("id-ID")}</span>
            </div>
            <div className="pt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-4 w-4 text-emerald-500"/> Akses penuh dasbor admin</div>
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-4 w-4 text-emerald-500"/> Sinkronisasi jadwal otomatis</div>
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-4 w-4 text-emerald-500"/> Bebas biaya server tahunan</div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-card/40 backdrop-blur-xl border-2 border-border/60 p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleRegisterAndPay} className="flex flex-col gap-5">
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Nama Masjid</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Masjid Raya Al-Falah"
                  value={formData.nama_masjid}
                  onChange={(e) => setFormData({...formData, nama_masjid: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Kota / Kabupaten (Untuk Sinkronisasi Jadwal)</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ketik nama kota..."
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>
                <button 
                  type="button"
                  onClick={detectLocation}
                  disabled={locating}
                  className="bg-primary/10 text-primary font-bold px-4 py-3 rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center min-w-[140px]"
                >
                  {locating ? "Melacak..." : "Deteksi GPS"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Anda bebas mengetik kota apa saja di seluruh dunia.</p>
            </div>

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Alamat Email Pengelola</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="email" 
                  required
                  placeholder="email@contoh.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Password Login</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="password" 
                  required
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Memproses...</>
              ) : (
                <>Bayar via Midtrans <ChevronRight className="h-5 w-5" /></>
              )}
            </button>
            <p className="text-xs text-center text-muted-foreground font-medium mt-2">
              Sistem pembayaran kami dijamin aman oleh Midtrans (Gojek Group).
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center p-8 text-xl font-bold">Memuat Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
