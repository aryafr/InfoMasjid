"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "akses-ditolak") {
      setError("Akses ditolak. Anda mencoba masuk ke Dasbor Masjid yang bukan milik Anda.");
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Check if Super Admin
      if (user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
        router.push("/superadmin");
        return;
      }

      // Check user mapping in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.masjidId) {
          router.push(`/${data.masjidId}/admin`);
        } else {
          setError("Masjid ID tidak ditemukan untuk akun ini.");
        }
      } else {
        // Fallback for demo logic if no mapping exists
        setError("Akun ini tidak terdaftar sebagai pengelola masjid mana pun.");
        await auth.signOut();
      }
    } catch (err) {
      setError("Email atau Password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none z-0"></div>
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors z-20">
        &larr; Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border-2 border-border/60 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 flex items-center justify-center mx-auto mb-4 shrink-0">
            <Image src="/icon.png" alt="Logo InfoMasjid" width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-center">Masuk ke Dasbor</h1>
          <p className="text-muted-foreground text-center mt-2 text-sm">Masuk untuk mengelola layar informasi dan operasional masjid Anda.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-bold text-muted-foreground mb-2 block">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border/50 bg-background/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none font-medium"
                placeholder="email@contoh.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">Lupa Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border/50 bg-background/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-primary text-primary-foreground font-bold px-6 py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Masuk <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function GlobalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
