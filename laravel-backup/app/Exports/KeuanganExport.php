<?php
// app/Exports/KeuanganExport.php

namespace App\Exports;

use App\Models\Keuangan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;

class KeuanganExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithTitle
{
	protected $dari;
	protected $sampai;

	public function __construct($dari, $sampai)
	{
		$this->dari = $dari;
		$this->sampai = $sampai;
	}

	public function collection()
	{
		return Keuangan::whereBetween('tanggal', [$this->dari, $this->sampai])
		->orderBy('tanggal', 'desc')
		->get();
	}

	public function headings(): array
	{
		return [
			'No',
			'Tanggal',
			'Deskripsi',
			'Kategori',
			'Pemasukan (Rp)',
			'Pengeluaran (Rp)',
			'Saldo (Rp)'
		];
	}

	public function map($keuangan): array
	{
		static $rowNumber = 0;
		$rowNumber++;
		
		return [
			$rowNumber,
			$keuangan->tanggal,
			$keuangan->deskripsi,
			$keuangan->kategori ?? '-',
			$keuangan->pemasukan > 0 ? $keuangan->pemasukan : 0,
			$keuangan->pengeluaran > 0 ? $keuangan->pengeluaran : 0,
			$keuangan->saldo
		];
	}

	public function styles(Worksheet $sheet)
	{
        // Header style
		$sheet->getStyle('A1:G1')->applyFromArray([
			'font' => [
				'bold' => true,
				'color' => ['rgb' => 'FFFFFF'],
				'size' => 11
			],
			'fill' => [
				'fillType' => Fill::FILL_SOLID,
				'startColor' => ['rgb' => '0A4D68']
			],
			'alignment' => [
				'horizontal' => Alignment::HORIZONTAL_CENTER,
				'vertical' => Alignment::VERTICAL_CENTER
			]
		]);
		
        // Set row height for header
		$sheet->getRowDimension(1)->setRowHeight(25);
		
        // Style for all cells
		$sheet->getStyle('A1:G' . ($sheet->getHighestRow()))->applyFromArray([
			'borders' => [
				'allBorders' => [
					'borderStyle' => Border::BORDER_THIN,
					'color' => ['rgb' => 'CCCCCC']
				]
			],
			'alignment' => [
				'vertical' => Alignment::VERTICAL_CENTER
			]
		]);
		
        // Number format for currency columns (E, F, G)
		$sheet->getStyle('E2:G' . $sheet->getHighestRow())->getNumberFormat()
		->setFormatCode('#,##0');
		
        // Column alignment
		$sheet->getStyle('A:A')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
		$sheet->getStyle('B:B')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
		$sheet->getStyle('D:D')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
		
        // Color for income column (E)
		$highestRow = $sheet->getHighestRow();
		for ($row = 2; $row <= $highestRow; $row++) {
			$incomeValue = $sheet->getCell('E' . $row)->getValue();
			if ($incomeValue > 0) {
				$sheet->getStyle('E' . $row)->getFont()->getColor()->setRGB('28A745');
			}
			
			$expenseValue = $sheet->getCell('F' . $row)->getValue();
			if ($expenseValue > 0) {
				$sheet->getStyle('F' . $row)->getFont()->getColor()->setRGB('DC3545');
			}
		}
		
        // Total row style
		$lastRow = $highestRow + 1;
		$totalPemasukan = Keuangan::whereBetween('tanggal', [$this->dari, $this->sampai])->sum('pemasukan');
		$totalPengeluaran = Keuangan::whereBetween('tanggal', [$this->dari, $this->sampai])->sum('pengeluaran');
		$saldo = $totalPemasukan - $totalPengeluaran;
		
		$sheet->setCellValue('A' . $lastRow, 'TOTAL');
		$sheet->mergeCells('A' . $lastRow . ':D' . $lastRow);
		$sheet->setCellValue('E' . $lastRow, $totalPemasukan);
		$sheet->setCellValue('F' . $lastRow, $totalPengeluaran);
		$sheet->setCellValue('G' . $lastRow, $saldo);
		
		$sheet->getStyle('A' . $lastRow . ':G' . $lastRow)->applyFromArray([
			'font' => ['bold' => true],
			'fill' => [
				'fillType' => Fill::FILL_SOLID,
				'startColor' => ['rgb' => 'F8F9FC']
			]
		]);
		$sheet->getStyle('A' . $lastRow . ':D' . $lastRow)->getAlignment()
		->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		
		return $sheet;
	}

	public function columnWidths(): array
	{
		return [
            'A' => 6,   // No
            'B' => 12,  // Tanggal
            'C' => 35,  // Deskripsi
            'D' => 15,  // Kategori
            'E' => 18,  // Pemasukan
            'F' => 18,  // Pengeluaran
            'G' => 18,  // Saldo
        ];
    }

    public function title(): string
    {
    	return 'Laporan Keuangan';
    }
}