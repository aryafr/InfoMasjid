<?php
// app/Http/Controllers/AppSettingController.php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AppSettingController extends Controller
{
    public function show()
    {
        $setting = AppSetting::first();

        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'Masjid Al-Ikhlas',
                'footer' => 'Hak Cipta © <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . now()->year,
                'running_text' => 'Selamat datang di Masjid Al-Ikhlas',
                'auto_update_jadwal' => false,
                'auto_update_frequency' => 'daily',
                'auto_update_time' => '00:00:00',
                'auto_update_city' => 'Jakarta',
                'auto_update_country' => 'Indonesia',
                'auto_update_method' => 11,
                'rotation_interval' => 10,
                'rotation_enabled' => true,
                'rotation_pages' => [
                    ['url' => 'welcome.embed', 'name' => 'Dashboard Lengkap', 'active' => true],
                    ['url' => 'utama.embed', 'name' => 'Jadwal Sholat', 'active' => true],
                    ['url' => 'keuangan.embed', 'name' => 'Rincian Keuangan', 'active' => true]
                ]
            ]);
        }

        return view('about', compact('setting'));
    }

    public function edit()
    {
        $setting = AppSetting::first();

        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'MASJID AL-IKHLAS',
                'footer' => '<a href="https://wa.me/628179851011" target="_blank" style="font-size: 12px; text-decoration: none; color: gray;">Copyright 2025 Ali Mochtar Development System</a>',
                'running_text' => '🌙 "Hati yang tenang ada pada mereka yang selalu mengingat Allah. Mari perbanyak zikir dan shalat berjamaah." 📖 "Ingatlah, hanya dengan mengingat Allah hati menjadi tenang." — (QS. Ar-Ra’d: 28)',
                'auto_update_jadwal' => true,
                'auto_update_frequency' => 'daily',
                'auto_update_time' => '00:00:00',
                'auto_update_city' => 'Jakarta',
                'auto_update_country' => 'Indonesia',
                'auto_update_method' => 11,
                'rotation_interval' => 10,
                'rotation_enabled' => true,
                'rotation_pages' => [
                    ['url' => 'welcome.embed', 'name' => 'Dashboard Lengkap', 'active' => true],
                    ['url' => 'utama.embed', 'name' => 'Jadwal Sholat', 'active' => true],
                    ['url' => 'keuangan.embed', 'name' => 'Rincian Keuangan', 'active' => true]
                ]
            ]);
        }

        return view('settings.edit', compact('setting'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'nama_aplikasi' => 'required|string|max:255',
            'favicon' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
            'background' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'footer' => 'nullable|string',
            'running_text' => 'nullable|string',
            'auto_update_jadwal' => 'sometimes|boolean',
            'auto_update_frequency' => 'required_if:auto_update_jadwal,1|in:daily,weekly,monthly',
            'auto_update_time' => 'required_if:auto_update_jadwal,1|date_format:H:i',
            'auto_update_city' => 'required_if:auto_update_jadwal,1|string|max:255',
            'auto_update_country' => 'required_if:auto_update_jadwal,1|string|max:255',
            'auto_update_method' => 'required_if:auto_update_jadwal,1|integer|between:1,21',
            'rotation_interval' => 'nullable|integer|min:1|max:3600',
            'rotation_enabled' => 'sometimes|boolean',
            'rotation_pages' => 'nullable|array'
        ]);

        $setting = AppSetting::first();

        if (!$setting) {
            $setting = new AppSetting();
        }

        // Data umum
        $setting->nama_aplikasi = $request->nama_aplikasi;
        $setting->footer = $request->footer;
        $setting->running_text = $request->running_text;
        
        // Data auto-update
        $setting->auto_update_jadwal = $request->boolean('auto_update_jadwal', false);
        $setting->auto_update_frequency = $request->auto_update_frequency ?? 'daily';
        $setting->auto_update_city = $request->auto_update_city ?? 'Jakarta';
        $setting->auto_update_country = $request->auto_update_country ?? 'Indonesia';
        $setting->auto_update_method = $request->auto_update_method ?? 11;
        
        if ($request->has('auto_update_time')) {
            $setting->auto_update_time = $request->auto_update_time . ':00';
        }
        
        // Data rotasi halaman
        $setting->rotation_interval = $request->rotation_interval ?? 10;
        $setting->rotation_enabled = $request->boolean('rotation_enabled', true);
        
        if ($request->has('rotation_pages')) {
            $setting->rotation_pages = $request->rotation_pages;
        }

        // Handle file uploads
        $this->handleFileUpload($request, 'favicon', $setting);
        $this->handleFileUpload($request, 'background', $setting);
        $this->handleFileUpload($request, 'logo', $setting);

        $setting->save();

        return redirect()->route('settings.edit')
        ->with('success', 'Pengaturan aplikasi berhasil diperbarui!');
    }

    protected function handleFileUpload($request, $fieldName, $setting)
    {
        if ($request->hasFile($fieldName)) {
            // Hapus file lama jika ada
            if ($setting->$fieldName && Storage::exists('public/' . $setting->$fieldName)) {
                Storage::delete('public/' . $setting->$fieldName);
            }

            // Simpan file baru
            $path = $request->file($fieldName)->store('settings', 'public');
            $setting->$fieldName = $path;
        }
    }
}