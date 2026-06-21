<?php
// app/Console/Commands/UpdateJadwalSholat.php

namespace App\Console\Commands;

use App\Models\AppSetting;
use App\Services\JadwalSholatAutoUpdateService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateJadwalSholat extends Command
{
	protected $signature = 'jadwal:update 
	{--force : Paksa update tanpa cek pengaturan}
	{--city= : Nama kota (opsional)}
	{--country=Indonesia : Nama negara (opsional)}';
	
	protected $description = 'Update jadwal sholat secara otomatis dari API';

	protected $autoUpdateService;

	public function __construct(JadwalSholatAutoUpdateService $autoUpdateService)
	{
		parent::__construct();
		$this->autoUpdateService = $autoUpdateService;
	}

	public function handle()
	{
		$this->info('Memulai update jadwal sholat...');
		$this->newLine();

		try {
            // Ambil setting dari database
			$setting = AppSetting::first();
			
			if (!$setting) {
				$this->error('Setting aplikasi tidak ditemukan!');
				return 1;
			}

            // Tentukan kota yang akan digunakan
			$city = $this->option('city') ?? $setting->auto_update_city ?? 'Jakarta';
			$country = $this->option('country') ?? $setting->auto_update_country ?? 'Indonesia';
			
			$this->line("Kota: <fg=yellow>$city, $country</>");
			$this->line("Metode: <fg=yellow>" . ($setting->auto_update_method ?? 11) . "</>");
			$this->newLine();

            // Tampilkan progress bar
			$bar = $this->output->createProgressBar(3);
			$bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %message%');
			
			$bar->setMessage('Mengambil data dari API...');
			$bar->advance();
			
            // Panggil service dengan parameter yang benar
			if ($this->option('force')) {
                // Jika force, gunakan parameter yang diberikan
				$result = $this->autoUpdateService->forceUpdate($city, $country);
			} else {
                // Jika tidak force, cek auto_update_jadwal
				if (!$setting->auto_update_jadwal) {
					$this->error('Auto-update tidak diaktifkan! Gunakan --force untuk memaksa.');
					return 1;
				}
				$result = $this->autoUpdateService->updateFromAPI();
			}
			
			$bar->setMessage('Memproses data...');
			$bar->advance();
			
			if ($result && (is_bool($result) ? $result : $result['success'])) {
				$bar->setMessage('Update selesai!');
				$bar->finish();
				
				$this->newLine(2);
				$this->info('✓ Jadwal sholat berhasil diupdate!');
				
				if (is_array($result) && isset($result['results'])) {
					$this->line('  Perubahan yang dilakukan:');
					foreach ($result['results'] as $change) {
						$this->line("    • $change");
					}
				}
				
				$this->newLine();
				$this->line("  Data diambil dari: <fg=cyan>$city, $country</>");
				
                // Tampilkan jadwal terbaru
				$this->newLine();
				$this->table(
					['No', 'Sholat', 'Waktu'],
					\App\Models\JadwalSholat::orderBy('id')->get()->map(function($item, $key) {
						return [$key + 1, $item->nama_sholat, $item->waktu];
					})
				);
				
				Log::info('Jadwal sholat diupdate via command', [
					'city' => $city,
					'country' => $country,
					'force' => $this->option('force')
				]);
				
                return 0; // Success
            } else {
            	$bar->setMessage('Update gagal!');
            	$bar->finish();
            	
            	$this->newLine(2);
            	$this->error('✗ Gagal update jadwal sholat');
            	
            	if (is_array($result) && isset($result['message'])) {
            		$this->line('  ' . $result['message']);
            	} else {
            		$this->line('  Periksa koneksi internet dan pengaturan API');
            	}
            	
                return 1; // Error
            }

        } catch (\Exception $e) {
        	$this->newLine(2);
        	$this->error('✗ Error: ' . $e->getMessage());
        	
        	Log::error('Command update jadwal sholat error: ' . $e->getMessage());
        	Log::error('Stack trace: ' . $e->getTraceAsString());
        	
            return 1; // Error
        }
    }
}