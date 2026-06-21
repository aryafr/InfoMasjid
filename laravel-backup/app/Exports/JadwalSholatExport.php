<?php

namespace App\Exports;

use App\Models\JadwalSholat;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class JadwalSholatExport implements FromCollection, WithHeadings, WithMapping
{
	public function collection()
	{
		return JadwalSholat::all();
	}

	public function headings(): array
	{
		return [
			'ID',
			'Nama Sholat',
			'Waktu',
			'Dibuat',
			'Diupdate'
		];
	}

	public function map($jadwal): array
	{
		return [
			$jadwal->id,
			$jadwal->nama_sholat,
			$jadwal->waktu,
			$jadwal->created_at,
			$jadwal->updated_at
		];
	}
}