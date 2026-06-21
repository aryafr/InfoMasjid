<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalSholat extends Model
{
	protected $table = 'jadwal_sholat';
	
	protected $fillable = [
		'nama_sholat',
		'waktu',
	];

	public $timestamps = true;
}