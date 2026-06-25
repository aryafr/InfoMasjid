"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  LogOut, Users, CheckCircle, Clock, Trash2, 
  ShieldCheck, ExternalLink, Bell, User, LayoutDashboard,
  TrendingUp, CreditCard, Activity, MoreVertical, Building,
  ArrowUpCircle, Menu, X, Tag, Ticket, Phone,
  Copy, Check, Download, ChevronLeft, ChevronRight,
  Megaphone, Edit
} from "lucide-react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from "recharts";
import { 
  subscribeToGlobalPricing, 
  updateGlobalPricing, 
  subscribeToVouchers, 
  addVoucher, 
  updateVoucher, 
  deleteVoucher 
} from "@/lib/firestoreService";

const PACKAGE_PRICE = 250000; // Assumption based on previous logic

export default function SuperAdminPage() {
  const [user, setUser] = useState(null);
  const [masjids, setMasjids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editPackageModal, setEditPackageModal] = useState({ isOpen: false, id: null, currentPackage: "berkah" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, type: "default" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPackage, setFilterPackage] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // Settings & Vouchers State
  const [globalPricing, setGlobalPricing] = useState({
    is_discount_active: false,
    berkah: { original_price: 250000, discounted_price: 200000 },
    premium: { original_price: 550000, discounted_price: 450000 }
  });
  const [vouchers, setVouchers] = useState([]);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [voucherModal, setVoucherModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [copiedCode, setCopiedCode] = useState(null);
  const [newVoucher, setNewVoucher] = useState({
    code: "", discount_type: "percentage", discount_value: 0, max_uses: 0, valid_until: ""
  });

  // Info Updates State
  const [updates, setUpdates] = useState([]);
  const [updateModal, setUpdateModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [newUpdate, setNewUpdate] = useState({
    version: "", title: "", content: "", is_published: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else if (currentUser.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
        toast.error("Akses ditolak: Anda bukan Super Admin");
        router.push("/");
      } else {
        setUser(currentUser);
        fetchMasjids();
      }
    });
    
    const unsubPricing = subscribeToGlobalPricing((data) => setGlobalPricing(data));
    const unsubVouchers = subscribeToVouchers((data) => setVouchers(data));

    // Updates Subscription
    const qUpdates = query(collection(db, "system_updates"), orderBy("created_at", "desc"));
    const unsubUpdates = onSnapshot(qUpdates, (snap) => {
      const data = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setUpdates(data);
    });
    
    return () => {
      unsubscribe();
      unsubPricing();
      unsubVouchers();
      unsubUpdates();
    };
  }, [router]);

  const fetchMasjids = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "masjids"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setMasjids(data);
    } catch (error) {
      console.error("Error fetching masjids:", error);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (title, message, onConfirm, type = "default") => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, type });
  };

  const handleDelete = async (id) => {
    openConfirmModal(
      "Hapus Data Masjid",
      `Yakin ingin menghapus data masjid ini (${id}) beserta seluruh pengaturannya? Tindakan ini tidak dapat dibatalkan.`,
      async () => {
        try {
          const { deleteMasjidFull } = require("@/lib/firestoreService");
          await deleteMasjidFull(id);
          toast.success("Data masjid berhasil dihapus");
          fetchMasjids();
        } catch (error) {
          toast.error("Gagal menghapus data masjid");
        }
      },
      "destructive"
    );
  };

  const handleManualActivate = async (id) => {
    openConfirmModal(
      "Aktifkan Manual",
      "Aktifkan akun ini secara manual? (Melewati proses pembayaran sistem)",
      async () => {
        try {
          await updateDoc(doc(db, "masjids", id), {
            payment_status: "paid",
            active_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            payment_method: "MANUAL_ACTIVATION"
          });
          toast.success("Akun masjid berhasil diaktifkan secara manual");
          fetchMasjids();
        } catch (error) {
          toast.error("Gagal mengaktifkan akun masjid");
        }
      },
      "success"
    );
  };

  const openEditPackageModal = (id, currentPackage) => {
    setEditPackageModal({ isOpen: true, id, currentPackage: currentPackage || "berkah" });
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  const submitEditPackage = async () => {
    try {
      await updateDoc(doc(db, "masjids", editPackageModal.id), {
        subscription_package: editPackageModal.currentPackage
      });
      toast.success(`Paket berlangganan berhasil diubah ke ${editPackageModal.currentPackage.toUpperCase()}`);
      fetchMasjids();
      setEditPackageModal({ isOpen: false, id: null, currentPackage: "berkah" });
    } catch (error) {
      toast.error("Gagal mengubah paket berlangganan");
    }
  };

  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center p-8 text-xl font-bold">Otentikasi...</div>;

  // Derived Stats
  const totalPaid = masjids.filter(m => m.payment_status === "paid").length;
  const totalPending = masjids.length - totalPaid;

  // Pagination & Filtering Logic
  const customerTabMasjids = masjids.filter(m => {
    const matchesSearch = 
      (m.nama_aplikasi || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || m.payment_status === filterStatus;
    const matchesPackage = filterPackage === 'all' || m.subscription_package === filterPackage;

    return matchesSearch && matchesStatus && matchesPackage;
  });

  const totalPages = Math.ceil(customerTabMasjids.length / itemsPerPage) || 1;
  const paginatedMasjids = customerTabMasjids.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const displayMasjids = activeTab === 'dashboard' 
    ? masjids.filter(m => {
        if (m.payment_status !== "paid") return true;
        const daysLeft = getDaysLeft(m.active_until);
        if (daysLeft <= 30) return true;
        return false;
      }) 
    : paginatedMasjids;

  const handleExportCSV = () => {
    if (customerTabMasjids.length === 0) {
      toast("Tidak ada data untuk diekspor", { icon: "ℹ️" });
      return;
    }

    // 1. Ekstrak semua kolom (kunci) yang ada dari semua data
    const allKeys = Array.from(new Set(customerTabMasjids.reduce((acc, m) => {
      return acc.concat(Object.keys(m));
    }, [])));

    // 2. Urutkan agar kolom penting berada di depan
    const priorityKeys = ["id", "nama_aplikasi", "email", "wa_number", "subscription_package", "payment_status", "payment_amount", "active_until", "created_at"];
    const sortedKeys = [
      ...priorityKeys.filter(k => allKeys.includes(k)),
      ...allKeys.filter(k => !priorityKeys.includes(k))
    ];

    // 3. Buat header row (huruf kapital)
    const headerRow = sortedKeys.map(key => key.replace(/_/g, " ").toUpperCase());

    const csvContent = [
      headerRow,
      ...customerTabMasjids.map(m => {
        return sortedKeys.map(key => {
          let value = m[key];
          
          if (value === null || value === undefined || value === "") {
            return "-";
          }
          
          if (typeof value === 'object') {
            if (value.seconds !== undefined || value.toDate) {
              value = new Date(value.toDate ? value.toDate() : value.seconds * 1000).toLocaleString();
            } else {
              value = JSON.stringify(value);
            }
          }

          value = String(value);
          // CSV Escape handling
          if (value.includes(",") || value.includes("\\n") || value.includes('"')) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
      })
    ]
    .map(e => e.join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const currentMonthIdx = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newUsersThisMonth = masjids.filter(m => {
    if (!m.created_at) return false;
    const d = new Date(m.created_at);
    return d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
  }).length;
  
  const totalPremium = masjids.filter(m => m.subscription_package === 'premium').length;
  const totalBerkah = masjids.length - totalPremium;

  let totalRevenue = 0;
  masjids.forEach(m => {
    if (m.payment_status === 'paid') {
      // Menghitung omzet nyata berdasarkan nominal yang dibayarkan,
      // sehingga pengguna voucher 100% (Rp 0) tidak merusak estimasi MRR.
      totalRevenue += (m.payment_amount || 0);
    }
  });

  // Dynamic Chart Data Preparation
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ordersByMonth = Array(12).fill(0);
  
  masjids.forEach(m => {
    if (m.created_at) {
      const date = new Date(m.created_at);
      const month = date.getMonth();
      ordersByMonth[month]++;
    }
  });

  const currentMonth = new Date().getMonth();
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    let mIndex = currentMonth - i;
    if (mIndex < 0) mIndex += 12;
    chartData.push({
      name: monthNames[mIndex],
      orders: ordersByMonth[mIndex]
    });
  }

  function getDaysLeft(activeUntil) {
    if (!activeUntil) return 0;
    const expiryDate = activeUntil.toDate ? activeUntil.toDate() : new Date(activeUntil);
    const diffTime = expiryDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  const pieData = [
    { name: 'Premium', value: totalPremium, color: '#f59e0b' },
    { name: 'Berkah', value: totalBerkah, color: 'var(--primary)' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden relative">
      
      {/* Premium Luxury Background Glows (Mesh Gradient Effect) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-[100%] blur-[140px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '1s' }}></div>

      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/40 backdrop-blur-3xl border-r border-border/60 flex flex-col justify-between shrink-0 h-full shadow-xl shadow-primary/5 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-10 pl-1 lg:pl-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center shrink-0">
                <Image src="/icon.png" alt="Logo" width={48} height={48} className="w-full h-full object-contain" />
              </div>
              <h2 className="font-bold text-xl text-foreground leading-tight tracking-tight hidden md:block">InfoMasjid</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-foreground/70 hover:text-foreground p-1">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => {
                setActiveTab("dashboard");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm transition-all cursor-pointer relative group ${activeTab === 'dashboard' ? 'bg-primary/10 text-indigo-500 font-bold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}>
              {activeTab === 'dashboard' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md hidden md:block"></div>}
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Dashboard</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("customers");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm transition-all cursor-pointer relative group ${activeTab === 'customers' ? 'bg-primary/10 text-indigo-500 font-bold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}>
              {activeTab === 'customers' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md hidden md:block"></div>}
              <Users className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Customers</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab("pricing");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm transition-all cursor-pointer relative group ${activeTab === 'pricing' ? 'bg-primary/10 text-indigo-500 font-bold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}>
              {activeTab === 'pricing' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md hidden md:block"></div>}
              <Tag className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Harga & Diskon</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("vouchers");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm transition-all cursor-pointer relative group ${activeTab === 'vouchers' ? 'bg-primary/10 text-indigo-500 font-bold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}>
              {activeTab === 'vouchers' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md hidden md:block"></div>}
              <Ticket className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Vouchers</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("updates");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm transition-all cursor-pointer relative group ${activeTab === 'updates' ? 'bg-primary/10 text-indigo-500 font-bold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}>
              {activeTab === 'updates' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md hidden md:block"></div>}
              <Megaphone className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Info Update</span>
            </button>

          </nav>
        </div>
      </aside>

      {/* 2. MIDDLE CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 shrink-0 border-b border-border/30 bg-background/40 backdrop-blur-2xl relative z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-foreground/80 hover:bg-muted rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight capitalize">
              {activeTab === 'pricing' ? 'Harga & Diskon' : activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-card/50 backdrop-blur-md border border-border/50 rounded-full px-4 py-2.5 w-48 md:w-80 shadow-sm hover:shadow-md hover:bg-card/80 transition-all items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <input 
                type="text" 
                placeholder="Search masjids..." 
                className="bg-transparent border-none outline-none text-sm w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background shadow-sm hover:ring-2 hover:ring-primary/50 transition-all"
              >
                <User className="w-5 h-5 text-indigo-500" />
              </button>
              
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-3 w-56 bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="font-bold text-sm">Arya Founder</p>
                      <p className="text-xs text-muted-foreground">Super Administrator</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          toast("Fitur Edit Profil Superadmin sedang dalam tahap pengembangan", { icon: 'ℹ️' });
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl hover:bg-accent text-left w-full transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>Edit Profile</span>
                      </button>
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          openConfirmModal("Keluar", "Apakah Anda yakin ingin keluar?", () => signOut(auth), "destructive");
                        }}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl hover:bg-destructive/10 text-destructive text-left w-full transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
            
            {/* Loading Skeletons */}
            {loading && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                {activeTab === "dashboard" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <Skeleton className="h-36 w-full rounded-3xl" />
                    <Skeleton className="h-36 w-full rounded-3xl" />
                    <Skeleton className="h-36 w-full rounded-3xl" />
                    <Skeleton className="h-36 w-full rounded-3xl" />
                  </div>
                )}
                {activeTab === "dashboard" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[340px] w-full lg:col-span-2 rounded-3xl" />
                    <Skeleton className="h-[340px] w-full rounded-3xl" />
                  </div>
                )}
                {(activeTab === "dashboard" || activeTab === "customers" || activeTab === "vouchers") && (
                  <Skeleton className="h-[500px] w-full rounded-3xl" />
                )}
                {activeTab === "pricing" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                    <Skeleton className="h-[400px] w-full rounded-3xl" />
                  </div>
                )}
              </div>
            )}

            {/* Top Stat Cards - Show on Dashboard */}
            {!loading && activeTab === "dashboard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-card/40 backdrop-blur-3xl p-6 rounded-3xl border border-border/60 shadow-xl transition-all hover:-translate-y-2 hover:shadow-indigo-500/20 group flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground text-sm font-medium">Total Customers</span>
                  <div className="p-2 bg-primary/10 text-indigo-500 rounded-lg"><Users className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black">{masjids.length}</div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1 text-indigo-500 font-medium">
                  {newUsersThisMonth > 0 ? (
                    <><TrendingUp className="w-3 h-3"/> +{newUsersThisMonth} bulan ini</>
                  ) : (
                    "Belum ada tambahan bulan ini"
                  )}
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-3xl p-6 rounded-3xl border border-border/60 shadow-xl transition-all hover:-translate-y-2 hover:shadow-indigo-500/20 group flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground text-sm font-medium">Paid Subscriptions</span>
                  <div className="p-2 bg-primary/10 text-indigo-500 rounded-lg"><CheckCircle className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black">{totalPaid}</div>
                <div className="text-xs text-muted-foreground mt-2 font-medium">
                  {((totalPaid / Math.max(1, masjids.length)) * 100).toFixed(0)}% conversion rate
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-3xl p-6 rounded-3xl border border-border/60 shadow-xl transition-all hover:-translate-y-2 hover:shadow-indigo-500/20 group flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground text-sm font-medium">Pending Payments</span>
                  <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Clock className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black text-orange-500">{totalPending}</div>
                <div className="text-xs text-muted-foreground mt-2 font-medium">
                  Requires follow-up
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-3xl p-6 rounded-3xl border border-border/60 shadow-xl transition-all hover:-translate-y-2 hover:shadow-emerald-500/20 group flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10"><Activity className="w-32 h-32 text-emerald-500" /></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="text-muted-foreground text-sm font-medium">Est. Revenue (MRR)</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CreditCard className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black text-emerald-500 relative z-10">
                  Rp {totalRevenue > 1000000 ? (totalRevenue/1000000).toFixed(1) + 'M' : totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-muted-foreground mt-2 font-medium relative z-10">
                  Berdasarkan pelanggan aktif
                </div>
              </div>
              </div>
            )}

            {/* Charts Section - Show on Dashboard */}
            {!loading && activeTab === "dashboard" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
                <h3 className="font-bold mb-6">Projections and Goals</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="orders" fill="var(--primary)" radius={[6, 6, 6, 6]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col items-center justify-center">
                <h3 className="font-bold mb-4 w-full text-left">Package Distribution</h3>
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black">{masjids.length}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Total</span>
                  </div>
                </div>
                <div className="flex gap-6 mt-4 w-full justify-center">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="font-medium">{d.name}</span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            )}

            {/* Customers Table List - Show on Dashboard and Customers */}
            {!loading && (activeTab === "dashboard" || activeTab === "customers") && (
              <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 md:p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-card/50 gap-4">
                  <h3 className="font-bold text-lg">{activeTab === 'dashboard' ? 'Needs Attention (Pending/Expiring)' : 'Customer Directory'}</h3>
                  
                  {activeTab === 'customers' && (
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                      <div className="w-40">
                        <Select 
                          value={filterStatus}
                          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                          options={[
                            { value: "all", label: "Semua Status" },
                            { value: "paid", label: "Lunas" },
                            { value: "pending", label: "Pending" }
                          ]}
                        />
                      </div>
                      <div className="w-40">
                        <Select 
                          value={filterPackage}
                          onChange={(e) => { setFilterPackage(e.target.value); setCurrentPage(1); }}
                          options={[
                            { value: "all", label: "Semua Paket" },
                            { value: "premium", label: "Premium" },
                            { value: "berkah", label: "Berkah" }
                          ]}
                        />
                      </div>
                      
                      <Button 
                        variant="outline"
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 text-emerald-500 hover:text-emerald-600 border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/10 flex-1 md:flex-none"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                      </Button>
                    </div>
                  )}

                  {activeTab === "dashboard" && <button onClick={() => setActiveTab("customers")} className="text-sm font-medium text-indigo-500 hover:underline">View all directory</button>}
                </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50">
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Masjid Info</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Contact</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Paket</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Masa Berlaku</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayMasjids.map((m) => (
                      <tr key={m.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-indigo-500 flex items-center justify-center shrink-0">
                              <Building className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{m.nama_aplikasi || m.id}</p>
                              <p className="text-xs text-muted-foreground font-mono">{m.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{m.email || "-"}</p>
                          {m.wa_number && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                              <Phone className="w-3 h-3 text-emerald-500" /> {m.wa_number}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md ${
                            m.subscription_package === 'premium' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-primary/10 text-indigo-500 border border-primary/20'
                          }`}>
                            {m.subscription_package || "Berkah"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {m.active_until ? (
                            <span className="text-sm font-bold text-foreground">
                              {getDaysLeft(m.active_until)} Hari
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {m.payment_status === "paid" ? (
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LUNAS
                            </span>
                          ) : (
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border border-orange-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> PENDING
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end md:opacity-40 md:group-hover:opacity-100 transition-opacity">
                            <a href={`/${m.id}`} target="_blank" title="Lihat Layar TV">
                              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-accent hover:bg-primary text-foreground hover:text-primary-foreground">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                            {m.payment_status !== "paid" && (
                              <Button 
                                variant="ghost" size="icon"
                                onClick={() => handleManualActivate(m.id)}
                                className="w-8 h-8 rounded-full bg-accent hover:bg-emerald-500 text-foreground hover:text-white"
                                title="Lunaskan Manual"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" size="icon"
                              onClick={() => openEditPackageModal(m.id, m.subscription_package)}
                              className="w-8 h-8 rounded-full bg-accent hover:bg-amber-500 text-foreground hover:text-white"
                              title="Ubah Paket Berlangganan"
                            >
                              <ArrowUpCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" size="icon"
                              onClick={() => handleDelete(m.id)}
                              className="w-8 h-8 rounded-full bg-accent hover:bg-destructive text-foreground hover:text-white"
                              title="Hapus Data Masjid"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {displayMasjids.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Building className="w-10 h-10 opacity-20" />
                            <p className="font-medium">{searchQuery ? "Tidak ada masjid yang cocok dengan pencarian." : (activeTab === 'dashboard' ? "Hebat! Semua akun pelanggan aman dan berstatus lunas." : "Belum ada masjid yang terdaftar.")}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {activeTab === 'customers' && totalPages > 1 && (
                <div className="p-4 border-t border-border/50 flex items-center justify-between bg-card/30">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Hal {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, customerTabMasjids.length)} dari {customerTabMasjids.length}
                  </span>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="p-1.5 md:p-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex gap-1 hidden sm:flex">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <span className="sm:hidden text-sm font-medium px-2">{currentPage} / {totalPages}</span>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="p-1.5 md:p-2 rounded-lg border border-border/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
            )}

            {/* PRICING TAB */}
            {!loading && activeTab === "pricing" && (
              <div className="bg-card/40 backdrop-blur-3xl rounded-3xl border border-border/60 shadow-xl overflow-hidden flex flex-col p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h3 className="font-bold text-2xl">Pengaturan Harga & Diskon Bundle</h3>
                  <Button 
                    disabled={isSavingPricing}
                    onClick={async () => {
                      setIsSavingPricing(true);
                      await updateGlobalPricing(globalPricing);
                      setIsSavingPricing(false);
                      toast.success("Pengaturan harga berhasil disimpan!");
                    }}
                    className="w-full md:w-auto shadow-lg"
                  >
                    {isSavingPricing ? "Menyimpan..." : "Simpan Pengaturan Harga"}
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 p-5 bg-primary/5 rounded-2xl border border-primary/20">
                  <div className="mb-4 sm:mb-0">
                    <h4 className="font-bold text-foreground text-lg flex items-center gap-2">Status Diskon Global <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span></h4>
                    <p className="text-sm text-muted-foreground mt-1">Aktifkan untuk menerapkan gaya harga coret promosi di seluruh aplikasi.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={globalPricing?.is_discount_active || false}
                      onChange={async (e) => {
                        const val = e.target.checked;
                        const newPricing = { ...globalPricing, is_discount_active: val };
                        setGlobalPricing(newPricing);
                        await updateGlobalPricing({ is_discount_active: val });
                      }}
                    />
                    <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex flex-col gap-8">
                  {/* Paket Berkah */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
                    {/* Left: Inputs */}
                    <div className="flex flex-col gap-5">
                      <div>
                        <h4 className="font-black text-2xl text-indigo-500 mb-1">Paket Berkah</h4>
                        <p className="text-sm text-muted-foreground">Harga paket standar untuk fitur dasar.</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-bold mb-2 block">Harga Asli (Rp)</label>
                        <Input 
                          type="number" 
                          value={globalPricing?.berkah?.original_price || 0} 
                          onChange={e => setGlobalPricing({...globalPricing, berkah: {...globalPricing.berkah, original_price: Number(e.target.value)}})} 
                        />
                        <p className="text-xs text-indigo-500 font-mono mt-1 bg-indigo-500/10 inline-block px-2 py-1 rounded-md">Format: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.berkah?.original_price || 0)}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-sm font-bold block">Harga Diskon (Rp)</label>
                          <div className="flex gap-2">
                            {[10, 20, 30, 50].map(pct => (
                              <button 
                                key={pct}
                                onClick={() => {
                                  const orig = globalPricing?.berkah?.original_price || 0;
                                  const disc = orig - (orig * (pct/100));
                                  setGlobalPricing({...globalPricing, berkah: {...globalPricing.berkah, discounted_price: disc}});
                                }}
                                className="text-[10px] font-bold bg-accent hover:bg-primary/20 text-foreground px-2 py-1 rounded-full transition-colors"
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>
                        </div>
                        <Input 
                          type="number" 
                          value={globalPricing?.berkah?.discounted_price || 0} 
                          onChange={e => setGlobalPricing({...globalPricing, berkah: {...globalPricing.berkah, discounted_price: Number(e.target.value)}})} 
                        />
                        <p className="text-xs text-emerald-500 font-mono mt-1 bg-emerald-500/10 inline-block px-2 py-1 rounded-md">Format: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.berkah?.discounted_price || 0)}</p>
                      </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div className="flex items-center justify-center bg-muted/30 rounded-2xl p-6 border border-border border-dashed">
                      <div className="bg-background border border-indigo-500/30 rounded-3xl p-6 w-full max-w-sm shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">LIVE PREVIEW</div>
                        <h5 className="font-black text-xl text-indigo-500 mb-4">Berkah</h5>
                        {globalPricing?.is_discount_active ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground line-through decoration-destructive decoration-2">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.berkah?.original_price || 0)}</span>
                            <span className="text-3xl font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.berkah?.discounted_price || 0)}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm opacity-0 line-through">Hidden</span>
                            <span className="text-3xl font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.berkah?.original_price || 0)}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">Per Tahun / Masjid</p>
                        <Button className="w-full mt-6 opacity-50 cursor-default pointer-events-none" variant="outline">Pilih Paket Berkah</Button>
                      </div>
                    </div>
                  </div>

                  {/* Paket Premium */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card border border-amber-500/30 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl z-10">RECOMMENDED</div>
                    {/* Left: Inputs */}
                    <div className="flex flex-col gap-5 relative z-20">
                      <div>
                        <h4 className="font-black text-2xl text-amber-500 mb-1">Paket Premium</h4>
                        <p className="text-sm text-muted-foreground">Harga paket lengkap dengan semua fitur terbuka.</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-bold mb-2 block">Harga Asli (Rp)</label>
                        <Input 
                          type="number" 
                          value={globalPricing?.premium?.original_price || 0} 
                          onChange={e => setGlobalPricing({...globalPricing, premium: {...globalPricing.premium, original_price: Number(e.target.value)}})} 
                        />
                        <p className="text-xs text-amber-500 font-mono mt-1 bg-amber-500/10 inline-block px-2 py-1 rounded-md">Format: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.premium?.original_price || 0)}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-sm font-bold block">Harga Diskon (Rp)</label>
                          <div className="flex gap-2">
                            {[10, 20, 30, 50].map(pct => (
                              <button 
                                key={pct}
                                onClick={() => {
                                  const orig = globalPricing?.premium?.original_price || 0;
                                  const disc = orig - (orig * (pct/100));
                                  setGlobalPricing({...globalPricing, premium: {...globalPricing.premium, discounted_price: disc}});
                                }}
                                className="text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/30 text-amber-600 px-2 py-1 rounded-full transition-colors"
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>
                        </div>
                        <Input 
                          type="number" 
                          value={globalPricing?.premium?.discounted_price || 0} 
                          onChange={e => setGlobalPricing({...globalPricing, premium: {...globalPricing.premium, discounted_price: Number(e.target.value)}})} 
                        />
                        <p className="text-xs text-emerald-500 font-mono mt-1 bg-emerald-500/10 inline-block px-2 py-1 rounded-md">Format: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.premium?.discounted_price || 0)}</p>
                      </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div className="flex items-center justify-center bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20 border-dashed relative z-20">
                      <div className="bg-background border border-amber-500 rounded-3xl p-6 w-full max-w-sm shadow-xl shadow-amber-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">LIVE PREVIEW</div>
                        <h5 className="font-black text-xl text-amber-500 mb-4">Premium</h5>
                        {globalPricing?.is_discount_active ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground line-through decoration-destructive decoration-2">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.premium?.original_price || 0)}</span>
                            <span className="text-3xl font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.premium?.discounted_price || 0)}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm opacity-0 line-through">Hidden</span>
                            <span className="text-3xl font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(globalPricing?.premium?.original_price || 0)}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">Per Tahun / Masjid</p>
                        <Button className="w-full mt-6 opacity-50 cursor-default pointer-events-none bg-amber-500 text-white border-none hover:bg-amber-500">Pilih Paket Premium</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VOUCHERS TAB */}
            {!loading && activeTab === "vouchers" && (
              <div className="flex flex-col gap-6">
                {/* Mini Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Ticket className="w-6 h-6"/></div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Voucher Aktif</p>
                      <p className="text-2xl font-black">{vouchers.filter(v => v.is_active).length}</p>
                    </div>
                  </div>
                  <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl"><CheckCircle className="w-6 h-6"/></div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Digunakan</p>
                      <p className="text-2xl font-black">{vouchers.reduce((acc, v) => acc + (v.used_count || 0), 0)}</p>
                    </div>
                  </div>
                  <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl"><Tag className="w-6 h-6"/></div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Semua Voucher</p>
                      <p className="text-2xl font-black">{vouchers.length}</p>
                    </div>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">Manajemen Voucher</h3>
                    <Button 
                      onClick={() => {
                        setNewVoucher({ code: "", discount_type: "percentage", discount_value: 0, max_uses: 0, valid_until: "", is_active: true });
                        setVoucherModal({ isOpen: true, isEdit: false, data: null });
                      }}
                      className="shadow-md"
                    >
                      + Tambah Voucher
                    </Button>
                  </div>
  
                  {vouchers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="w-10 h-10 text-primary opacity-50" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">Belum ada voucher</h4>
                      <p className="text-muted-foreground max-w-sm mb-6">Buat voucher pertama Anda untuk mulai memberikan diskon berlangganan ke pelanggan Anda.</p>
                      <Button 
                        onClick={() => {
                          setNewVoucher({ code: "", discount_type: "percentage", discount_value: 0, max_uses: 0, valid_until: "", is_active: true });
                          setVoucherModal({ isOpen: true, isEdit: false, data: null });
                        }}
                      >
                        + Buat Voucher Baru
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border/50">
                            <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground rounded-tl-xl">Kode</th>
                            <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground">Tipe</th>
                            <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground">Nilai</th>
                            <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground">Batas</th>
                            <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground">Terpakai</th>
                            <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground">Status</th>
                            <th className="px-4 py-3 font-semibold text-xs uppercase text-right rounded-tr-xl">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vouchers.map(v => (
                            <tr key={v.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-4 font-bold text-indigo-500">
                                <div className="flex items-center gap-2">
                                  {v.code}
                                  <button 
                                    onClick={() => handleCopyCode(v.code)}
                                    className="p-1.5 hover:bg-indigo-500/10 rounded-md transition-colors text-muted-foreground hover:text-indigo-500"
                                    title="Copy code"
                                  >
                                    {copiedCode === v.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-4 capitalize">
                                <span className={v.discount_type === 'percentage' ? "px-2 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600" : "px-2 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600"}>
                                  {v.discount_type}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-medium">{v.discount_type === 'percentage' ? `${v.discount_value}%` : `Rp ${Number(v.discount_value).toLocaleString('id-ID')}`}</td>
                              <td className="px-4 py-4">{v.max_uses > 0 ? v.max_uses : <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded-md">Unlimited</span>}</td>
                              <td className="px-4 py-4 font-medium">{v.used_count || 0}</td>
                              <td className="px-4 py-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={v.is_active}
                                    onChange={async (e) => {
                                      await updateVoucher(v.id, { is_active: e.target.checked });
                                    }}
                                  />
                                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <button onClick={() => {
                                  openConfirmModal(
                                    "Hapus Voucher",
                                    `Apakah Anda yakin ingin menghapus voucher "${v.code}"?`,
                                    async () => {
                                      await deleteVoucher(v.id);
                                      toast.success("Voucher berhasil dihapus");
                                    },
                                    "destructive"
                                  );
                                }} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              </div>
            )}

            {/* UPDATES TAB */}
            {!loading && activeTab === "updates" && (
              <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-xl">Info Pembaruan Sistem</h3>
                    <p className="text-sm text-muted-foreground mt-1">Buat pengumuman update fitur atau perbaikan bug ke semua pengguna.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setNewUpdate({ version: "", title: "", content: "", is_published: false });
                      setUpdateModal({ isOpen: true, isEdit: false, data: null });
                    }}
                    className="shadow-md"
                  >
                    + Buat Update
                  </Button>
                </div>

                {updates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Megaphone className="w-10 h-10 text-primary opacity-50" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">Belum ada Info Update</h4>
                    <p className="text-muted-foreground max-w-sm mb-6">Buat pengumuman pertama Anda untuk memberi tahu admin masjid mengenai fitur baru.</p>
                    <Button 
                      onClick={() => {
                        setNewUpdate({ version: "", title: "", content: "", is_published: false });
                        setUpdateModal({ isOpen: true, isEdit: false, data: null });
                      }}
                    >
                      + Buat Update Baru
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/50">
                          <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground rounded-tl-xl w-32">Versi</th>
                          <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground">Judul</th>
                          <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground w-40">Tanggal</th>
                          <th className="px-4 py-3 font-semibold text-xs uppercase text-muted-foreground w-32">Status</th>
                          <th className="px-4 py-3 font-semibold text-xs uppercase text-right rounded-tr-xl w-32">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map(u => (
                          <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-4 font-bold">
                              <span className="bg-accent text-foreground px-3 py-1 rounded-full text-xs font-mono">{u.version}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-bold text-base mb-1">{u.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{u.content}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-muted-foreground">
                              {u.created_at ? new Date(u.created_at?.seconds ? u.created_at.seconds * 1000 : u.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'}) : '-'}
                            </td>
                            <td className="px-4 py-4">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={u.is_published}
                                  onChange={async (e) => {
                                    await updateDoc(doc(db, "system_updates", u.id), { is_published: e.target.checked });
                                  }}
                                />
                                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                              </label>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => {
                                  setNewUpdate({ version: u.version, title: u.title, content: u.content, is_published: u.is_published });
                                  setUpdateModal({ isOpen: true, isEdit: true, data: u });
                                }} className="p-2 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 rounded-md transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => {
                                  openConfirmModal(
                                    "Hapus Update",
                                    `Apakah Anda yakin ingin menghapus Info Update versi ${u.version}?`,
                                    async () => {
                                      await deleteDoc(doc(db, "system_updates", u.id));
                                      toast.success("Info Update berhasil dihapus");
                                    },
                                    "destructive"
                                  );
                                }} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}



          </div>
        </main>
      </div>

      {/* 3. RIGHT SIDEBAR (Finances) */}
      <aside className="w-80 bg-card/60 backdrop-blur-xl border-l border-border/60 flex flex-col shrink-0 h-full z-20 shadow-2xl hidden xl:flex relative">
        <div className="p-6 lg:p-8 border-b border-border/50 flex flex-col items-center">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toast("Tidak ada notifikasi baru saat ini.", { icon: '🔔' })}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></div>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 flex-1 overflow-y-auto">
          <h3 className="font-bold text-lg mb-6">Financial Summary</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/30 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Total Revenue</p>
              <h4 className="text-2xl font-black">Rp {totalRevenue.toLocaleString("id-ID")}</h4>
            </div>
          </div>

          <div className="h-px w-full bg-border/50 my-6"></div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm">Recent Activity</h3>
            <button 
              onClick={() => setActiveTab("customers")}
              className="text-xs font-medium text-indigo-500 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {masjids.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  m.payment_status === 'paid' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}>
                  {m.nama_aplikasi ? m.nama_aplikasi.substring(0, 2).toUpperCase() : 'MD'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm truncate">{m.nama_aplikasi || 'Masjid Baru'}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.payment_status === 'paid' ? 'Telah lunas' : 'Menunggu pembayaran'}</p>
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  {m.payment_status === 'paid' ? (m.payment_amount ? `+${m.payment_amount / 1000}k` : 'Free') : '...'}
                </div>
              </div>
            ))}
            {masjids.length === 0 && (
               <p className="text-sm text-muted-foreground text-center py-4">Belum ada aktivitas.</p>
            )}
          </div>
        </div>

      </aside>

      {/* CUSTOM MODAL FOR EDIT PACKAGE */}
      <Modal
        isOpen={editPackageModal.isOpen}
        onClose={() => setEditPackageModal({ isOpen: false, id: null, currentPackage: 'berkah' })}
        title="Ubah Paket Berlangganan"
      >
        <p className="text-sm text-muted-foreground mb-4">Pilih paket untuk masjid ID: <span className="font-mono text-foreground font-medium">{editPackageModal.id}</span></p>
        
        <div className="mb-6 flex flex-col gap-3">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-accent transition-colors">
            <input 
              type="radio" 
              name="package" 
              value="berkah"
              checked={editPackageModal.currentPackage === 'berkah'}
              onChange={() => setEditPackageModal({ ...editPackageModal, currentPackage: 'berkah' })}
              className="w-4 h-4 text-indigo-500 accent-primary"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-indigo-500">Paket Berkah</span>
              <span className="text-xs text-muted-foreground">Fitur standar</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
            <input 
              type="radio" 
              name="package" 
              value="premium"
              checked={editPackageModal.currentPackage === 'premium'}
              onChange={() => setEditPackageModal({ ...editPackageModal, currentPackage: 'premium' })}
              className="w-4 h-4 text-amber-600 accent-amber-600"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-amber-700 dark:text-amber-500">Paket Premium</span>
              <span className="text-xs text-muted-foreground">Semua fitur terbuka</span>
            </div>
          </label>
        </div>
        
        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline"
            onClick={() => setEditPackageModal({ isOpen: false, id: null, currentPackage: 'berkah' })}
          >
            Batal
          </Button>
          <Button onClick={submitEditPackage}>
            Simpan Perubahan
          </Button>
        </div>
      </Modal>

      {/* CUSTOM GENERIC CONFIRM MODAL */}
      <Modal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
      >
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{confirmModal.message}</p>
        
        <div className="flex gap-3 justify-end">
          {confirmModal.type !== 'alert' && (
            <Button 
              variant="outline"
              onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            >
              Batal
            </Button>
          )}
          <Button 
            variant={confirmModal.type === 'destructive' ? 'destructive' : confirmModal.type === 'success' ? 'default' : 'primary'}
            onClick={() => {
              if (confirmModal.onConfirm) confirmModal.onConfirm();
              setConfirmModal({ ...confirmModal, isOpen: false });
            }}
            className={confirmModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
          >
            {confirmModal.type === 'alert' ? 'Oke, Mengerti' : 'Ya, Lanjutkan'}
          </Button>
        </div>
      </Modal>

      {/* VOUCHER MODAL */}
      <Modal
        isOpen={voucherModal.isOpen}
        onClose={() => setVoucherModal({ isOpen: false, isEdit: false, data: null })}
        title="Tambah Voucher Baru"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            await addVoucher({
              ...newVoucher,
              code: newVoucher.code.toUpperCase(),
              used_count: 0,
              created_at: new Date().toISOString()
            });
            setVoucherModal({ isOpen: false, isEdit: false, data: null });
            toast.success("Voucher berhasil ditambahkan");
          } catch (err) {
            toast.error("Gagal menambahkan voucher");
          }
        }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Kode Voucher</label>
              <Input type="text" required placeholder="PROMO2026" className="uppercase" 
                value={newVoucher.code} onChange={e => setNewVoucher({...newVoucher, code: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipe Diskon</label>
                <Select 
                  value={newVoucher.discount_type} 
                  onChange={e => setNewVoucher({...newVoucher, discount_type: e.target.value})}
                  options={[
                    { value: "percentage", label: "Persentase (%)" },
                    { value: "fixed", label: "Nominal Tetap (Rp)" }
                  ]}
                />
              </div>
              <div>
                  <label className="text-sm font-medium mb-1 block">Nilai Diskon</label>
                  <Input type="number" required 
                    value={newVoucher.discount_value} onChange={e => setNewVoucher({...newVoucher, discount_value: Number(e.target.value)})} 
                  />
                  {newVoucher.discount_type === 'percentage' && (
                    <p className="text-xs text-amber-600 font-mono mt-1 bg-amber-500/10 inline-block px-2 py-1 rounded-md">Format: Diskon {newVoucher.discount_value || 0}%</p>
                  )}
                  {newVoucher.discount_type === 'fixed' && (
                    <p className="text-xs text-emerald-600 font-mono mt-1 bg-emerald-500/10 inline-block px-2 py-1 rounded-md">Format: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(newVoucher.discount_value || 0)}</p>
                  )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Batas Pemakaian</label>
                <Input type="number" placeholder="0 = Unlimited"
                  value={newVoucher.max_uses || ""} onChange={e => setNewVoucher({...newVoucher, max_uses: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Kedaluwarsa (Opsional)</label>
                <Input type="date"
                  value={newVoucher.valid_until} onChange={e => setNewVoucher({...newVoucher, valid_until: e.target.value})} 
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setVoucherModal({ isOpen: false })}>Batal</Button>
            <Button type="submit">Simpan Voucher</Button>
          </div>
        </form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        isOpen={updateModal.isOpen}
        onClose={() => setUpdateModal({ isOpen: false, isEdit: false, data: null })}
        title={updateModal.isEdit ? "Edit Info Update" : "Buat Info Update Baru"}
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            if (updateModal.isEdit) {
              await updateDoc(doc(db, "system_updates", updateModal.data.id), {
                ...newUpdate,
                updated_at: serverTimestamp()
              });
              toast.success("Info update berhasil diperbarui");
            } else {
              await addDoc(collection(db, "system_updates"), {
                ...newUpdate,
                created_at: serverTimestamp()
              });
              toast.success("Info update berhasil dibuat");
            }
            setUpdateModal({ isOpen: false, isEdit: false, data: null });
          } catch (err) {
            console.error(err);
            toast.error("Gagal menyimpan info update");
          }
        }}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Versi (Contoh: v1.2.0)</label>
              <Input type="text" required placeholder="v1.0.0" className="font-mono"
                value={newUpdate.version} onChange={e => setNewUpdate({...newUpdate, version: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Judul Update</label>
              <Input type="text" required placeholder="Fitur Baru: Manajemen Voucher"
                value={newUpdate.title} onChange={e => setNewUpdate({...newUpdate, title: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Konten / Penjelasan</label>
              <textarea 
                required 
                className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 min-h-[150px] resize-y text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="Tuliskan penjelasan mengenai update ini. Admin masjid akan melihat ini saat login."
                value={newUpdate.content} onChange={e => setNewUpdate({...newUpdate, content: e.target.value})} 
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div>
                <h4 className="font-bold text-sm">Publikasikan Sekarang?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Jika aktif, admin akan melihat popup ini.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={newUpdate.is_published}
                  onChange={e => setNewUpdate({...newUpdate, is_published: e.target.checked})}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setUpdateModal({ isOpen: false })}>Batal</Button>
            <Button type="submit">{updateModal.isEdit ? "Simpan Perubahan" : "Rilis Update"}</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
