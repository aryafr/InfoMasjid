<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SholatJumat extends Model
{
	protected $table = 'sholat_jumat';
	
	protected $fillable = [
		'imam',
		'khatib',
		'muadzin',
		'tanggal',
	];

	public $timestamps = true;
}