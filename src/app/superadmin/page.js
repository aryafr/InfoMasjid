"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Shield, Building, Trash2, CheckCircle, XCircle, Search, DollarSign, Users, AlertTriangle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function SuperAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [masjids, setMasjids] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const SUPERADMIN_EMAIL = "aryafr4@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin"); // Redirect to login if not logged in
        return;
      }
      
      if (user.email !== SUPERADMIN_EMAIL) {
        alert("Akses Ditolak: Anda bukan Super Admin.");
        router.push("/"); 
        return;
      }

      // Fetch all masjids
      try {
        const querySnapshot = await getDocs(collection(db, "masjids"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMasjids(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Gagal mengambil data dari database. Pastikan Firebase Security Rules mengizinkan baca untuk superadmin.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id, nama) => {
    if (confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus data masjid "${nama}" (ID: ${id}) secara permanen?`)) {
      try {
        await deleteDoc(doc(db, "masjids", id));
        setMasjids(masjids.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Gagal menghapus.");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await updateDoc(doc(db, "masjids", id), {
        subscription_status: newStatus
      });
      setMasjids(masjids.map(m => m.id === id ? { ...m, subscription_status: newStatus } : m));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengubah status.");
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeCount = masjids.filter(m => m.subscription_status === "active").length;
  const pendingCount = masjids.filter(m => m.subscription_status === "pending_payment").length;

  const filteredMasjids = masjids.filter(m => 
    m.nama_aplikasi?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <header className="h-20 bg-card/40 backdrop-blur-xl border-b border-border flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight">Super Admin Portal</h1>
            <p className="text-muted-foreground text-sm font-medium">Control panel khusus untuk {SUPERADMIN_EMAIL}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => { auth.signOut(); router.push("/"); }} className="bg-destructive/10 text-destructive px-5 py-2.5 rounded-full font-bold hover:bg-destructive hover:text-white transition-colors">
            Keluar
          </button>
        </div>
      </header>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-sm flex items-center gap-6">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Building className="h-8 w-8" /></div>
            <div>
              <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Total Masjid</p>
              <p className="text-4xl font-black">{masjids.length}</p>
            </div>
          </div>
          <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-sm flex items-center gap-6">
            <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500"><CheckCircle className="h-8 w-8" /></div>
            <div>
              <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Klien Aktif</p>
              <p className="text-4xl font-black">{activeCount}</p>
            </div>
          </div>
          <div className="bg-card border-2 border-border p-6 rounded-3xl shadow-sm flex items-center gap-6">
            <div className="bg-amber-500/10 p-4 rounded-2xl text-amber-500"><AlertTriangle className="h-8 w-8" /></div>
            <div>
              <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Pending Payment</p>
              <p className="text-4xl font-black">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Client List */}
        <div className="bg-card border-2 border-border rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/30">
            <h2 className="text-xl font-black flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Daftar Pelanggan</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Cari nama masjid, ID, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-xs font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Masjid & ID</th>
                  <th className="px-6 py-4">Kontak (Email)</th>
                  <th className="px-6 py-4">Kota</th>
                  <th className="px-6 py-4">Status / Paket</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMasjids.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground font-medium">Tidak ada data masjid ditemukan.</td>
                  </tr>
                ) : (
                  filteredMasjids.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-base">{m.nama_aplikasi || "Tanpa Nama"}</div>
                        <div className="text-xs font-mono text-muted-foreground mt-1 bg-background px-2 py-1 rounded inline-block border border-border">{m.id}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">{m.email || "-"}</td>
                      <td className="px-6 py-4 font-medium">{m.settings?.auto_update?.city || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full ${
                            m.subscription_status === 'active' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 
                            m.subscription_status === 'pending_payment' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                            'bg-destructive/20 text-destructive'
                          }`}>
                            {m.subscription_status || "UNKNOWN"}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground capitalize border border-border px-2 py-0.5 rounded-md">
                            {m.subscription_package || "Trial"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => window.open(`/${m.id}`, '_blank')}
                            className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs rounded-lg transition-colors border border-border"
                          >
                            Lihat TV
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(m.id, m.subscription_status)}
                            className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition-colors border border-primary/20"
                          >
                            {m.subscription_status === "active" ? "Suspend" : "Aktifkan"}
                          </button>
                          <button 
                            onClick={() => handleDelete(m.id, m.nama_aplikasi)}
                            className="p-1.5 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white rounded-lg transition-colors"
                            title="Hapus Masjid"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
