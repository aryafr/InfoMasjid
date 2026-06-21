<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keuangan extends Model
{
	protected $table = 'keuangan';
	
	protected $fillable = [
		'tanggal',
		'deskripsi',
		'pemasukan',
		'pengeluaran',
		'saldo',
		'kategori',
	];

	public $timestamps = true;
}