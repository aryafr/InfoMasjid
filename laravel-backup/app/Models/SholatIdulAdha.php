<?php
// app/Models/SholatIdulAdha.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class SholatIdulAdha extends Model
{
	use HasFactory;

	protected $table = 'sholat_idul_adha';

	protected $fillable = [
		'tahun',
		'tanggal',
		'imam',
		'khatib',
		'muadzin',
		'waktu',
		'keterangan'
	];

	protected $casts = [
		'tanggal' => 'date',
		'waktu' => 'datetime'
	];

    // Scope untuk tahun tertentu
	public function scopeTahun($query, $tahun)
	{
		return $query->where('tahun', $tahun);
	}

    // Scope untuk tahun berjalan
	public function scopeTahunIni($query)
	{
		return $query->where('tahun', date('Y'));
	}

    // Accessor format tanggal
	public function getFormattedTanggalAttribute()
	{
		return Carbon::parse($this->tanggal)->translatedFormat('l, d F Y');
	}

    // Accessor format waktu
	public function getFormattedWaktuAttribute()
	{
		return Carbon::parse($this->waktu)->format('H:i') . ' WIB';
	}
}