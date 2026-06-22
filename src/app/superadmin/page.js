"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  LogOut, Users, CheckCircle, Clock, Trash2, 
  ShieldCheck, ExternalLink, Bell, User, LayoutDashboard,
  TrendingUp, CreditCard, Activity, MoreVertical, Building,
  ArrowUpCircle, Menu, X
} from "lucide-react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from "recharts";

const PACKAGE_PRICE = 250000; // Assumption based on previous logic

export default function SuperAdminPage() {
  const [user, setUser] = useState(null);
  const [masjids, setMasjids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editPackageModal, setEditPackageModal] = useState({ isOpen: false, id: null, currentPackage: "berkah" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, type: "default" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else if (currentUser.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
        openConfirmModal("Akses Ditolak", "Anda bukan Super Admin.", () => router.push("/"), "alert");
      } else {
        setUser(currentUser);
        fetchMasjids();
      }
    });
    return () => unsubscribe();
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
      `Yakin ingin menghapus data masjid ini (${id})? Tindakan ini tidak dapat dibatalkan.`,
      async () => {
        try {
          await deleteDoc(doc(db, "masjids", id));
          fetchMasjids();
        } catch (error) {
          openConfirmModal("Gagal", "Gagal menghapus data masjid.", null, "alert");
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
            active_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          });
          fetchMasjids();
        } catch (error) {
          openConfirmModal("Gagal", "Gagal mengaktifkan akun masjid.", null, "alert");
        }
      },
      "success"
    );
  };

  const openEditPackageModal = (id, currentPackage) => {
    setEditPackageModal({ isOpen: true, id, currentPackage: currentPackage || "berkah" });
  };

  const submitEditPackage = async () => {
    try {
      await updateDoc(doc(db, "masjids", editPackageModal.id), {
        subscription_package: editPackageModal.currentPackage.toLowerCase()
      });
      fetchMasjids();
      setEditPackageModal({ isOpen: false, id: null, currentPackage: "berkah" });
    } catch (error) {
      openConfirmModal("Gagal", "Gagal mengubah paket berlangganan.", null, "alert");
    }
  };

  if (loading || !user) return <div className="min-h-screen bg-background flex items-center justify-center p-8 text-xl font-bold">Memuat Dasbor Super Admin...</div>;

  // Derived Stats
  const totalPaid = masjids.filter(m => m.payment_status === "paid").length;
  const totalPending = masjids.length - totalPaid;
  const totalRevenue = totalPaid * PACKAGE_PRICE;

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

  const getDaysLeft = (activeUntil) => {
    if (!activeUntil) return 0;
    const expiryDate = activeUntil.toDate ? activeUntil.toDate() : new Date(activeUntil);
    const diffTime = expiryDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const pieData = [
    { name: 'Lunas', value: totalPaid, color: 'var(--primary)' },
    { name: 'Pending', value: totalPending, color: '#f59e0b' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      
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
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm transition-all cursor-pointer relative group ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}>
              {activeTab === 'dashboard' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md hidden md:block"></div>}
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Dashboard</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("customers");
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm transition-all cursor-pointer relative group ${activeTab === 'customers' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}`}>
              {activeTab === 'customers' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-md hidden md:block"></div>}
              <Users className="h-5 w-5 shrink-0" />
              <span className="hidden md:block">Customers</span>
            </button>

          </nav>
        </div>

        <div className="p-4 lg:p-6 border-t border-border/50">
          <button 
            onClick={() => {
              openConfirmModal(
                "Keluar",
                "Apakah Anda yakin ingin keluar?",
                () => signOut(auth),
                "destructive"
              );
            }}
            className="flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="hidden md:block">Log out</span>
          </button>
        </div>
      </aside>

      {/* 2. MIDDLE CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-muted/10 w-full">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 shrink-0 border-b border-border/30 bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-foreground/80 hover:bg-muted rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>
          
          <div className="flex bg-card border border-border rounded-full px-4 py-2 w-48 md:w-96 shadow-sm items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" placeholder="Search masjids..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
            
            {/* Top Stat Cards - Show on Dashboard */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground text-sm font-medium">Total Customers</span>
                  <div className="p-2 bg-primary/10 text-primary rounded-lg"><Users className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black">{masjids.length}</div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1 text-primary font-medium">
                  <TrendingUp className="w-3 h-3"/> +12% this month
                </div>
              </div>

              <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground text-sm font-medium">Paid Subscriptions</span>
                  <div className="p-2 bg-primary/10 text-primary rounded-lg"><CheckCircle className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black">{totalPaid}</div>
                <div className="text-xs text-muted-foreground mt-2 font-medium">
                  {((totalPaid / Math.max(1, masjids.length)) * 100).toFixed(0)}% conversion rate
                </div>
              </div>

              <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-muted-foreground text-sm font-medium">Pending Payments</span>
                  <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Clock className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black text-orange-500">{totalPending}</div>
                <div className="text-xs text-muted-foreground mt-2 font-medium">
                  Requires follow-up
                </div>
              </div>

              <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10"><Activity className="w-32 h-32 text-primary" /></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="text-muted-foreground text-sm font-medium">System Health</span>
                  <div className="p-2 bg-primary/10 text-primary rounded-lg"><ShieldCheck className="w-4 h-4"/></div>
                </div>
                <div className="text-3xl font-black relative z-10">99.9%</div>
                <div className="text-xs text-primary mt-2 font-medium relative z-10">
                  All services operational
                </div>
              </div>
              </div>
            )}

            {/* Charts Section - Show on Dashboard */}
            {activeTab === "dashboard" && (
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
                <h3 className="font-bold mb-4 w-full text-left">Status Accounts</h3>
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
            {(activeTab === "dashboard" || activeTab === "customers") && (
              <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border/50 flex justify-between items-center bg-card/50">
                  <h3 className="font-bold text-lg">Customer Directory</h3>
                  {activeTab === "dashboard" && <button onClick={() => setActiveTab("customers")} className="text-sm font-medium text-primary hover:underline">View all</button>}
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
                    {masjids.map((m) => (
                      <tr key={m.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
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
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md ${
                            m.subscription_package === 'premium' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-primary/10 text-primary border border-primary/20'
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
                          <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                            <a 
                              href={`/${m.id}`} 
                              target="_blank" 
                              className="w-8 h-8 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                              title="Lihat Layar TV"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            {m.payment_status !== "paid" && (
                              <button 
                                onClick={() => handleManualActivate(m.id)}
                                className="w-8 h-8 rounded-full bg-accent hover:bg-emerald-500 hover:text-white text-foreground flex items-center justify-center transition-colors shadow-sm"
                                title="Lunaskan Manual"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => openEditPackageModal(m.id, m.subscription_package)}
                              className="w-8 h-8 rounded-full bg-accent hover:bg-amber-500 hover:text-white text-foreground flex items-center justify-center transition-colors shadow-sm"
                              title="Ubah Paket Berlangganan"
                            >
                              <ArrowUpCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(m.id)}
                              className="w-8 h-8 rounded-full bg-accent hover:bg-destructive hover:text-white text-foreground flex items-center justify-center transition-colors shadow-sm"
                              title="Hapus Data Masjid"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {masjids.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Building className="w-10 h-10 opacity-20" />
                            <p className="font-medium">Belum ada masjid yang terdaftar.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            )}

          </div>
        </main>
      </div>

      {/* 3. RIGHT SIDEBAR (Profile & Finances) */}
      <aside className="w-80 bg-card border-l border-border/60 flex flex-col shrink-0 h-full z-20 shadow-xl hidden xl:flex">
        <div className="p-8 border-b border-border/50 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-8">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></div>
            </button>
            <ThemeToggle />
          </div>
          
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg mb-4 relative">
            <User className="w-10 h-10 text-primary" />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card"></div>
          </div>
          <h2 className="font-black text-xl">Arya Founder</h2>
          <p className="text-sm text-muted-foreground">Super Administrator</p>
          
          <button className="mt-6 w-full py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors text-sm">
            Edit Profile
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          <h3 className="font-bold text-lg mb-6">Financial Summary</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
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
            <button className="text-xs font-medium text-primary hover:underline">View all</button>
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
                  {m.payment_status === 'paid' ? '+250k' : '...'}
                </div>
              </div>
            ))}
            {masjids.length === 0 && (
               <p className="text-sm text-muted-foreground text-center py-4">Belum ada aktivitas.</p>
            )}
          </div>
        </div>

        {/* CUSTOM MODAL FOR EDIT PACKAGE */}
        {editPackageModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-xl border border-border">
              <h3 className="font-bold text-lg mb-2">Ubah Paket Berlangganan</h3>
              <p className="text-sm text-muted-foreground mb-4">Pilih paket untuk masjid ID: <span className="font-mono text-foreground font-medium">{editPackageModal.id}</span></p>
              
              <div className="mb-6 flex flex-col gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-accent transition-colors">
                  <input 
                    type="radio" 
                    name="package" 
                    value="berkah"
                    checked={editPackageModal.currentPackage === 'berkah'}
                    onChange={() => setEditPackageModal({ ...editPackageModal, currentPackage: 'berkah' })}
                    className="w-4 h-4 text-primary accent-primary"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-primary">Paket Berkah</span>
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
                <button 
                  onClick={() => setEditPackageModal({ isOpen: false, id: null, currentPackage: 'berkah' })}
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={submitEditPackage}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM GENERIC CONFIRM MODAL */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-xl border border-border">
              <h3 className="font-bold text-lg mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{confirmModal.message}</p>
              
              <div className="flex gap-3 justify-end">
                {confirmModal.type !== 'alert' && (
                  <button 
                    onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Batal
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                    setConfirmModal({ ...confirmModal, isOpen: false });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors shadow-md ${
                    confirmModal.type === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : 
                    confirmModal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : 
                    'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {confirmModal.type === 'alert' ? 'Oke, Mengerti' : 'Ya, Lanjutkan'}
                </button>
              </div>
            </div>
          </div>
        )}

      </aside>
    </div>
  );
}
