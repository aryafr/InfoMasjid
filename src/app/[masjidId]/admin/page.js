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
  LayoutDashboard, MessageSquare, CreditCard, Building,
  Megaphone,
  TrendingUp,
  TrendingDown,
  Wallet,
  BookOpen,
  PlayCircle,
  UploadCloud, Download,
  Loader2,
  Info,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Copy,
  ExternalLink,
  Menu,
  X,
  Edit2,
  Tag,
  FileText,
  Save
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
  updateKeuangan,
  updateQris,
  updateIdulFitri,
  updateIdulAdha
} from "@/lib/firestoreService";
import { auth, db, isMockFirebase } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const applyOffset = (timeStr, offsetMinutes) => {
  if (!timeStr || !offsetMinutes) return timeStr;
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + parseInt(offsetMinutes), 0, 0);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : null;
};

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
  const [isSaving, setIsSaving] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [systemUpdate, setSystemUpdate] = useState(null);
  const [latestUpdateData, setLatestUpdateData] = useState(null);
  const [hasUnreadUpdate, setHasUnreadUpdate] = useState(false);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [masjidRoot, setMasjidRoot] = useState(null);
  const [profileForm, setProfileForm] = useState({
    nama_masjid: "", city: "", email: "", wa_number: "", currentPassword: "", newPassword: "", alamat_lengkap: ""
  });
  const [settingsForm, setSettingsForm] = useState({
    nama_aplikasi: "",
    running_text: "",
    running_text_speed: 45,
    rotation_interval: 12,
    rotation_enabled: true,
    rotation_pages: [],
    jeda_iqamah: { subuh: 10, dzuhur: 10, ashar: 10, maghrib: 10, isya: 10 },
    durasi_sholat: { subuh: 15, dzuhur: 15, ashar: 15, maghrib: 15, isya: 15 },
    tema: "theme-emerald",
    murottal: { enabled: false, url: "" },
    posters: [],
    keuangan_tv_filter: { type: 'weekly', customStart: '', customEnd: '' }
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
  const [newPengumuman, setNewPengumuman] = useState({ judul: "", isi: "", tanggal: "" });
  const [newKeuangan, setNewKeuangan] = useState({
    deskripsi: "", kategori: "", pemasukan: 0, pengeluaran: 0, tanggal: ""
  });
  const [transactionType, setTransactionType] = useState("masuk"); // 'masuk' or 'keluar'
  const [editingKeuangan, setEditingKeuangan] = useState(null);

  // Keuangan Export & Filter State
  const [keuanganFilterType, setKeuanganFilterType] = useState('all'); // 'all', 'weekly', 'monthly', 'custom'
  const [keuanganCustomDate, setKeuanganCustomDate] = useState({ start: '', end: '' });

  // City Search State for Jadwal Sholat
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  // 1. Auth Listener
  useEffect(() => {
    if (isMockFirebase) {
      const isMockLoggedIn = localStorage.getItem(`mock_admin_logged_in_${masjidId}`);
      if (isMockLoggedIn === "true") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setAuthLoading(false);
      return;
    }

    if (masjidId === 'demo-masjid') {
      setIsLoggedIn(true);
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

  // Fetch System Update Notification
  useEffect(() => {
    if (!isLoggedIn || masjidId === 'demo-masjid' || isMockFirebase) return;

    const fetchSystemUpdate = async () => {
      try {
        // Fetch up to 10 latest updates and filter the published one on client
        // This avoids needing a composite index in Firestore for is_published + created_at
        const q = query(
          collection(db, "system_updates"),
          orderBy("created_at", "desc"),
          limit(10)
        );
        const snapshot = await getDocs(q);
        
        // Find the first published update
        const publishedDoc = snapshot.docs.find(doc => doc.data().is_published === true);
        
        if (publishedDoc) {
          const latestUpdate = { id: publishedDoc.id, ...publishedDoc.data() };
          setLatestUpdateData(latestUpdate);
          const lastSeenId = localStorage.getItem("last_seen_update");
          if (lastSeenId !== latestUpdate.id) {
            setSystemUpdate(latestUpdate);
            setHasUnreadUpdate(true);
          } else {
            setHasUnreadUpdate(false);
          }
        }
      } catch (error) {
        console.error("Error fetching system updates:", error);
      }
    };

    fetchSystemUpdate();
  }, [isLoggedIn, masjidId]);

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
      if (data) {
        const newData = { ...data };
        if (typeof newData.jeda_iqamah === 'number') {
           newData.jeda_iqamah = {
             subuh: newData.jeda_iqamah, dzuhur: newData.jeda_iqamah, ashar: newData.jeda_iqamah, maghrib: newData.jeda_iqamah, isya: newData.jeda_iqamah
           };
        }
        if (!newData.jeda_iqamah) {
           newData.jeda_iqamah = { subuh: 10, dzuhur: 10, ashar: 10, maghrib: 10, isya: 10 };
        }
        if (typeof newData.durasi_sholat === 'number') {
           newData.durasi_sholat = {
             subuh: newData.durasi_sholat, dzuhur: newData.durasi_sholat, ashar: newData.durasi_sholat, maghrib: newData.durasi_sholat, isya: newData.durasi_sholat
           };
        }
        if (!newData.durasi_sholat) {
           newData.durasi_sholat = { subuh: 15, dzuhur: 15, ashar: 15, maghrib: 15, isya: 15 };
        }
        if (!newData.running_text_speed) {
           newData.running_text_speed = 45;
        }
        if (!newData.keuangan_tv_filter) {
           newData.keuangan_tv_filter = { type: 'weekly', customStart: '', customEnd: '' };
        }
        setSettingsForm(newData);
      }
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

  // City Autocomplete Effect
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

  // Populate Profile Form when data arrives
  useEffect(() => {
    if (masjidRoot && settings) {
      setProfileForm(prev => {
        // Only populate if not already populated to avoid overwriting typing
        if (!prev.nama_masjid && !prev.email && !prev.wa_number) {
          return {
            ...prev,
            nama_masjid: masjidRoot.nama_aplikasi || "",
            email: masjidRoot.email || auth?.currentUser?.email || "",
            wa_number: masjidRoot.wa_number || "",
            city: settings.auto_update?.city || "Jakarta",
            alamat_lengkap: masjidRoot.alamat_lengkap || "",
          };
        }
        return prev;
      });
    }
  }, [masjidRoot, settings, auth?.currentUser]);

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

  
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Update Masjid Root
      await setDoc(doc(db, "masjids", masjidId), {
        nama_aplikasi: profileForm.nama_masjid,
        email: profileForm.email,
        wa_number: profileForm.wa_number,
        alamat_lengkap: profileForm.alamat_lengkap
      }, { merge: true });

      // Update Settings Global
      const updatedSettings = {
        ...settingsForm,
        nama_aplikasi: profileForm.nama_masjid,
        auto_update: { ...settingsForm.auto_update, city: profileForm.city }
      };
      await updateSettings(masjidId, updatedSettings);

      // Update User Mapping
      if (auth.currentUser) {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          email: profileForm.email,
          wa_number: profileForm.wa_number
        }, { merge: true });
      }

      toast.success("Profil berhasil diperbarui!");
      setSettings(updatedSettings);
      setSettingsForm(updatedSettings);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!profileForm.currentPassword || !profileForm.newPassword) {
      toast.error("Semua kolom password harus diisi.");
      return;
    }
    if (profileForm.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }
    
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Tidak ada user aktif.");

      const credential = EmailAuthProvider.credential(user.email, profileForm.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, profileForm.newPassword);
      
      toast.success("Password berhasil diubah!");
      setProfileForm(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        toast.error("Password lama salah.");
      } else {
        toast.error("Gagal mengganti password: " + err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

// Save changes wrapper
  const executeSave = async (fn, data, successMsg) => {
    setIsSaving(true);
    try {
      const res = await fn(masjidId, data);
      if (res) {
        toast.success(successMsg);
      } else {
        toast.error("Gagal menyimpan perubahan ke Firestore.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const updatedSettings = { ...settingsForm };
    if (updatedSettings.murottal?.enabled) {
      const duration = updatedSettings.murottal.duration || "always";
      if (duration === "always") {
        updatedSettings.murottal.expiresAt = null;
      } else {
        const msMap = {
          "5m": 5 * 60 * 1000,
          "10m": 10 * 60 * 1000,
          "15m": 15 * 60 * 1000,
          "30m": 30 * 60 * 1000,
          "1h": 60 * 60 * 1000,
          "2h": 120 * 60 * 1000
        };
        updatedSettings.murottal.expiresAt = Date.now() + msMap[duration];
      }
    } else {
      updatedSettings.murottal.expiresAt = null;
    }
    executeSave(updateSettings, updatedSettings, "Pengaturan global berhasil diperbarui!");
  };

  const handleJadwalSubmit = (e) => {
    e.preventDefault();
    executeSave(updateJadwal, jadwalForm, "Jadwal sholat berhasil disesuaikan secara manual!");
  };

  const handleForceSync = async () => {
    if (!settings) return;
    setSyncLoading(true);
    try {
      const city = settingsForm.auto_update?.city || settings.auto_update?.city || "Balikpapan";
      let cityId = settingsForm.auto_update?.cityId || settings.auto_update?.cityId;
      
      // If no cityId, fetch it first based on city name
      if (!cityId) {
         const searchRes = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(city)}`);
         if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData.status && searchData.data && searchData.data.length > 0) {
               cityId = searchData.data[0].id;
            }
         }
      }
      
      if (!cityId) {
         toast.error("Gagal mendapatkan ID Kota untuk " + city);
         return;
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      
      const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}/${date}`);
      if (res.ok) {
        const result = await res.json();
        if (!result.status || !result.data || !result.data.jadwal) throw new Error("Data API MyQuran tidak valid");
        const timings = result.data.jadwal;
        const offsets = settingsForm.jadwal_offsets || {};
        const newJadwal = {
          Imsak: applyOffset(timings.imsak, offsets.Imsak || 0),
          Subuh: applyOffset(timings.subuh, offsets.Subuh || 0),
          Terbit: applyOffset(timings.terbit, offsets.Terbit || 0),
          Dzuhur: applyOffset(timings.dzuhur, offsets.Dzuhur || 0),
          Ashar: applyOffset(timings.ashar, offsets.Ashar || 0),
          Maghrib: applyOffset(timings.maghrib, offsets.Maghrib || 0),
          Isya: applyOffset(timings.isya, offsets.Isya || 0)
        };
        const ok = await updateJadwal(masjidId, newJadwal);
        if (ok) {
          const updatedSettings = {
            ...settingsForm,
            auto_update: { ...settingsForm.auto_update, city: city, cityId: cityId }
          };
          await updateSettings(masjidId, updatedSettings);
          setSettings(updatedSettings);
          setSettingsForm(updatedSettings);
          setProfileForm(prev => ({...prev, city: city}));
          
          toast.success(`Sync otomatis berhasil untuk kota ${city}!`);
        }
      } else {
        toast.error("Gagal memanggil API AlAdhan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Koneksi internet bermasalah.");
    }
    setSyncLoading(false);
  };

  const handleJumatSubmit = (e) => {
    e.preventDefault();
    // Sort by date before saving
    const sortedList = [...(jumatForm.list || [])].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    executeSave(updateSholatJumat, { list: sortedList }, "Jadwal Petugas Jumat berhasil diperbarui!");
  };

  const handleAddPengumuman = (e) => {
    e.preventDefault();
    if (!newPengumuman.isi || !newPengumuman.judul) return;
    executeSave(addPengumuman, {
      judul: newPengumuman.judul,
      isi: newPengumuman.isi,
      tanggal: newPengumuman.tanggal || new Date().toISOString().split('T')[0]
    }, "Pengumuman baru berhasil ditambahkan!");
    setNewPengumuman({ judul: "", isi: "", tanggal: "" });
  };

  const handleDeletePengumuman = (id) => {
    showConfirm("Hapus Pengumuman", "Hapus pengumuman ini?", () => {
      executeSave(deletePengumuman, id, "Pengumuman berhasil dihapus!");
    });
  };

  const handleAddKeuangan = async (e) => {
    e.preventDefault();
    if (!newKeuangan.deskripsi || !newKeuangan.kategori || !newKeuangan.tanggal) {
      toast("Mohon isi deskripsi, kategori, dan tanggal!");
      return;
    }
    executeSave(addKeuangan, {
      deskripsi: newKeuangan.deskripsi,
      kategori: newKeuangan.kategori,
      pemasukan: Number(newKeuangan.pemasukan || 0),
      pengeluaran: Number(newKeuangan.pengeluaran || 0),
      tanggal: newKeuangan.tanggal
    }, "Transaksi keuangan baru berhasil dicatat!");
    setNewKeuangan({ deskripsi: "", kategori: "Infak", pemasukan: 0, pengeluaran: 0, tanggal: "" });
  };

  const handleUpdateKeuangan = async (e) => {
    e.preventDefault();
    if (!editingKeuangan.deskripsi || !editingKeuangan.kategori || !editingKeuangan.tanggal) {
      toast("Mohon isi deskripsi, kategori, dan tanggal!");
      return;
    }
    const fn = (mId, data) => updateKeuangan(mId, editingKeuangan.id, data);
    executeSave(fn, {
      deskripsi: editingKeuangan.deskripsi,
      kategori: editingKeuangan.kategori,
      pemasukan: Number(editingKeuangan.pemasukan || 0),
      pengeluaran: Number(editingKeuangan.pengeluaran || 0),
      tanggal: editingKeuangan.tanggal
    }, "Transaksi keuangan berhasil diperbarui!");
    setEditingKeuangan(null);
  };

  const handleDeleteKeuangan = async (id) => {
    showConfirm("Hapus Transaksi", "Hapus transaksi keuangan ini?", () => {
      executeSave(deleteKeuangan, id, "Transaksi keuangan berhasil dihapus!");
    });
  };

  const handleSaveTVSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(masjidId, { ...settings, keuangan_tv_filter: settingsForm.keuangan_tv_filter });
      toast.success("Pengaturan Layar TV berhasil disimpan!");
    } catch (err) {
      toast.error("Gagal menyimpan pengaturan layar TV");
    }
  };

  const filteredKeuangan = (keuangan || []).filter(item => {
    if (keuanganFilterType === 'all') return true;
    const itemDate = new Date(item.tanggal);
    const now = new Date();
    
    if (keuanganFilterType === 'weekly') {
       const sevenDaysAgo = new Date();
       sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
       sevenDaysAgo.setHours(0,0,0,0);
       return itemDate >= sevenDaysAgo && itemDate <= new Date();
    }
    if (keuanganFilterType === 'monthly') {
       return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }
    if (keuanganFilterType === 'custom') {
       if (!keuanganCustomDate.start || !keuanganCustomDate.end) return true;
       return itemDate >= new Date(keuanganCustomDate.start) && itemDate <= new Date(keuanganCustomDate.end);
    }
    return true;
  });

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      await import("jspdf-autotable");
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Laporan Rekapitulasi Kas Keuangan", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Masjid: ${masjidData?.nama_aplikasi || "InfoMasjid"}`, 14, 30);
      
      let periodStr = "Semua Waktu";
      if (keuanganFilterType === 'weekly') periodStr = "7 Hari Terakhir";
      if (keuanganFilterType === 'monthly') periodStr = "Bulan Ini";
      if (keuanganFilterType === 'custom') periodStr = `${keuanganCustomDate.start} s/d ${keuanganCustomDate.end}`;
      doc.text(`Periode: ${periodStr}`, 14, 36);

      const tableColumn = ["Tanggal", "Keterangan", "Kategori", "Pemasukan", "Pengeluaran"];
      const tableRows = [];

      let totalIn = 0;
      let totalOut = 0;

      filteredKeuangan.forEach(item => {
        const p = Number(item.pemasukan || 0);
        const k = Number(item.pengeluaran || 0);
        totalIn += p;
        totalOut += k;
        tableRows.push([
          item.tanggal,
          item.deskripsi,
          item.kategori,
          p > 0 ? `Rp ${p.toLocaleString('id-ID')}` : "-",
          k > 0 ? `Rp ${k.toLocaleString('id-ID')}` : "-"
        ]);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105] }, // primary emerald
      });

      const finalY = doc.lastAutoTable.finalY || 45;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Total Pemasukan: Rp ${totalIn.toLocaleString('id-ID')}`, 14, finalY + 10);
      doc.text(`Total Pengeluaran: Rp ${totalOut.toLocaleString('id-ID')}`, 14, finalY + 18);
      doc.setFontSize(14);
      doc.text(`Saldo Akhir: Rp ${(totalIn - totalOut).toLocaleString('id-ID')}`, 14, finalY + 28);

      doc.save(`Laporan_Keuangan_${masjidId}.pdf`);
      toast.success("Laporan PDF berhasil diunduh!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat PDF");
    }
  };

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      
      const worksheetData = [
        ["Laporan Rekapitulasi Kas Keuangan"],
        [`Masjid: ${masjidData?.nama_aplikasi || "InfoMasjid"}`],
        []
      ];

      let periodStr = "Semua Waktu";
      if (keuanganFilterType === 'weekly') periodStr = "7 Hari Terakhir";
      if (keuanganFilterType === 'monthly') periodStr = "Bulan Ini";
      if (keuanganFilterType === 'custom') periodStr = `${keuanganCustomDate.start} s/d ${keuanganCustomDate.end}`;
      worksheetData[1].push(`Periode: ${periodStr}`);

      const header = ["Tanggal", "Keterangan", "Kategori", "Pemasukan (Rp)", "Pengeluaran (Rp)"];
      worksheetData.push(header);

      let totalIn = 0;
      let totalOut = 0;

      filteredKeuangan.forEach(item => {
        const p = Number(item.pemasukan || 0);
        const k = Number(item.pengeluaran || 0);
        totalIn += p;
        totalOut += k;
        worksheetData.push([
          item.tanggal,
          item.deskripsi,
          item.kategori,
          p,
          k
        ]);
      });

      worksheetData.push([]);
      worksheetData.push(["", "", "Total Pemasukan", totalIn, ""]);
      worksheetData.push(["", "", "Total Pengeluaran", "", totalOut]);
      worksheetData.push(["", "", "Saldo Akhir", totalIn - totalOut, ""]);

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Keuangan");
      
      XLSX.writeFile(wb, `Laporan_Keuangan_${masjidId}.xlsx`);
      toast.success("Laporan Excel berhasil diunduh!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat Excel");
    }
  };

  const handleQrisSubmit = (e) => {
    e.preventDefault();
    executeSave(updateQris, qrisForm, "Data QRIS dan Rekening berhasil disimpan!");
  };

  const handleIdulFitriSubmit = (e) => {
    e.preventDefault();
    executeSave(updateIdulFitri, fitriForm, "Data Idul Fitri berhasil disimpan!");
  };

  const handleIdulAdhaSubmit = (e) => {
    e.preventDefault();
    executeSave(updateIdulAdha, adhaForm, "Data Idul Adha berhasil disimpan!");
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
    { id: "ied", name: "Sholat Ied", icon: Moon },
    { id: "panduan", name: "Buku Panduan", icon: BookOpen },
    { id: "profile", name: "Profil Akun", icon: User }
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
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar/40 backdrop-blur-2xl border-r border-border/60 flex flex-col justify-between shrink-0 h-full shadow-xl shadow-emerald-500/10 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10 pl-2">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 flex items-center justify-center shrink-0">
                <Image src="/icon.png" alt="Logo" width={56} height={56} className="w-full h-full object-contain" />
              </div>
              <h2 className="font-bold text-lg text-sidebar-foreground leading-tight tracking-tight">InfoMasjid</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground p-1">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {menus.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false); // Close on mobile after selection
                  }}
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {renderPendingPaymentOverlay()}
        
        {/* Premium Luxury Background Glows (Mesh Gradient Effect) */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-accent/20 rounded-[100%] blur-[140px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '1s' }}></div>
        
        {/* TOP BAR */}
        <header className="h-20 bg-background/40 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 z-[40] border-b border-border/50 relative">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-foreground/80 hover:bg-muted rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {activeTab === 'settings' && "Welcome back, Admin!"}
                {activeTab === 'murottal' && "Media & Murottal"}
                {activeTab === 'jadwal' && "Jadwal Sholat"}
                {activeTab === 'jumat' && "Petugas Sholat Jumat"}
                {activeTab === 'pengumuman' && "Kelola Pengumuman"}
                {activeTab === 'keuangan' && "Kelola Kas Keuangan"}
                {activeTab === 'qris' && "Pengaturan QRIS"}
                {activeTab === 'ied' && "Sholat Ied"}
                {activeTab === 'panduan' && "Buku Panduan"}
                {activeTab === 'profile' && "Profil & Keamanan"}
              </h1>
              <p className="text-muted-foreground text-xs mt-0.5">
                {activeTab === 'settings' && "Plan, prioritize, and accomplish your tasks with ease."}
                {activeTab === 'murottal' && "Putar video YouTube dan atur tampilan media TV Anda."}
                {activeTab === 'jadwal' && "Atur waktu sholat secara manual atau sinkronisasi otomatis via API."}
                {activeTab === 'jumat' && "Kelola daftar petugas Jumat untuk ditampilkan otomatis setiap hari Jumat."}
                {activeTab === 'pengumuman' && "Buat dan atur pengumuman kegiatan masjid untuk para jamaah."}
                {activeTab === 'keuangan' && "Pantau arus kas masuk dan keluar secara rapi dan presisi."}
                {activeTab === 'qris' && "Atur gambar barcode QRIS dan informasi rekening donasi masjid."}
                {activeTab === 'ied' && "Pengaturan informasi pelaksanaan sholat Idul Fitri dan Idul Adha."}
                {activeTab === 'panduan' && "Pelajari panduan penggunaan aplikasi secara menyeluruh dan mudah."}
                {activeTab === 'profile' && "Kelola profil masjid dan pengaturan sandi administrator."}
              </p>
            </div>
            
            {/* Mobile Header Title (Visible only when title is hidden) */}
            <div className="sm:hidden font-bold text-foreground text-lg">
                {activeTab === 'settings' && "Pengaturan"}
                {activeTab === 'murottal' && "Murottal"}
                {activeTab === 'jadwal' && "Jadwal Sholat"}
                {activeTab === 'jumat' && "Jumat"}
                {activeTab === 'pengumuman' && "Pengumuman"}
                {activeTab === 'keuangan' && "Keuangan"}
                {activeTab === 'qris' && "QRIS"}
                {activeTab === 'ied' && "Sholat Ied"}
                {activeTab === 'panduan' && "Panduan"}
                {activeTab === 'profile' && "Profil"}
            </div>
            
            {/* Status Alert Badge removed, using react-hot-toast now */}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button 
              onClick={() => {
                if (latestUpdateData) {
                  setSystemUpdate(latestUpdateData);
                } else {
                  showAlert("Informasi Sistem", `Tidak ada pembaruan sistem terbaru. Masa tenggang langganan aktif: ${getRemainingDays()} Hari.`);
                }
              }}
              className="p-2 border border-border rounded-full bg-card text-muted-foreground hover:bg-accent hover:text-foreground shadow-sm transition-colors cursor-pointer relative"
              title="Notifikasi"
            >
              {hasUnreadUpdate && (
                <div className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border border-card animate-pulse"></div>
              )}
              <Bell className="h-5 w-5" />
            </button>
            <Button variant="outline" size="icon" className="ml-2 rounded-full" onClick={() => setActiveTab("profile")}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">

          
          {/* ==================== 0. TAB: PROFILE ==================== */}
          {activeTab === "profile" && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/50">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground">Profil Masjid & Keamanan</h2>
                  <p className="text-sm text-muted-foreground mt-1">Kelola data dasar masjid dan pengaturan keamanan administrator Anda.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Data Profil Form */}
                <Card className="bg-card/20 backdrop-blur-3xl border-border/60 shadow-xl shadow-emerald-500/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary"/> Data Profil Organisasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Nama Masjid / Organisasi</label>
                        <Input 
                          value={profileForm.nama_masjid}
                          onChange={(e) => setProfileForm({...profileForm, nama_masjid: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Kota / Kabupaten</label>
                        <Input 
                          value={profileForm.city}
                          disabled
                          className="opacity-70 cursor-not-allowed bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Kota tidak dapat diubah (terhubung ke lisensi sistem sinkronisasi sholat).</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Alamat Lengkap</label>
                        <Input 
                          value={profileForm.alamat_lengkap}
                          onChange={(e) => setProfileForm({...profileForm, alamat_lengkap: e.target.value})}
                          placeholder="misal: Jl. Kenangan No 123..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Alamat Email Kontak</label>
                        <Input 
                          type="email"
                          value={profileForm.email}
                          disabled
                          className="opacity-70 cursor-not-allowed bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Email kontak tidak dapat diubah tanpa verifikasi ulang.</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Nomor WhatsApp Pengelola</label>
                        <Input 
                          type="text"
                          value={profileForm.wa_number}
                          onChange={(e) => setProfileForm({...profileForm, wa_number: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" isLoading={isSaving} className="mt-4 w-full">
                        Simpan Pembaruan Profil
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Ganti Password Form */}
                <Card className="bg-card/20 backdrop-blur-3xl border-border/60 shadow-xl shadow-emerald-500/10 h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary"/> Ubah Password Login
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSave} className="flex flex-col gap-5">
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-lg flex gap-2">
                        <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                        <p className="text-xs">Sistem akan meminta Anda untuk memasukkan password saat ini demi memverifikasi identitas Anda dengan aman.</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Password Saat Ini</label>
                        <Input 
                          type="password"
                          value={profileForm.currentPassword}
                          onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                          required
                          placeholder="Masukkan password yang Anda gunakan sekarang"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Password Baru</label>
                        <Input 
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                          required
                          placeholder="Minimal 6 karakter kombinasi"
                        />
                      </div>
                      <Button type="submit" variant="secondary" isLoading={isSaving} className="mt-4 w-full border border-border hover:border-primary">
                        Perbarui Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}


          {/* ==================== 1. TAB: SETTINGS / DASHBOARD ==================== */}
          {activeTab === "settings" && settings && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
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
                  <Button 
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setSelectedRenewalPackage(masjidRoot?.subscription_package || "berkah");
                      setRenewalModalOpen(true);
                    }}
                    className="shrink-0 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Perpanjang
                  </Button>
                </div>

                <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6">
                  
                  {/* TV LINK SECTION */}
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <label className="text-sm text-primary font-bold mb-2 block">Link Layar TV Anda</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        type="text" 
                        value={tvUrl}
                        readOnly
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(tvUrl);
                            toast.success("Link Layar TV berhasil disalin!");
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Salin
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => window.open(tvUrl, '_blank')}
                          className="flex-1 sm:flex-none"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex gap-1 items-center">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      Gunakan link ini pada Smart TV, Android TV, atau komputer yang tersambung ke layar masjid Anda.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">
                      Custom Logo Masjid <span className="text-muted-foreground text-xs font-normal">(Opsional)</span>
                    </label>
                    <div className="flex gap-3">
                      <Input 
                        type="text" 
                        value={settingsForm.logo_url || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logo_url: e.target.value })}
                        placeholder="https://... atau klik Upload"
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
                              toast.error("Gagal mengolah gambar logo.");
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Interval Rotasi Slide (Detik)</label>
                      <Input 
                        type="number" 
                        value={settingsForm.rotation_interval}
                        onChange={(e) => setSettingsForm({ ...settingsForm, rotation_interval: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Kecepatan Running Text (Detik - Makin Kecil Makin Cepat)</label>
                      <Input 
                        type="number" 
                        value={settingsForm.running_text_speed ?? 45}
                        onChange={(e) => setSettingsForm({ ...settingsForm, running_text_speed: Number(e.target.value) })}
                      />
                    </div>
                  </div>



                  <div className="grid grid-cols-1 gap-6 mt-4">

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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 sm:p-5 rounded-2xl border border-border">
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
                    <Button 
                      type="submit" 
                      size="lg"
                      isLoading={isSaving}
                    >
                      Simpan Perubahan
                    </Button>
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
                        <div className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 shrink-0 ${settingsForm.murottal?.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                          <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform shrink-0 ${settingsForm.murottal?.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
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
                      {settingsForm.murottal?.enabled && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <label className="text-sm font-bold block mb-2">Durasi Putar Video</label>
                          <select 
                            value={settingsForm.murottal?.duration || "always"}
                            onChange={(e) => {
                              setSettingsForm({ ...settingsForm, murottal: { ...settingsForm.murottal, duration: e.target.value }});
                            }}
                            className="bg-input/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full text-foreground"
                          >
                            <option value="always">Putar Terus Menerus</option>
                            <option value="5m">Aktif 5 Menit</option>
                            <option value="10m">Aktif 10 Menit</option>
                            <option value="15m">Aktif 15 Menit</option>
                            <option value="30m">Aktif 30 Menit</option>
                            <option value="1h">Aktif 1 Jam</option>
                            <option value="2h">Aktif 2 Jam</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Link Video YouTube</label>
                      <Input 
                        type="text" 
                        placeholder="Contoh: https://www.youtube.com/watch?v=IPyvDEiUq2s"
                        value={settingsForm.murottal?.url || ""}
                        onChange={(e) => {
                          let val = e.target.value;
                          setSettingsForm({ ...settingsForm, murottal: { ...settingsForm.murottal, url: val } });
                        }}
                      />
                      {settingsForm.murottal?.url && extractYouTubeId(settingsForm.murottal.url) && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border w-full max-w-sm aspect-video relative shadow-sm">
                          <img src={`https://img.youtube.com/vi/${extractYouTubeId(settingsForm.murottal.url)}/hqdefault.jpg`} alt="YouTube Thumbnail" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                            <PlayCircle className="h-12 w-12 text-white/90 drop-shadow-lg" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* POSTER CAMPAIGN SECTION */}
                  <div className="bg-card border-2 border-border p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="h-6 w-6 text-primary"/> Poster Campaign (Slide)
                        {!isPremium && <span className="ml-2 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-500/20"><Lock className="w-3 h-3 inline mr-1 -mt-0.5"/>Hanya Premium</span>}
                      </h3>
                      <Button type="button" disabled={!isPremium} variant="outline" size="sm" onClick={() => {
                        const newPosters = [...(settingsForm.posters || []), ""];
                        setSettingsForm({...settingsForm, posters: newPosters});
                      }} className="border-primary/20 text-primary hover:bg-primary/10">
                        <Plus className="h-4 w-4 mr-1"/> Tambah Poster
                      </Button>
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
                          <Input 
                            type="url" 
                            disabled={!isPremium}
                            placeholder="https://... atau klik Upload"
                            value={poster}
                            onChange={(e) => {
                              const newPosters = [...settingsForm.posters];
                              newPosters[index] = e.target.value;
                              setSettingsForm({...settingsForm, posters: newPosters});
                            }}
                            className="flex-1"
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

                  <Button 
                    type="submit" 
                    size="lg"
                    isLoading={isSaving}
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Simpan Pengaturan Media
                  </Button>
                </form>
              </div>
            </div>
          )}


          {/* ==================== 2. TAB: JADWAL SHOLAT ==================== */}
          {activeTab === "jadwal" && jadwal && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow max-w-5xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h2 className="text-lg font-bold text-foreground">Jadwal Sholat Fardhu</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="text" 
                        placeholder="Cari Kota..."
                        value={citySearchTerm || settingsForm.auto_update?.city || ""}
                        onChange={(e) => {
                          setCitySearchTerm(e.target.value);
                          setSettingsForm({
                            ...settingsForm, 
                            auto_update: { ...settingsForm.auto_update, city: e.target.value }
                          });
                        }}
                        onFocus={() => {
                          if (citySuggestions.length > 0) setShowCityDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                        className="w-56 pl-9 pr-8"
                      />
                      {isSearchingCity && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      
                      {showCityDropdown && citySuggestions.length > 0 && (
                        <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-card border border-border rounded-xl shadow-lg">
                          {citySuggestions.map((city) => (
                            <li 
                              key={city.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const formattedCity = city.lokasi.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                setSettingsForm({
                                  ...settingsForm, 
                                  auto_update: { ...settingsForm.auto_update, city: formattedCity, cityId: city.id }
                                });
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
                    </div>
                    <Button 
                      onClick={handleForceSync}
                      disabled={syncLoading}
                      variant="outline"
                      className="border-primary/20 text-primary hover:bg-primary/10"
                    >
                      <RefreshCw className={`h-4 w-4 ${syncLoading ? "animate-spin" : ""}`} />
                      <span>{syncLoading ? "Mencari..." : "Sync API Otomatis"}</span>
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleJadwalSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                    {["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (
                      <div key={name}>
                        <label className="text-sm text-foreground font-medium mb-2 block">Waktu {name}</label>
                        <Input 
                          type="text" 
                          value={jadwalForm[name] || "00:00"}
                          onChange={(e) => setJadwalForm({ ...jadwalForm, [name]: e.target.value })}
                          className="font-mono font-bold text-lg text-center"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex flex-col gap-1">
                      Koreksi Jadwal API (Offset)
                      <span className="text-sm font-normal text-muted-foreground">Isi dengan nilai plus (misal: 2) atau minus (misal: -2) menit. Klik Sync API untuk menerapkan.</span>
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                      {["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((waktu) => (
                        <div key={waktu} className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                           <label className="text-sm font-bold text-foreground capitalize mb-3 block">{waktu}</label>
                           <Input 
                             type="number" 
                             placeholder="0"
                             value={settingsForm.jadwal_offsets?.[waktu] || ""}
                             onChange={(e) => setSettingsForm({ ...settingsForm, jadwal_offsets: { ...(settingsForm.jadwal_offsets || {}), [waktu]: Number(e.target.value) } })}
                             className="text-center"
                           />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Pengaturan Jeda Iqamah & Durasi Sholat</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((waktu) => (
                        <div key={waktu} className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                           <label className="text-sm font-bold text-foreground capitalize mb-3 block">{waktu}</label>
                           <div className="flex flex-col gap-3">
                             <div>
                               <label className="text-xs text-muted-foreground mb-1 block">Jeda Iqamah (Menit)</label>
                               <Input 
                                 type="number" 
                                 value={settingsForm.jeda_iqamah?.[waktu] ?? 10}
                                 onChange={(e) => setSettingsForm({ ...settingsForm, jeda_iqamah: { ...(settingsForm.jeda_iqamah || {}), [waktu]: Number(e.target.value) } })}
                               />
                             </div>
                             <div>
                               <label className="text-xs text-muted-foreground mb-1 block">Durasi Sholat (Menit)</label>
                               <Input 
                                 type="number" 
                                 value={settingsForm.durasi_sholat?.[waktu] ?? 15}
                                 onChange={(e) => setSettingsForm({ ...settingsForm, durasi_sholat: { ...(settingsForm.durasi_sholat || {}), [waktu]: Number(e.target.value) } })}
                               />
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                       <Button onClick={(e) => { e.preventDefault(); handleSettingsSubmit(e); }}>Simpan Pengaturan Jeda & Offset</Button>
                    </div>
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
                
                <form onSubmit={handleJumatSubmit} className="flex flex-col gap-6">
                  {jumatForm.list && jumatForm.list.map((item, index) => (
                    <div key={index} className="bg-muted/20 border border-border/50 rounded-2xl p-6 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const newList = [...jumatForm.list];
                          newList.splice(index, 1);
                          setJumatForm({ ...jumatForm, list: newList });
                        }}
                        className="absolute top-4 right-4 p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors md:opacity-0 md:group-hover:opacity-100"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Tanggal Jumat</label>
                          <input 
                            type="date" 
                            value={item.tanggal}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].tanggal = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Khatib Jumat</label>
                          <input 
                            type="text" 
                            value={item.khatib}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].khatib = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            placeholder="Nama Khatib"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Imam Jumat</label>
                          <input 
                            type="text" 
                            value={item.imam}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].imam = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            placeholder="Nama Imam"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Muadzin / Bilal</label>
                          <input 
                            type="text" 
                            value={item.muadzin}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].muadzin = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            placeholder="Nama Muadzin"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-border/50">
                    <button 
                      type="button" 
                      onClick={() => {
                        setJumatForm({
                          ...jumatForm,
                          list: [...(jumatForm.list || []), { tanggal: "", khatib: "", imam: "", muadzin: "" }]
                        });
                      }}
                      className="bg-secondary text-secondary-foreground font-bold px-6 py-3 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Tambah Jadwal Jumat
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 flex-1"
                    >
                      {isSaving ? <span className="animate-spin text-xl">⏳</span> : "Simpan Semua Jadwal"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================== 4. TAB: PENGUMUMAN ==================== */}
          {activeTab === "pengumuman" && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-6xl w-full mx-auto pb-20">
              
              {/* Form Col */}
              <div className="md:col-span-4 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                   <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                     <Megaphone className="w-5 h-5" />
                   </div>
                   <h3 className="text-lg font-bold text-foreground">Buat Agenda Baru</h3>
                </div>
                <form onSubmit={handleAddPengumuman} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Judul Pengumuman</label>
                    <input 
                      type="text" 
                      value={newPengumuman.judul}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, judul: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      placeholder="Misal: Kajian Subuh"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Tanggal Agenda</label>
                    <input 
                      type="date" 
                      value={newPengumuman.tanggal}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, tanggal: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Isi Pengumuman</label>
                    <textarea 
                      value={newPengumuman.isi}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, isi: e.target.value })}
                      rows={5}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-none"
                      placeholder="Tuliskan deskripsi lengkap di sini..."
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground font-bold p-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                  >
                    {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Plus className="h-5 w-5" /> Publikasikan Agenda</>}
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="md:col-span-8 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2.5 bg-secondary/80 rounded-xl text-secondary-foreground">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Daftar Pengumuman Aktif</h3>
                </div>
                
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {(pengumuman || []).map((item) => (
                    <div key={item.id} className="group p-5 rounded-2xl border border-border/60 bg-muted/10 hover:bg-card/40 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-xs font-bold text-primary">
                             {item.tanggal}
                           </span>
                           <h4 className="text-base font-bold text-foreground">{item.judul || "Pengumuman"}</h4>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{item.isi}</p>
                      </div>
                      <button 
                        onClick={() => handleDeletePengumuman(item.id)}
                        className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer shrink-0 md:opacity-0 group-hover:opacity-100"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {(!pengumuman || pengumuman.length === 0) && (
                    <div className="text-center py-20 flex flex-col items-center justify-center text-muted-foreground opacity-60">
                      <Megaphone className="w-16 h-16 mb-4" />
                      <p className="text-lg font-medium">Belum ada pengumuman aktif.</p>
                      <p className="text-sm">Buat agenda baru di panel sebelah kiri.</p>
                    </div>
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
                
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Catat Transaksi Baru</h3>
                  </div>
                  
                  {/* TYPE SELECTOR TABS */}
                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => {
                        setTransactionType("masuk");
                        setNewKeuangan({ ...newKeuangan, kategori: "", pemasukan: newKeuangan.pemasukan || newKeuangan.pengeluaran, pengeluaran: 0 });
                      }}
                      className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${transactionType === "masuk" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/50" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                      <TrendingUp className="w-5 h-5" /> Pemasukan Baru
                    </button>
                    <button 
                      onClick={() => {
                        setTransactionType("keluar");
                        setNewKeuangan({ ...newKeuangan, kategori: "", pengeluaran: newKeuangan.pemasukan || newKeuangan.pengeluaran, pemasukan: 0 });
                      }}
                      className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${transactionType === "keluar" ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 ring-2 ring-destructive/50" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                    >
                      <TrendingDown className="w-5 h-5" /> Pengeluaran Baru
                    </button>
                  </div>

                  <form onSubmit={handleAddKeuangan} className="grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Tanggal</label>
                      <input 
                        type="date" 
                        value={newKeuangan.tanggal}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, tanggal: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Kategori</label>
                      <input 
                        list="kategori-options"
                        placeholder="Pilih atau ketik kategori..."
                        value={newKeuangan.kategori}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, kategori: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                      <datalist id="kategori-options">
                        {transactionType === "masuk" ? (
                          <>
                            <option value="Infak Jumat" />
                            <option value="Infak Harian / Kotak Amal" />
                            <option value="Donatur Tetap" />
                            <option value="Zakat & Fidyah" />
                            <option value="Hibah / Lainnya" />
                          </>
                        ) : (
                          <>
                            <option value="Operasional & Pemeliharaan" />
                            <option value="Utilitas (Listrik/Air/Internet)" />
                            <option value="Pembangunan & Renovasi" />
                            <option value="Kajian, Dakwah & Pendidikan" />
                            <option value="Kegiatan Sosial / Santunan" />
                            <option value="Gaji Imam / Marbot / Pegawai" />
                          </>
                        )}
                      </datalist>
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Keterangan / Deskripsi</label>
                      <input 
                        type="text" 
                        placeholder={transactionType === "masuk" ? "Cth: Infak Kotak Amal..." : "Cth: Bayar Listrik..."}
                        value={newKeuangan.deskripsi}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, deskripsi: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Nominal (Rp)</label>
                      <input 
                        type="text" 
                        placeholder="0"
                        value={transactionType === "masuk" 
                          ? (newKeuangan.pemasukan ? newKeuangan.pemasukan.toLocaleString('id-ID') : "") 
                          : (newKeuangan.pengeluaran ? newKeuangan.pengeluaran.toLocaleString('id-ID') : "")}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^0-9]/g, '');
                          const val = Number(rawValue);
                          if (transactionType === "masuk") {
                            setNewKeuangan({ ...newKeuangan, pemasukan: val, pengeluaran: 0 });
                          } else {
                            setNewKeuangan({ ...newKeuangan, pemasukan: 0, pengeluaran: val });
                          }
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                    </div>
                    
                    <div className="col-span-12 flex justify-end mt-2 pt-4 border-t border-border/50">
                      <button type="submit" disabled={isSaving} className={`${transactionType === "masuk" ? "bg-primary" : "bg-destructive"} text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50`}>
                        {isSaving ? <span className="animate-spin text-xl">⏳</span> : <>Simpan {transactionType === "masuk" ? "Pemasukan" : "Pengeluaran"}</>}
                      </button>
                    </div>
                  </form>
                </div>

                {/* TV Display Settings */}
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm mb-4">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Pengaturan Tampilan Layar TV</h3>
                      <p className="text-sm text-muted-foreground mt-1">Pilih rentang waktu laporan keuangan yang akan ditampilkan otomatis pada Smart TV masjid.</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSaveTVSettings} className="flex flex-col md:flex-row md:items-end gap-6">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-bold text-foreground/80">Rentang Waktu Laporan (di TV)</label>
                      <select 
                        value={settingsForm.keuangan_tv_filter?.type || 'weekly'}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          keuangan_tv_filter: { ...(settingsForm.keuangan_tv_filter || {}), type: e.target.value }
                        })}
                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="weekly">Otomatis (7 Hari Terakhir)</option>
                        <option value="monthly">Otomatis (Bulan Ini)</option>
                        <option value="custom">Rentang Tanggal Manual...</option>
                      </select>
                    </div>

                    {settingsForm.keuangan_tv_filter?.type === 'custom' && (
                      <div className="flex-2 flex items-center gap-3">
                        <div className="w-full space-y-2">
                          <label className="text-sm font-bold text-foreground/80">Dari Tanggal</label>
                          <input 
                            type="date"
                            value={settingsForm.keuangan_tv_filter?.customStart || ''}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              keuangan_tv_filter: { ...(settingsForm.keuangan_tv_filter || {}), customStart: e.target.value }
                            })}
                            className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <span className="mt-8 text-muted-foreground font-bold">-</span>
                        <div className="w-full space-y-2">
                          <label className="text-sm font-bold text-foreground/80">Sampai Tanggal</label>
                          <input 
                            type="date"
                            value={settingsForm.keuangan_tv_filter?.customEnd || ''}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              keuangan_tv_filter: { ...(settingsForm.keuangan_tv_filter || {}), customEnd: e.target.value }
                            })}
                            className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    )}

                    <button type="submit" className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all w-full md:w-auto h-[46px]">
                      Simpan TV
                    </button>
                  </form>
                </div>

                {/* Ledger Table */}
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-5 mb-6 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-secondary/80 rounded-xl text-secondary-foreground">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Buku Kas Rekapitulasi</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <select 
                            value={keuanganFilterType} 
                            onChange={(e) => setKeuanganFilterType(e.target.value)}
                            className="bg-background border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="all">Semua Waktu</option>
                            <option value="weekly">7 Hari Terakhir</option>
                            <option value="monthly">Bulan Ini</option>
                            <option value="custom">Pilih Tanggal...</option>
                          </select>
                          {keuanganFilterType === 'custom' && (
                            <div className="flex items-center gap-2">
                              <input 
                                type="date" 
                                value={keuanganCustomDate.start}
                                onChange={(e) => setKeuanganCustomDate({...keuanganCustomDate, start: e.target.value})}
                                className="bg-background border border-input rounded-xl px-2 py-2 text-sm"
                              />
                              <span className="text-muted-foreground">-</span>
                              <input 
                                type="date" 
                                value={keuanganCustomDate.end}
                                onChange={(e) => setKeuanganCustomDate({...keuanganCustomDate, end: e.target.value})}
                                className="bg-background border border-input rounded-xl px-2 py-2 text-sm"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-xl text-sm font-semibold transition-colors">
                            <Download className="w-4 h-4" /> PDF
                          </button>
                          <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-semibold transition-colors">
                            <Download className="w-4 h-4" /> Excel
                          </button>
                        </div>
                      </div>
                    </div>

                  <div className="overflow-x-auto custom-scrollbar pb-4">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Tanggal</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-2/6">Keterangan</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Kategori</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Nominal</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Status</th>
                          <th className="py-4 px-5 border-b border-border w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {filteredKeuangan.map((item, index) => {
                          const isIncome = item.pemasukan > 0;
                          return (
                            <tr key={item.id} className={`group hover:bg-muted/30 transition-colors ${index % 2 === 1 ? 'bg-muted/10' : 'bg-transparent'}`}>
                              <td className="py-5 px-5 text-sm font-semibold text-foreground whitespace-nowrap">{item.tanggal}</td>
                              <td className="py-5 px-5 text-sm text-foreground/90 font-medium leading-relaxed">{item.deskripsi}</td>
                              <td className="py-5 px-5">
                                <span className="inline-flex px-3 py-1.5 bg-secondary/20 text-secondary-foreground text-xs font-bold rounded-lg border border-secondary/40 whitespace-nowrap">
                                  {item.kategori || "-"}
                                </span>
                              </td>
                              <td className={`py-5 px-5 text-sm font-mono font-bold whitespace-nowrap ${isIncome ? 'text-primary' : 'text-destructive'}`}>
                                Rp {Number(isIncome ? item.pemasukan : item.pengeluaran).toLocaleString("id-ID")}
                              </td>
                              <td className="py-5 px-5 whitespace-nowrap">
                                <span className={`inline-flex px-4 py-1.5 text-xs font-bold rounded-full border ${
                                  isIncome 
                                    ? "bg-primary/15 text-primary border-primary/30" 
                                    : "bg-destructive/15 text-destructive border-destructive/30"
                                }`}>
                                  {isIncome ? "Pemasukan" : "Pengeluaran"}
                                </span>
                              </td>
                              <td className="py-5 px-5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setEditingKeuangan(item)}
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-4.5 w-4.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteKeuangan(item.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredKeuangan.length === 0 && (
                          <tr>
                            <td colSpan="6" className="py-20 text-center">
                               <div className="flex flex-col items-center justify-center text-muted-foreground opacity-60">
                                  <Wallet className="w-16 h-16 mb-4" />
                                  <p className="text-lg font-bold">Belum ada transaksi</p>
                                  <p className="text-sm mt-1">Mulai catat pemasukan atau pengeluaran pertama Anda.</p>
                               </div>
                            </td>
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
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-primary/10 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto w-full">
                
                <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/50">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <QrCode className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Pengaturan QRIS Donasi</h2>
                    <p className="text-sm text-muted-foreground mt-1">Perbarui barcode QRIS dan rekening untuk kemudahan jamaah berdonasi.</p>
                  </div>
                </div>
                
                <form onSubmit={handleQrisSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Nama Merchant (Atas Nama)</label>
                    <input 
                      type="text" 
                      value={qrisForm.atas_nama}
                      placeholder="Cth: Masjid Al-Ikhlas"
                      onChange={(e) => setQrisForm({ ...qrisForm, atas_nama: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-medium transition-all shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Building className="w-4 h-4"/> Nama Bank / E-Wallet</label>
                      <input 
                        type="text" 
                        value={qrisForm.bank}
                        placeholder="Cth: BSI / Gopay"
                        onChange={(e) => setQrisForm({ ...qrisForm, bank: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-medium transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Nomor Rekening</label>
                      <input 
                        type="text" 
                        value={qrisForm.nomor_rekening}
                        placeholder="Cth: 7123456789"
                        onChange={(e) => setQrisForm({ ...qrisForm, nomor_rekening: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-mono font-bold tracking-wide transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Keterangan Ajakan</label>
                    <input 
                      type="text" 
                      value={qrisForm.keterangan}
                      placeholder="Cth: Salurkan infak terbaik Anda melalui QRIS di atas"
                      onChange={(e) => setQrisForm({ ...qrisForm, keterangan: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-medium transition-all shadow-inner"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><QrCode className="w-4 h-4"/> Gambar QRIS</label>
                    
                    <div className="relative group rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors overflow-hidden">
                      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
                        {qrisForm.gambar ? (
                          <div className="relative w-48 h-48 rounded-xl bg-white shadow-md p-3 group-hover:scale-105 transition-transform duration-300">
                            <Image src={qrisForm.gambar} alt="QR Preview" fill className="object-contain p-2 mix-blend-multiply" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl bg-white shadow-sm flex items-center justify-center text-muted-foreground mb-4 opacity-50">
                             <QrCode className="w-12 h-12" />
                          </div>
                        )}
                        
                        <div className="mt-6 flex flex-col items-center">
                          <div className="flex items-center gap-2 text-primary font-bold bg-white px-5 py-2.5 rounded-full shadow-sm pointer-events-none">
                            <UploadCloud className="w-5 h-5" />
                            {qrisForm.gambar ? "Ganti Gambar QRIS" : "Pilih Gambar QRIS"}
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 font-medium">Format: JPG, PNG (Maks 2MB)</p>
                        </div>
                      </div>
                      
                      {/* Invisible absolute file input covering the whole dropzone */}
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Upload gambar QRIS baru"
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-2 border-t border-border/50">
                    <button type="submit" disabled={isSaving} className="w-full bg-primary text-primary-foreground font-bold py-4 px-6 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0">
                      {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Save className="w-5 h-5" /> Simpan Data QRIS</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            </div>
          )}

          {/* ==================== 6.5. TAB: SHOLAT IED ==================== */}
          {activeTab === "ied" && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-6 max-w-7xl w-full mx-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Form Idul Fitri */}
                  <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-teal-500/10 rounded-3xl p-8 transition-all hover:shadow-teal-500/20 group">
                    <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/50">
                      <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-500 group-hover:scale-110 transition-transform">
                        <Moon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Idul Fitri</h2>
                        <p className="text-sm text-muted-foreground mt-1">Pengaturan jadwal sholat Idul Fitri.</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleIdulFitriSubmit} className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tahun Hijriah</label>
                          <input type="text" placeholder="Cth: 1445 H" value={fitriForm.tahun} onChange={(e) => setFitriForm({ ...fitriForm, tahun: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tanggal (Masehi)</label>
                          <input type="date" value={fitriForm.tanggal} onChange={(e) => setFitriForm({ ...fitriForm, tanggal: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Imam</label>
                          <input type="text" placeholder="Nama Imam" value={fitriForm.imam} onChange={(e) => setFitriForm({ ...fitriForm, imam: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Khatib</label>
                          <input type="text" placeholder="Nama Khatib" value={fitriForm.khatib} onChange={(e) => setFitriForm({ ...fitriForm, khatib: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Volume2 className="w-4 h-4"/> Bilal / Muadzin</label>
                          <input type="text" placeholder="Nama Bilal" value={fitriForm.muadzin} onChange={(e) => setFitriForm({ ...fitriForm, muadzin: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Clock className="w-4 h-4"/> Waktu Pelaksanaan</label>
                          <input type="time" value={fitriForm.waktu} onChange={(e) => setFitriForm({ ...fitriForm, waktu: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner font-mono" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><MapPin className="w-4 h-4"/> Keterangan Tambahan</label>
                        <input type="text" placeholder="Cth: Dilaksanakan di Lapangan Utama Masjid" value={fitriForm.keterangan} onChange={(e) => setFitriForm({ ...fitriForm, keterangan: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                      </div>
                      
                      <div className="pt-4 mt-2 border-t border-border/50">
                        <button type="submit" disabled={isSaving} className="w-full bg-teal-500 text-white font-bold py-4 px-6 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/30 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0">
                          {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Save className="w-5 h-5" /> Simpan Data Idul Fitri</>}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Form Idul Adha */}
                  <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-indigo-500/10 rounded-3xl p-8 transition-all hover:shadow-indigo-500/20 group">
                    <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/50">
                      <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                        <Moon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Idul Adha</h2>
                        <p className="text-sm text-muted-foreground mt-1">Pengaturan jadwal sholat Idul Adha.</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleIdulAdhaSubmit} className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tahun Hijriah</label>
                          <input type="text" placeholder="Cth: 1445 H" value={adhaForm.tahun} onChange={(e) => setAdhaForm({ ...adhaForm, tahun: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tanggal (Masehi)</label>
                          <input type="date" value={adhaForm.tanggal} onChange={(e) => setAdhaForm({ ...adhaForm, tanggal: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Imam</label>
                          <input type="text" placeholder="Nama Imam" value={adhaForm.imam} onChange={(e) => setAdhaForm({ ...adhaForm, imam: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Khatib</label>
                          <input type="text" placeholder="Nama Khatib" value={adhaForm.khatib} onChange={(e) => setAdhaForm({ ...adhaForm, khatib: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Volume2 className="w-4 h-4"/> Bilal / Muadzin</label>
                          <input type="text" placeholder="Nama Bilal" value={adhaForm.muadzin} onChange={(e) => setAdhaForm({ ...adhaForm, muadzin: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Clock className="w-4 h-4"/> Waktu Pelaksanaan</label>
                          <input type="time" value={adhaForm.waktu} onChange={(e) => setAdhaForm({ ...adhaForm, waktu: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner font-mono" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><MapPin className="w-4 h-4"/> Keterangan Tambahan</label>
                        <input type="text" placeholder="Cth: Dilaksanakan di Lapangan Utama Masjid" value={adhaForm.keterangan} onChange={(e) => setAdhaForm({ ...adhaForm, keterangan: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                      </div>
                      
                      <div className="pt-4 mt-2 border-t border-border/50">
                        <button type="submit" disabled={isSaving} className="w-full bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0">
                          {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Save className="w-5 h-5" /> Simpan Data Idul Adha</>}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                </div>
              </div>
            </div>
          )}

                    {/* ==================== 7. TAB: PANDUAN ==================== */}
          {activeTab === "panduan" && (
            <div className="animate-fade-in flex flex-col gap-6 w-full max-w-5xl mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-6 mb-10 gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-foreground flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-primary" /> Panduan Penggunaan
                    </h2>
                    <p className="text-muted-foreground mt-2">Buku saku komprehensif untuk pengurus masjid dalam mengelola sistem InfoMasjid.</p>
                  </div>
                  
                  {/* The PDF button logic remains the same but text updated slightly */}
                  <button 
                    onClick={async () => {
                      try {
                        const htmlContent = document.getElementById("panduan-content").innerHTML;
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
                                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
                                h1, h2, h3, h4 { color: #059669; }
                                h1 { border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 30px; font-size: 24px; }
                                h2 { margin-top: 40px; margin-bottom: 20px; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 8px;}
                                h3 { margin-top: 25px; font-size: 16px; color: #1f2937; }
                                .text-primary { color: #059669; }
                                .bg-primary { background-color: #059669; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
                                ul, ol { margin-bottom: 20px; padding-left: 20px; }
                                li { margin-bottom: 8px; }
                                p { margin-bottom: 15px; }
                                .bg-muted\/30 { background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px; }
                                .warning { background-color: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-top: 40px; color: #b91c1c; }
                                svg { display: none; } /* Hide icons in print for cleaner look */
                                @media print {
                                  body { padding: 0; max-width: none; }
                                  @page { margin: 2cm; }
                                  .bg-muted\/30 { break-inside: avoid; }
                                }
                              </style>
                            </head>
                            <body>
                              <h1>🕌 Buku Panduan InfoMasjid v1.0</h1>
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
                    className="bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all shadow-sm shrink-0"
                  >
                    <Download className="w-5 h-5" /> Cetak / Download PDF
                  </button>
                </div>
                
                {/* INLINE DETAILED CONTENT */}
                <div id="panduan-content" className="space-y-16 max-w-none">
                  
                  {/* BAGIAN 1: KONSEP DASAR */}
                  <section>
                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                      <span className="bg-primary/20 text-primary h-10 w-10 rounded-2xl flex items-center justify-center text-lg">1</span> 
                      Konsep Dasar Sistem InfoMasjid
                    </h2>
                    <div className="prose prose-emerald prose-invert max-w-none text-foreground/80 space-y-4">
                      <p>
                        Sistem <strong>InfoMasjid</strong> dirancang khusus untuk memodernisasi cara takmir masjid menyampaikan informasi kepada jamaah. Sistem ini bekerja melalui teknologi awan (<em>Cloud</em>) dan memiliki 2 bagian utama:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Frontend (Layar TV):</strong> Adalah tampilan antarmuka yang dilihat oleh jamaah di dalam masjid. Tampilan ini diputar pada layar Smart TV dan akan selalu merotasi informasi secara otomatis.</li>
                        <li><strong>Backend (Panel Admin):</strong> Adalah halaman tempat Anda berada saat ini. Halaman ini digunakan oleh pengurus masjid untuk mengubah tulisan, gambar, jadwal, dan keuangan.</li>
                      </ul>
                      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-4 text-primary font-medium">
                        ✨ <strong>Keunggulan Real-Time:</strong> Anda tidak perlu menarik kabel apapun ke TV. Selama TV terhubung ke internet, apapun yang Anda ketik di Panel Admin (melalui HP atau Laptop dari rumah sekalipun) akan otomatis langsung berubah di layar TV masjid detik itu juga!
                      </div>
                    </div>
                  </section>

                  {/* BAGIAN 2: INSTALASI TV */}
                  <section>
                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                      <span className="bg-primary/20 text-primary h-10 w-10 rounded-2xl flex items-center justify-center text-lg">2</span> 
                      Panduan Instalasi & Persiapan TV
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2"><Settings className="w-5 h-5 text-primary"/> Kebutuhan Perangkat</h4>
                        <ul className="text-sm text-foreground/80 space-y-2 pl-5 list-decimal">
                          <li><strong>Layar Layak:</strong> Smart TV / Android TV berukuran 40-inch ke atas (disarankan).</li>
                          <li>Jika menggunakan TV biasa, gunakan <strong>Android TV Box</strong> atau <strong>Mini PC</strong> yang dihubungkan via kabel HDMI.</li>
                          <li><strong>Koneksi Internet (WIFI):</strong> Pastikan TV terhubung ke WIFI masjid (kecepatan 5 Mbps sudah cukup, yang penting stabil).</li>
                        </ul>
                      </div>
                      
                      <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2"><PlayCircle className="w-5 h-5 text-primary"/> Langkah Menyalakan TV</h4>
                        
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-300 mb-3">
                          <p className="font-bold mb-1">A. Rekomendasi Utama (Android TV / STB)</p>
                          <ul className="pl-4 list-decimal space-y-1 mt-1">
                            <li>Instal aplikasi <strong>Fully Kiosk Browser</strong> dari Play Store TV.</li>
                            <li>Masukkan Link TV Anda (di atas) ke dalam pengaturan <em>Start URL</em>.</li>
                            <li>Aktifkan fitur <strong>Auto-Start on Boot</strong>.</li>
                            <li className="font-semibold text-primary">Begitu TV dicolokkan listrik/dinyalakan, InfoMasjid akan otomatis terbuka <em>Full Screen</em> tanpa perlu disentuh marbot!</li>
                          </ul>
                        </div>
                        
                        <div className="text-sm text-foreground/80">
                          <p className="font-bold mb-1">B. Cara Manual (Browser Biasa)</p>
                          <ul className="pl-5 list-decimal space-y-1">
                            <li>Buka aplikasi Browser (Chrome/bawaan TV).</li>
                            <li>Ketik Link TV Anda di kolom pencarian.</li>
                            <li>Tekan <strong>F11</strong> atau cari opsi <em>Fullscreen</em> di remote agar URL hilang.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* PERINGATAN AUTOPLAY */}
                    <div className="bg-destructive/10 border-2 border-destructive/30 p-6 rounded-2xl flex items-start gap-4 shadow-lg shadow-destructive/5">
                      <AlertTriangle className="h-10 w-10 text-destructive shrink-0" />
                      <div>
                        <h4 className="text-lg font-black text-destructive mb-2">PENTING: Aturan Autoplay Suara (Wajib Dibaca!)</h4>
                        <div className="text-sm text-foreground/80 space-y-3">
                          <p>Untuk alasan keamanan web, browser (Chrome/TV) <strong>memblokir suara apapun untuk diputar secara otomatis</strong> sebelum ada manusia yang berinteraksi dengan layar.</p>
                          <p className="bg-destructive/15 p-3 rounded-lg text-destructive font-bold">
                            SOLUSI: Setiap kali TV baru dinyalakan (atau browser baru dibuka), Anda WAJIB mengklik area mana saja di layar TV satu kali menggunakan Mouse / Remote TV.
                          </p>
                          <p>Jika Anda tidak melakukan "Klik Pertama" ini, maka <strong>Suara Adzan, Suara Beep Iqamah, dan Suara Murottal YouTube TIDAK AKAN KELUAR.</strong> Setelah diklik satu kali, suara akan lancar selama 24 jam nonstop.</p>
                          <p className="font-medium"><em>Tip: Agar tampilan terlihat rapi, ubah browser ke mode layar penuh (Full Screen) dengan menekan tombol F11 di keyboard.</em></p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* BAGIAN 3: PANDUAN MENU ADMIN */}
                  <section>
                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                      <span className="bg-primary/20 text-primary h-10 w-10 rounded-2xl flex items-center justify-center text-lg">3</span> 
                      Panduan Operasional Tiap Tab (Step-by-Step)
                    </h2>
                    
                    <div className="space-y-8">
                      {/* Dashboard Global */}
                      <div className="bg-card/40 border border-border p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                          <LayoutDashboard className="w-6 h-6"/> Tab 1: Dashboard Global
                        </h3>
                        <p className="text-sm text-foreground/80 mb-4">Tempat Anda mengatur "Wajah" identitas dari TV Masjid Anda.</p>
                        <ol className="list-decimal pl-5 text-sm text-foreground/80 space-y-3">
                          <li><strong>Identitas:</strong> Ketikkan Nama Masjid dan Alamat singkat. Data ini akan terus tampil di pojok kiri atas TV.</li>
                          <li><strong>Teks Berjalan (Marquee):</strong> Ketik kalimat sambutan atau himbauan. Gunakan tanda koma atau spasi panjang untuk memisahkan antar kalimat. Teks ini akan mengalir terus menerus di pita bawah TV.</li>
                          <li><strong>Tema Tampilan:</strong> Pilih Skema Warna yang paling serasi dengan warna cat bangunan masjid Anda.</li>
                          <li><strong>Durasi Layar:</strong> Atur berapa detik sebuah informasi ditayangkan sebelum berpindah ke informasi berikutnya (Standarnya adalah 10-15 detik).</li>
                          <li><strong>Upload Poster:</strong> Jika ada kajian akbar atau poster sumbangan, klik area kotak gambar untuk mengunggah poster (Maksimal 2 MB agar TV tidak berat saat meload gambar). Poster akan masuk secara otomatis dalam urutan rotasi layar.</li>
                          <li>Klik tombol <strong>Simpan Pengaturan Global</strong> setelah selesai mengubah data.</li>
                        </ol>
                      </div>

                      {/* Media & Murottal */}
                      <div className="bg-card/40 border border-border p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                          <PlayCircle className="w-6 h-6"/> Tab 2: Media & Murottal
                        </h3>
                        <p className="text-sm text-foreground/80 mb-4">Fitur interaktif untuk memutar Murottal Al-Quran atau menyiarkan Livestreaming Kajian dari YouTube secara langsung ke TV Masjid.</p>
                        <ol className="list-decimal pl-5 text-sm text-foreground/80 space-y-3">
                          <li>Buka aplikasi YouTube, cari video kajian atau Murottal yang diinginkan.</li>
                          <li>Salin (<em>Copy</em>) URL/Link video tersebut (Contoh: <code className="bg-muted px-1 rounded text-primary">https://www.youtube.com/watch?v=abcd123</code>).</li>
                          <li>Tempel (<em>Paste</em>) link tersebut ke dalam kolom input di Admin.</li>
                          <li>Klik saklar (*Toggle*) hingga berubah menjadi warna hijau bersinar (Posisi ON).</li>
                          <li><strong>Keajaiban terjadi:</strong> TV di ruang masjid akan seketika menghentikan putaran informasinya, lalu beralih menampilkan video YouTube layar penuh beserta suaranya secara otomatis.</li>
                          <li>Jika video selesai (tamat) atau Anda mematikan saklar (Posisi OFF), layar TV akan langsung kembali berotasi menampilkan informasi normal tanpa harus disentuh.</li>
                        </ol>
                      </div>

                      {/* Jadwal Sholat */}
                      <div className="bg-card/40 border border-border p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                          <Clock className="w-6 h-6"/> Tab 3: Jadwal Sholat
                        </h3>
                        <p className="text-sm text-foreground/80 mb-4">Otak dari sistem ini. Mengambil data kalender presisi secara online yang otomatis mengubah jam adzan.</p>
                        <ol className="list-decimal pl-5 text-sm text-foreground/80 space-y-3">
                          <li>Sistem secara bawaan akan mengambil lokasi dari koneksi internet Anda. Anda bisa menggantinya dengan mengetik nama Kota/Kabupaten masjid Anda berada.</li>
                          <li><strong>Penyesuaian Manual (+/-):</strong> Seringkali jadwal resmi Kemenag berbeda 1 atau 2 menit dengan jam masjid setempat. Jika adzan TV terlalu cepat, tambahkan angka (Misal: <code>2</code> untuk +2 Menit). Jika TV terlambat adzan, ketik angka minus (Misal: <code>-1</code> untuk dimundurkan 1 menit).</li>
                          <li><strong>Hitung Mundur Iqamah:</strong> Tentukan waktu jeda antara Adzan dan Iqamah. (Misal: Subuh 15 menit, Maghrib 10 menit). Saat waktu Iqamah habis, TV akan mengeluarkan suara bunyi "Bip" panjang.</li>
                          <li><strong>Durasi Layar Hitam (Salat):</strong> TV akan meredup dan berubah menjadi hitam pekat saat salat berlangsung agar tidak menyilaukan jamaah. Atur durasi berapa lama layar menjadi hitam (Misal: 15 menit untuk Dzuhur). Setelah waktu habis, layar TV akan menyala terang kembali secara ajaib.</li>
                        </ol>
                      </div>

                      {/* Petugas Jumat & Pengumuman */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card/40 border border-border p-6 rounded-2xl">
                          <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                            <Calendar className="w-6 h-6"/> Tab 4: Petugas Jumat
                          </h3>
                          <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                            <li>Ketikkan nama para petugas ibadah Jumat minggu ini (Imam, Khatib, dsb).</li>
                            <li><strong>Logika Sistem:</strong> Informasi ini sangat pintar. Kartu "Petugas Jumat" hanya akan memunculkan dirinya di TV secara otomatis pada hari <strong>Kamis dan Jumat</strong>. Pada hari lain (Sabtu-Rabu), slide ini akan disembunyikan agar TV tidak dipenuhi info yang belum relevan.</li>
                          </ul>
                        </div>
                        
                        <div className="bg-card/40 border border-border p-6 rounded-2xl">
                          <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                            <Volume2 className="w-6 h-6"/> Tab 5: Pengumuman
                          </h3>
                          <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                            <li>Tuliskan laporan warga, ajakan berinfak, atau jadwal kajian.</li>
                            <li>Pecah kalimat yang sangat panjang menjadi beberapa baris pengumuman dengan menekan tombol <strong>"+ Tambah"</strong> berulang kali.</li>
                            <li>TV akan membagi pengumuman menjadi daftar buletin (*bullet points*). Jika teks terlalu banyak, TV akan cerdas memecahnya menjadi beberapa halaman (paginasi) yang berputar otomatis setiap sekian detik.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Kas Keuangan */}
                      <div className="bg-card/40 border border-border p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                          <DollarSign className="w-6 h-6"/> Tab 6: Kas Keuangan
                        </h3>
                        <p className="text-sm text-foreground/80 mb-4">Sistem akutansi mini transparan untuk melaporkan dana umat.</p>
                        <ol className="list-decimal pl-5 text-sm text-foreground/80 space-y-3">
                          <li><strong>Cara Tambah Data:</strong> Tentukan Tanggal transaksi. Pilih jenisnya (Pemasukan warna hijau, Pengeluaran warna merah).</li>
                          <li>Ketikkan angka nominal langsung (Misalnya: <code>1500000</code>). Sistem otomatis akan mengubah formatnya menjadi format uang (Rp 1.500.000).</li>
                          <li>Berikan deskripsi yang jelas (Contoh: "Kotak Amal Jumat" atau "Bayar Tagihan Listrik PLN").</li>
                          <li><strong>Logika Saldo:</strong> Anda tidak perlu mengetikkan Sisa Saldo. Cukup masukkan pemasukan dan pengeluaran, mesin kami akan menghitung sisa "Saldo Akhir Kas" secara presisi secara real-time.</li>
                        </ol>
                      </div>

                      {/* QRIS & Ied */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card/40 border border-border p-6 rounded-2xl">
                          <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                            <QrCode className="w-6 h-6"/> Tab 7: QRIS Donasi
                          </h3>
                          <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                            <li>Klik area kotak garis putus-putus untuk memilih gambar Barcode QRIS yang di-download dari bank.</li>
                            <li><strong>Syarat Gambar:</strong> Pastikan gambar tidak pecah agar mudah di-*scan* oleh kamera HP jamaah dari jarak jauh.</li>
                            <li>Isikan juga nama merchant, bank, dan rekening cadangan bagi jamaah yang aplikasinya tidak support scan QR.</li>
                          </ul>
                        </div>
                        
                        <div className="bg-card/40 border border-border p-6 rounded-2xl">
                          <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
                            <Moon className="w-6 h-6"/> Tab 8: Sholat Ied
                          </h3>
                          <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                            <li>Persiapkan data ini seminggu sebelum Hari Raya Idul Fitri atau Idul Adha.</li>
                            <li>Isi dengan cermat karena data ini biasanya paling ditunggu-tunggu jamaah untuk mengetahui jam pelaksanaan salat yang tepat di lapangan.</li>
                          </ul>
                        </div>
                      </div>

                    </div>
                  </section>
                  
                  {/* BAGIAN 4: TROUBLESHOOTING */}
                  <section className="border-t border-border/50 pt-10">
                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3 mb-6">
                      <ShieldCheck className="h-8 w-8 text-primary" /> Kendala Umum (Troubleshooting)
                    </h2>
                    <div className="space-y-4">
                      <details className="bg-card border border-border p-4 rounded-xl cursor-pointer group">
                        <summary className="font-bold text-foreground outline-none list-none flex items-center justify-between">
                          <span>❓ Mengapa Layar TV Tiba-tiba Menjadi Gelap/Hitam?</span>
                          <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-foreground/70 leading-relaxed pt-3 border-t border-border/50">
                          Jangan panik, ini BUKAN error. Ini adalah fitur "Layar Khusyuk". Sistem mendeteksi bahwa saat ini sedang berlangsung waktu ibadah salat (setelah durasi Iqamah habis). TV dengan sengaja dimatikan agar jamaah tidak terdistraksi melihat layar saat salat. TV akan hidup kembali dengan sendirinya setelah waktu durasi salat habis.
                        </p>
                      </details>
                      
                      <details className="bg-card border border-border p-4 rounded-xl cursor-pointer group">
                        <summary className="font-bold text-foreground outline-none list-none flex items-center justify-between">
                          <span>❓ Saya sudah mengubah data di HP, tapi layar di TV masjid tidak berubah?</span>
                          <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-foreground/70 leading-relaxed pt-3 border-t border-border/50">
                          Penyebab utamanya adalah koneksi internet terputus. Sistem *Real-Time* membutuhkan akses internet yang tersambung di kedua belah pihak. Pastikan: 1) HP Anda terhubung ke internet saat menyimpan data. 2) WIFI yang menyambung ke TV tidak mati (Indihome/Biznet/dsb sedang tidak gangguan). Jika WIFI TV sempat mati, coba *refresh* / muat ulang *browser* di TV menggunakan remote.
                        </p>
                      </details>

                      <details className="bg-card border border-border p-4 rounded-xl cursor-pointer group">
                        <summary className="font-bold text-foreground outline-none list-none flex items-center justify-between">
                          <span>❓ Suara Murottal YouTube / Suara Iqamah tidak berbunyi?</span>
                          <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-foreground/70 leading-relaxed pt-3 border-t border-border/50">
                          Seperti peringatan wajib di atas, browser Chrome di TV Anda sedang memblokir *Auto-Play* audio. Ambil mouse / remote TV, lalu gerakkan kursor dan <strong>KLIK</strong> satu kali di area manapun di dalam layar web InfoMasjid tersebut. Suara akan segera berfungsi setelah layar tersebut mendapatkan 1 kali respon sentuhan.
                        </p>
                      </details>
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

      {/* EDIT KEUANGAN MODAL */}
      {editingKeuangan && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setEditingKeuangan(null)}></div>
          <div className="relative bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Edit Transaksi Keuangan</h3>
            
            <form onSubmit={handleUpdateKeuangan} className="grid grid-cols-12 gap-5 items-end">
              <div className="col-span-12 md:col-span-4">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Tanggal</label>
                <input 
                  type="date" 
                  value={editingKeuangan.tanggal}
                  onChange={(e) => setEditingKeuangan({ ...editingKeuangan, tanggal: e.target.value })}
                  className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="col-span-12 md:col-span-8">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Keterangan / Deskripsi</label>
                <input 
                  type="text" 
                  value={editingKeuangan.deskripsi}
                  onChange={(e) => setEditingKeuangan({ ...editingKeuangan, deskripsi: e.target.value })}
                  className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Kategori</label>
                <input 
                  list="kategori-options-edit"
                  placeholder="Pilih / ketik baru..."
                  value={editingKeuangan.kategori}
                  onChange={(e) => setEditingKeuangan({ ...editingKeuangan, kategori: e.target.value })}
                  className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                />
                <datalist id="kategori-options-edit">
                  <option value="Infak" />
                  <option value="Donatur" />
                  <option value="Operasional" />
                  <option value="Utilitas" />
                </datalist>
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Tipe</label>
                <select 
                  value={editingKeuangan.pemasukan > 0 ? "masuk" : "keluar"}
                  onChange={(e) => {
                    const isMasuk = e.target.value === "masuk";
                    const val = editingKeuangan.pemasukan || editingKeuangan.pengeluaran;
                    if (isMasuk) {
                      setEditingKeuangan({ ...editingKeuangan, pemasukan: val, pengeluaran: 0 });
                    } else {
                      setEditingKeuangan({ ...editingKeuangan, pemasukan: 0, pengeluaran: val });
                    }
                  }}
                  className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="masuk">Masuk (+)</option>
                  <option value="keluar">Keluar (-)</option>
                </select>
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Nominal (Rp)</label>
                <input 
                  type="number" 
                  value={editingKeuangan.pemasukan || editingKeuangan.pengeluaran || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (editingKeuangan.pemasukan > 0 || (!editingKeuangan.pemasukan && !editingKeuangan.pengeluaran)) {
                      setEditingKeuangan({ ...editingKeuangan, pemasukan: val, pengeluaran: 0 });
                    } else {
                      setEditingKeuangan({ ...editingKeuangan, pemasukan: 0, pengeluaran: val });
                    }
                  }}
                  className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="col-span-12 flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setEditingKeuangan(null)}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SYSTEM UPDATE NOTIFICATION MODAL */}
      {systemUpdate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-background/80">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-primary/20 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-primary/10 p-6 flex items-center justify-center shrink-0">
              <Megaphone className="w-16 h-16 text-primary" />
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-mono text-sm font-bold rounded-full mb-4">
                {systemUpdate.version}
              </div>
              <h2 className="text-2xl font-bold mb-4">{systemUpdate.title}</h2>
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                {systemUpdate.content}
              </div>
            </div>
            <div className="p-6 pt-0 shrink-0">
              <Button 
                className="w-full text-lg py-6"
                onClick={() => {
                  localStorage.setItem("last_seen_update", systemUpdate.id);
                  setHasUnreadUpdate(false);
                  setSystemUpdate(null);
                }}
              >
                Mengerti & Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
