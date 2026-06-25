import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";
import { Toaster } from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const viewport = {
  themeColor: "#059669",
};

export const metadata = {
  title: "InfoMasjid TV - Smart Signage Masjid Digital",
  description: "Aplikasi Smart Signage dan TV Informasi Digital untuk Masjid di Seluruh Indonesia. Jadwal sholat akurat, pengumuman otomatis, laporan keuangan, dan barcode QRIS infaq.",
  keywords: ["Smart Signage Masjid", "TV Masjid", "Jadwal Sholat Digital", "Aplikasi Masjid", "InfoMasjid"],
  openGraph: {
    title: "InfoMasjid TV - Smart Signage Masjid Digital",
    description: "Tampilkan jadwal sholat akurat, laporan keuangan transparan, dan pengumuman interaktif langsung di TV Masjid Anda.",
    url: "https://infomasjid.com",
    siteName: "InfoMasjid TV",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InfoMasjid TV - Smart Signage Masjid Digital",
    description: "Ubah TV biasa menjadi papan informasi pintar untuk jamaah Masjid.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "InfoMasjid TV",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${amiri.variable} antialiased`}
    >
      <body className="font-sans select-none bg-background text-foreground">
        <PwaRegister />
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { borderRadius: '1rem', fontWeight: '500' } }} />
        {children}
      </body>
    </html>
  );
}
