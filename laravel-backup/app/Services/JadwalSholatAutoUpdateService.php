<?php
// app/Services/JadwalSholatAutoUpdateService.php

namespace App\Services;

use App\Models\JadwalSholat;
use App\Models\AppSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class JadwalSholatAutoUpdateService
{
    protected $apiUrl = 'https://api.aladhan.com/v1/timingsByCity';
    protected $city = 'Jakarta';
    protected $country = 'Indonesia';
    protected $method = 11;

    /**
     * Update jadwal sholat otomatis dari API menggunakan data dari database
     */
    public function updateFromAPI()
    {
        try {
            // Ambil setting dari database
            $setting = AppSetting::first();
            
            // Jika auto-update tidak diaktifkan, return false
            if (!$setting || !$setting->auto_update_jadwal) {
                Log::info('Auto-update dinonaktifkan atau setting tidak ditemukan');
                return false;
            }

            // Gunakan data dari database, bukan dari property class
            $city = $setting->auto_update_city ?? 'Jakarta';
            $country = $setting->auto_update_country ?? 'Indonesia';
            $method = $setting->auto_update_method ?? 11;

            Log::info('Mencoba update dari API untuk:', [
                'city' => $city,
                'country' => $country,
                'method' => $method
            ]);

            // Ambil data dari API
            $response = Http::get($this->apiUrl, [
                'city' => $city,
                'country' => $country,
                'method' => $method,
            ]);

            if (!$response->successful()) {
                Log::error('Gagal mengambil data jadwal sholat dari API. Status: ' . $response->status());
                return false;
            }

            $data = $response->json();
            
            if (!isset($data['data']['timings'])) {
                Log::error('Response API tidak valid', ['response' => $data]);
                return false;
            }
            
            $timings = $data['data']['timings'];

            // Mapping nama sholat
            $sholatMapping = [
                'Fajr' => 'Subuh',
                'Dhuhr' => 'Dzuhur',
                'Asr' => 'Ashar',
                'Maghrib' => 'Maghrib',
                'Isha' => 'Isya',
            ];

            $updated = false;
            $updatedData = [];

            foreach ($sholatMapping as $apiName => $localName) {
                if (isset($timings[$apiName])) {
                    $waktu = Carbon::parse($timings[$apiName])->format('H:i:s');
                    
                    $jadwal = JadwalSholat::where('nama_sholat', $localName)->first();
                    
                    if ($jadwal) {
                        // Update jika berbeda
                        if ($jadwal->waktu != $waktu) {
                            $jadwal->update(['waktu' => $waktu]);
                            $updated = true;
                            $updatedData[] = $localName . ' (' . $jadwal->waktu . ' -> ' . $waktu . ')';
                        }
                    } else {
                        // Buat baru jika belum ada
                        JadwalSholat::create([
                            'nama_sholat' => $localName,
                            'waktu' => $waktu,
                        ]);
                        $updated = true;
                        $updatedData[] = $localName . ' (baru: ' . $waktu . ')';
                    }
                }
            }

            if ($updated) {
                // Update last_auto_update di settings
                $setting->last_auto_update = now();
                $setting->save();
                
                Log::info('Jadwal sholat berhasil diupdate otomatis', [
                    'city' => $city,
                    'country' => $country,
                    'updates' => $updatedData
                ]);
            } else {
                Log::info('Tidak ada perubahan jadwal sholat untuk ' . $city . ', ' . $country);
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error auto-update jadwal sholat: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return false;
        }
    }

    

    public function forceUpdate($city = null, $country = null, $method = null)
    {
        try {
            $setting = AppSetting::first();

        // Gunakan parameter atau dari database
            $city = $city ?? ($setting->auto_update_city ?? 'Jakarta');
            $country = $country ?? ($setting->auto_update_country ?? 'Indonesia');
            $method = $method ?? ($setting->auto_update_method ?? 11);

            Log::info('Force update untuk:', [
                'city' => $city,
                'country' => $country,
                'method' => $method
            ]);

        // Ambil data dari API
            $response = Http::get($this->apiUrl, [
                'city' => $city,
                'country' => $country,
                'method' => $method,
            ]);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'message' => 'Gagal mengambil data dari API. Status: ' . $response->status()
                ];
            }

            $data = $response->json();

            if (!isset($data['data']['timings'])) {
                return [
                    'success' => false,
                    'message' => 'Response API tidak valid'
                ];
            }

            $timings = $data['data']['timings'];

            $sholatMapping = [
                'Fajr' => 'Subuh',
                'Dhuhr' => 'Dzuhur',
                'Asr' => 'Ashar',
                'Maghrib' => 'Maghrib',
                'Isha' => 'Isya',
            ];

            $updated = false;
            $results = [];

            foreach ($sholatMapping as $apiName => $localName) {
                if (isset($timings[$apiName])) {
                    $waktu = Carbon::parse($timings[$apiName])->format('H:i:s');

                    $jadwal = JadwalSholat::where('nama_sholat', $localName)->first();

                    if ($jadwal) {
                        $oldTime = $jadwal->waktu;
                        if ($jadwal->waktu != $waktu) {
                            $jadwal->update(['waktu' => $waktu]);
                            $updated = true;
                            $results[] = "$localName: $oldTime -> $waktu";
                        } else {
                            $results[] = "$localName: $waktu (tidak berubah)";
                        }
                    } else {
                        JadwalSholat::create([
                            'nama_sholat' => $localName,
                            'waktu' => $waktu,
                        ]);
                        $updated = true;
                        $results[] = "$localName: $waktu (baru)";
                    }
                }
            }

        // UPDATE LAST_AUTO_UPDATE - Pastikan ini dijalankan
            if ($setting) {
                $setting->last_auto_update = now();
                $setting->save();

                Log::info('last_auto_update diupdate menjadi: ' . now()->format('Y-m-d H:i:s'));
            }

            return [
                'success' => true,
                'message' => 'Update berhasil untuk ' . $city . ', ' . $country,
                'city' => $city,
                'country' => $country,
                'results' => $results,
                'updated' => $updated,
                'last_update' => now()->format('Y-m-d H:i:s')
            ];

        } catch (\Exception $e) {
            Log::error('Error force update: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Update jadwal sholat berdasarkan perhitungan manual
     */
    public function calculateManual($latitude, $longitude, $timezone = 'Asia/Jakarta')
    {
        try {
            $today = Carbon::now($timezone);
            $date = $today->format('d-m-Y');
            
            $response = Http::get('https://api.aladhan.com/v1/timings/' . $date, [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'method' => $this->method,
            ]);

            if (!$response->successful()) {
                return false;
            }

            $data = $response->json();
            $timings = $data['data']['timings'];

            $sholatMapping = [
                'Fajr' => 'Subuh',
                'Dhuhr' => 'Dzuhur',
                'Asr' => 'Ashar',
                'Maghrib' => 'Maghrib',
                'Isha' => 'Isya',
            ];

            $updated = false;
            foreach ($sholatMapping as $apiName => $localName) {
                if (isset($timings[$apiName])) {
                    $waktu = Carbon::parse($timings[$apiName])->format('H:i:s');
                    
                    $jadwal = JadwalSholat::updateOrCreate(
                        ['nama_sholat' => $localName],
                        ['waktu' => $waktu]
                    );
                    
                    if ($jadwal->wasRecentlyCreated || $jadwal->wasChanged()) {
                        $updated = true;
                    }
                }
            }

            return $updated;
        } catch (\Exception $e) {
            Log::error('Error calculate manual jadwal sholat: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Set lokasi untuk auto-update
     */
    public function setLocation($city, $country = 'Indonesia')
    {
        $this->city = $city;
        $this->country = $country;
        
        // Simpan ke settings
        $setting = AppSetting::first();
        if ($setting) {
            $setting->update([
                'auto_update_city' => $city,
                'auto_update_country' => $country,
            ]);
            Log::info('Location updated in database', ['city' => $city, 'country' => $country]);
        }
    }

    /**
     * Set metode perhitungan
     */
    public function setMethod($method)
    {
        $this->method = $method;
        
        $setting = AppSetting::first();
        if ($setting) {
            $setting->update(['auto_update_method' => $method]);
        }
    }

    /**
     * Get current location from database
     */
    public function getCurrentLocation()
    {
        $setting = AppSetting::first();
        return [
            'city' => $setting->auto_update_city ?? 'Jakarta',
            'country' => $setting->auto_update_country ?? 'Indonesia',
            'method' => $setting->auto_update_method ?? 11
        ];
    }
}