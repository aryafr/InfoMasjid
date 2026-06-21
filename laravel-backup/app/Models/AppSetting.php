<?php
// app/Models/AppSetting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AppSetting extends Model
{
	use HasFactory;

	protected $table = 'app_settings';
	
	protected $fillable = [
		'nama_aplikasi',
		'favicon',
		'background',
		'logo',
		'footer',
		'running_text',
		'auto_update_jadwal',
		'auto_update_frequency',
		'auto_update_time',
		'auto_update_city',
		'auto_update_country',
		'auto_update_method',
		'last_auto_update',
		'rotation_interval',
		'rotation_enabled',
		'rotation_pages'
	];

	protected $casts = [
		'auto_update_jadwal' => 'boolean',
		'rotation_enabled' => 'boolean',
		'last_auto_update' => 'datetime',
		'auto_update_time' => 'datetime:H:i:s',
	];

	public $timestamps = true;
	
	public function getLastAutoUpdateAttribute($value)
	{
		if ($value && !($value instanceof Carbon)) {
			try {
				return Carbon::parse($value);
			} catch (\Exception $e) {
				return null;
			}
		}
		return $value;
	}
	
    // Method untuk mendapatkan daftar halaman rotasi (DENGAN 6 HALAMAN)
	public function getRotationPagesList()
	{
		if (empty($this->rotation_pages)) {
			return [
				['url' => 'welcome-embed', 'name' => 'Dashboard Lengkap', 'active' => true],
				['url' => 'utama-embed', 'name' => 'Jadwal Sholat', 'active' => true],
				['url' => 'keuangan-embed', 'name' => 'Rincian Keuangan', 'active' => true],
				['url' => 'jumat-embed', 'name' => 'Jadwal Sholat Jumat', 'active' => true],
				['url' => 'pengumuman-embed', 'name' => 'Pengumuman', 'active' => true],
				['url' => 'keuangan-summary-embed', 'name' => 'Ringkasan Keuangan', 'active' => true]
			];
		}
		
		$data = is_string($this->rotation_pages) 
		? json_decode($this->rotation_pages, true) 
		: $this->rotation_pages;
		
		if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
			return [
				['url' => 'welcome-embed', 'name' => 'Dashboard Lengkap', 'active' => true],
				['url' => 'utama-embed', 'name' => 'Jadwal Sholat', 'active' => true],
				['url' => 'keuangan-embed', 'name' => 'Rincian Keuangan', 'active' => true],
				['url' => 'jumat-embed', 'name' => 'Jadwal Sholat Jumat', 'active' => true],
				['url' => 'pengumuman-embed', 'name' => 'Pengumuman', 'active' => true],
				['url' => 'keuangan-summary-embed', 'name' => 'Ringkasan Keuangan', 'active' => true]
			];
		}
		
		return $data;
	}
	
    // Alias untuk kompatibilitas dengan RotationController
	public function getRotationPages()
	{
		return $this->getRotationPagesList();
	}
	
	public function getRotationInterval()
	{
		return $this->rotation_interval ?? 10;
	}
	
	public function isRotationEnabled()
	{
		return $this->rotation_enabled ?? true;
	}
}