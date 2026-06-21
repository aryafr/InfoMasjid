<!-- resources/views/keuangan.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sistem Informasi Masjid - Keuangan</title>
	<link rel="icon" type="image/x-icon" href="{{ asset($settings['favicon'] ?? 'favicon.ico') }}">
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
	<style>
		:root {
			--primary-color: #0d6e6e;
			--secondary-color: #ffd700;
			--accent-color: #0a4d68;
			--text-light: #ffffff;
			--text-dark: #333333;
			--bg-gradient: linear-gradient(135deg, #0a4d68, #088395);
			--income-bg: rgba(0, 255, 127, 0.15);
			--expense-bg: rgba(255, 99, 71, 0.15);
		}

		body {
			margin: 0;
			padding: 0;
			font-family: 'Poppins', sans-serif;
			background: var(--bg-gradient);
			color: var(--text-light);
			height: 100vh;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			overflow: hidden;
		}

		.kaligrafi {
			position: absolute;
			top: 20px;
			font-family: 'Amiri', serif;
			font-size: 5rem;
			z-index: 0;
			user-select: none;
			background: linear-gradient(to right, #ffd700, #ffffff);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			text-shadow: 2px 2px 0 rgba(0,0,0,0.2), 4px 4px 0 rgba(0,0,0,0.1);
			opacity: 0.7;
			transition: all 0.3s ease;
		}

		.kaligrafi:hover {
			opacity: 1;
			transform: scale(1.05);
		}

		.kaligrafi-allah {
			right: 40px;
		}

		.kaligrafi-muhammad {
			left: 40px;
		}

		.container {
			width: 100%;
			max-width: 1920px;
			height: 100%;
			display: flex;
			flex-direction: column;
			padding: 20px;
			box-sizing: border-box;
			position: relative;
			z-index: 1;
		}

		.header {
			text-align: center;
			margin-bottom: 20px;
		}

		.header h1 {
			font-size: 3.2rem;
			margin: 0;
			letter-spacing: 1.5px;
			font-weight: 700;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
			background: linear-gradient(to right, #ffd700, #ffffff);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			padding: 0 20px;
		}

		.datetime {
			font-size: 1.6rem;
			margin-top: 15px;
			background: rgba(0, 0, 0, 0.25);
			display: inline-block;
			padding: 10px 25px;
			border-radius: 30px;
			font-weight: 500;
			border: 1px solid rgba(255, 255, 255, 0.2);
		}

		.running-text {
			font-size: 1.5rem;
			margin-top: 20px;
			background: rgba(0, 0, 0, 0.35);
			padding: 15px 25px;
			border-radius: 8px;
			border-left: 5px solid var(--secondary-color);
			max-width: 90%;
			margin-left: auto;
			margin-right: auto;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		}

		.main-content {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
		}

		.panel {
			background: rgba(255, 255, 255, 0.1);
			border-radius: 20px;
			padding: 30px;
			backdrop-filter: blur(12px);
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
			border: 2px solid rgba(255, 215, 0, 0.3);
			transition: transform 0.4s ease, box-shadow 0.4s ease;
			width: 100%;
			max-width: 1400px;
			animation: fadeIn 1s ease-out forwards;
			display: flex;
			flex-direction: column;
		}

		.panel:hover {
			transform: translateY(-10px);
			box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
		}

		.keuangan h2 {
			font-size: 2.2rem;
			margin-bottom: 20px;
			padding-bottom: 12px;
			position: relative;
			color: var(--secondary-color);
			text-align: center;
		}

		.keuangan h2:after {
			content: '';
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0;
			width: 60px;
			height: 4px;
			background: var(--secondary-color);
			border-radius: 4px;
		}

		.summary {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20px;
			padding: 15px;
			background: rgba(0, 0, 0, 0.2);
			border-radius: 10px;
			border: 1px solid rgba(255, 215, 0, 0.3);
		}

		.summary p {
			margin: 0;
			font-size: 1.4rem;
			font-weight: 500;
		}

		.summary p i {
			margin-right: 10px;
			color: var(--secondary-color);
		}

		.summary .income { color: #00ff7f; }
		.summary .expense { color: #ff6347; }
		.summary .balance { color: #32cd32; }

		.table-wrapper {
			max-height: 400px;
			min-height: 400px;
			overflow: hidden;
			position: relative;
		}

		.keuangan table {
			width: 100%;
			border-collapse: separate;
			border-spacing: 0;
			font-size: 1.3rem;
			border-radius: 12px;
		}

		.keuangan th, .keuangan td {
			padding: 15px;
			text-align: left;
			width: 16.66%;
		}

		.keuangan th {
			background: var(--secondary-color);
			color: var(--accent-color);
			font-weight: 600;
			position: sticky;
			top: 0;
			z-index: 1;
		}

		.keuangan tbody {
			display: block;
			will-change: transform;
			animation: scrollUp 40s linear infinite;
		}

		.keuangan tbody:hover {
			animation-play-state: paused;
		}

		.keuangan tr {
			display: flex;
			width: 100%;
		}

		.keuangan tr.income { background: var(--income-bg); }
		.keuangan tr.expense { background: var(--expense-bg); }
		.keuangan tr:hover { background: rgba(255, 215, 0, 0.3); }

		.keuangan td i {
			margin-right: 8px;
			color: var(--secondary-color);
		}

		.no-data {
			text-align: center;
			font-size: 1.2rem;
			padding: 20px;
			color: rgba(255, 255, 255, 0.7);
		}

		.footer {
			text-align: center;
			font-size: 1rem;
			margin-top: 25px;
			color: rgba(255, 255, 255, 0.8);
			padding: 15px;
			background: rgba(0, 0, 0, 0.25);
			border-radius: 8px;
		}

		@keyframes fadeIn {
			from { opacity: 0; transform: translateY(30px); }
			to { opacity: 1; transform: translateY(0); }
		}

		@keyframes scrollUp {
			0% { transform: translateY(0); }
			100% { transform: translateY(-50%); }
		}

		@media (max-width: 1366px) {
			.container { max-width: 90%; }
			.panel { max-width: 95%; }
			.header h1 { font-size: 2.8rem; }
			.kaligrafi { font-size: 4.5rem; }
			.datetime, .running-text { font-size: 1.3rem; }
			.keuangan h2 { font-size: 2rem; }
			.summary p { font-size: 1.2rem; }
			.keuangan table { font-size: 1.1rem; }
			.keuangan th, .keuangan td { padding: 12px; }
			.table-wrapper { max-height: 350px; min-height: 350px; }
		}

		@media (max-width: 1024px) {
			.container { max-width: 95%; }
			.panel { max-width: 98%; }
			.kaligrafi { font-size: 4rem; }
			.summary { flex-direction: column; gap: 10px; }
			.table-wrapper { max-height: 300px; min-height: 300px; }
		}

		@media (max-width: 768px) {
			.header h1 { font-size: 2.2rem; }
			.kaligrafi {
				font-size: 3.5rem;
				top: 10px;
			}
			.kaligrafi-allah { right: 15px; }
			.kaligrafi-muhammad { left: 15px; }
			.datetime { font-size: 1.1rem; padding: 8px 15px; }
			.running-text { font-size: 1rem; padding: 10px 15px; max-width: 95%; }
			.keuangan h2 { font-size: 1.8rem; }
			.summary p, .keuangan table { font-size: 1rem; }
			.panel { padding: 20px; }
			.keuangan table .kategori { display: none; }
			.keuangan th, .keuangan td { width: 20%; }
			.table-wrapper { max-height: 250px; min-height: 250px; }
		}
	</style>
</head>
<body>
	<div class="kaligrafi kaligrafi-allah">ﷲ</div>
	<div class="kaligrafi kaligrafi-muhammad">ﷺ</div>

	<div class="container">
		<div class="header">
			<h1 id="nama-masjid">{{ $settings['nama_aplikasi'] ?? 'Masjid Al-Ikhlas' }}</h1>
			<div class="datetime" id="datetime"></div>
			@if($settings['running_text'])
			<marquee class="running-text">{{ $settings['running_text'] }}</marquee>
			@endif
		</div>
		<div class="main-content">
			<div class="panel keuangan">
				<h2>Rincian Keuangan</h2>
				<div class="summary">
					<p class="income"><i class="fas fa-coins"></i> Total Pemasukan: Rp {{ number_format($totalPemasukan, 2, ',', '.') }}</p>
					<p class="expense"><i class="fas fa-coins"></i> Total Pengeluaran: Rp {{ number_format($totalPengeluaran, 2, ',', '.') }}</p>
					<p class="balance"><i class="fas fa-coins"></i> Saldo: Rp {{ number_format($saldo, 2, ',', '.') }}</p>
				</div>
				<div class="table-wrapper">
					<table id="keuangan-table">
						<thead>
							<tr>
								<th>Tanggal</th>
								<th>Deskripsi</th>
								<th>Pemasukan</th>
								<th>Pengeluaran</th>
								<th>Saldo</th>
								<th class="kategori">Kategori</th>
							</tr>
						</thead>
						<tbody id="keuangan-tbody">
							@if($keuangan->isEmpty())
							<tr>
								<td colspan="6" class="no-data">Tidak ada data keuangan tersedia.</td>
							</tr>
							@else
							@foreach ($keuangan as $item)
							<tr class="{{ $item->pemasukan > 0 ? 'income' : 'expense' }}">
								<td>{{ \Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y') }}</td>
								<td><i class="fas {{ $item->pemasukan > 0 ? 'fa-arrow-up' : 'fa-arrow-down' }}"></i> {{ $item->deskripsi }}</td>
								<td>Rp {{ number_format($item->pemasukan, 2, ',', '.') }}</td>
								<td>Rp {{ number_format($item->pengeluaran, 2, ',', '.') }}</td>
								<td>Rp {{ number_format($item->saldo, 2, ',', '.') }}</td>
								<td class="kategori">{{ $item->kategori ?? '-' }}</td>
							</tr>
							@endforeach
							@foreach ($keuangan as $item)
							<tr class="{{ $item->pemasukan > 0 ? 'income' : 'expense' }}">
								<td>{{ \Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y') }}</td>
								<td><i class="fas {{ $item->pemasukan > 0 ? 'fa-arrow-up' : 'fa-arrow-down' }}"></i> {{ $item->deskripsi }}</td>
								<td>Rp {{ number_format($item->pemasukan, 2, ',', '.') }}</td>
								<td>Rp {{ number_format($item->pengeluaran, 2, ',', '.') }}</td>
								<td>Rp {{ number_format($item->saldo, 2, ',', '.') }}</td>
								<td class="kategori">{{ $item->kategori ?? '-' }}</td>
							</tr>
							@endforeach
							@endif
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="footer">
			{!! $settings['footer'] ?? 'Hak Cipta © 2025 Ali Mochtar Development System' !!}
		</div>
	</div>

	<script>
		function updateDateTime() {
			const now = new Date();
			const options = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				timeZone: 'Asia/Jakarta'
			};
			const formattedDateTime = now.toLocaleString('id-ID', options);
			document.getElementById('datetime').textContent = formattedDateTime;
		}
		updateDateTime();
		setInterval(updateDateTime, 1000);

		document.addEventListener('DOMContentLoaded', function() {
			const marquee = document.querySelector('marquee');
			if (marquee) {
				marquee.style.transition = 'all 0.5s ease';
			}

            // Auto-refresh logic
			let lastTimestamp = null;
			async function checkForUpdates() {
				try {
					const response = await fetch('{{ route("data.timestamp") }}');
					const data = await response.json();
					const newTimestamp = data.timestamp;
					if (lastTimestamp && newTimestamp && newTimestamp !== lastTimestamp) {
						window.location.reload();
					}
					lastTimestamp = newTimestamp;
				} catch (error) {
					console.error('Error checking for updates:', error);
				}
			}
			checkForUpdates();
            setInterval(checkForUpdates, 30000); // Check every 30 seconds
        });
    </script>
</body>
</html>