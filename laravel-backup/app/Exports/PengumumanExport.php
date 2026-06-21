<?php

namespace App\Exports;

use App\Models\Pengumuman;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PengumumanExport implements FromCollection, WithHeadings, WithMapping
{
	public function collection()
	{
		return Pengumuman::all();
	}

	public function headings(): array
	{
		return [
			'ID',
			'Isi Pengumuman',
			'Tanggal',
			'Dibuat',
			'Diupdate'
		];
	}

	public function map($pengumuman): array
	{
		return [
			$pengumuman->id,
			$pengumuman->isi,
			$pengumuman->tanggal,
			$pengumuman->created_at,
			$pengumuman->updated_at
		];
	}
}