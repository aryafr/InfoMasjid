const fs = require('fs');
const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

const oldPanduanStart = `{/* ==================== 7. TAB: PANDUAN ==================== */}`;
const oldPanduanEnd = `                  </section>

                </div>
              </div>
            </div>
          )}`;

const panduanBlockRegex = new RegExp('\\{\\/\\* ==================== 7\\. TAB: PANDUAN ==================== \\*\\/\\}[\\s\\S]*?<\\/section>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*\\)}');

// We need a VERY detailed panduan.
const newPanduanContent = `          {/* ==================== 7. TAB: PANDUAN ==================== */}
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
                        
                        const fullHtml = \`
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
                                .bg-muted\\/30 { background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px; }
                                .warning { background-color: #fee2e2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-top: 40px; color: #b91c1c; }
                                svg { display: none; } /* Hide icons in print for cleaner look */
                                @media print {
                                  body { padding: 0; max-width: none; }
                                  @page { margin: 2cm; }
                                  .bg-muted\\/30 { break-inside: avoid; }
                                }
                              </style>
                            </head>
                            <body>
                              <h1>🕌 Buku Panduan InfoMasjid v1.0</h1>
                              \${htmlContent}
                              <script>
                                window.onload = function() {
                                  setTimeout(function() {
                                    window.print();
                                  }, 500);
                                };
                              </script>
                            </body>
                          </html>
                        \`;
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
                        <ul className="text-sm text-foreground/80 space-y-2 pl-5 list-decimal">
                          <li>Buka aplikasi <strong>Browser</strong> di TV (Google Chrome, Firefox, atau browser bawaan).</li>
                          <li>Ketikkan alamat link khusus TV Anda di kolom pencarian.</li>
                          <li>Halaman TV akan terbuka dan langsung memulai rotasi informasi.</li>
                        </ul>
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
          )}`;

const updatedCodeAdmin = codeAdmin.replace(panduanBlockRegex, newPanduanContent);

fs.writeFileSync(pathAdmin, updatedCodeAdmin, 'utf8');

// Also inject Download icon import if missing
let finalCode = fs.readFileSync(pathAdmin, 'utf8');
if (!finalCode.includes('Download,')) {
  finalCode = finalCode.replace('UploadCloud,', 'UploadCloud, Download,');
  fs.writeFileSync(pathAdmin, finalCode, 'utf8');
}

console.log('Successfully upgraded Panduan UI.');
