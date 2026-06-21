<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AppSettingController;
use App\Http\Controllers\JadwalSholatController;
use App\Http\Controllers\SholatJumatController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\KeuanganController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\AutoUpdateController;
use App\Http\Controllers\RotationController;
use App\Http\Controllers\QrisController;
use App\Http\Controllers\SholatIdulFitriController;
use App\Http\Controllers\SholatIdulAdhaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// ============================================
// HALAMAN PUBLIK (TIDAK PERLU LOGIN)
// ============================================

// Halaman rotator utama
Route::get('/', [WelcomeController::class, 'rotator'])->name('rotator');

// Halaman embed untuk rotasi - PASTIKAN ROUTE INI TERSEDIA
Route::get('/welcome-embed', [WelcomeController::class, 'welcomeEmbed'])->name('welcome.embed');
Route::get('/utama-embed', [WelcomeController::class, 'utamaEmbed'])->name('utama.embed');
Route::get('/keuangan-embed', [WelcomeController::class, 'keuanganEmbed'])->name('keuangan.embed');
Route::get('/jumat-embed', [WelcomeController::class, 'jumatEmbed'])->name('jumat.embed');
Route::get('/pengumuman-embed', [WelcomeController::class, 'pengumumanEmbed'])->name('pengumuman.embed');
Route::get('/keuangan-summary-embed', [WelcomeController::class, 'keuanganSummaryEmbed'])->name('keuangan-summary.embed');
Route::get('/qris-embed', [QrisController::class, 'embed'])->name('qris.embed');
Route::get('/idul-fitri-embed', [SholatIdulFitriController::class, 'embed'])->name('idul-fitri.embed');
Route::get('/idul-adha-embed', [SholatIdulAdhaController::class, 'embed'])->name('idul-adha.embed');

// Route untuk cek timestamp data (public)
Route::get('/data-timestamp', [WelcomeController::class, 'getDataTimestamp'])->name('data.timestamp');

// Route untuk mendapatkan pengaturan rotasi (public) - untuk AJAX
Route::get('/rotation-settings', [WelcomeController::class, 'getRotationSettings'])->name('rotation.settings');

// Route alternatif
Route::get('/infokeuangan', function () {
    $settings = \App\Models\AppSetting::first();
    $keuangan = \App\Models\Keuangan::orderBy('tanggal', 'desc')->get();
    $totalPemasukan = \App\Models\Keuangan::sum('pemasukan');
    $totalPengeluaran = \App\Models\Keuangan::sum('pengeluaran');
    $saldo = $totalPemasukan - $totalPengeluaran;
    return view('keuangan', compact('settings', 'keuangan', 'totalPemasukan', 'totalPengeluaran', 'saldo'));
})->name('keuangan');

// ============================================
// AUTHENTICATION ROUTES
// ============================================
Auth::routes();

// ============================================
// ROUTES YANG MEMERLUKAN LOGIN
// ============================================
Route::middleware(['auth'])->group(function () {

    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::get('/about', [AppSettingController::class, 'show'])->name('about');
    
    Route::prefix('settings')->group(function () {
        Route::get('/', [AppSettingController::class, 'edit'])->name('settings.edit');
        Route::put('/', [AppSettingController::class, 'update'])->name('settings.update');
    });
    
    Route::resource('jadwal_sholat', JadwalSholatController::class);
    Route::resource('sholat_jumat', SholatJumatController::class);
    Route::resource('idul-fitri', SholatIdulFitriController::class);
    Route::resource('idul-adha', SholatIdulAdhaController::class);
    Route::resource('pengumuman', PengumumanController::class);
    Route::resource('keuangan', KeuanganController::class);
    
    // ============================================
    // ROUTES QRIS (MEMERLUKAN LOGIN)
    // ============================================
    Route::prefix('qris')->name('qris.')->group(function () {
        Route::get('/', [QrisController::class, 'index'])->name('index');
        Route::get('/create', [QrisController::class, 'create'])->name('create');
        Route::post('/', [QrisController::class, 'store'])->name('store');
        Route::get('/{qris}', [QrisController::class, 'show'])->name('show');
        Route::get('/{qris}/edit', [QrisController::class, 'edit'])->name('edit');
        Route::put('/{qris}', [QrisController::class, 'update'])->name('update');
        Route::delete('/{qris}', [QrisController::class, 'destroy'])->name('destroy');
        Route::put('/{qris}/set-aktif', [QrisController::class, 'setAktif'])->name('set-aktif');
    });
    
    // Auto-Update Routes
    Route::prefix('auto-update')->name('auto_update.')->group(function () {
        Route::get('/', [AutoUpdateController::class, 'index'])->name('index');
        Route::post('/settings', [AutoUpdateController::class, 'updateSettings'])->name('settings');
        Route::get('/manual', [AutoUpdateController::class, 'manualUpdate'])->name('manual');
        Route::get('/log', [AutoUpdateController::class, 'getUpdateLog'])->name('log');
        Route::get('/methods', [AutoUpdateController::class, 'getAvailableMethods'])->name('methods');
    });
    
    // Rotasi Halaman Routes
    Route::prefix('rotation')->name('rotation.')->group(function () {
        Route::get('/', [RotationController::class, 'index'])->name('index');
        Route::put('/update', [RotationController::class, 'update'])->name('update');
        Route::get('/preview', [RotationController::class, 'preview'])->name('preview');
        Route::get('/status', [RotationController::class, 'status'])->name('status');
    });
    
    // Export routes
    Route::prefix('export')->name('export.')->group(function () {
        Route::get('/jadwal-sholat', [JadwalSholatController::class, 'export'])->name('jadwal-sholat');
        Route::get('/keuangan', [KeuanganController::class, 'export'])->name('keuangan');
        Route::get('/pengumuman', [PengumumanController::class, 'export'])->name('pengumuman');
    });
    
    Route::prefix('laporan')->name('laporan.')->group(function () {
        Route::get('/keuangan', [KeuanganController::class, 'laporan'])->name('keuangan');
        Route::get('/keuangan/pdf', [KeuanganController::class, 'pdf'])->name('keuangan.pdf');
    });
});

Route::fallback(function () {
    return redirect()->route('rotator');
});