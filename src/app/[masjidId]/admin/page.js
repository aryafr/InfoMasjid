"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Settings, 
  Clock, 
  Calendar, 
  Volume2, 
  DollarSign, 
  QrCode, 
  Moon, 
  LogOut, 
  Plus, 
  Trash2, 
  RefreshCw, 
  MapPin,
  CheckCircle,
  AlertTriangle,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  TrendingDown,
  Wallet,
  BookOpen,
  PlayCircle,
  UploadCloud,
  Loader2,
  Info,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Copy
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  subscribeToSettings, 
  subscribeToJadwal, 
  subscribeToSholatJumat, 
  subscribeToPengumuman, 
  subscribeToKeuangan, 
  subscribeToQris, 
  subscribeToIdulFitri, 
  subscribeToIdulAdha,
  subscribeToMasjidRoot,
  updateSettings,
  updateJadwal,
  updateSholatJumat,
  addPengumuman,
  deletePengumuman,
  addKeuangan,
  deleteKeuangan,
  updateQris,
  updateIdulFitri,
  updateIdulAdha
} from "@/lib/firestoreService";
import { auth, db, isMockFirebase } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

const compressImageToBase64 = (file, maxWidth = 1280, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        const base64String = canvas.toDataURL("image/webp", quality);
        resolve(base64String);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function AdminPage() {
  const params = useParams();
  const masjidId = params.masjidId || 'demo-masjid';

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Firestore state
  const [settings, setSettings] = useState(null);
  const [jadwal, setJadwal] = useState(null);
  const [sholatJumat, setSholatJumat] = useState(null);
  const [pengumuman, setPengumuman] = useState([]);
  const [keuangan, setKeuangan] = useState([]);
  const [qris, setQris] = useState(null);
  const [idulFitri, setIdulFitri] = useState(null);
  const [idulAdha, setIdulAdha] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState("settings");
  const [uploadingPosterIndex, setUploadingPosterIndex] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [actionStatus, setActionStatus] = useState({ success: null, message: "" });
  const [syncLoading, setSyncLoading] = useState(false);
  const [tvUrl, setTvUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTvUrl(`${window.location.origin}/${masjidId}`);
    }
  }, [masjidId]);

  // Custom Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "alert", onConfirm: null });

  const showConfirm = (title, message, onConfirm) => {
    setModalConfig({ isOpen: true, title, message, type: "confirm", onConfirm });
  };

  const showAlert = (title, message) => {
    setModalConfig({ isOpen: true, title, message, type: "alert", onConfirm: null });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const getRemainingDays = () => {
    if (masjidRoot?.subscription_expiry) {
        const expireAt = new Date(masjidRoot.subscription_expiry);
        const now = new Date();
        const diffTime = Math.max(0, expireAt - now);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    if (!masjidRoot?.created_at) return 0;
    const createdAt = new Date(masjidRoot.created_at);
    const expireAt = new Date(createdAt.getTime() + (365 * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diffTime = Math.max(0, expireAt - now);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Form States
  const [renewalModalOpen, setRenewalModalOpen] = useState(false);
  const [selectedRenewalPackage, setSelectedRenewalPackage] = useState("berkah");
  const [isExtending, setIsExtending] = useState(false);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);
  const [masjidRoot, setMasjidRoot] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    nama_aplikasi: "",
    running_text: "",
    rotation_interval: 12,
    rotation_enabled: true,
    rotation_pages: [],
    jeda_iqamah: 10,
    durasi_sholat: 15,
    tema: "theme-emerald",
    murottal: { enabled: false, url: "" },
    posters: []
  });
  const [jadwalForm, setJadwalForm] = useState({
    Subuh: "", Dzuhur: "", Ashar: "", Maghrib: "", Isya: ""
  });
  const [jumatForm, setJumatForm] = useState({
    imam: "", khatib: "", muadzin: "", tanggal: ""
  });
  const [qrisForm, setQrisForm] = useState({
    atas_nama: "", bank: "", nomor_rekening: "", keterangan: "", status: "aktif", gambar: ""
  });
  const [fitriForm, setFitriForm] = useState({
    tahun: "", tanggal: "", imam: "", khatib: "", muadzin: "", waktu: "", keterangan: ""
  });
  const [adhaForm, setAdhaForm] = useState({
    tahun: "", tanggal: "", imam: "", khatib: "", muadzin: "", waktu: "", keterangan: ""
  });

  // Inputs for new items
  const [newPengumuman, setNewPengumuman] = useState({ isi: "", tanggal: "" });
  const [newKeuangan, setNewKeuangan] = useState({
    deskripsi: "", kategori: "Infak", pemasukan: 0, pengeluaran: 0, tanggal: ""
  });

  // 1. Auth Listener
  useEffect(() => {
    if (isMockFirebase || masjidId === 'demo-masjid') {
      const isMockLoggedIn = localStorage.getItem(`mock_admin_logged_in_${masjidId}`);
      if (isMockLoggedIn === "true") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setAuthLoading(false);
      return;
    }

    // Verify Masjid exists before showing login
    const checkMasjid = async () => {
      try {
        const masjidRef = doc(db, "masjids", masjidId);
        const masjidSnap = await getDoc(masjidRef);
        
        if (!masjidSnap.exists() && masjidId !== "demo-masjid") {
           // Provide a subtle way to exit or redirect, but better to redirect to 404
           window.location.href = "/not-found"; 
           return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            if (user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
              window.location.href = "/superadmin";
              return;
            }
            
            // Ownership Verification
            if (masjidSnap.exists() && masjidSnap.data().ownerUid === user.uid) {
              setIsLoggedIn(true);
            } else {
              await signOut(auth);
              window.location.href = "/login?error=akses-ditolak";
            }
          } else {
            window.location.href = "/login";
          }
          setAuthLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.error(error);
        setAuthLoading(false);
      }
    };
    
    let unsubPromise = checkMasjid();
    return () => {
      unsubPromise.then(unsub => { if (typeof unsub === 'function') unsub() });
    };
  }, [masjidId]);

  // Load Midtrans Snap JS for retry payment and renewals
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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 2. Load Firestore subscriptions when logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubSettings = subscribeToSettings(masjidId, (data) => {
      setSettings(data);
      if (data) setSettingsForm(data);
    });
    const unsubJadwal = subscribeToJadwal(masjidId, (data) => {
      setJadwal(data);
      if (data) setJadwalForm(data);
    });
    const unsubJumat = subscribeToSholatJumat(masjidId, (data) => {
      setSholatJumat(data);
      if (data) setJumatForm(data);
    });
    const unsubPengumuman = subscribeToPengumuman(masjidId, setPengumuman);
    const unsubKeuangan = subscribeToKeuangan(masjidId, setKeuangan);
    const unsubQris = subscribeToQris(masjidId, (data) => {
      setQris(data);
      if (data) setQrisForm(data);
    });
    const unsubFitri = subscribeToIdulFitri(masjidId, (data) => {
      setIdulFitri(data);
      if (data) setFitriForm(data);
    });
    const unsubAdha = subscribeToIdulAdha(masjidId, (data) => {
      setIdulAdha(data);
      if (data) setAdhaForm(data);
    });
    const unsubRoot = subscribeToMasjidRoot(masjidId, setMasjidRoot);

    return () => {
      unsubSettings();
      unsubJadwal();
      unsubJumat();
      unsubPengumuman();
      unsubKeuangan();
      unsubQris();
      unsubFitri();
      unsubAdha();
      unsubRoot();
    };
  }, [isLoggedIn, masjidId]);

  // Set alert timeouts
  useEffect(() => {
    if (actionStatus.message) {
      const timer = setTimeout(() => {
        setActionStatus({ success: null, message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [actionStatus]);

  // Logout handler
  const handleLogout = async () => {
    showConfirm("Konfirmasi Logout", "Apakah Anda yakin ingin keluar dari Admin Panel?", async () => {
      if (isMockFirebase || masjidId === 'demo-masjid') {
        localStorage.removeItem(`mock_admin_logged_in_${masjidId}`);
        setIsLoggedIn(false);
        window.location.href = "/login";
        return;
      }
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("Firebase Auth Logout failed, executing local logout:", e);
      }
      setIsLoggedIn(false);
      window.location.href = "/login";
    });
  };

  // Save changes wrapper
  const executeSave = async (fn, data, successMsg) => {
    const res = await fn(masjidId, data);
    if (res) {
      setActionStatus({ success: true, message: successMsg });
    } else {
      setActionStatus({ success: false, message: "Gagal menyimpan perubahan ke Firestore." });
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    executeSave(updateSettings, settingsForm, "Pengaturan global berhasil diperbarui!");
  };

  const handleJadwalSubmit = (e) => {
    e.preventDefault();
    executeSave(updateJadwal, jadwalForm, "Jadwal sholat berhasil disesuaikan secara manual!");
  };

  const handleForceSync = async () => {
    if (!settings) return;
    setSyncLoading(true);
    try {
      const city = settingsForm.auto_update.city || settings.auto_update?.city || "Balikpapan";
      const country = settingsForm.auto_update.country || settings.auto_update?.country || "Indonesia";
      const method = settingsForm.auto_update.method || settings.auto_update?.method || 11;
      
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`
      );
      if (res.ok) {
        const result = await res.json();
        const timings = result.data.timings;
        const newJadwal = {
          Subuh: timings.Fajr,
          Dzuhur: timings.Dhuhr,
          Ashar: timings.Asr,
          Maghrib: timings.Maghrib,
          Isya: timings.Isha
        };
        const ok = await updateJadwal(masjidId, newJadwal);
        if (ok) {
          setActionStatus({ success: true, message: `Sync otomatis berhasil untuk kota ${city}!` });
        }
      } else {
        setActionStatus({ success: false, message: "Gagal memanggil API AlAdhan." });
      }
    } catch (err) {
      console.error(err);
      setActionStatus({ success: false, message: "Koneksi internet bermasalah." });
    }
    setSyncLoading(false);
  };

  const handleJumatSubmit = (e) => {
    e.preventDefault();
    executeSave(updateSholatJumat, jumatForm, "Jadwal Petugas Jumat berhasil diperbarui!");
  };

  const handleAddPengumuman = (e) => {
    e.preventDefault();
    if (!newPengumuman.isi) return;
    executeSave(addPengumuman, {
      isi: newPengumuman.isi,
      tanggal: newPengumuman.tanggal || new Date().toISOString().split('T')[0]
    }, "Pengumuman baru berhasil ditambahkan!");
    setNewPengumuman({ isi: "", tanggal: "" });
  };

  const handleDeletePengumuman = (id) => {
    showConfirm("Hapus Pengumuman", "Hapus pengumuman ini?", () => {
      executeSave(deletePengumuman, id, "Pengumuman berhasil dihapus!");
    });
  };

  const handleAddKeuangan = (e) => {
    e.preventDefault();
    if (!newKeuangan.deskripsi) return;
    executeSave(addKeuangan, {
      deskripsi: newKeuangan.deskripsi,
      kategori: newKeuangan.kategori,
      pemasukan: Number(newKeuangan.pemasukan || 0),
      pengeluaran: Number(newKeuangan.pengeluaran || 0),
      tanggal: newKeuangan.tanggal || new Date().toISOString().split('T')[0]
    }, "Transaksi keuangan baru berhasil dicatat!");
    setNewKeuangan({ deskripsi: "", kategori: "Infak", pemasukan: 0, pengeluaran: 0, tanggal: "" });
  };

  const handleDeleteKeuangan = (id) => {
    showConfirm("Hapus Transaksi", "Hapus transaksi keuangan ini?", () => {
      executeSave(deleteKeuangan, id, "Transaksi keuangan berhasil dihapus!");
    });
  };

  const handleQrisSubmit = (e) => {
    e.preventDefault();
    executeSave(updateQris, qrisForm, "Data QRIS dan Rekening berhasil disimpan!");
  };

  const handleRetryPayment = async () => {
    setIsRetryingPayment(true);
    try {
      const price = masjidRoot.subscription_package === "premium" ? 550000 : 250000;
      const order_id = `ORDER-${masjidId}-${Date.now()}`;
      
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order_id,
          gross_amount: price,
          customer_details: { email: masjidRoot.email, first_name: "Admin" },
          masjidId: masjidId,
          packageType: masjidRoot.subscription_package
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat transaksi baru.");

      window.snap.pay(data.token, {
        onSuccess: function(result) {
          window.location.reload();
        },
        onPending: function(result){
          showAlert("Menunggu", "Menunggu pembayaran Anda!");
        },
        onError: function(result) {
          showAlert("Error", "Pembayaran gagal atau dibatalkan.");
        },
        onClose: function() {
          showAlert("Info", "Anda menutup popup sebelum menyelesaikan pembayaran.");
        }
      });
    } catch (err) {
      console.error(err);
      showAlert("Error", err.message);
    } finally {
      setIsRetryingPayment(false);
    }
  };

  const handleExtendSubscription = async () => {
    setIsExtending(true);
    try {
      const price = selectedRenewalPackage === "premium" ? 550000 : 250000;
      const order_id = `ORDER-${masjidId}-EXT-${Date.now()}`;
      
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order_id,
          gross_amount: price,
          customer_details: { email: masjidRoot.email, first_name: "Admin" },
          masjidId: masjidId,
          packageType: selectedRenewalPackage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat transaksi baru.");

      window.snap.pay(data.token, {
        onSuccess: function(result) {
          showAlert("Sukses", "Pembayaran berhasil! Masa aktif langganan Anda telah ditambahkan.");
          setRenewalModalOpen(false);
          // Wait a bit before reloading to let webhook finish
          setTimeout(() => window.location.reload(), 3000);
        },
        onPending: function(result){
          showAlert("Menunggu", "Menunggu konfirmasi pembayaran Anda!");
          setRenewalModalOpen(false);
        },
        onError: function(result) {
          showAlert("Error", "Pembayaran gagal atau dibatalkan.");
          setRenewalModalOpen(false);
        },
        onClose: function() {
          showAlert("Info", "Anda menutup popup sebelum menyelesaikan pembayaran.");
        }
      });
    } catch (err) {
      console.error(err);
      showAlert("Error", err.message);
    } finally {
      setIsExtending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-primary">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium">Mengalihkan ke halaman login...</span>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN DASHBOARD
  // -------------------------------------------------------------
  const totalPemasukan = (keuangan || []).reduce((sum, item) => sum + Number(item.pemasukan || 0), 0);
  const totalPengeluaran = (keuangan || []).reduce((sum, item) => sum + Number(item.pengeluaran || 0), 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const menus = [
    { id: "settings", name: "Dashboard Global", icon: LayoutDashboard },
    { id: "murottal", name: "Media & Murottal", icon: PlayCircle },
    { id: "jadwal", name: "Jadwal Sholat", icon: Clock },
    { id: "jumat", name: "Petugas Jumat", icon: Calendar },
    { id: "pengumuman", name: "Pengumuman", icon: Volume2 },
    { id: "keuangan", name: "Kas Keuangan", icon: DollarSign },
    { id: "qris", name: "QRIS Donasi", icon: QrCode },
    { id: "panduan", name: "Buku Panduan", icon: BookOpen },
  ];

  const isPremium = masjidRoot?.subscription_package === 'premium' || masjidId === 'demo-masjid';

  const renderPremiumLockOverlay = () => {
    if (isPremium) return null;
    return (
      <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-3xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-primary/20">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Fitur Eksklusif Paket Premium</h2>
        <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed">
          Fitur ini terkunci karena Anda saat ini berlangganan <strong>Paket Berkah</strong>. 
          Tingkatkan langganan Anda ke <strong>Paket Premium</strong> untuk membuka seluruh fitur unggulan InfoMasjid.
        </p>
        <a 
          href="https://wa.me/6282220788248?text=Halo%20Admin%20InfoMasjid,%20saya%20ingin%20upgrade%20ke%20Paket%20Premium."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
        >
          Upgrade Sekarang <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    );
  };

  const isPendingPayment = masjidRoot?.payment_status === 'pending' && masjidId !== 'demo-masjid';

  const renderPendingPaymentOverlay = () => {
    if (!isPendingPayment) return null;
    return (
      <div className="absolute inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-orange-500/20">
          <Clock className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">Menunggu Pembayaran</h2>
        <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed">
          Akun Anda saat ini berstatus <strong>Pending</strong>. Harap selesaikan pembayaran untuk mengaktifkan Dasbor Admin secara penuh. Hubungi Admin (WhatsApp) jika Anda membutuhkan bantuan atau ingin melakukan aktivasi manual.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={handleRetryPayment}
            disabled={isRetryingPayment}
            className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isRetryingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <DollarSign className="w-5 h-5" />}
            Bayar Sekarang
          </button>
          <a 
            href={`https://wa.me/6282220788248?text=Halo%20Admin%20InfoMasjid,%20saya%20butuh%20bantuan%20terkait%20pembayaran%20akun%20saya%20(${masjidId}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Hubungi Admin <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-sidebar/40 backdrop-blur-2xl border-r border-border/60 flex flex-col justify-between shrink-0 h-full z-10 shadow-xl shadow-emerald-500/10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="h-14 w-14 flex items-center justify-center shrink-0">
              <Image src="/icon.png" alt="Logo" width={56} height={56} className="w-full h-full object-contain" />
            </div>
            <h2 className="font-bold text-lg text-sidebar-foreground leading-tight tracking-tight">InfoMasjid</h2>
          </div>

          <nav className="flex flex-col gap-1.5">
            {menus.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer text-left relative ${
                    isActive 
                      ? "bg-sidebar-primary/10 text-sidebar-primary font-bold" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground font-medium"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-md"></div>
                  )}
                  <Icon className={`h-5 w-5 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50"}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-border flex flex-col gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer text-left w-full"
          >
            <LogOut className="h-5 w-5 text-sidebar-foreground/50" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {renderPendingPaymentOverlay()}
        
        {/* Premium Luxury Background Glows (Mesh Gradient Effect) */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-accent/20 rounded-[100%] blur-[140px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '1s' }}></div>
        
        {/* TOP BAR */}
        <header className="h-20 bg-background/40 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-[40] border-b border-border/50 relative">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {activeTab === 'settings' && "Welcome back, Admin!"}
                {activeTab === 'murottal' && "Media & Murottal"}
                {activeTab === 'jadwal' && "Jadwal Sholat"}
                {activeTab === 'jumat' && "Petugas Sholat Jumat"}
                {activeTab === 'pengumuman' && "Kelola Pengumuman"}
                {activeTab === 'keuangan' && "Track due billings"}
                {activeTab === 'qris' && "Pengaturan QRIS"}
                {activeTab === 'panduan' && "Buku Panduan"}
              </h1>
              <p className="text-muted-foreground text-xs mt-0.5">
                {activeTab === 'settings' && "Plan, prioritize, and accomplish your tasks with ease."}
                {activeTab === 'murottal' && "Putar video YouTube dan atur tampilan media TV Anda."}
                {activeTab === 'jadwal' && "Atur waktu sholat secara manual atau sinkronisasi otomatis via API."}
                {activeTab === 'jumat' && "Kelola daftar petugas Jumat untuk ditampilkan otomatis setiap hari Jumat."}
                {activeTab === 'pengumuman' && "Buat dan atur pengumuman kegiatan masjid untuk para jamaah."}
                {activeTab === 'keuangan' && "Pantau arus kas masuk dan keluar secara rapi dan presisi."}
                {activeTab === 'qris' && "Atur gambar barcode QRIS dan informasi rekening donasi masjid."}
                {activeTab === 'panduan' && "Pelajari panduan penggunaan aplikasi secara menyeluruh dan mudah."}
              </p>
            </div>
            
            {/* Status Alert Badge */}
            {actionStatus.message && (
              <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm ${
                actionStatus.success 
                  ? "bg-primary/10 border-primary/20 text-primary" 
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}>
                {actionStatus.success ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                {actionStatus.message}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={() => showAlert("Informasi Sistem", `Update pengembangan fitur terbaru (Version 1.0) telah diterapkan. Masa tenggang langganan aktif: ${getRemainingDays()} Hari.`)}
              className="p-2 border border-border rounded-full bg-card text-muted-foreground hover:bg-accent hover:text-foreground shadow-sm transition-colors cursor-pointer relative"
              title="Notifikasi"
            >
              <div className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border border-card"></div>
              <Bell className="h-5 w-5" />
            </button>
            <div className="ml-2 h-10 w-10 bg-accent rounded-full flex items-center justify-center text-muted-foreground border border-border shadow-sm">
              <User className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">

          {/* ==================== 1. TAB: SETTINGS / DASHBOARD ==================== */}
          {activeTab === "settings" && settings && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              
              {/* Highlight Cards */}
              <div className="grid grid-cols-3 gap-6">
                
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40">
                  <h3 className="text-muted-foreground font-medium text-sm flex justify-between items-center">
                    Total Pemasukan <TrendingUp className="h-4 w-4 opacity-50 text-primary"/>
                  </h3>
                  <div>
                    <div className="text-3xl font-bold text-primary tracking-tight mb-1">Rp {totalPemasukan.toLocaleString("id-ID")}</div>
                    <p className="text-muted-foreground text-xs">Akumulasi kas masuk</p>
                  </div>
                </div>

                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40">
                  <h3 className="text-muted-foreground font-medium text-sm flex justify-between items-center">
                    Total Pengeluaran <TrendingDown className="h-4 w-4 opacity-50 text-destructive"/>
                  </h3>
                  <div>
                    <div className="text-3xl font-bold text-destructive tracking-tight mb-1">Rp {totalPengeluaran.toLocaleString("id-ID")}</div>
                    <p className="text-muted-foreground text-xs">Akumulasi kas keluar</p>
                  </div>
                </div>

                <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-40 cursor-default">
                  <div className="absolute -bottom-4 -right-4 p-4 opacity-20">
                    <Wallet className="h-24 w-24" />
                  </div>
                  <h3 className="text-primary-foreground/90 font-medium text-sm">Saldo Keuangan Bersih</h3>
                  <div>
                    <div className="text-3xl font-bold tracking-tight mb-1">Rp {saldo.toLocaleString("id-ID")}</div>
                    <p className="text-primary-foreground/70 text-xs">Berdasarkan {keuangan.length} transaksi</p>
                  </div>
                </div>

                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40">
                  <h3 className="text-muted-foreground font-medium text-sm flex justify-between items-center">
                    Total Pengumuman <Volume2 className="h-4 w-4 opacity-50"/>
                  </h3>
                  <div>
                    <div className="text-3xl font-bold text-foreground tracking-tight mb-1">{(pengumuman || []).length}</div>
                    <p className="text-muted-foreground text-xs">Agenda aktif dan terpublikasi</p>
                  </div>
                </div>

                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40">
                  <h3 className="text-muted-foreground font-medium text-sm flex justify-between items-center">
                    Rotasi Layar <LayoutDashboard className="h-4 w-4 opacity-50"/>
                  </h3>
                  <div>
                    <div className="text-3xl font-bold text-foreground tracking-tight mb-1">{settings.rotation_enabled ? "ON" : "OFF"}</div>
                    <p className="text-muted-foreground text-xs">Interval {settings.rotation_interval} detik</p>
                  </div>
                </div>

                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40">
                  <h3 className="text-muted-foreground font-medium text-sm flex justify-between items-center">
                    Petugas Jumat <User className="h-4 w-4 opacity-50"/>
                  </h3>
                  <div>
                    <div className="text-lg font-bold text-foreground tracking-tight truncate mb-1">{sholatJumat?.khatib || "-"}</div>
                    <p className="text-muted-foreground text-xs">{sholatJumat?.tanggal}</p>
                  </div>
                </div>
              </div>

              {/* Form Settings */}
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-10 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border pb-4">Pengaturan Global App</h2>
                
                {/* Subscription Reminder */}
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-4 rounded-xl mb-6 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Masa Aktif Layanan</h4>
                    <p className="text-xs mt-1">
                      Sisa masa aktif langganan aplikasi InfoMasjid Anda adalah <strong>{getRemainingDays()} Hari</strong>. 
                      Harap perpanjang sebelum masa berlaku habis agar layar TV tetap dapat beroperasi.
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedRenewalPackage(masjidRoot?.subscription_package || "berkah");
                      setRenewalModalOpen(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors shrink-0 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Perpanjang
                  </button>
                </div>

                <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6">
                  
                  {/* TV LINK SECTION */}
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <label className="text-sm text-primary font-bold mb-2 block">Link Layar TV Anda</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={tvUrl}
                        readOnly
                        className="flex-1 bg-background border border-primary/20 rounded-xl px-4 py-3 focus:outline-none text-foreground text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(tvUrl);
                          setActionStatus({ success: true, message: "Link Layar TV berhasil disalin!" });
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 px-6 font-bold text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        Salin
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex gap-1 items-center">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      Gunakan link ini pada Smart TV, Android TV, atau komputer yang tersambung ke layar masjid Anda.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Nama Aplikasi / Masjid</label>
                    <input 
                      type="text" 
                      value={settingsForm.nama_aplikasi}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nama_aplikasi: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">
                      Custom Logo Masjid <span className="text-muted-foreground text-xs font-normal">(Opsional)</span>
                    </label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={settingsForm.logo_url || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logo_url: e.target.value })}
                        placeholder="https://... atau klik Upload"
                        className="flex-1 bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                      <label className={`p-3 rounded-xl transition-colors flex items-center justify-center border border-border ${
                        uploadingLogo 
                          ? "bg-primary/20 text-primary" 
                          : "bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer"
                      }`}>
                        {uploadingLogo ? <Loader2 className="h-5 w-5 animate-spin"/> : <UploadCloud className="h-5 w-5"/>}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            setUploadingLogo(true);
                            try {
                              if (isMockFirebase) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setSettingsForm({ ...settingsForm, logo_url: event.target.result });
                                  setUploadingLogo(false);
                                };
                                reader.readAsDataURL(file);
                                return;
                              }

                              const base64Url = await compressImageToBase64(file);
                              setSettingsForm({ ...settingsForm, logo_url: base64Url });
                            } catch (error) {
                              console.error("Gagal kompresi logo:", error);
                              showAlert("Gagal", "Gagal mengolah gambar logo.");
                            } finally {
                              setUploadingLogo(false);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 flex gap-1 items-center">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      Gunakan file gambar transparan (PNG). Jika kosong, logo default InfoMasjid akan digunakan.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Running Text Banner (Footer)</label>
                    <textarea 
                      value={settingsForm.running_text}
                      onChange={(e) => setSettingsForm({ ...settingsForm, running_text: e.target.value })}
                      rows={3}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-3 block">Tema Warna Tampilan TV</label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { id: 'theme-emerald', name: 'Emerald', color: '#10b981' },
                        { id: 'theme-ocean', name: 'Ocean (Blue)', color: '#3b82f6' },
                        { id: 'theme-sunset', name: 'Sunset (Orange)', color: '#f97316' },
                        { id: 'theme-royal', name: 'Royal (Purple)', color: '#a855f7' },
                        { id: 'theme-gold', name: 'Gold (Yellow)', color: '#eab308' },
                        { id: 'theme-ruby', name: 'Ruby (Red)', color: '#f43f5e' },
                        { id: 'theme-midnight', name: 'Midnight (Indigo)', color: '#4f46e5' },
                        { id: 'theme-coffee', name: 'Coffee (Brown)', color: '#b45309' },
                        { id: 'theme-forest', name: 'Forest (Dark Green)', color: '#15803d' },
                        { id: 'theme-monochrome', name: 'Monochrome (Gray)', color: '#52525b' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          title={t.name}
                          onClick={() => setSettingsForm({ ...settingsForm, tema: t.id })}
                          className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm flex items-center justify-center ${
                            (settingsForm.tema || 'theme-emerald') === t.id 
                              ? 'border-foreground scale-110 ring-2 ring-background' 
                              : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: t.color }}
                        >
                          {(settingsForm.tema || 'theme-emerald') === t.id && <CheckCircle className="h-5 w-5 text-white drop-shadow-md" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Interval Rotasi (Detik)</label>
                      <input 
                        type="number" 
                        value={settingsForm.rotation_interval}
                        onChange={(e) => setSettingsForm({ ...settingsForm, rotation_interval: Number(e.target.value) })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Jeda Iqamah (Menit)</label>
                      <input 
                        type="number" 
                        value={settingsForm.jeda_iqamah ?? 10}
                        onChange={(e) => setSettingsForm({ ...settingsForm, jeda_iqamah: Number(e.target.value) })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Durasi Sholat (Menit)</label>
                      <input 
                        type="number" 
                        value={settingsForm.durasi_sholat ?? 15}
                        onChange={(e) => setSettingsForm({ ...settingsForm, durasi_sholat: Number(e.target.value) })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-foreground font-medium mb-3 block">Status Rotasi Otomatis</label>
                      <label className="inline-flex items-center gap-3 cursor-pointer mt-2">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={settingsForm.rotation_enabled}
                            onChange={(e) => setSettingsForm({ ...settingsForm, rotation_enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${settingsForm.rotation_enabled ? 'bg-primary' : 'bg-muted'} peer-focus:outline-none relative`}>
                             <div className={`absolute top-[2px] left-[2px] bg-white border border-border rounded-full h-5 w-5 transition-all ${settingsForm.rotation_enabled ? 'translate-x-full border-white' : ''}`}></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-foreground">Aktifkan Rotasi</span>
                      </label>
                    </div>
                  </div>

                  {/* Checkboxes for active pages */}
                  <div>
                    <label className="text-sm text-foreground font-medium mb-3 block">Halaman yang Ditampilkan (Aktif)</label>
                    <div className="grid grid-cols-3 gap-4 bg-muted/30 p-5 rounded-2xl border border-border">
                      {(() => {
                        const masterList = [
                          { url: "welcome", name: "Dashboard Lengkap", active: true },
                          { url: "utama", name: "Jadwal Sholat", active: true },
                          { url: "keuangan", name: "Rincian Keuangan", active: false },
                          { url: "jumat", name: "Jadwal Sholat Jumat", active: true },
                          { url: "pengumuman", name: "Pengumuman", active: false },
                          { url: "keuangan-summary", name: "Ringkasan Keuangan", active: false },
                          { url: "qris", name: "QRIS Donasi", active: false },
                          { url: "idul-fitri", name: "Idul Fitri", active: false },
                          { url: "idul-adha", name: "Idul Adha", active: false },
                          { url: "hitung-mundur", name: "Hitung Mundur Hari Besar", active: false }
                        ];

                        const currentPages = settingsForm.rotation_pages || [];
                        
                        // Merge current pages into master list
                        const mergedPages = masterList.map(masterPage => {
                          const existing = currentPages.find(p => p.url === masterPage.url);
                          if (existing) {
                            return { ...masterPage, active: existing.active };
                          }
                          return masterPage;
                        });

                        return mergedPages.map((page, index) => {
                          const isPremiumPage = ['keuangan', 'keuangan-summary', 'qris', 'idul-fitri', 'idul-adha'].includes(page.url);
                          const isDisabled = !isPremium && isPremiumPage;
                          
                          return (
                            <label key={page.url} className={`flex items-center gap-3 select-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <input 
                                type="checkbox" 
                                checked={isDisabled ? false : page.active}
                                disabled={isDisabled}
                                onChange={(e) => {
                                  const updated = [...mergedPages];
                                  updated[index].active = e.target.checked;
                                  setSettingsForm({ ...settingsForm, rotation_pages: updated });
                                }}
                                className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary accent-primary disabled:opacity-50"
                              />
                              <span className="text-sm font-medium text-foreground">
                                {page.name}
                                {isDisabled && <Lock className="w-3 h-3 inline ml-1.5 text-amber-500 mb-0.5" />}
                              </span>
                            </label>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="bg-primary text-primary-foreground font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================== 1.5. TAB: MUROTTAL ==================== */}
          {activeTab === "murottal" && settings && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-10 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <PlayCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground">Media & Murottal</h2>
                    <p className="text-foreground/60 mt-1">Atur pemutaran otomatis Murottal/Video YouTube sebelum adzan.</p>
                  </div>
                </div>

                <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6">
                  
                  {/* VIDEO KAJIAN SECTION */}
                  <div className="bg-card border-2 border-border p-6 rounded-3xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><PlayCircle className="h-6 w-6 text-primary"/> Pengaturan Video & Kajian</h3>
                    
                    <div className="bg-muted/40 p-4 rounded-2xl border border-border/50 mb-4">
                      <label className="flex items-center gap-4 cursor-pointer">
                        <div className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${settingsForm.murottal?.enabled ? 'bg-red-500' : 'bg-muted-foreground/30'}`}>
                          <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settingsForm.murottal?.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={settingsForm.murottal?.enabled || false}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm, 
                            murottal: { ...settingsForm.murottal, enabled: e.target.checked }
                          })}
                        />
                        <div>
                          <span className="font-bold text-lg text-foreground block">Putar Video & Lock Screen Sekarang</span>
                          <span className="text-sm text-foreground/60">Akan menghentikan rotasi slide dan memutar video secara penuh. Otomatis kembali setelah video selesai.</span>
                        </div>
                      </label>
                    </div>

                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Link Video YouTube</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: https://www.youtube.com/watch?v=IPyvDEiUq2s"
                        value={settingsForm.murottal?.url || ""}
                        onChange={(e) => {
                          let val = e.target.value;
                          setSettingsForm({ ...settingsForm, murottal: { ...settingsForm.murottal, url: val } });
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                    </div>
                  </div>

                  {/* POSTER CAMPAIGN SECTION */}
                  <div className="bg-card border-2 border-border p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="h-6 w-6 text-primary"/> Poster Campaign (Slide)
                        {!isPremium && <span className="ml-2 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-500/20"><Lock className="w-3 h-3 inline mr-1 -mt-0.5"/>Hanya Premium</span>}
                      </h3>
                      <button type="button" disabled={!isPremium} onClick={() => {
                        const newPosters = [...(settingsForm.posters || []), ""];
                        setSettingsForm({...settingsForm, posters: newPosters});
                      }} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Plus className="h-4 w-4"/> Tambah Poster
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {(!settingsForm.posters || settingsForm.posters.length === 0) && (
                        <div className="text-center p-6 bg-muted/30 rounded-xl border border-dashed border-border text-foreground/50 text-sm">
                          Belum ada poster. Tambahkan link gambar untuk ditampilkan sebagai slide rotasi.
                        </div>
                      )}
                      {settingsForm.posters?.map((poster, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="font-bold text-foreground/30 w-6 text-right">{index+1}.</span>
                          <input 
                            type="url" 
                            disabled={!isPremium}
                            placeholder="https://... atau klik Upload"
                            value={poster}
                            onChange={(e) => {
                              const newPosters = [...settingsForm.posters];
                              newPosters[index] = e.target.value;
                              setSettingsForm({...settingsForm, posters: newPosters});
                            }}
                            className="flex-1 bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <label className={`p-3 rounded-xl transition-colors flex items-center justify-center ${
                            uploadingPosterIndex === index 
                              ? "bg-primary/20 text-primary" 
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer"
                          } ${!isPremium ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                            {uploadingPosterIndex === index ? <Loader2 className="h-4 w-4 animate-spin"/> : <UploadCloud className="h-4 w-4"/>}
                            <input 
                              type="file" 
                              disabled={!isPremium}
                              accept="image/*" 
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                if (isMockFirebase) {
                                  // In demo mode, we convert image to base64 so it can be previewed without a real server
                                  setUploadingPosterIndex(index);
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const base64Url = event.target.result;
                                    const newPosters = [...settingsForm.posters];
                                    newPosters[index] = base64Url;
                                    setSettingsForm({...settingsForm, posters: newPosters});
                                    setUploadingPosterIndex(null);
                                  };
                                  reader.readAsDataURL(file);
                                  return;
                                }

                                setUploadingPosterIndex(index);
                                try {
                                  const base64Url = await compressImageToBase64(file);
                                  const newPosters = [...settingsForm.posters];
                                  newPosters[index] = base64Url;
                                  setSettingsForm({...settingsForm, posters: newPosters});
                                } catch (error) {
                                  console.error("Error compression:", error);
                                  showAlert("Gagal", "Gagal mengolah gambar.");
                                } finally {
                                  setUploadingPosterIndex(null);
                                }
                              }}
                            />
                          </label>
                          <button 
                            type="button" 
                            disabled={!isPremium}
                            onClick={() => {
                              const newPosters = settingsForm.posters.filter((_, i) => i !== index);
                              setSettingsForm({...settingsForm, posters: newPosters});
                            }}
                            className="p-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4 w-4"/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-primary/30 w-full"
                  >
                    <Settings className="h-5 w-5" />
                    Simpan Pengaturan Media
                  </button>
                </form>
              </div>
            </div>
          )}


          {/* ==================== 2. TAB: JADWAL SHOLAT ==================== */}
          {activeTab === "jadwal" && jadwal && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow max-w-3xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h2 className="text-lg font-bold text-foreground">Jadwal Sholat Fardhu</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Cari Kota..."
                        value={settingsForm.auto_update?.city || ""}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm, 
                          auto_update: { ...settingsForm.auto_update, city: e.target.value }
                        })}
                        className="w-48 bg-input/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                    <button 
                      onClick={handleForceSync}
                      disabled={syncLoading}
                      className="bg-primary/10 text-primary font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary/20 transition-colors disabled:opacity-50 text-sm border border-primary/20 cursor-pointer"
                    >
                      <RefreshCw className={`h-4 w-4 ${syncLoading ? "animate-spin" : ""}`} />
                      <span>{syncLoading ? "Mencari..." : "Sync API Otomatis"}</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleJadwalSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (
                      <div key={name}>
                        <label className="text-sm text-foreground font-medium mb-2 block">Waktu {name}</label>
                        <input 
                          type="text" 
                          value={jadwalForm[name]}
                          onChange={(e) => setJadwalForm({ ...jadwalForm, [name]: e.target.value })}
                          className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow font-mono font-bold text-lg text-center"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground font-mono mt-2 flex items-center gap-1.5 bg-muted/50 p-3 rounded-lg w-fit">
                    <Clock className="h-4 w-4 opacity-70" />
                    <span>Terakhir diperbarui: {jadwal.updated_at}</span>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="bg-primary text-primary-foreground font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer"
                    >
                      Simpan Jadwal Manual
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================== 3. TAB: PETUGAS JUMAT ==================== */}
          {activeTab === "jumat" && sholatJumat && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow max-w-2xl mx-auto w-full">
                <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border pb-4">Petugas Sholat Jumat Berikutnya</h2>
                
                <form onSubmit={handleJumatSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Tanggal Jumat</label>
                    <input 
                      type="date" 
                      value={jumatForm.tanggal}
                      onChange={(e) => setJumatForm({ ...jumatForm, tanggal: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Khatib Jumat</label>
                    <input 
                      type="text" 
                      value={jumatForm.khatib}
                      onChange={(e) => setJumatForm({ ...jumatForm, khatib: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Imam Jumat</label>
                    <input 
                      type="text" 
                      value={jumatForm.imam}
                      onChange={(e) => setJumatForm({ ...jumatForm, imam: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Muadzin / Bilal</label>
                    <input 
                      type="text" 
                      value={jumatForm.muadzin}
                      onChange={(e) => setJumatForm({ ...jumatForm, muadzin: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="bg-primary text-primary-foreground font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer"
                    >
                      Simpan Petugas
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================== 4. TAB: PENGUMUMAN ==================== */}
          {activeTab === "pengumuman" && (
            <div className="animate-fade-in grid grid-cols-12 gap-8 items-start max-w-6xl w-full mx-auto pb-20">
              
              {/* Form Col */}
              <div className="col-span-4 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-foreground mb-5 pb-3 border-b border-border">Buat Agenda Baru</h3>
                <form onSubmit={handleAddPengumuman} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Tanggal Agenda</label>
                    <input 
                      type="date" 
                      value={newPengumuman.tanggal}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, tanggal: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Isi Pengumuman</label>
                    <textarea 
                      value={newPengumuman.isi}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, isi: e.target.value })}
                      rows={4}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="bg-primary text-primary-foreground text-sm font-medium p-3 rounded-xl shadow-sm hover:opacity-90 transition-colors flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Tambahkan
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="col-span-8 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-foreground mb-5 pb-3 border-b border-border flex justify-between">
                  Daftar Pengumuman Aktif
                </h3>
                
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {(pengumuman || []).map((item) => (
                    <div key={item.id} className="group p-5 rounded-2xl border border-border bg-muted/20 hover:bg-accent hover:border-primary/30 hover:shadow-sm transition-all flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-block px-2.5 py-1 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-md text-xs font-mono font-medium text-muted-foreground mb-2">
                          {item.tanggal}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-medium">{item.isi}</p>
                      </div>
                      <button 
                        onClick={() => handleDeletePengumuman(item.id)}
                        className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                  {(!pengumuman || pengumuman.length === 0) && (
                    <div className="text-center py-10 text-muted-foreground text-sm">Belum ada pengumuman.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ==================== 5. TAB: KEUANGAN ==================== */}
          {activeTab === "keuangan" && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
                
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-foreground mb-5 pb-3 border-b border-border">Catat Transaksi Baru</h3>
                  <form onSubmit={handleAddKeuangan} className="grid grid-cols-12 gap-5 items-end">
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Tanggal</label>
                      <input 
                        type="date" 
                        value={newKeuangan.tanggal}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, tanggal: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="col-span-4">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Keterangan / Deskripsi</label>
                      <input 
                        type="text" 
                        placeholder="Cth: Infak Jumat..."
                        value={newKeuangan.deskripsi}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, deskripsi: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Kategori</label>
                      <select 
                        value={newKeuangan.kategori}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, kategori: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      >
                        <option value="Infak">Infak</option>
                        <option value="Donatur">Donatur</option>
                        <option value="Operasional">Operasional</option>
                        <option value="Utilitas">Utilitas</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Tipe</label>
                      <select 
                        onChange={(e) => {
                          const isMasuk = e.target.value === "masuk";
                          const val = newKeuangan.pemasukan || newKeuangan.pengeluaran;
                          if (isMasuk) {
                            setNewKeuangan({ ...newKeuangan, pemasukan: val, pengeluaran: 0 });
                          } else {
                            setNewKeuangan({ ...newKeuangan, pemasukan: 0, pengeluaran: val });
                          }
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      >
                        <option value="masuk">Masuk (+)</option>
                        <option value="keluar">Keluar (-)</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Nominal (Rp)</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={newKeuangan.pemasukan || newKeuangan.pengeluaran || ""}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (newKeuangan.pemasukan > 0 || (!newKeuangan.pemasukan && !newKeuangan.pengeluaran)) {
                            setNewKeuangan({ ...newKeuangan, pemasukan: val, pengeluaran: 0 });
                          } else {
                            setNewKeuangan({ ...newKeuangan, pemasukan: 0, pengeluaran: val });
                          }
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                    
                    <div className="col-span-12 flex justify-end mt-2">
                      <button type="submit" className="bg-primary text-primary-foreground text-sm font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-colors cursor-pointer">
                        Simpan Transaksi
                      </button>
                    </div>
                  </form>
                </div>

                {/* Ledger Table */}
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
                    <h3 className="text-base font-bold text-foreground">Buku Kas Rekapitulasi</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Tanggal</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-2/6">Keterangan</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Kategori</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Nominal</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Status</th>
                          <th className="py-3 px-4 border-b border-border w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {(keuangan || []).map((item, index) => {
                          const isIncome = item.pemasukan > 0;
                          return (
                            <tr key={item.id} className={`hover:bg-muted/40 transition-colors ${index % 2 === 1 ? 'bg-muted/20' : 'bg-transparent'}`}>
                              <td className="py-4 px-4 text-sm font-medium text-foreground">{item.tanggal}</td>
                              <td className="py-4 px-4 text-sm text-foreground/80 font-medium">{item.deskripsi}</td>
                              <td className="py-4 px-4 text-sm text-muted-foreground">{item.kategori}</td>
                              <td className="py-4 px-4 text-sm font-mono font-bold text-foreground">
                                Rp {Number(isIncome ? item.pemasukan : item.pengeluaran).toLocaleString("id-ID")}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex px-3.5 py-1 text-xs font-bold rounded-full ${
                                  isIncome 
                                    ? "bg-primary/20 text-primary" 
                                    : "bg-destructive/15 text-destructive"
                                }`}>
                                  {isIncome ? "Received" : "Expense"}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button 
                                  onClick={() => handleDeleteKeuangan(item.id)}
                                  className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {(!keuangan || keuangan.length === 0) && (
                          <tr>
                            <td colSpan="6" className="text-center py-10 text-muted-foreground text-sm">Belum ada transaksi.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6. TAB: QRIS ==================== */}
          {activeTab === "qris" && qris && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-6 max-w-6xl w-full mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto w-full">
                <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border pb-4">Pengaturan QRIS Donasi</h2>
                
                <form onSubmit={handleQrisSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Nama Merchant (Atas Nama)</label>
                    <input 
                      type="text" 
                      value={qrisForm.atas_nama}
                      onChange={(e) => setQrisForm({ ...qrisForm, atas_nama: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Nama Bank / E-Wallet</label>
                      <input 
                        type="text" 
                        value={qrisForm.bank}
                        onChange={(e) => setQrisForm({ ...qrisForm, bank: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Nomor Rekening</label>
                      <input 
                        type="text" 
                        value={qrisForm.nomor_rekening}
                        onChange={(e) => setQrisForm({ ...qrisForm, nomor_rekening: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Keterangan Ajakan</label>
                    <input 
                      type="text" 
                      value={qrisForm.keterangan}
                      onChange={(e) => setQrisForm({ ...qrisForm, keterangan: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Upload Gambar QRIS</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-xl border border-border overflow-hidden bg-white shrink-0 shadow-inner flex items-center justify-center p-2">
                        {qrisForm.gambar ? (
                          <Image src={qrisForm.gambar} alt="QR Preview" width={80} height={80} className="object-contain w-full h-full mix-blend-multiply" />
                        ) : (
                          <span className="text-xs text-muted-foreground text-center">No Image</span>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            compressImageToBase64(file).then(base64 => {
                              setQrisForm({ ...qrisForm, gambar: base64 });
                            }).catch(err => {
                              console.error("Error compression QRIS:", err);
                              showAlert("Gagal", "Gagal mengolah gambar QRIS.");
                            });
                          }
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="bg-primary text-primary-foreground font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer"
                    >
                      Simpan Data QRIS
                    </button>
                  </div>
                </form>
              </div>
            </div>
            </div>
          )}

          {/* ==================== 7. TAB: PANDUAN ==================== */}
          {activeTab === "panduan" && (
            <div className="animate-fade-in flex flex-col gap-6 w-full max-w-4xl mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-10">
                <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-8">
                  <h2 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-primary" /> Panduan Penggunaan
                  </h2>
                  <button 
                    onClick={async () => {
                      try {
                        const htmlContent = `
                          <div>
                            <h1>🕌 Panduan Penggunaan InfoMasjid Version 1.0</h1>
                            <p>Selamat datang di sistem <strong>InfoMasjid Version 1.0</strong>. Panduan ini menjelaskan alur kerja (Input - Proses - Output) untuk seluruh fitur di Admin Panel.</p>
                            
                            <h2>📺 Bagian 1: Tampilan TV Layar Lebar (Frontend)</h2>
                            <p>Layar utama berotasi menampilkan Informasi Masjid, QRIS, Keuangan, Pengumuman, dan Poster. Saat waktu Adzan tiba, layar penuh dengan pengingat Adzan. Saat Iqamah tiba, hitung mundur berjalan dengan suara beep. Saat Salat berlangsung, layar meredup/hitam agar jamaah khusyuk.</p>

                            <h2>⚙️ Bagian 2: Penjelasan Fitur Admin Panel (Backend)</h2>
                            <p>Semua perubahan yang Anda lakukan bersifat <strong>Real-Time</strong>, artinya langsung mengubah tampilan layar TV di detik yang sama.</p>

                            <h3>1. Dashboard Global</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                              <li><strong>Input:</strong> Mengisi nama masjid, teks berjalan (marquee), memilih tema warna, mengatur durasi slide, atau mengunggah file gambar poster.</li>
                              <li><strong>Proses:</strong> Klik "Simpan Pengaturan". Sistem memvalidasi data dan mengunggah gambar ke server secara otomatis.</li>
                              <li><strong>Output:</strong> Identitas header TV berubah, tema warna menyesuaikan, teks berjalan bergerak di bawah, dan poster masuk ke dalam siklus putaran slide di TV.</li>
                            </ul>

                            <h3>2. Media & Murottal</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                              <li><strong>Input:</strong> Memasukkan Link/URL video YouTube (kajian/murottal) dan mengklik toggle saklar ke posisi aktif (hijau).</li>
                              <li><strong>Proses:</strong> Sistem mengirim perintah instan ke frontend TV untuk menghentikan rotasi slide dan membuka pemutar video.</li>
                              <li><strong>Output:</strong> TV menampilkan video YouTube secara Full Screen beserta suaranya. Ketika video tamat, layar TV otomatis kembali memutar slide reguler.</li>
                            </ul>

                            <h3>3. Jadwal Sholat</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                              <li><strong>Input:</strong> Mengisi nama Kota/Kabupaten pada pencarian API, atau memasukkan angka penyesuaian menit (-/+) secara manual.</li>
                              <li><strong>Proses:</strong> Klik "Sinkronkan & Simpan". Sistem memanggil data astronomis dari server API sesuai hari ini.</li>
                              <li><strong>Output:</strong> Jam sholat di header TV langsung diperbarui secara presisi. Hitung mundur (countdown) menuju waktu salat berikutnya otomatis menyesuaikan jadwal yang baru.</li>
                            </ul>

                            <h3>4. Petugas Jumat</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                              <li><strong>Input:</strong> Mengetikkan nama petugas (Khatib, Imam, Muadzin, Bilal) ke dalam kotak teks.</li>
                              <li><strong>Proses:</strong> Klik "Simpan Petugas". Sistem menyimpan jadwal khusus untuk pelaksanaan Jumat terdekat.</li>
                              <li><strong>Output:</strong> Slide khusus "Petugas Sholat Jumat" akan muncul di putaran layar TV (Slide ini hanya akan tampil secara otomatis khusus pada hari Kamis dan Jumat).</li>
                            </ul>

                            <h3>5. Kelola Pengumuman</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                              <li><strong>Input:</strong> Mengetikkan teks informasi atau kegiatan masjid pada kolom input dan klik "+ Tambah".</li>
                              <li><strong>Proses:</strong> Data teks dimasukkan ke dalam daftar tabel pengumuman aktif.</li>
                              <li><strong>Output:</strong> Muncul slide "Pengumuman Masjid" pada TV yang berisikan teks-teks poin kegiatan yang baru saja Anda buat agar bisa dibaca jamaah.</li>
                            </ul>

                            <h3>6. Kas Keuangan</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                              <li><strong>Input:</strong> Memilih Tanggal, jenis kas (Pemasukan/Pengeluaran), memasukkan Nominal Uang, dan Keterangan. Klik "Tambah Transaksi".</li>
                              <li><strong>Proses:</strong> Sistem melakukan perhitungan matematika otomatis untuk mengakumulasikan Saldo Bersih (Total Pemasukan dikurangi Total Pengeluaran).</li>
                              <li><strong>Output:</strong> Laporan Keuangan tampil di TV berupa diagram tabel dengan warna hijau (masuk) dan merah (keluar), lengkap dengan sisa saldo kas saat ini secara transparan.</li>
                            </ul>

                            <h3>7. Pengaturan QRIS</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                              <li><strong>Input:</strong> Mengklik Ikon Awan untuk mengunggah gambar Barcode QRIS masjid, serta mengetik Nama Bank dan Nomor Rekening.</li>
                              <li><strong>Proses:</strong> Klik "Simpan Data QRIS". Sistem mengompres ukuran file gambar dan menyimpannya secara aman di Cloud.</li>
                              <li><strong>Output:</strong> Tampil slide "Infaq Digital" di TV dengan gambar barcode QRIS besar di tengah layar yang siap untuk di-scan oleh aplikasi perbankan milik jamaah.</li>
                            </ul>

                            <div class="warning">
                              <h3>! PENTING: Kebijakan Autoplay Browser</h3>
                              <p>Saat TV dinyalakan dan membuka halaman TV, Anda <strong>WAJIB meng-klik layar TV satu kali</strong> menggunakan mouse/remote. Jika tidak diklik, suara beep, adzan, dan Murottal YouTube tidak akan berbunyi karena diblokir keamanan browser.</p>
                            </div>
                          </div>
                        `;
                        const printWindow = window.open('', '_blank');
                        if (!printWindow) {
                          showAlert("Pop-up Diblokir", "Mohon izinkan pop-up pada browser Anda untuk memunculkan PDF.");
                          return;
                        }
                        
                        const fullHtml = `
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <title>Buku_Panduan_InfoMasjid</title>
                              <style>
                                body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
                                h1 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 30px; font-size: 24px; }
                                h2 { color: #059669; margin-top: 40px; margin-bottom: 20px; font-size: 20px; }
                                h3 { color: #1f2937; margin-top: 25px; font-size: 16px; }
                                ul { margin-bottom: 20px; padding-left: 20px; }
                                li { margin-bottom: 8px; }
                                p { margin-bottom: 15px; }
                                .warning { background-color: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-top: 40px; }
                                .warning h3 { color: #b91c1c; margin-top: 0; }
                                .warning p { margin-bottom: 0; }
                                @media print {
                                  body { padding: 0; max-width: none; }
                                  @page { margin: 2cm; }
                                }
                              </style>
                            </head>
                            <body>
                              ${htmlContent}
                              <script>
                                window.onload = function() {
                                  setTimeout(function() {
                                    window.print();
                                  }, 500);
                                };
                              </script>
                            </body>
                          </html>
                        `;
                        printWindow.document.open();
                        printWindow.document.write(fullHtml);
                        printWindow.document.close();
                      } catch (e) {
                        console.error("Failed to generate PDF", e);
                        showAlert("Gagal Download", "Maaf, gagal memproses panduan. Silakan coba lagi.");
                      }
                    }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    Download Panduan (.pdf)
                  </button>
                </div>
                
                <div id="panduan-content" className="space-y-12 prose prose-emerald prose-invert max-w-none bg-card/20 p-8 rounded-3xl">
                  
                  {/* PANDUAN TV */}
                  <section>
                    <h3 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center text-sm">1</span> 
                      Tampilan TV Layar Lebar (Frontend)
                    </h3>
                    <div className="bg-muted/30 p-6 rounded-2xl border border-border space-y-4">
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Rotasi Slide Berjalan</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          Layar utama akan berotasi menampilkan Informasi Masjid, QRIS, Keuangan, Pengumuman, Jadwal Jumat/Hari Raya, dan <strong>Poster Campaign</strong>. Semua slide menyesuaikan durasi yang Anda tentukan di Pengaturan.
                        </p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-xl border border-border">
                        <h4 className="font-bold text-foreground mb-1">Mode Murottal & Video YouTube</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          Anda dapat menyiarkan Livestreaming kajian atau memutar Murottal melalui YouTube. Ketika mode ini diaktifkan, video akan tampil elegan di tengah layar. Menariknya, <strong>ketika video tamat</strong>, layar TV akan otomatis menutup video tersebut dan kembali ke mode rotasi slide normal!
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Mode Layar Hitam (Salat Khusyuk)</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          Saat memasuki waktu Iqamah hingga waktu salat berlangsung, layar TV akan meredup/hitam secara otomatis. Ini dirancang agar cahaya TV tidak memecah kekhusyukan jamaah. Layar akan menyala normal setelah durasi salat (yang Anda atur) habis.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* PANDUAN ADMIN */}
                  <section>
                    <h3 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center text-sm">2</span> 
                      Menggunakan Admin Panel (Backend)
                    </h3>
                    
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      Semua perubahan yang Anda lakukan pada menu-menu di bawah ini bersifat <strong>Real-Time</strong>, artinya akan langsung mengubah tampilan layar TV di detik yang sama tanpa perlu me-refresh TV.
                    </p>

                    <div className="bg-muted/30 p-6 rounded-2xl border border-border space-y-6">
                      
                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <LayoutDashboard className="h-4 w-4" /> 1. Dashboard Global
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-foreground/80">
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-emerald-500 block mb-1">Input:</span> Mengisi nama masjid, tema, durasi slide, dan upload poster banner.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-blue-500 block mb-1">Proses:</span> Validasi data dan gambar diunggah ke server secara aman.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-purple-500 block mb-1">Output:</span> Identitas TV berubah instan & poster tampil bergantian di slide rotasi.
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/50 p-4 rounded-xl border border-border">
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <PlayCircle className="h-4 w-4" /> 2. Media & Murottal
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-foreground/80">
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-emerald-500 block mb-1">Input:</span> Masukkan link YouTube dan klik saklar/toggle ke posisi "Aktif".
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-blue-500 block mb-1">Proses:</span> Perintah di-broadcast ke TV untuk memotong slide berjalan.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-purple-500 block mb-1">Output:</span> Video YouTube tayang Full Screen. Jika tamat, otomatis kembali ke slide normal.
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4" /> 3. Jadwal Sholat
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-foreground/80">
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-emerald-500 block mb-1">Input:</span> Cari nama Kota API atau masukkan angka penyesuaian (+/- menit).
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-blue-500 block mb-1">Proses:</span> Sinkronisasi dengan server kalender astronomis kemenag real-time.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-purple-500 block mb-1">Output:</span> Jam jadwal sholat di header TV diperbarui, jam countdown salat ikut bergeser presisi.
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4" /> 4. Petugas Jumat
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-foreground/80">
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-emerald-500 block mb-1">Input:</span> Ketik nama Khatib, Imam, Muadzin, dan Bilal ke dalam kotak isian.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-blue-500 block mb-1">Proses:</span> Sistem menyimpan data khusus untuk pelaksanaan Jumat minggu ini.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-purple-500 block mb-1">Output:</span> Slide khusus "Petugas Jumat" ditayangkan. Tampil HANYA di hari Kamis & Jumat otomatis.
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <Volume2 className="h-4 w-4" /> 5. Kelola Pengumuman
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-foreground/80">
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-emerald-500 block mb-1">Input:</span> Ketik teks kegiatan masjid, lalu tekan tombol "+ Tambah".
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-blue-500 block mb-1">Proses:</span> Sistem menyusun teks menjadi urutan list (daftar buletin).
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-purple-500 block mb-1">Output:</span> Layar TV melahirkan slide "Pengumuman" berisikan catatan untuk dibaca jamaah.
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4" /> 6. Kas Keuangan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-foreground/80">
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-emerald-500 block mb-1">Input:</span> Pilih Jenis (Masuk/Keluar), ketik Angka Nominal (Rp), dan Keterangan.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-blue-500 block mb-1">Proses:</span> Mesin kalkulator menghitung otomatis total pemasukan dikurangi pengeluaran.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-purple-500 block mb-1">Output:</span> Slide diagram Laporan Keuangan tayang transparan dengan warna hijau/merah di TV.
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                          <QrCode className="h-4 w-4" /> 7. Pengaturan QRIS
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-foreground/80">
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-emerald-500 block mb-1">Input:</span> Klik Ikon Awan unggah Barcode QRIS, ketik Rekening & Bank.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-blue-500 block mb-1">Proses:</span> File foto dikompres agar ringan diload di TV, lalu disimpan di Cloud.
                          </div>
                          <div className="bg-background/40 p-3 rounded-lg border border-border">
                            <span className="font-bold text-purple-500 block mb-1">Output:</span> Slide khusus "Infaq QRIS" akan berotasi memunculkan barcode besar untuk discan HP.
                          </div>
                        </div>
                      </div>

                    </div>
                  </section>

                  {/* PENTING */}
                  <section>
                    <h3 className="text-2xl font-bold text-primary flex items-center gap-3 mb-4">
                      <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center text-sm">!</span> 
                      PERHATIAN: Peringatan Suara TV
                    </h3>
                    <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl flex items-start gap-4">
                      <Megaphone className="h-8 w-8 text-destructive shrink-0 mt-1" />
                      <div>
                        <h4 className="text-lg font-bold text-destructive mb-2">Browser Memblokir Suara Otomatis</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          Untuk alasan keamanan, browser (Chrome/Android TV) tidak akan mengeluarkan suara <em>beep</em> Iqamah, Adzan, maupun video YouTube sebelum ada interaksi dari manusia. 
                          <br/><br/>
                          <strong>Solusi Wajib:</strong> Saat TV Masjid Anda baru pertama kali dihidupkan dan membuka halaman TV Masjid, pastikan Anda <strong>mengklik layar TV menggunakan mouse atau remote TV satu kali</strong> (klik tombol "Mulai / Aktifkan Layar"). Setelah itu, suara akan berjalan normal secara otomatis selama 24 jam!
                        </p>
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CUSTOM MODAL UI */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-card border border-border shadow-2xl rounded-[2rem] max-w-md w-full p-8 transform transition-all animate-slide-up relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-3">
                {modalConfig.type === "confirm" ? (
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                ) : (
                  <Bell className="h-6 w-6 text-primary" />
                )}
                {modalConfig.title}
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-8">
                {modalConfig.message}
              </p>
              
              <div className="flex items-center justify-end gap-3">
                {modalConfig.type === "confirm" && (
                  <button 
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Batal
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (modalConfig.onConfirm) modalConfig.onConfirm();
                    closeModal();
                  }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors shadow-lg ${
                    modalConfig.type === "confirm" 
                      ? "bg-destructive hover:bg-destructive/90 shadow-destructive/20" 
                      : "bg-primary hover:bg-primary/90 shadow-primary/20"
                  }`}
                >
                  {modalConfig.type === "confirm" ? "Ya, Lanjutkan" : "Oke, Mengerti"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENEWAL MODAL */}
      {renewalModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setRenewalModalOpen(false)}></div>
          <div className="relative bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Perpanjang Langganan</h3>
            <p className="text-muted-foreground text-sm mb-6">Pilih paket yang ingin Anda perpanjang. Jika Anda memilih paket yang berbeda, akun Anda akan otomatis disesuaikan setelah pembayaran berhasil.</p>
            
            <div className="space-y-4 mb-8">
              {/* Berkah */}
              <div 
                onClick={() => setSelectedRenewalPackage("berkah")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRenewalPackage === 'berkah' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-foreground">Paket Berkah (1 Tahun)</h4>
                  <span className="font-black text-primary">Rp 250.000</span>
                </div>
                <p className="text-xs text-muted-foreground">Perpanjang akses ke fitur dasar aplikasi InfoMasjid.</p>
              </div>
              
              {/* Premium */}
              <div 
                onClick={() => setSelectedRenewalPackage("premium")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRenewalPackage === 'premium' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-foreground flex items-center gap-2">Paket Premium (1 Tahun) <span className="bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full text-[10px] uppercase">Rekomendasi</span></h4>
                  <span className="font-black text-primary">Rp 550.000</span>
                </div>
                <p className="text-xs text-muted-foreground">Perpanjang akses ke semua fitur termasuk Murottal otomatis dan Video interaktif.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setRenewalModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleExtendSubscription}
                disabled={isExtending}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isExtending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
