"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Loader2, Building, MapPin, Mail, Lock, CheckCircle, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
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
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState("");

  const price = pkg === "premium" ? 550000 : 250000;
  const packageName = pkg === "premium" ? "Paket Premium (1 Tahun)" : "Paket Berkah (1 Tahun)";

  // Load Midtrans Snap JS
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY; // We will use environment variable
    
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
  // For production, we usually use a static list or API. We'll use a hardcoded list for common cities to ensure it works, but allow typing.
  const commonCities = [
    "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", 
    "Makassar", "Palembang", "Balikpapan", "Samarinda", "Yogyakarta",
    "Banjarmasin", "Malang", "Denpasar", "Pekanbaru", "Batam"
  ];

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
      await setDoc(doc(db, "masjids", masjidId), {
        ownerUid: user.uid,
        email: formData.email,
        nama_aplikasi: formData.nama_masjid,
        subscription_status: "pending_payment",
        subscription_package: pkg,
        created_at: new Date().toISOString(),
        settings: {
          nama_aplikasi: formData.nama_masjid,
          auto_update: { city: formData.city, country: "Indonesia", method: 11 },
          tema: "theme-emerald",
          rotation_interval: 10,
          rotation_enabled: true,
          running_text: "Selamat datang di Masjid " + formData.nama_masjid + ".",
          rotation_pages: [
            { url: "welcome", active: true },
            { url: "utama", active: true },
            { url: "pengumuman", active: true },
            { url: "keuangan", active: true },
            { url: "jumat", active: true },
            { url: "qris", active: true }
          ]
        }
      });

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
        onSuccess: function(result) {
          // Redirect to admin dashboard
          router.push(`/${masjidId}/admin`);
        },
        onPending: function(result) {
          alert("Menunggu pembayaran Anda!");
          router.push(`/${masjidId}/admin`);
        },
        onError: function(result) {
          setError("Pembayaran gagal atau dibatalkan.");
        },
        onClose: function() {
          alert("Anda menutup popup sebelum menyelesaikan pembayaran.");
          router.push(`/${masjidId}/admin`);
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
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        
        {/* Left Side: Summary */}
        <div className="flex flex-col gap-6 justify-center">
          <div className="flex items-center gap-3 mb-6">
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
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  required
                  placeholder="Ketik kota Anda (Contoh: Balikpapan)"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  list="city-list"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
                <datalist id="city-list">
                  {commonCities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
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
