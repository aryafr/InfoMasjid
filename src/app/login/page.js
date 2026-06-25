"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "akses-ditolak") {
      toast.error("Akses ditolak. Anda mencoba masuk ke Dasbor Masjid yang bukan milik Anda.");
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
          toast.error("Masjid ID tidak ditemukan untuk akun ini.");
        }
      } else {
        // Fallback for demo logic if no mapping exists
        toast.error("Akun ini tidak terdaftar sebagai pengelola masjid mana pun.");
        await auth.signOut();
      }
    } catch (err) {
      toast.error("Email atau Password salah.");
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

      <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-2 border-border/60 p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 flex items-center justify-center mx-auto mb-4 shrink-0">
            <Image src="/icon.png" alt="Logo InfoMasjid" width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-center">Masuk ke Dasbor</h1>
          <p className="text-muted-foreground text-center mt-2 text-sm">Masuk untuk mengelola layar informasi dan operasional masjid Anda.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-bold text-muted-foreground mb-2 block">Alamat Email</label>
            <Input 
              type="email" 
              icon={Mail}
              required
              placeholder="email@contoh.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-semibold">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">Lupa Password?</Link>
            </div>
            <Input 
              type="password" 
              icon={Lock}
              required
              placeholder="••••••••"
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
            Masuk <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </Card>
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
