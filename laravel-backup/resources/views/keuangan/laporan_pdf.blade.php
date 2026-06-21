<!-- resources/views/keuangan/laporan_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Laporan Keuangan Masjid</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: Arial, sans-serif;
			background: #fff;
			padding: 20px;
			font-size: 12px;
			color: #2c3e50;
		}
		
		.header {
			text-align: center;
			margin-bottom: 30px;
			padding-bottom: 20px;
			border-bottom: 3px solid #0a4d68;
		}
		
		.header h1 {
			color: #0a4d68;
			font-size: 24px;
		}
		
		.header h2 {
			font-size: 18px;
			margin-top: 10px;
		}
		
		.header .period {
			background: #eaf4f8;
			padding: 6px 15px;
			border-radius: 20px;
			margin-top: 10px;
			display: inline-block;
			font-weight: bold;
			color: #0a4d68;
		}
		
		.summary-grid {
			display: flex;
			gap: 10px;
			margin-bottom: 25px;
		}
		
		.summary-card {
			flex: 1;
			background: #f8f9fc;
			padding: 15px;
			border-left: 5px solid;
			text-align: center;
		}
		
		.income { border-color: #28a745; }
		.expense { border-color: #dc3545; }
		.balance { border-color: #0a4d68; }
		
		.amount {
			font-size: 18px;
			font-weight: bold;
		}
		
		table {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #ddd;
			margin-top: 10px;
		}
		
		thead {
			border-top: 3px solid #0a4d68;
		}
		
		th {
			background: #0a4d68;
			color: #fff;
			padding: 10px;
			font-size: 10px;
			text-transform: uppercase;
		}
		
		td {
			padding: 10px;
			border-bottom: 1px solid #eee;
		}
		
		tbody tr:nth-child(even) {
			background: #f4f8fb;
		}
		
		.text-success { color: #28a745; font-weight: bold; }
		.text-danger { color: #dc3545; font-weight: bold; }
		.text-primary { color: #0a4d68; font-weight: bold; }
		
		.badge {
			padding: 4px 8px;
			border-radius: 10px;
			font-size: 9px;
		}
		
		.badge-income { background: #d4edda; color: #155724; }
		.badge-expense { background: #f8d7da; color: #721c24; }
		
		.total-row {
			background: #ecf0f1;
			font-weight: bold;
		}
		
		.footer {
			margin-top: 30px;
			text-align: center;
			font-size: 10px;
			color: #777;
		}
		
		.page-break {
			page-break-before: always;
		}
	</style>
</head>
<body>

	@php
	$setting = \App\Models\AppSetting::first();
	@endphp

	<div class="header">
		<h1>{{ $setting->nama_aplikasi ?? 'MASJID DIGITAL' }}</h1>
		<h2>LAPORAN KEUANGAN</h2>
		<div class="period">
			{{ \Carbon\Carbon::parse($dari)->translatedFormat('d F Y') }} -
			{{ \Carbon\Carbon::parse($sampai)->translatedFormat('d F Y') }}
		</div>
	</div>

	<div class="summary-grid">
		<div class="summary-card income">
			<div>Total Pemasukan</div>
			<div class="amount text-success">Rp {{ number_format($totalPemasukan,0,',','.') }}</div>
		</div>
		<div class="summary-card expense">
			<div>Total Pengeluaran</div>
			<div class="amount text-danger">Rp {{ number_format($totalPengeluaran,0,',','.') }}</div>
		</div>
		<div class="summary-card balance">
			<div>Saldo</div>
			<div class="amount text-primary">Rp {{ number_format($saldo,0,',','.') }}</div>
		</div>
	</div>

	<table>
		<thead>
			<tr>
				<th>No</th>
				<th>Tanggal</th>
				<th>Deskripsi</th>
				<th>Kategori</th>
				<th>Pemasukan</th>
				<th>Pengeluaran</th>
				<th>Saldo</th>
			</tr>
		</thead>
		<tbody>
			@forelse($keuangan as $i => $item)
			<tr>
				<td>{{ $i+1 }}</td>
				<td>{{ \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y') }}</td>
				<td>{{ $item->deskripsi }}</td>
				<td>
					<span class="badge {{ $item->pemasukan > 0 ? 'badge-income' : 'badge-expense' }}">
						{{ $item->kategori ?? '-' }}
					</span>
				</td>
				<td class="text-success">
					{{ $item->pemasukan ? 'Rp '.number_format($item->pemasukan,0,',','.') : '-' }}
				</td>
				<td class="text-danger">
					{{ $item->pengeluaran ? 'Rp '.number_format($item->pengeluaran,0,',','.') : '-' }}
				</td>
				<td class="text-primary">
					Rp {{ number_format($item->saldo,0,',','.') }}
				</td>
			</tr>
			@empty
			<tr>
				<td colspan="7" align="center">Tidak ada data</td>
			</tr>
			@endforelse
		</tbody>

		@if($keuangan->count())
		<tfoot>
			<tr class="total-row">
				<td colspan="4" align="right">TOTAL</td>
				<td class="text-success">Rp {{ number_format($totalPemasukan,0,',','.') }}</td>
				<td class="text-danger">Rp {{ number_format($totalPengeluaran,0,',','.') }}</td>
				<td class="text-primary">Rp {{ number_format($saldo,0,',','.') }}</td>
			</tr>
		</tfoot>
		@endif
	</table>

	{{-- ================= RINGKASAN PER KATEGORI ================= --}}
	@php
	$categorySummary = [];
	foreach($keuangan as $item){
		$cat = $item->kategori ?? 'Lainnya';
		if(!isset($categorySummary[$cat])){
			$categorySummary[$cat] = ['pemasukan'=>0,'pengeluaran'=>0];
		}
		$categorySummary[$cat]['pemasukan'] += $item->pemasukan;
		$categorySummary[$cat]['pengeluaran'] += $item->pengeluaran;
	}
	@endphp

	@if(count($categorySummary))
	<div class="page-break"></div>

	<div class="header">
		<h2>RINGKASAN PER KATEGORI</h2>
	</div>

	<table>
		<thead>
			<tr>
				<th>No</th>
				<th>Kategori</th>
				<th>Pemasukan</th>
				<th>Pengeluaran</th>
				<th>Saldo</th>
			</tr>
		</thead>
		<tbody>
			@foreach($categorySummary as $kategori => $val)
			<tr>
				<td>{{ $loop->iteration }}</td>
				<td><strong>{{ $kategori }}</strong></td>
				<td class="text-success">Rp {{ number_format($val['pemasukan'],0,',','.') }}</td>
				<td class="text-danger">Rp {{ number_format($val['pengeluaran'],0,',','.') }}</td>
				<td class="text-primary">Rp {{ number_format($val['pemasukan'] - $val['pengeluaran'],0,',','.') }}</td>
			</tr>
			@endforeach
		</tbody>
	</table>
	@endif

	<div class="footer">
		<p>Dicetak: {{ \Carbon\Carbon::now('Asia/Jakarta')->translatedFormat('d F Y H:i') }}</p>
		<p>{{ $setting->footer ?? 'Sistem Informasi Masjid Digital' }}</p>
	</div>

</body>
</html>