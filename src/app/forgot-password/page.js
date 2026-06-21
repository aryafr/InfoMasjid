"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ArrowLeft, Send, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Silakan masukkan email Anda.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("Email tidak terdaftar dalam sistem kami.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else {
        setError("Gagal mengirim email reset. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-[100%] blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-[100%] blur-[120px]"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-card/40 backdrop-blur-3xl rounded-[2rem] p-8 border border-border/50 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-6 shadow-inner">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black mb-3">Lupa Password?</h1>
            <p className="text-muted-foreground text-sm">
              Masukkan email yang terdaftar, kami akan mengirimkan link untuk mengatur ulang password Anda.
            </p>
          </div>

          {success ? (
            <div className="text-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-emerald-700 dark:text-emerald-400 font-bold mb-2">Email Terkirim!</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-300">
                Silakan cek kotak masuk email Anda (termasuk folder Spam/Junk) untuk instruksi reset password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Email Aktif</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                    placeholder="nama@masjid.com"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Kirim Link Reset</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
