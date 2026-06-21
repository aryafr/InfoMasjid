<!-- resources/views/pengumuman/export_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Export Pengumuman</title>
	<style>
		* {
			font-family: 'Arial', sans-serif;
		}
		body {
			padding: 20px;
		}
		.header {
			text-align: center;
			margin-bottom: 30px;
			border-bottom: 2px solid #f6c23e;
			padding-bottom: 10px;
		}
		.header h1 {
			color: #2c3e50;
			margin: 0;
			font-size: 24px;
		}
		.header p {
			color: #7f8c8d;
			margin: 5px 0 0;
			font-size: 12px;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 20px;
		}
		th, td {
			border: 1px solid #ddd;
			padding: 10px;
			text-align: left;
			vertical-align: top;
		}
		th {
			background-color: #f6c23e;
			color: #2c3e50;
			font-weight: bold;
		}
		tr:nth-child(even) {
			background-color: #f9f9f9;
		}
		.footer {
			text-align: center;
			margin-top: 30px;
			font-size: 10px;
			color: #7f8c8d;
			border-top: 1px solid #ddd;
			padding-top: 10px;
		}
		.badge-active {
			display: inline-block;
			padding: 3px 8px;
			background-color: #28a745;
			color: white;
			border-radius: 4px;
			font-size: 10px;
		}
		.badge-expired {
			background-color: #6c757d;
			color: white;
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>Data Pengumuman</h1>
		<p>{{ \App\Models\AppSetting::first()->nama_aplikasi ?? 'Masjid Digital' }}</p>
		<p>Tanggal Export: {{ \Carbon\Carbon::now()->format('d F Y H:i:s') }} WIB</p>
	</div>

	<table>
		<thead>
			<tr>
				<th width="30">No</th>
				<th>Isi Pengumuman</th>
				<th width="120">Tanggal</th>
				<th width="80">Status</th>
			</tr>
		</thead>
		<tbody>
			@foreach($pengumuman as $index => $item)
			@php
			$isActive = \Carbon\Carbon::parse($item->tanggal)->gte(now());
			@endphp
			<tr>
				<td>{{ $index + 1 }}</td>
				<td>{{ $item->isi }}</td>
				<td>{{ \Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y') }}</td>
				<td>
					@if($isActive)
					<span class="badge-active">Aktif</span>
					@else
					<span class="badge-active badge-expired">Berlalu</span>
					@endif
				</td>
			</tr>
			@endforeach
		</tbody>
	</table>

	<div class="footer">
		<p>Dicetak oleh sistem {{ \App\Models\AppSetting::first()->nama_aplikasi ?? 'Masjid Digital' }}</p>
		<p>&copy; {{ date('Y') }} - Hak Cipta Dilindungi</p>
	</div>
</body>
</html>