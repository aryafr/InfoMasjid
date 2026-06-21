<?php
// app/Http/Controllers/WelcomeController.php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\JadwalSholat;
use App\Models\SholatJumat;
use App\Models\Pengumuman;
use App\Models\Keuangan;
use App\Models\Qris; // Tambahkan ini
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class WelcomeController extends Controller
{
    // Halaman rotator utama
	public function rotator()
	{
		$settings = AppSetting::first();
		
		if (!$settings) {
			$settings = AppSetting::create([
				'nama_aplikasi' => 'MASJID AL-IKHLAS',
				'footer' => '<a href="https://wa.me/628179851011" target="_blank" style="font-size: 12px; text-decoration: none; color: gray;">Copyright 2025 Ali Mochtar Development System</a>',
				'running_text' => '🌙 "Hati yang tenang ada pada mereka yang selalu mengingat Allah. Mari perbanyak zikir dan shalat berjamaah."',
				'auto_update_jadwal' => true,
				'auto_update_city' => 'Jakarta',
				'auto_update_country' => 'Indonesia',
				'rotation_interval' => 10,
				'rotation_enabled' => true,
				'rotation_pages' => json_encode([
					['url' => 'welcome-embed', 'name' => 'Dashboard Lengkap', 'active' => true],
					['url' => 'utama-embed', 'name' => 'Jadwal Sholat', 'active' => true],
					['url' => 'keuangan-embed', 'name' => 'Rincian Keuangan', 'active' => true],
					['url' => 'jumat-embed', 'name' => 'Jadwal Sholat Jumat', 'active' => true],
					['url' => 'pengumuman-embed', 'name' => 'Pengumuman', 'active' => true],
					['url' => 'keuangan-summary-embed', 'name' => 'Ringkasan Keuangan', 'active' => true],
                    ['url' => 'qris-embed', 'name' => 'QRIS Donasi', 'active' => true] // Tambahkan QRIS
                ])
			]);
		}
		
		return view('rotator', [
			'rotationInterval' => $settings->getRotationInterval(),
			'rotationEnabled' => $settings->isRotationEnabled(),
			'rotationPages' => $settings->getRotationPagesList()
		]);
	}
	
    // Halaman welcome (dashboard lengkap) untuk embed
	public function welcomeEmbed()
	{
		$settings = AppSetting::first();
		
		if (!$settings) {
			$settings = AppSetting::create([
				'nama_aplikasi' => 'MASJID AL-IKHLAS',
				'footer' => '<a href="https://wa.me/628179851011" target="_blank" style="font-size: 12px; text-decoration: none; color: gray;">Copyright 2025 Ali Mochtar Development System</a>',
				'running_text' => '🌙 "Hati yang tenang ada pada mereka yang selalu mengingat Allah. Mari perbanyak zikir dan shalat berjamaah."',
				'auto_update_jadwal' => true,
				'auto_update_city' => 'Jakarta',
				'auto_update_country' => 'Indonesia',
			]);
		}
		
		$jadwalSholat = JadwalSholat::all();
		
		$today = Carbon::today('Asia/Jakarta');
		$sholatJumat = SholatJumat::where('tanggal', '>=', $today)
		->orderBy('tanggal', 'asc')
		->first();
		
		$pengumuman = Pengumuman::where('tanggal', '>=', $today)
		->orderBy('tanggal', 'asc')
		->take(3)
		->get();
		
		$keuanganSummary = [
			'total_pemasukan' => Keuangan::sum('pemasukan'),
			'total_pengeluaran' => Keuangan::sum('pengeluaran'),
			'saldo' => Keuangan::sum('pemasukan') - Keuangan::sum('pengeluaran'),
		];
		
        // Ambil data QRIS aktif
		$qris = Qris::aktif()->first();
		
		return view('welcome', compact('settings', 'jadwalSholat', 'sholatJumat', 'pengumuman', 'keuanganSummary', 'qris'));
	}

	public function utamaEmbed()
	{
		$settings = AppSetting::first();
		$jadwalSholat = JadwalSholat::all();
		
		return view('utama', compact('settings', 'jadwalSholat'));
	}

	public function keuanganEmbed()
	{
		$settings = AppSetting::first();
		$keuangan = Keuangan::orderBy('tanggal', 'desc')->get();
		$totalPemasukan = Keuangan::sum('pemasukan');
		$totalPengeluaran = Keuangan::sum('pengeluaran');
		$saldo = $totalPemasukan - $totalPengeluaran;
		
		return view('keuangan', compact('settings', 'keuangan', 'totalPemasukan', 'totalPengeluaran', 'saldo'));
	}
	
    // Halaman baru: Jadwal Sholat Jumat
	public function jumatEmbed()
	{
		$settings = AppSetting::first();
		$jadwalSholat = JadwalSholat::all();
		$today = Carbon::today('Asia/Jakarta');
		$sholatJumat = SholatJumat::where('tanggal', '>=', $today)
		->orderBy('tanggal', 'asc')
		->first();
		
		return view('jumat', compact('settings', 'jadwalSholat', 'sholatJumat'));
	}
	
    // Halaman baru: Pengumuman
	public function pengumumanEmbed()
	{
		$settings = AppSetting::first();
		$today = Carbon::today('Asia/Jakarta');
		$pengumuman = Pengumuman::where('tanggal', '>=', $today)
		->orderBy('tanggal', 'asc')
		->get();
		
		return view('pengumuman', compact('settings', 'pengumuman'));
	}
	
    // Halaman baru: Ringkasan Keuangan
	public function keuanganSummaryEmbed()
	{
		$settings = AppSetting::first();
		$totalPemasukan = Keuangan::sum('pemasukan');
		$totalPengeluaran = Keuangan::sum('pengeluaran');
		$saldo = $totalPemasukan - $totalPengeluaran;
		$recentTransactions = Keuangan::orderBy('tanggal', 'desc')->take(10)->get();
		
		return view('keuangan-summary', compact('settings', 'totalPemasukan', 'totalPengeluaran', 'saldo', 'recentTransactions'));
	}
	
    // API untuk mendapatkan pengaturan rotasi
	public function getRotationSettings()
	{
		$settings = AppSetting::first();
		
		return response()->json([
			'interval' => $settings ? $settings->getRotationInterval() : 10,
			'enabled' => $settings ? $settings->isRotationEnabled() : true,
			'pages' => $settings ? $settings->getRotationPagesList() : []
		]);
	}

	public function getDataTimestamp()
	{
		$timestamp = Cache::remember('data_timestamp', 60, function () {
			$latestTimestamps = [
				'app_settings' => AppSetting::max('updated_at'),
				'jadwal_sholat' => JadwalSholat::max('updated_at'),
				'sholat_jumat' => SholatJumat::max('updated_at'),
				'pengumuman' => Pengumuman::max('updated_at'),
				'keuangan' => Keuangan::max('updated_at'),
			];

			$latestTimestamp = collect($latestTimestamps)->filter()->max();

			$updatedData = [];
			foreach ($latestTimestamps as $key => $timestamp) {
				if ($timestamp && $timestamp == $latestTimestamp) {
					$updatedData[] = $key;
				}
			}

			return [
				'timestamp' => $latestTimestamp ? Carbon::parse($latestTimestamp)->toIso8601String() : null,
				'updated_data' => $updatedData,
			];
		});

		return response()->json(array_merge($timestamp, [
			'check_time' => now()->toIso8601String(),
			'auto_update_status' => AppSetting::first()->auto_update_jadwal ?? false,
			'auto_update_location' => AppSetting::first()->auto_update_city ?? 'Jakarta',
		]));
	}
}