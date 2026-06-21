<?php
// app/Models/Qris.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Qris extends Model
{
	use HasFactory;

	protected $table = 'qris';
	
	protected $fillable = [
		'nama',
		'gambar',
		'keterangan',
		'nomor_rekening',
		'bank',
		'atas_nama',
		'status'
	];

	protected $casts = [
		'status' => 'string'
	];

    // Accessor untuk mendapatkan URL gambar lengkap
	public function getGambarUrlAttribute()
	{
		if ($this->gambar && Storage::disk('public')->exists($this->gambar)) {
			return Storage::url($this->gambar);
		}
		return asset('img/default-qris.png');
	}

    // Scope untuk QRIS aktif
	public function scopeAktif($query)
	{
		return $query->where('status', 'aktif');
	}

    // Scope untuk QRIS nonaktif
	public function scopeNonaktif($query)
	{
		return $query->where('status', 'nonaktif');
	}

    // Cek apakah QRIS aktif
	public function isAktif()
	{
		return $this->status === 'aktif';
	}
}