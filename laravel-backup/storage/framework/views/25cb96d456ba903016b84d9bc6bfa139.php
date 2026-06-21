<!-- resources/views/home.blade.php -->


<?php $__env->startSection('main-content'); ?>
<!-- Page Heading -->
<div class="d-sm-flex align-items-center justify-content-between mb-4">
    <div>
        <h1 class="h3 mb-0 text-gray-800">
            <i class="fas fa-tachometer-alt"></i> <?php echo e(__('Dashboard')); ?>

        </h1>
        <p class="text-muted mt-1 mb-0">Selamat datang kembali, <strong><?php echo e(auth()->user()->name); ?></strong>!</p>
    </div>
    <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" id="quickActionsDropdown" data-toggle="dropdown">
            <i class="fas fa-bolt"></i> Aksi Cepat
        </button>
        <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="<?php echo e(route('jadwal_sholat.create')); ?>">
                <i class="fas fa-plus-circle text-success"></i> Tambah Jadwal Sholat
            </a>
            <a class="dropdown-item" href="<?php echo e(route('pengumuman.create')); ?>">
                <i class="fas fa-bullhorn text-info"></i> Buat Pengumuman
            </a>
            <a class="dropdown-item" href="<?php echo e(route('keuangan.create')); ?>">
                <i class="fas fa-money-bill text-warning"></i> Input Keuangan
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="<?php echo e(route('rotator')); ?>" target="_blank">
                <i class="fas fa-tv text-primary"></i> Buka Tampilan TV
            </a>
        </div>
    </div>
</div>

<!-- Notification Alerts -->
<?php if(session('success')): ?>
<div class="alert alert-success border-left-success alert-dismissible fade show" role="alert">
    <i class="fas fa-check-circle mr-2"></i> <?php echo e(session('success')); ?>

    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<?php endif; ?>

<?php if(session('status')): ?>
<div class="alert alert-success border-left-success alert-dismissible fade show" role="alert">
    <i class="fas fa-check-circle mr-2"></i> <?php echo e(session('status')); ?>

    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<?php endif; ?>

<?php if(session('welcome')): ?>
<div class="alert alert-info border-left-info alert-dismissible fade show" role="alert">
    <i class="fas fa-info-circle mr-2"></i> <?php echo e(session('welcome')); ?>

    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<?php endif; ?>

<!-- Welcome Card -->
<div class="row mb-4">
    <div class="col-md-12">
        <div class="card bg-gradient-primary text-white shadow">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h4 class="mb-2">Selamat Datang di Sistem Informasi Masjid</h4>
                        <p class="mb-0">Kelola jadwal sholat, pengumuman, keuangan, dan tampilan TV digital dengan mudah.</p>
                        <small class="opacity-75">Terakhir login: <?php echo e(auth()->user()->updated_at->diffForHumans() ?? 'Baru saja'); ?></small>
                    </div>
                    <div class="col-md-4 text-center">
                        <i class="fas fa-mosque fa-4x opacity-75"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php if(auth()->user()->role && auth()->user()->role->name === 'admin'): ?>
<!-- Admin Dashboard Cards -->
<div class="row">
    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('users.index')); ?>" class="card-link">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                <i class="fas fa-users"></i> Total Pengguna
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo e($widget['users'] ?? 0); ?></div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-user-check"></i> Aktif: <?php echo e(\App\Models\User::where('created_at', '>=', now()->subDays(30))->count()); ?>

                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-users fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('keuangan.index')); ?>" class="card-link">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                <i class="fas fa-wallet"></i> Saldo Kas
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                <?php
                                $totalPemasukan = \App\Models\Keuangan::sum('pemasukan');
                                $totalPengeluaran = \App\Models\Keuangan::sum('pengeluaran');
                                $saldo = $totalPemasukan - $totalPengeluaran;
                                $saldoClass = $saldo >= 0 ? 'text-success' : 'text-danger';
                                ?>
                                <span class="<?php echo e($saldoClass); ?>">Rp <?php echo e(number_format($saldo, 0, ',', '.')); ?></span>
                            </div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-arrow-up text-success"></i> Masuk: Rp <?php echo e(number_format($totalPemasukan, 0, ',', '.')); ?> |
                                <i class="fas fa-arrow-down text-danger"></i> Keluar: Rp <?php echo e(number_format($totalPengeluaran, 0, ',', '.')); ?>

                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-chart-line fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('jadwal_sholat.index')); ?>" class="card-link">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                <i class="fas fa-clock"></i> Jadwal Sholat
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                <?php echo e(\App\Models\JadwalSholat::count()); ?> Jadwal
                            </div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-hourglass-half"></i> 
                                <?php
                                $nextPrayer = \App\Models\JadwalSholat::where('waktu', '>=', now()->format('H:i:s'))->first();
                                ?>
                                <?php if($nextPrayer): ?>
                                Selanjutnya: <?php echo e($nextPrayer->nama_sholat); ?> (<?php echo e(\Carbon\Carbon::parse($nextPrayer->waktu)->format('H:i')); ?>)
                                <?php else: ?>
                                Semua jadwal hari ini telah berlalu
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-mosque fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('sholat_jumat.index')); ?>" class="card-link">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                <i class="fas fa-praying-hands"></i> Sholat Jumat
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                <?php echo e(\App\Models\SholatJumat::where('tanggal', '>=', now())->count()); ?> Jadwal
                            </div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-calendar-week"></i> 
                                <?php
                                $nextFriday = \App\Models\SholatJumat::where('tanggal', '>=', now())->orderBy('tanggal')->first();
                                ?>
                                <?php if($nextFriday): ?>
                                Mendatang: <?php echo e(\Carbon\Carbon::parse($nextFriday->tanggal)->translatedFormat('d M Y')); ?>

                                <?php else: ?>
                                Belum ada jadwal
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-calendar-alt fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
</div>

<!-- Second Row -->
<div class="row">
    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('pengumuman.index')); ?>" class="card-link">
            <div class="card border-left-purple shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-purple text-uppercase mb-1">
                                <i class="fas fa-bullhorn"></i> Pengumuman
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                <?php echo e(\App\Models\Pengumuman::where('tanggal', '>=', now())->count()); ?> Aktif
                            </div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-total"></i> Total: <?php echo e(\App\Models\Pengumuman::count()); ?> Pengumuman
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-bullhorn fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('settings.edit')); ?>" class="card-link">
            <div class="card border-left-secondary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                <i class="fas fa-cogs"></i> Pengaturan
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">Aplikasi</div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-sliders-h"></i> Konfigurasi sistem
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-cog fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('auto_update.index')); ?>" class="card-link">
            <div class="card border-left-dark shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-dark text-uppercase mb-1">
                                <i class="fas fa-sync-alt"></i> Auto-Update
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                <?php if($setting->auto_update_jadwal ?? false): ?>
                                <span class="badge badge-success">AKTIF</span>
                                <?php else: ?>
                                <span class="badge badge-secondary">NONAKTIF</span>
                                <?php endif; ?>
                            </div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-city"></i> Lokasi: <?php echo e($setting->auto_update_city ?? 'Jakarta'); ?>

                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-cloud-sun fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <a href="<?php echo e(route('rotator')); ?>" target="_blank" class="card-link">
            <div class="card border-left-danger shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                <i class="fas fa-tv"></i> Tampilan TV
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">Display Mode</div>
                            <div class="mt-2 text-xs text-muted">
                                <i class="fas fa-exchange-alt"></i> Rotasi: <?php echo e($setting->rotation_interval ?? 10); ?> detik
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-desktop fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
</div>

<!-- Recent Activities & Charts -->
<div class="row">
    <!-- Recent Transactions -->
    <div class="col-lg-7 mb-4">
        <div class="card shadow">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="fas fa-history"></i> Transaksi Terbaru
                </h6>
                <a href="<?php echo e(route('keuangan.index')); ?>" class="btn btn-sm btn-primary">Lihat Semua</a>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Deskripsi</th>
                                <th>Pemasukan</th>
                                <th>Pengeluaran</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $recentTransactions = \App\Models\Keuangan::orderBy('tanggal', 'desc')->take(5)->get();
                            ?>
                            <?php $__empty_1 = true; $__currentLoopData = $recentTransactions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $transaction): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                            <tr>
                                <td><?php echo e(\Carbon\Carbon::parse($transaction->tanggal)->translatedFormat('d M Y')); ?></td>
                                <td><?php echo e(\Illuminate\Support\Str::limit($transaction->deskripsi, 40)); ?></td>
                                <td class="text-success">
                                    <?php if($transaction->pemasukan > 0): ?>
                                    Rp <?php echo e(number_format($transaction->pemasukan, 0, ',', '.')); ?>

                                    <?php else: ?>
                                    -
                                    <?php endif; ?>
                                </td>
                                <td class="text-danger">
                                    <?php if($transaction->pengeluaran > 0): ?>
                                    Rp <?php echo e(number_format($transaction->pengeluaran, 0, ',', '.')); ?>

                                    <?php else: ?>
                                    -
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <tr>
                                <td colspan="4" class="text-center">Belum ada transaksi</td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Upcoming Announcements -->
    <div class="col-lg-5 mb-4">
        <div class="card shadow">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="fas fa-calendar-alt"></i> Pengumuman Mendatang
                </h6>
                <a href="<?php echo e(route('pengumuman.create')); ?>" class="btn btn-sm btn-success">
                    <i class="fas fa-plus"></i> Tambah
                </a>
            </div>
            <div class="card-body">
                <?php
                $upcomingAnnouncements = \App\Models\Pengumuman::where('tanggal', '>=', now())->orderBy('tanggal')->take(5)->get();
                ?>
                <?php $__empty_1 = true; $__currentLoopData = $upcomingAnnouncements; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $announcement): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                <div class="activity-feed mb-3">
                    <div class="feed-item">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <i class="fas fa-bullhorn text-warning mr-2"></i>
                                <strong><?php echo e(\Carbon\Carbon::parse($announcement->tanggal)->translatedFormat('d M Y')); ?></strong>
                            </div>
                            <small class="text-muted"><?php echo e(\Carbon\Carbon::parse($announcement->tanggal)->diffForHumans()); ?></small>
                        </div>
                        <p class="mb-0 mt-1"><?php echo e(\Illuminate\Support\Str::limit($announcement->isi, 60)); ?></p>
                    </div>
                </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                <div class="text-center py-4">
                    <i class="fas fa-inbox fa-3x text-gray-300 mb-2"></i>
                    <p class="text-muted">Tidak ada pengumuman mendatang</p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php elseif(auth()->user()->role && auth()->user()->role->name === 'petugas'): ?>
<!-- Petugas Dashboard -->
<div class="row">
    <div class="col-xl-4 col-md-6 mb-4">
        <a href="<?php echo e(route('profile')); ?>" class="card-link">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                <i class="fas fa-user"></i> Profil Saya
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800"><?php echo e(auth()->user()->name); ?></div>
                            <div class="mt-2 text-xs text-muted"><?php echo e(auth()->user()->email); ?></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-user-circle fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-4 col-md-6 mb-4">
        <a href="<?php echo e(route('jadwal_sholat.index')); ?>" class="card-link">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                <i class="fas fa-clock"></i> Jadwal Sholat
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                <?php echo e(\App\Models\JadwalSholat::count()); ?> Jadwal
                            </div>
                            <div class="mt-2 text-xs text-muted">Lihat jadwal harian</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-mosque fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>

    <div class="col-xl-4 col-md-6 mb-4">
        <a href="<?php echo e(route('sholat_jumat.index')); ?>" class="card-link">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                <i class="fas fa-praying-hands"></i> Jadwal Jumat
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                <?php echo e(\App\Models\SholatJumat::where('tanggal', '>=', now())->count()); ?> Mendatang
                            </div>
                            <div class="mt-2 text-xs text-muted">Lihat jadwal Anda</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-calendar-alt fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
</div>

<!-- Jadwal Sholat Hari Ini -->
<div class="row">
    <div class="col-lg-12 mb-4">
        <div class="card shadow">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">
                    <i class="fas fa-clock"></i> Jadwal Sholat Hari Ini
                </h6>
                <div class="text-muted small"><?php echo e(\Carbon\Carbon::now('Asia/Jakarta')->translatedFormat('l, d F Y')); ?></div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Sholat</th>
                                <th>Waktu</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $now = \Carbon\Carbon::now('Asia/Jakarta');
                            $schedules = \App\Models\JadwalSholat::all();
                            ?>
                            <?php $__currentLoopData = $schedules; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $schedule): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php
                            $waktuSholat = \Carbon\Carbon::parse($schedule->waktu);
                            $isPassed = $waktuSholat->lt($now);
                            $isNow = $waktuSholat->diffInMinutes($now) <= 30 && !$isPassed;
                            ?>
                            <tr>
                                <td><strong><?php echo e($schedule->nama_sholat); ?></strong></td>
                                <td><?php echo e($schedule->waktu); ?> WIB</td>
                                <td>
                                    <?php if($isNow): ?>
                                    <span class="badge badge-success">
                                        <i class="fas fa-bell"></i> Waktunya sholat!
                                    </span>
                                    <?php elseif($isPassed): ?>
                                    <span class="badge badge-secondary">
                                        <i class="fas fa-check-circle"></i> Telah berlalu
                                    </span>
                                    <?php else: ?>
                                    <span class="badge badge-info">
                                        <i class="fas fa-hourglass-half"></i> Dalam <?php echo e($waktuSholat->diffForHumans()); ?>

                                    </span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>


<!-- Custom CSS -->
<style>
    .card-link {
        text-decoration: none;
        transition: transform 0.3s ease;
        display: block;
    }
    
    .card-link:hover {
        transform: translateY(-5px);
    }
    
    .card {
        border-radius: 12px;
        transition: all 0.3s ease;
        overflow: hidden;
    }
    
    .card:hover {
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .border-left-primary { border-left: 4px solid #4e73df; }
    .border-left-success { border-left: 4px solid #1cc88a; }
    .border-left-info { border-left: 4px solid #36b9cc; }
    .border-left-warning { border-left: 4px solid #f6c23e; }
    .border-left-purple { border-left: 4px solid #6f42c1; }
    .border-left-secondary { border-left: 4px solid #858796; }
    .border-left-dark { border-left: 4px solid #5a5c69; }
    .border-left-danger { border-left: 4px solid #e74a3b; }
    
    .bg-gradient-primary {
        background: linear-gradient(135deg, #0a4d68 0%, #088395 100%);
    }
    
    .activity-feed .feed-item {
        padding: 12px;
        border-left: 3px solid #f6c23e;
        background-color: #f8f9fc;
        margin-bottom: 8px;
        border-radius: 0 8px 8px 0;
        transition: all 0.2s ease;
    }
    
    .activity-feed .feed-item:hover {
        background-color: #fff3cd;
    }
    
    .table-hover tbody tr:hover {
        background-color: rgba(78, 115, 223, 0.05);
    }
    
    .opacity-75 {
        opacity: 0.75;
    }
    
    .text-purple {
        color: #6f42c1 !important;
    }
</style>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\home.blade.php ENDPATH**/ ?>