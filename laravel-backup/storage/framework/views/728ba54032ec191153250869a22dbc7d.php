<!-- resources/views/about.blade.php -->

<?php $__env->startSection('title', 'Tentang Aplikasi'); ?>
<?php $__env->startSection('main-content'); ?>

<div class="row justify-content-center">
    <div class="col-lg-10">
        <!-- Main Card -->
        <div class="card shadow mb-4" style="border-left: 4px solid var(--islamic-gold, #c9a03d); border-radius: 15px;">
            <!-- Card Header with Logo -->
            <div class="card-header py-3 text-center" style="background: linear-gradient(135deg, #1e5a3a, #0a2e1f); color: white; border-radius: 15px 15px 0 0;">
                <img src="<?php echo e(isset($setting['logo']) ? asset('storage/' . $setting['logo']) : asset('img/default-logo.png')); ?>"
                alt="Logo Aplikasi"
                class="img-fluid mb-3"
                style="max-width: 80px; border-radius: 50%; border: 3px solid #c9a03d; padding: 5px; background: white;">
                <h4 class="m-0 font-weight-bold" style="font-family: 'Amiri', serif;"><?php echo e($setting->nama_aplikasi ?? 'Sistem Informasi Masjid Digital'); ?></h4>
                <p class="mb-0 small" style="opacity: 0.9;">Solusi Digital untuk Manajemen Masjid dengan Tampilan TV Dinamis</p>
            </div>

            <!-- Card Body -->
            <div class="card-body">
                <!-- Introduction -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-info-circle mr-2" style="color: #c9a03d;"></i>Tentang Aplikasi Ini
                    </h5>
                    <p class="text-justify">
                        <strong><?php echo e($setting->nama_aplikasi ?? 'Sistem Informasi Masjid Digital'); ?></strong> adalah solusi terintegrasi berbasis web untuk manajemen masjid modern yang dibangun dengan Laravel 12. Aplikasi ini menampilkan informasi masjid secara real-time pada layar TV digital dengan desain yang dinamis dan responsif.
                    </p>
                    <p class="text-justify">
                        Sistem ini dirancang khusus untuk menampilkan jadwal sholat, pengumuman, informasi keuangan, dan kegiatan masjid secara digital dengan tampilan yang elegan dan mudah dibaca dari jarak jauh. Dilengkapi dengan antarmuka admin yang lengkap untuk mengelola semua konten yang ditampilkan.
                    </p>
                </section>

                <!-- Main Features -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-star-of-life mr-2" style="color: #c9a03d;"></i>Fitur Utama
                    </h5>
                    <div class="row">
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm" style="border-left: 4px solid #1e5a3a; border-radius: 10px;">
                                <div class="card-body">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;"><i class="fas fa-tv mr-2" style="color: #c9a03d;"></i>Tampilan TV Dinamis</h6>
                                    <p class="small text-justify">
                                        Menampilkan informasi masjid secara real-time pada layar TV dengan desain modern dan animasi yang menarik.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm" style="border-left: 4px solid #1e5a3a; border-radius: 10px;">
                                <div class="card-body">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;"><i class="fas fa-clock mr-2" style="color: #c9a03d;"></i>Jadwal Sholat Otomatis</h6>
                                    <p class="small text-justify">
                                        Menampilkan jadwal sholat dengan waktu yang akurat dan update otomatis sesuai lokasi masjid.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm" style="border-left: 4px solid #1e5a3a; border-radius: 10px;">
                                <div class="card-body">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;"><i class="fas fa-hand-holding-heart mr-2" style="color: #c9a03d;"></i>Laporan Keuangan</h6>
                                    <p class="small text-justify">
                                        Menampilkan informasi keuangan masjid secara transparan dengan grafik dan detail pemasukan/pengeluaran.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm" style="border-left: 4px solid #1e5a3a; border-radius: 10px;">
                                <div class="card-body">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;"><i class="fas fa-bullhorn mr-2" style="color: #c9a03d;"></i>Pengumuman Digital</h6>
                                    <p class="small text-justify">
                                        Menampilkan pengumuman penting masjid secara bergulir dengan efek animasi yang menarik.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm" style="border-left: 4px solid #1e5a3a; border-radius: 10px;">
                                <div class="card-body">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;"><i class="fas fa-sync-alt mr-2" style="color: #c9a03d;"></i>Auto-Update Jadwal</h6>
                                    <p class="small text-justify">
                                        Jadwal sholat diperbarui secara otomatis melalui API eksternal sesuai lokasi yang ditentukan.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm" style="border-left: 4px solid #1e5a3a; border-radius: 10px;">
                                <div class="card-body">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;"><i class="fas fa-exchange-alt mr-2" style="color: #c9a03d;"></i>Rotasi Halaman Dinamis</h6>
                                    <p class="small text-justify">
                                        Halaman tampilan TV berganti secara otomatis dengan interval yang dapat diatur sesuai kebutuhan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- TV Display Features -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-tv mr-2" style="color: #c9a03d;"></i>Fitur Tampilan TV
                    </h5>
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm h-100" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <div style="background: linear-gradient(135deg, #1e5a3a, #0a2e1f); color: white; border-radius: 50%; width: 50px; height: 50px; line-height: 50px; font-size: 20px; margin: 0 auto 15px;">1</div>
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Tampilan Waktu</h6>
                                    <p class="small">Menampilkan waktu sholat, tanggal Hijriah & Masehi secara real-time</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm h-100" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <div style="background: linear-gradient(135deg, #1e5a3a, #0a2e1f); color: white; border-radius: 50%; width: 50px; height: 50px; line-height: 50px; font-size: 20px; margin: 0 auto 15px;">2</div>
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Running Text</h6>
                                    <p class="small">Pengumuman bergulir dengan kecepatan yang dapat disesuaikan</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm h-100" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <div style="background: linear-gradient(135deg, #1e5a3a, #0a2e1f); color: white; border-radius: 50%; width: 50px; height: 50px; line-height: 50px; font-size: 20px; margin: 0 auto 15px;">3</div>
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Animasi Kaligrafi</h6>
                                    <p class="small">Elemen kaligrafi Islami dengan efek visual yang indah</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm h-100" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <div style="background: linear-gradient(135deg, #1e5a3a, #0a2e1f); color: white; border-radius: 50%; width: 50px; height: 50px; line-height: 50px; font-size: 20px; margin: 0 auto 15px;">4</div>
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Rotasi Otomatis</h6>
                                    <p class="small">Halaman berganti otomatis dengan interval yang dapat diatur</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- New Feature: Rotation Display -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-exchange-alt mr-2" style="color: #c9a03d;"></i>Fitur Rotasi Halaman Dinamis
                    </h5>
                    <div class="card shadow-sm" style="border-left: 4px solid #c9a03d; border-radius: 10px;">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Apa itu Rotasi Halaman?</h6>
                                    <p class="small">
                                        Fitur ini memungkinkan tampilan TV untuk berganti secara otomatis antara beberapa halaman yang berbeda. 
                                        Anda dapat mengatur halaman mana saja yang ingin ditampilkan dan berapa lama waktu pergantiannya.
                                    </p>
                                    <h6 class="font-weight-bold mt-3" style="color: #1e5a3a;">Keuntungan:</h6>
                                    <ul class="small">
                                        <li>Informasi lebih lengkap dan bervariasi</li>
                                        <li>Tampilan tidak monoton</li>
                                        <li>Dapat menampilkan lebih banyak informasi</li>
                                        <li>Mudah diatur melalui panel admin</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <div style="background: linear-gradient(135deg, rgba(30,90,58,0.05), rgba(201,160,61,0.05); padding: 15px; border-radius: 10px;">
                                        <h6 class="font-weight-bold" style="color: #1e5a3a;">Cara Mengatur:</h6>
                                        <ol class="small">
                                            <li>Buka menu <strong>Rotasi Halaman</strong> di sidebar</li>
                                            <li>Aktifkan fitur rotasi dengan toggle switch</li>
                                            <li>Atur interval waktu pergantian (1-3600 detik)</li>
                                            <li>Pilih halaman yang ingin ditampilkan</li>
                                            <li>Klik Simpan Pengaturan</li>
                                            <li>Buka halaman utama untuk melihat hasilnya</li>
                                        </ol>
                                        <div class="alert mt-2 mb-0" style="background: linear-gradient(135deg, #1e5a3a, #0a2e1f); color: white; border-radius: 10px;">
                                            <i class="fas fa-info-circle"></i> <strong>Info:</strong> Perubahan pengaturan akan langsung diterapkan tanpa perlu refresh browser!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="my-3">
                            <div class="row text-center">
                                <div class="col-4">
                                    <span class="badge p-2" style="background: #1e5a3a; color: white;">Dashboard Lengkap</span>
                                </div>
                                <div class="col-4">
                                    <span class="badge p-2" style="background: #c9a03d; color: #1e5a3a;">Jadwal Sholat</span>
                                </div>
                                <div class="col-4">
                                    <span class="badge p-2" style="background: #1e5a3a; color: white;">Rincian Keuangan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Admin Features -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-user-shield mr-2" style="color: #c9a03d;"></i>Fitur Admin
                    </h5>
                    <div class="card shadow-sm" style="border-radius: 10px;">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Manajemen Konten</h6>
                                    <ul class="small">
                                        <li>Kelola jadwal sholat dan jadwal imam</li>
                                        <li>Posting pengumuman dan kegiatan masjid</li>
                                        <li>Input data keuangan dan laporan</li>
                                        <li>Atur tampilan TV (warna, font, layout)</li>
                                        <li>Upload gambar dan dokumen pendukung</li>
                                        <li><strong>Atur Rotasi Halaman TV</strong> - <span style="color: #c9a03d;">Fitur Baru!</span></li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Sistem Keamanan</h6>
                                    <ul class="small">
                                        <li>Login dengan verifikasi dua faktor</li>
                                        <li>Pembatasan akses berdasarkan role</li>
                                        <li>Log aktivitas administrator</li>
                                        <li>Backup data otomatis</li>
                                        <li>Proteksi terhadap serangan cyber</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Technologies Used -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-microchip mr-2" style="color: #c9a03d;"></i>Teknologi yang Digunakan
                    </h5>
                    <div class="row">
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <img src="https://laravel.com/img/logomark.min.svg" alt="Laravel" style="height: 40px;" class="mb-2">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Laravel 12</h6>
                                    <p class="small">Framework PHP untuk backend</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <img src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg" alt="Bootstrap" style="height: 40px;" class="mb-2">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">Bootstrap 5</h6>
                                    <p class="small">Framework CSS untuk frontend</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <img src="https://jquery.com/jquery-wp-content/themes/jquery/img/logo-jquery.png" alt="jQuery" style="height: 40px;" class="mb-2">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">jQuery & AJAX</h6>
                                    <p class="small">Untuk update data real-time tanpa refresh</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 mb-3">
                            <div class="card shadow-sm" style="border-radius: 10px;">
                                <div class="card-body text-center">
                                    <img src="https://www.mysql.com/common/logos/logo-mysql-170x115.png" alt="MySQL" style="height: 40px;" class="mb-2">
                                    <h6 class="font-weight-bold" style="color: #1e5a3a;">MySQL</h6>
                                    <p class="small">Database management system</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Quick Guide -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-book-open mr-2" style="color: #c9a03d;"></i>Panduan Penggunaan
                    </h5>
                    <div class="card shadow-sm" style="border-radius: 10px;">
                        <div class="card-body">
                            <div class="accordion" id="usageGuide">
                                <div class="card" style="border-radius: 10px; margin-bottom: 10px;">
                                    <div class="card-header" id="headingOne" style="background: rgba(30,90,58,0.05); border-radius: 10px 10px 0 0;">
                                        <h6 class="mb-0">
                                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" style="color: #1e5a3a; text-decoration: none; font-weight: bold;">
                                                <i class="fas fa-plus-circle mr-2" style="color: #c9a03d;"></i>Menampilkan di TV
                                            </button>
                                        </h6>
                                    </div>
                                    <div id="collapseOne" class="collapse show" data-parent="#usageGuide">
                                        <div class="card-body small">
                                            1. Buka browser di perangkat yang terhubung ke TV<br>
                                            2. Akses alamat aplikasi (contoh: http://masjidanda.tv)<br>
                                            3. Tekan F11 untuk mode layar penuh<br>
                                            4. Atur resolusi sesuai dengan layar TV<br>
                                            5. Sistem akan menampilkan informasi secara otomatis
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="border-radius: 10px; margin-bottom: 10px;">
                                    <div class="card-header" id="headingTwo" style="background: rgba(30,90,58,0.05); border-radius: 10px 10px 0 0;">
                                        <h6 class="mb-0">
                                            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" style="color: #1e5a3a; text-decoration: none; font-weight: bold;">
                                                <i class="fas fa-plus-circle mr-2" style="color: #c9a03d;"></i>Update Jadwal Sholat
                                            </button>
                                        </h6>
                                    </div>
                                    <div id="collapseTwo" class="collapse" data-parent="#usageGuide">
                                        <div class="card-body small">
                                            1. Login sebagai admin<br>
                                            2. Akses menu Jadwal Sholat<br>
                                            3. Input waktu sholat sesuai lokasi masjid<br>
                                            4. Atur jadwal imam dan muadzin<br>
                                            5. Sistem akan update otomatis di tampilan TV
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="border-radius: 10px; margin-bottom: 10px;">
                                    <div class="card-header" id="headingThree" style="background: rgba(30,90,58,0.05); border-radius: 10px 10px 0 0;">
                                        <h6 class="mb-0">
                                            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" style="color: #1e5a3a; text-decoration: none; font-weight: bold;">
                                                <i class="fas fa-plus-circle mr-2" style="color: #c9a03d;"></i>Posting Pengumuman
                                            </button>
                                        </h6>
                                    </div>
                                    <div id="collapseThree" class="collapse" data-parent="#usageGuide">
                                        <div class="card-body small">
                                            1. Login sebagai admin<br>
                                            2. Akses menu Pengumuman<br>
                                            3. Buat pengumuman baru<br>
                                            4. Atur tanggal dan prioritas tampilan<br>
                                            5. Pengumuman akan muncul di running text TV
                                        </div>
                                    </div>
                                </div>
                                <div class="card" style="border-radius: 10px;">
                                    <div class="card-header" id="headingFour" style="background: rgba(30,90,58,0.05); border-radius: 10px 10px 0 0;">
                                        <h6 class="mb-0">
                                            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" style="color: #1e5a3a; text-decoration: none; font-weight: bold;">
                                                <i class="fas fa-plus-circle mr-2" style="color: #c9a03d;"></i>Atur Rotasi Halaman TV
                                            </button>
                                        </h6>
                                    </div>
                                    <div id="collapseFour" class="collapse" data-parent="#usageGuide">
                                        <div class="card-body small">
                                            1. Login sebagai admin<br>
                                            2. Akses menu Rotasi Halaman di sidebar<br>
                                            3. Aktifkan fitur rotasi<br>
                                            4. Atur interval waktu pergantian<br>
                                            5. Pilih halaman yang ingin ditampilkan<br>
                                            6. Klik Simpan - perubahan langsung berlaku!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Version History -->
                <section class="mb-5">
                    <h5 class="font-weight-bold mb-3" style="color: #1e5a3a; border-left: 4px solid #c9a03d; padding-left: 15px;">
                        <i class="fas fa-history mr-2" style="color: #c9a03d;"></i>Riwayat Versi
                    </h5>
                    <div class="card shadow-sm" style="border-radius: 10px;">
                        <div class="card-body">
                            <ul class="small">
                                <li><strong style="color: #1e5a3a;">Versi 2.1.0</strong> (<?php echo e(now()->format('d F Y')); ?>) - <span style="color: #c9a03d;">Fitur Baru: Rotasi Halaman Dinamis</span>
                                    <ul>
                                        <li>Penambahan fitur rotasi halaman otomatis</li>
                                        <li>Interval rotasi dapat diatur (1-3600 detik)</li>
                                        <li>Pemilihan halaman yang akan dirotasi</li>
                                        <li>Update pengaturan real-time tanpa refresh</li>
                                    </ul>
                                </li>
                                <li><strong style="color: #1e5a3a;">Versi 2.0.0</strong> (Januari 2025) - Rilis Utama
                                    <ul>
                                        <li>Penambahan fitur auto-update jadwal sholat</li>
                                        <li>Peningkatan tampilan TV responsif</li>
                                        <li>Penambahan laporan keuangan</li>
                                    </ul>
                                </li>
                                <li><strong style="color: #1e5a3a;">Versi 1.0.0</strong> (Oktober 2024) - Rilis Awal</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Developer Info -->
                <section class="text-center">
                    <div class="card shadow-sm" style="border-radius: 10px; background: linear-gradient(135deg, #1e5a3a, #0a2e1f); color: white;">
                        <div class="card-body">
                            <?php echo $setting->footer ?? '<p class="small mb-0">Dikembangkan oleh <a href="https://wa.me/628179851011" target="_blank" style="color: #c9a03d; text-decoration: none;">Ali Mochtar Development System</a></p>'; ?>

                            <p class="small mt-2 mb-0">Versi Aplikasi: 2.1.0 (Update: <?php echo e(now()->format('d F Y')); ?>)</p>
                            <p class="small mt-2 mb-0">
                                <i class="fas fa-exchange-alt" style="color: #c9a03d;"></i> Fitur Rotasi Halaman: 
                                <?php if($setting->rotation_enabled ?? false): ?>
                                <span class="badge" style="background: #c9a03d; color: #1e5a3a;">AKTIF</span> (Interval: <?php echo e($setting->rotation_interval ?? 10); ?> detik)
                                <?php else: ?>
                                <span class="badge" style="background: #6c757d; color: white;">NONAKTIF</span>
                                <?php endif; ?>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>

<!-- Custom CSS -->
<style>
    .card-header button.btn-link:focus {
        text-decoration: none;
        outline: none;
    }
    
    .accordion .card {
        border: 1px solid rgba(30,90,58,0.1);
    }
    
    .accordion .card-header {
        border-bottom: 1px solid rgba(30,90,58,0.1);
    }
    
    .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    section {
        animation: fadeInUp 0.5s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\about.blade.php ENDPATH**/ ?>