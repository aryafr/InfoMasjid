<?php
// app/Http/Controllers/RotationController.php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RotationController extends Controller
{
    public function index()
    {
        $setting = AppSetting::first();
        
        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'MASJID AL-IKHLAS',
                'footer' => 'Copyright 2025',
                'running_text' => 'Selamat datang',
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
                    ['url' => 'qris-embed', 'name' => 'QRIS Donasi', 'active' => true],
                    ['url' => 'idul-fitri-embed', 'name' => 'Idul Fitri', 'active' => true],
                    ['url' => 'idul-adha-embed', 'name' => 'Idul Adha', 'active' => true]
                ])
            ]);
        }
        
        return view('rotation.index', [
            'setting' => $setting,
            'pages' => $setting->getRotationPages()
        ]);
    }
    
    public function update(Request $request)
    {
        $activePages = $request->input('active_pages', []);
        
        $pages = [
            ['url' => 'welcome-embed', 'name' => 'Dashboard Lengkap', 'active' => in_array('welcome-embed', $activePages)],
            ['url' => 'utama-embed', 'name' => 'Jadwal Sholat', 'active' => in_array('utama-embed', $activePages)],
            ['url' => 'keuangan-embed', 'name' => 'Rincian Keuangan', 'active' => in_array('keuangan-embed', $activePages)],
            ['url' => 'jumat-embed', 'name' => 'Jadwal Sholat Jumat', 'active' => in_array('jumat-embed', $activePages)],
            ['url' => 'pengumuman-embed', 'name' => 'Pengumuman', 'active' => in_array('pengumuman-embed', $activePages)],
            ['url' => 'keuangan-summary-embed', 'name' => 'Ringkasan Keuangan', 'active' => in_array('keuangan-summary-embed', $activePages)],
            ['url' => 'qris-embed', 'name' => 'QRIS Donasi', 'active' => in_array('qris-embed', $activePages)],
            ['url' => 'idul-fitri-embed', 'name' => 'Idul Fitri', 'active' => in_array('idul-fitri-embed', $activePages)],
            ['url' => 'idul-adha-embed', 'name' => 'Idul Adha', 'active' => in_array('idul-adha-embed', $activePages)]
        ];
        
        DB::table('app_settings')->update([
            'rotation_enabled' => $request->has('rotation_enabled') ? 1 : 0,
            'rotation_interval' => $request->input('rotation_interval', 10),
            'rotation_pages' => json_encode($pages),
            'updated_at' => now()
        ]);
        
        return redirect()->route('rotation.index')
        ->with('success', 'Pengaturan rotasi halaman berhasil diperbarui!');
    }
}