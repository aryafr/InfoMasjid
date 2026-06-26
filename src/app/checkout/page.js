"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Loader2, Building, MapPin, Mail, Lock, CheckCircle, ChevronRight, ArrowLeft, AlertTriangle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pkg = searchParams.get("pkg") || "berkah"; // 'berkah' or 'premium'
  
  const [formData, setFormData] = useState({
    nama_masjid: "",
    city: "",
    email: "",
    wa_number: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", type: "info", onConfirm: null });

  // Pricing & Voucher state
  const [globalPricing, setGlobalPricing] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  // Autocomplete state
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  let basePrice = pkg === "premium" ? 550000 : 250000;
  if (globalPricing) {
    const pkgPricing = globalPricing[pkg] || {};
    basePrice = pkgPricing.original_price || basePrice;
    if (globalPricing.is_discount_active && pkgPricing.discounted_price) {
      basePrice = pkgPricing.discounted_price;
    }
  }

  let finalPrice = basePrice;
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discount_type === 'percentage') {
      discountAmount = (basePrice * appliedVoucher.discount_value) / 100;
    } else {
      discountAmount = appliedVoucher.discount_value;
    }
    finalPrice = Math.max(0, basePrice - discountAmount);
  }

  const packageName = pkg === "premium" ? "Paket Premium (1 Tahun)" : "Paket Berkah (1 Tahun)";

  useEffect(() => {
    import("@/lib/firestoreService").then(module => {
      const unsub = module.subscribeToGlobalPricing(setGlobalPricing);
      return () => unsub();
    });
  }, []);

  // Load Midtrans Snap JS
  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapScript = isProduction 
      ? "https://app.midtrans.com/snap/snap.js" 
      : "https://app.sandbox.midtrans.com/snap/snap.js";
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

  // Fetch Cities Autocomplete
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (citySearchTerm.length > 2) {
        setIsSearchingCity(true);
        try {
          const res = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${citySearchTerm}`);
          const data = await res.json();
          if (data.status && data.data) {
            setCitySuggestions(data.data);
            setShowCityDropdown(true);
          } else {
            setCitySuggestions([]);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearchingCity(false);
        }
      } else {
        setCitySuggestions([]);
        setShowCityDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [citySearchTerm]);

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    setIsValidatingVoucher(true);
    setVoucherError("");
    try {
      const res = await fetch("/api/voucher/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedVoucher({
          code: voucherCode.toUpperCase(),
          discount_type: data.discount_type,
          discount_value: data.discount_value
        });
        setVoucherCode(""); // Clear input on success
      } else {
        setVoucherError(data.message || "Voucher tidak valid.");
        setAppliedVoucher(null);
      }
    } catch (e) {
      setVoucherError("Gagal mengecek voucher.");
      setAppliedVoucher(null);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleRegisterAndPay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Generate a clean masjid ID (e.g. masjid-dawatul-islam)
      const cleanName = formData.nama_masjid.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const masjidId = `${cleanName}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 3. Save to Firestore with pending status
      const isFree = finalPrice === 0;
      let expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // Save root document
      await setDoc(doc(db, "masjids", masjidId), {
        ownerUid: user.uid,
        email: formData.email,
        wa_number: formData.wa_number,
        nama_aplikasi: formData.nama_masjid,
        subscription_status: isFree ? "active" : "pending_payment",
        payment_status: isFree ? "PAID" : "pending",
        subscription_package: pkg,
        subscription_expiry: isFree ? expiryDate.toISOString() : null,
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
        wa_number: formData.wa_number,
        masjidId: masjidId,
        role: "admin"
      });

      // 4. Call our Backend API to get Midtrans Snap Token
      if (isFree) {
        // Bypass Midtrans payment for 100% discount
        router.push(`/thank-you?masjidId=${masjidId}`);
        return;
      }
      
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: `ORDER-${masjidId}-${Date.now()}`,
          gross_amount: finalPrice,
          masjidId: masjidId,
          packageType: pkg,
          voucherCode: appliedVoucher ? appliedVoucher.code : "",
          customer_details: {
            first_name: formData.nama_masjid,
            email: formData.email,
            phone: formData.wa_number,
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
          toast.error("Pembayaran gagal atau dibatalkan.");
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
      if (err.message && err.message.includes("auth/email-already-in-use")) {
        toast.error("Email ini sudah terdaftar. Silakan gunakan email lain atau login terlebih dahulu.");
      } else {
        toast.error(err.message || "Terjadi kesalahan yang tidak terduga.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      <Modal isOpen={customAlert.show} onClose={() => {
        const action = customAlert.onConfirm;
        setCustomAlert({ show: false, message: "", type: "info", onConfirm: null });
        if (action) action();
      }}>
        <div className="text-center pb-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            customAlert.type === 'error' ? 'bg-destructive/10 text-destructive' :
            customAlert.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
            'bg-primary/10 text-primary'
          }`}>
            {customAlert.type === 'error' || customAlert.type === 'warning' ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
          </div>
          <h3 className="text-xl font-bold mb-2">Informasi</h3>
          <p className="text-muted-foreground mb-6 text-sm">{customAlert.message}</p>
          <Button
            onClick={() => {
              const action = customAlert.onConfirm;
              setCustomAlert({ show: false, message: "", type: "info", onConfirm: null });
              if (action) action();
            }}
            className="w-full"
            size="lg"
          >
            Mengerti
          </Button>
        </div>
      </Modal>

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
              <div className="text-right">
                {globalPricing && globalPricing.is_discount_active && (
                  <div className="text-sm text-muted-foreground line-through">Rp {globalPricing[pkg]?.original_price?.toLocaleString("id-ID")}</div>
                )}
                <span className="font-black text-xl text-primary">Rp {basePrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
            
            {/* VOUCHER SECTION */}
            <div className="py-4 border-b border-border/50">
              <label className="text-sm font-bold text-foreground mb-2 block">Punya Kode Voucher?</label>
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Masukkan kode..." 
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  disabled={appliedVoucher !== null || isValidatingVoucher}
                  className="uppercase"
                />
                {appliedVoucher ? (
                  <Button 
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherError("");
                    }}
                    className="shrink-0 h-[52px]"
                  >
                    Batal
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={handleApplyVoucher}
                    disabled={isValidatingVoucher || !voucherCode}
                    isLoading={isValidatingVoucher}
                    className="shrink-0 h-[52px]"
                  >
                    {!isValidatingVoucher && "Terapkan"}
                  </Button>
                )}
              </div>
              {voucherError && <p className="text-xs text-destructive font-bold mt-2">{voucherError}</p>}
              {appliedVoucher && <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Voucher {appliedVoucher.code} berhasil diterapkan (-Rp {discountAmount.toLocaleString("id-ID")})</p>}
            </div>

            <div className="pt-4 pb-4 border-b border-border/50 flex justify-between items-center bg-primary/5 px-4 rounded-xl">
              <span className="font-bold">Total Pembayaran</span>
              <span className="font-black text-2xl text-primary">Rp {finalPrice.toLocaleString("id-ID")}</span>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-4 w-4 text-emerald-500"/> Akses penuh dasbor admin</div>
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-4 w-4 text-emerald-500"/> Sinkronisasi jadwal otomatis</div>
              <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-4 w-4 text-emerald-500"/> Bebas biaya server tahunan</div>
            </div>
          </div>
        </div>

        <Card className="bg-card/40 backdrop-blur-xl border-2 border-border/60 p-8 shadow-xl">
          <form onSubmit={handleRegisterAndPay} className="flex flex-col gap-5">

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Nama Masjid</label>
              <Input 
                type="text" 
                icon={Building}
                required
                placeholder="Contoh: Masjid Raya Al-Falah"
                value={formData.nama_masjid}
                onChange={(e) => setFormData({...formData, nama_masjid: e.target.value})}
              />
            </div>

            <div className="relative">
              <label className="text-sm font-bold text-foreground mb-1 block">Kota / Kabupaten (Untuk Sinkronisasi Jadwal)</label>
              <div className="relative">
                <Input 
                  type="text" 
                  icon={MapPin}
                  required
                  placeholder="Ketik nama kota... (misal: Jakarta)"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({...formData, city: e.target.value});
                    setCitySearchTerm(e.target.value);
                  }}
                  onFocus={() => {
                    if (citySuggestions.length > 0) setShowCityDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                />
                {isSearchingCity && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              
              {showCityDropdown && citySuggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-xl shadow-lg">
                  {citySuggestions.map((city) => (
                    <li 
                      key={city.id}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input from losing focus
                        // Title Case conversion for nicer display
                        const formattedCity = city.lokasi.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        setFormData({...formData, city: formattedCity});
                        setCitySearchTerm(formattedCity);
                        setShowCityDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm font-medium border-b border-border/50 last:border-0"
                    >
                      {city.lokasi}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted-foreground mt-2">Pilih dari daftar (autocomplete) agar sinkronisasi jadwal sholat 100% akurat.</p>
            </div>

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Alamat Email Pengelola</label>
              <Input 
                type="email" 
                icon={Mail}
                required
                placeholder="email@contoh.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Nomor WhatsApp</label>
              <Input 
                type="tel" 
                icon={Phone}
                required
                placeholder="081234567890"
                value={formData.wa_number}
                onChange={(e) => setFormData({...formData, wa_number: e.target.value.replace(/[^0-9]/g, '')})}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-foreground mb-1 block">Password Login</label>
              <Input 
                type="password" 
                icon={Lock}
                required
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              isLoading={loading}
              className="mt-4 w-full"
              size="lg"
            >
              {!loading && <>Bayar via Midtrans <ChevronRight className="ml-2 h-5 w-5" /></>}
            </Button>
            <p className="text-xs text-center text-muted-foreground font-medium mt-2">
              Sistem pembayaran kami dijamin aman oleh Midtrans (Gojek Group).
            </p>
          </form>
        </Card>

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
