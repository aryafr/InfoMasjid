export const emptySettings = {
  nama_aplikasi: "Nama Masjid Anda",
  footer: "Copyright 2026 | Nama Masjid Anda",
  running_text: "Selamat datang di sistem InfoMasjid. Silakan atur teks berjalan ini di Dasbor Admin.",
  logo_url: "",
  rotation_interval: 10,
  rotation_enabled: true,
  rotation_pages: [
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
  ],
  auto_update: { enabled: true, city: "Jakarta", country: "Indonesia", method: 11 },
  murottal: { enabled: false, url: "" },
  posters: []
};

export const emptyJadwalSholat = {
  Subuh: "04:00", Dzuhur: "12:00", Ashar: "15:00", Maghrib: "18:00", Isya: "19:00",
  updated_at: new Date().toISOString()
};

export const emptySholatJumat = {
  imam: "-", khatib: "-", muadzin: "-", tanggal: new Date().toISOString().split('T')[0]
};

export const emptyPengumuman = [];
export const emptyKeuangan = [];
export const emptyQris = {
  nama: "", gambar: "", keterangan: "", nomor_rekening: "", bank: "", atas_nama: "", status: "tidak aktif"
};

export const emptyIdulFitri = { tahun: "", tanggal: "", imam: "-", khatib: "-", muadzin: "-", waktu: "07:00", keterangan: "" };
export const emptyIdulAdha = { tahun: "", tanggal: "", imam: "-", khatib: "-", muadzin: "-", waktu: "07:00", keterangan: "" };

export const defaultSettings = {
  nama_aplikasi: "MASJID DA'WATUL ISLAM",
  footer: "Copyright 2026 Ali Mochtar Development System | MASJID DA'WATUL ISLAM Balikpapan",
  running_text: "🌙 \"Hati yang tenang ada pada mereka yang selalu mengingat Allah. Mari perbanyak zikir dan shalat berjamaah.\" 📖 “Ingatlah, hanya dengan mengingat Allah hati menjadi tenang.” (QS. Ar-Ra’d: 28)",
  logo_url: "",
  rotation_interval: 12,
  rotation_enabled: true,
  rotation_pages: [
    { url: "welcome", name: "Dashboard Lengkap", active: true },
    { url: "utama", name: "Jadwal Sholat", active: true },
    { url: "keuangan", name: "Rincian Keuangan", active: true },
    { url: "jumat", name: "Jadwal Sholat Jumat", active: true },
    { url: "pengumuman", name: "Pengumuman", active: true },
    { url: "keuangan-summary", name: "Ringkasan Keuangan", active: true },
    { url: "qris", name: "QRIS Donasi", active: true },
    { url: "idul-fitri", name: "Idul Fitri", active: false },
    { url: "idul-adha", name: "Idul Adha", active: false },
    { url: "hitung-mundur", name: "Hitung Mundur Hari Besar", active: true }
  ],
  auto_update: {
    enabled: true,
    city: "Balikpapan",
    country: "Indonesia",
    method: 11
  },
  murottal: {
    enabled: false,
    url: "https://www.youtube.com/watch?v=IPyvDEiUq2s"
  },
  posters: [
    "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  ]
};

export const defaultJadwalSholat = {
  Subuh: "04:45",
  Dzuhur: "12:12",
  Ashar: "15:37",
  Maghrib: "18:14",
  Isya: "19:28",
  updated_at: new Date().toISOString()
};

export const defaultSholatJumat = {
  imam: "KH. Muhammad Syukri",
  khatib: "Dr. H. Ahmad Wijaya, M.A.",
  muadzin: "Fadli Rahman",
  tanggal: new Date(Date.now() + (5 - new Date().getDay()) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Next Friday
};

export const defaultPengumuman = [
  {
    id: "1",
    isi: "Kajian rutin Ahad Subuh bersama Ustadz Prof. KH. M. Hatta, Lc, MA. Tema: Tafsir Al-Quran.",
    tanggal: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: "2",
    isi: "Penggalangan dana untuk perluasan lahan parkir jamaah. Donasi dapat disalurkan melalui QRIS atau Bendahara.",
    tanggal: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  {
    id: "3",
    isi: "Kerja bakti kebersihan area masjid akan dilaksanakan pada Ahad pagi mulai pukul 07.30 WITA.",
    tanggal: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
];

export const defaultKeuangan = [
  { id: "1", tanggal: "2026-06-15", deskripsi: "Infak Jumat Berkah (15 Juni)", kategori: "Infak Jumat", pemasukan: 4850000, pengeluaran: 0 },
  { id: "2", tanggal: "2026-06-16", deskripsi: "Pembayaran Tagihan Listrik PLN & PDAM", kategori: "Utilitas (Listrik/Air)", pemasukan: 0, pengeluaran: 1250000 },
  { id: "3", tanggal: "2026-06-17", deskripsi: "Donasi Hamba Allah untuk Sound System", kategori: "Donatur Tetap", pemasukan: 5000000, pengeluaran: 0 },
  { id: "4", tanggal: "2026-06-18", deskripsi: "Pembelian Alat Kebersihan & Desinfektan", kategori: "Operasional & Pemeliharaan", pemasukan: 0, pengeluaran: 350000 },
  { id: "5", tanggal: "2026-06-19", deskripsi: "Infak Kotak Amal Harian", kategori: "Infak Harian / Kotak Amal", pemasukan: 1240000, pengeluaran: 0 },
  { id: "6", tanggal: "2026-06-20", deskripsi: "Gaji Petugas Kebersihan / Marbot", kategori: "Gaji Imam / Marbot / Pegawai", pemasukan: 0, pengeluaran: 1500000 },
  { id: "7", tanggal: "2026-06-21", deskripsi: "Konsumsi Kajian Rutin Ahad Subuh", kategori: "Kajian, Dakwah & Pendidikan", pemasukan: 0, pengeluaran: 450000 }
];

export const defaultQris = {
  nama: "QRIS Masjid Da'watul Islam",
  gambar: "/qris_example.png",
  keterangan: "Pindai kode QR untuk berdonasi/infak digital secara cashless",
  nomor_rekening: "123-456-7890",
  bank: "Bank Syariah Indonesia (BSI)",
  atas_nama: "DKM DA'WATUL ISLAM",
  status: "aktif"
};

export const defaultIdulFitri = {
  tahun: "2027",
  tanggal: "2027-03-10",
  imam: "KH. Ma'ruf Khozin",
  khatib: "Prof. Dr. H. Nur Kholis, MA",
  muadzin: "Saiful Anwar",
  waktu: "07:00",
  keterangan: "1 Syawal 1448 H"
};

export const defaultIdulAdha = {
  tahun: "2026",
  tanggal: "2026-05-27",
  imam: "Ustadz Fauzan Akbar",
  khatib: "KH. Syamsul Arifin",
  muadzin: "Bilal",
  waktu: "06:30",
  keterangan: "10 Dzulhijjah 1447 H"
};
