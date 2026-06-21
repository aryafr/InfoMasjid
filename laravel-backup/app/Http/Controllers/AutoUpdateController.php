<?php
// app/Http/Controllers/AutoUpdateController.php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Services\JadwalSholatAutoUpdateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class AutoUpdateController extends Controller
{
	protected $autoUpdateService;

	public function __construct(JadwalSholatAutoUpdateService $autoUpdateService)
	{
		$this->middleware('auth');
		$this->autoUpdateService = $autoUpdateService;
	}

	public function index()
	{
		$setting = AppSetting::first();
		
		if (!$setting) {
			$setting = AppSetting::create([
				'nama_aplikasi' => 'MASJID AL-IKHLAS',
				'auto_update_jadwal' => false,
				'auto_update_frequency' => 'daily',
				'auto_update_time' => '00:00:00',
				'auto_update_city' => 'Jakarta',
				'auto_update_country' => 'Indonesia',
				'auto_update_method' => 11,
			]);
		}
		
		return view('auto_update.index', compact('setting'));
	}

	public function updateSettings(Request $request)
	{
		$request->validate([
			'auto_update_jadwal' => 'sometimes|boolean',
			'auto_update_frequency' => 'required_if:auto_update_jadwal,1|in:daily,weekly,monthly',
			'auto_update_city' => 'required_if:auto_update_jadwal,1|string|max:255',
			'auto_update_country' => 'required_if:auto_update_jadwal,1|string|max:255',
			'auto_update_method' => 'required_if:auto_update_jadwal,1|integer|between:1,21',
			'auto_update_time' => 'required_if:auto_update_jadwal,1|date_format:H:i',
		]);

		try {
			$setting = AppSetting::first();
			
			if (!$setting) {
				$setting = new AppSetting();
			}

			Log::info('AutoUpdate Settings Request:', $request->all());

			$setting->auto_update_jadwal = $request->has('auto_update_jadwal') ? true : false;
			$setting->auto_update_frequency = $request->auto_update_frequency ?? 'daily';
			$setting->auto_update_city = $request->auto_update_city ?? 'Jakarta';
			$setting->auto_update_country = $request->auto_update_country ?? 'Indonesia';
			$setting->auto_update_method = $request->auto_update_method ?? 11;
			
			if ($request->has('auto_update_time') && !empty($request->auto_update_time)) {
				$setting->auto_update_time = $request->auto_update_time . ':00';
			}
			
			$setting->save();

			return redirect()->route('auto_update.index')
			->with('success', 'Pengaturan auto-update berhasil disimpan. Kota: ' . $setting->auto_update_city);
			
		} catch (\Exception $e) {
			Log::error('Error saving auto-update settings: ' . $e->getMessage());
			
			return redirect()->route('auto_update.index')
			->with('error', 'Gagal menyimpan pengaturan: ' . $e->getMessage());
		}
	}

	public function manualUpdate()
	{
		try {
            // Ambil setting dari database untuk mendapatkan kota terbaru
			$setting = AppSetting::first();
			$city = $setting->auto_update_city ?? 'Jakarta';
			$country = $setting->auto_update_country ?? 'Indonesia';
			
			Log::info('Manual update dimulai untuk:', [
				'city' => $city,
				'country' => $country
			]);
			
            // Panggil service dengan force update menggunakan data dari database
			$result = $this->autoUpdateService->forceUpdate($city, $country);
			
			if ($result['success']) {
				return response()->json([
					'success' => true,
					'message' => 'Update manual berhasil dilakukan untuk ' . $city . ', ' . $country,
					'results' => $result['results'] ?? [],
					'city' => $city,
					'country' => $country,
					'timestamp' => now()->toDateTimeString()
				]);
			} else {
				return response()->json([
					'success' => false,
					'message' => $result['message'] ?? 'Update manual gagal'
				], 500);
			}
			
		} catch (\Exception $e) {
			Log::error('Manual update error: ' . $e->getMessage());
			
			return response()->json([
				'success' => false,
				'message' => 'Error: ' . $e->getMessage()
			], 500);
		}
	}

	public function getUpdateLog()
	{
		$logFile = storage_path('logs/jadwal-update.log');
		$logs = [];
		
		if (file_exists($logFile)) {
			$lines = file($logFile);
			$lines = array_reverse($lines);
			$lines = array_slice($lines, 0, 20);
			
			foreach ($lines as $line) {
				if (preg_match('/\[(.*?)\].*?:(.*)/', $line, $matches)) {
					$logs[] = [
						'time' => $matches[1],
						'message' => trim($matches[2]),
						'status' => str_contains($line, 'berhasil') ? 'success' : 
						(str_contains($line, 'error') || str_contains($line, 'gagal') ? 'danger' : 'info')
					];
				}
			}
		}
		
		return response()->json([
			'logs' => $logs,
			'total' => count($logs)
		]);
	}
}