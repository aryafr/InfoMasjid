<?php
// app/Console/Kernel.php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\AppSetting;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\UpdateJadwalSholat::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // Schedule untuk update otomatis - cek setiap menit
        $schedule->call(function () {
            $this->checkAndRunUpdate();
        })->everyMinute();
    }

    /**
     * Cek dan jalankan update jika waktunya tepat
     */
    private function checkAndRunUpdate()
    {
        try {
            $setting = AppSetting::first();
            
            if (!$setting || !$setting->auto_update_jadwal) {
                return; // Auto-update tidak aktif
            }

            $now = now();
            $currentTime = $now->format('H:i'); // Format: 00:00
            $scheduledTime = substr($setting->auto_update_time ?? '00:00:00', 0, 5); // Ambil HH:MM dari database
            
            // Log untuk debugging
            Log::info('Cek jadwal update', [
                'waktu_sekarang' => $currentTime,
                'waktu_dijadwalkan' => $scheduledTime,
                'last_update' => $setting->last_auto_update ? $setting->last_auto_update->format('Y-m-d H:i:s') : 'never'
            ]);

            // Cek apakah sekarang waktunya update (perbandingan string)
            if ($currentTime !== $scheduledTime) {
                return; // Bukan waktunya update
            }

            // Cek kapan terakhir update
            $lastUpdate = $setting->last_auto_update;
            
            // Jika belum pernah update, langsung jalankan
            if (!$lastUpdate) {
                Log::info('Menjalankan update pertama kali pada jam ' . $currentTime);
                $this->executeUpdate($setting);
                return;
            }

            // Hitung selisih waktu
            $hoursSinceLastUpdate = $now->diffInHours($lastUpdate);
            $daysSinceLastUpdate = $now->diffInDays($lastUpdate);

            // Cek frekuensi update
            $shouldUpdate = false;
            $reason = '';

            switch ($setting->auto_update_frequency) {
                case 'daily':
                    // Update harian: minimal 23 jam sejak update terakhir
                $shouldUpdate = $hoursSinceLastUpdate >= 23;
                $reason = "daily (23 jam)";
                break;
                
                case 'weekly':
                    // Update mingguan: minimal 6 hari sejak update terakhir
                $shouldUpdate = $daysSinceLastUpdate >= 6;
                $reason = "weekly (6 hari)";
                break;
                
                case 'monthly':
                    // Update bulanan: minimal 27 hari sejak update terakhir
                $shouldUpdate = $daysSinceLastUpdate >= 27;
                $reason = "monthly (27 hari)";
                break;
                
                default:
                $shouldUpdate = true;
                $reason = "default";
            }

            Log::info('Evaluasi frekuensi update', [
                'frekuensi' => $setting->auto_update_frequency,
                'jam_terakhir' => $hoursSinceLastUpdate,
                'hari_terakhir' => $daysSinceLastUpdate,
                'should_update' => $shouldUpdate,
                'alasan' => $reason
            ]);

            if ($shouldUpdate) {
                $this->executeUpdate($setting);
            }

        } catch (\Exception $e) {
            Log::error('Error in scheduled update: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
        }
    }

    /**
     * Eksekusi update jadwal sholat
     */
    private function executeUpdate($setting)
    {
        Log::info('🚀 Memulai update terjadwal', [
            'waktu' => now()->format('H:i:s'),
            'kota' => $setting->auto_update_city,
            'negara' => $setting->auto_update_country,
            'frekuensi' => $setting->auto_update_frequency
        ]);

        try {
            // Panggil command update
            $exitCode = \Artisan::call('jadwal:update', [
                '--force' => true,
                '--city' => $setting->auto_update_city ?? 'Jakarta',
                '--country' => $setting->auto_update_country ?? 'Indonesia'
            ]);
            
            $output = \Artisan::output();
            
            if ($exitCode === 0) {
                Log::info('✅ Update terjadwal berhasil', [
                    'exit_code' => $exitCode,
                    'output' => $output
                ]);
            } else {
                Log::error('❌ Update terjadwal gagal', [
                    'exit_code' => $exitCode,
                    'output' => $output
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception in executeUpdate: ' . $e->getMessage());
        }
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}