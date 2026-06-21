{{-- resources/views/idul-fitri-embed.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<title>Jadwal Sholat Idul Fitri - Masjid Al-Ikhlas</title>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: 'Poppins', sans-serif;
			background: linear-gradient(135deg, #0a4d68, #088395);
			color: #ffffff;
			height: 100vh;
			width: 100vw;
			overflow: hidden;
			position: relative;
		}
		
		@keyframes gradientShift {
			0%, 100% { background: linear-gradient(135deg, #0a4d68, #088395); }
			50% { background: linear-gradient(135deg, #088395, #0a4d68); }
		}
		
		body {
			animation: gradientShift 15s ease infinite;
		}
		
		.kaligrafi {
			position: absolute;
			top: 20px;
			font-family: 'Amiri', serif;
			font-size: 5rem;
			opacity: 0.15;
			z-index: 0;
			user-select: none;
			background: linear-gradient(to right, #ffd700, #ffffff);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			pointer-events: none;
		}
		
		.kaligrafi-allah { right: 30px; }
		.kaligrafi-muhammad { left: 30px; }
		
		.container {
			position: relative;
			z-index: 1;
			height: 100vh;
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 15px 25px;
		}
		
		.header {
			text-align: center;
			margin-bottom: 20px;
			flex-shrink: 0;
		}
		
		.header h1 {
			font-size: 1.8rem;
			background: linear-gradient(to right, #ffd700, #ffffff);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			letter-spacing: 1px;
		}
		
		.datetime {
			font-size: 0.8rem;
			background: rgba(0,0,0,0.3);
			display: inline-block;
			padding: 3px 12px;
			border-radius: 20px;
			margin-top: 5px;
		}
		
		.main-content {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 0;
		}
		
		/* Layout 2 Kolom - Lebih lebar */
		.idul-card {
			background: rgba(255, 255, 255, 0.12);
			backdrop-filter: blur(10px);
			border-radius: 30px;
			border: 2px solid rgba(255, 215, 0, 0.3);
			box-shadow: 0 15px 45px rgba(0,0,0,0.3);
			width: 100%;
			max-width: 1000px;
			overflow: hidden;
			animation: fadeInUp 0.6s ease-out;
		}
		
		@keyframes fadeInUp {
			from {
				opacity: 0;
				transform: translateY(30px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
		
		.idul-header {
			background: linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2));
			padding: 20px;
			text-align: center;
			border-bottom: 2px solid #ffd700;
		}
		
		.idul-header i {
			font-size: 2.5rem;
			color: #ffd700;
			margin-bottom: 8px;
			display: block;
		}
		
		.idul-header h2 {
			font-size: 1.8rem;
			font-weight: 700;
			color: #ffd700;
			letter-spacing: 2px;
		}
		
		.idul-header p {
			font-size: 1rem;
			opacity: 0.9;
			margin-top: 5px;
		}
		
		/* Body 2 Kolom */
		.idul-body {
			padding: 30px;
			display: flex;
			gap: 30px;
			flex-wrap: wrap;
		}
		
		/* Kolom Kiri - Informasi Utama */
		.info-column {
			flex: 1;
			min-width: 250px;
		}
		
		/* Kolom Kanan - Informasi Petugas */
		.officials-column {
			flex: 1;
			min-width: 250px;
		}
		
		.section-title {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 20px;
			padding-bottom: 10px;
			border-bottom: 2px solid rgba(255, 215, 0, 0.3);
		}
		
		.section-title i {
			font-size: 1.3rem;
			color: #ffd700;
		}
		
		.section-title h3 {
			font-size: 1.1rem;
			font-weight: 600;
			color: #ffd700;
			letter-spacing: 1px;
		}
		
		.info-grid {
			display: flex;
			flex-direction: column;
			gap: 15px;
		}
		
		.info-item {
			background: rgba(0, 0, 0, 0.35);
			border-radius: 15px;
			padding: 15px;
			display: flex;
			align-items: center;
			gap: 15px;
			border-left: 4px solid #ffd700;
			transition: all 0.3s ease;
		}
		
		.info-item:hover {
			background: rgba(0, 0, 0, 0.5);
			transform: translateX(5px);
		}
		
		.info-item i {
			font-size: 1.5rem;
			color: #ffd700;
			width: 45px;
			text-align: center;
		}
		
		.info-item .label {
			font-size: 0.7rem;
			text-transform: uppercase;
			letter-spacing: 1px;
			opacity: 0.7;
			margin-bottom: 5px;
		}
		
		.info-item .value {
			font-size: 1rem;
			font-weight: 600;
			line-height: 1.4;
		}
		
		/* Petugas Item */
		.officials-grid {
			display: flex;
			flex-direction: column;
			gap: 15px;
		}
		
		.official-item {
			background: rgba(0, 0, 0, 0.35);
			border-radius: 15px;
			padding: 15px;
			display: flex;
			align-items: center;
			gap: 15px;
			border-left: 4px solid #ffd700;
			transition: all 0.3s ease;
		}
		
		.official-item:hover {
			background: rgba(0, 0, 0, 0.5);
			transform: translateX(5px);
		}
		
		.official-item i {
			font-size: 1.5rem;
			color: #ffd700;
			width: 45px;
			text-align: center;
		}
		
		.official-info .label {
			font-size: 0.7rem;
			text-transform: uppercase;
			letter-spacing: 1px;
			opacity: 0.7;
			margin-bottom: 5px;
		}
		
		.official-info .name {
			font-size: 1rem;
			font-weight: 600;
		}
		
		.date-badge {
			background: rgba(255, 215, 0, 0.2);
			border-radius: 30px;
			padding: 8px 15px;
			display: inline-block;
			margin-top: 20px;
			font-size: 0.85rem;
			border: 1px solid rgba(255,215,0,0.3);
			text-align: center;
			width: 100%;
		}
		
		.date-badge i {
			margin-right: 8px;
			color: #ffd700;
		}
		
		.footer {
			text-align: center;
			margin-top: 12px;
			padding-top: 8px;
			border-top: 1px solid rgba(255,255,255,0.15);
			font-size: 0.6rem;
			opacity: 0.6;
			flex-shrink: 0;
		}
		
		.empty-state {
			text-align: center;
			padding: 60px;
			width: 100%;
		}
		
		.empty-state i {
			font-size: 4rem;
			color: rgba(255,215,0,0.5);
			margin-bottom: 15px;
			display: block;
		}
		
		@media (min-width: 1920px) {
			.idul-card { max-width: 1200px; }
			.idul-header h2 { font-size: 2.2rem; }
			.idul-header i { font-size: 3rem; }
			.info-item .value, .official-info .name { font-size: 1.2rem; }
			.header h1 { font-size: 2.2rem; }
			.section-title h3 { font-size: 1.3rem; }
		}
		
		@media (max-width: 1024px) {
			.idul-body {
				flex-direction: column;
				gap: 20px;
			}
			.info-column, .officials-column {
				width: 100%;
			}
		}
		
		@media (max-width: 768px) {
			.container { padding: 10px 15px; }
			.idul-header h2 { font-size: 1.3rem; }
			.idul-header i { font-size: 2rem; }
			.info-item, .official-item { padding: 10px 12px; }
			.info-item .value, .official-info .name { font-size: 0.85rem; }
			.kaligrafi { font-size: 3.5rem; }
		}
	</style>
</head>
<body>
	<div class="kaligrafi kaligrafi-allah">ﷲ</div>
	<div class="kaligrafi kaligrafi-muhammad">ﷺ</div>
	
	<div class="container">
		<div class="header">
			<h1>{{ $settings['nama_aplikasi'] ?? 'Masjid Al-Ikhlas' }}</h1>
			<div class="datetime" id="datetime"></div>
		</div>
		
		<div class="main-content">
			@if(isset($idulFitri) && $idulFitri)
			<div class="idul-card">
				<div class="idul-header">
					<i class="fas fa-moon"></i>
					<h2>Sholat Idul Fitri</h2>
					<p>{{ $idulFitri->tahun }} M / {{ $idulFitri->tahun - 1 }} H</p>
				</div>
				<div class="idul-body">
					<!-- KOLOM KIRI: Informasi Tanggal & Waktu -->
					<div class="info-column">
						<div class="section-title">
							<i class="fas fa-info-circle"></i>
							<h3>Informasi Sholat</h3>
						</div>
						<div class="info-grid">
							<div class="info-item">
								<i class="fas fa-calendar-alt"></i>
								<div>
									<div class="label">Hari & Tanggal</div>
									<div class="value" id="formattedDate">
										{{-- Menggunakan format Indonesia dengan Carbon --}}
										@php
										setlocale(LC_TIME, 'id_ID', 'Indonesian');
										\Carbon\Carbon::setLocale('id');
										$tanggal = \Carbon\Carbon::parse($idulFitri->tanggal);
										@endphp
										{{ $tanggal->translatedFormat('l') }}, {{ $tanggal->translatedFormat('d') }} {{ $tanggal->translatedFormat('F') }} {{ $tanggal->translatedFormat('Y') }}
									</div>
								</div>
							</div>
							<div class="info-item">
								<i class="fas fa-clock"></i>
								<div>
									<div class="label">Waktu Pelaksanaan</div>
									<div class="value">{{ \Carbon\Carbon::parse($idulFitri->waktu)->format('H:i') }} WIB</div>
								</div>
							</div>
						</div>
						@if($idulFitri->keterangan)
						<div class="date-badge">
							<i class="fas fa-info-circle"></i> {{ $idulFitri->keterangan }}
						</div>
						@endif
					</div>
					
					<!-- KOLOM KANAN: Petugas Sholat -->
					<div class="officials-column">
						<div class="section-title">
							<i class="fas fa-users"></i>
							<h3>Petugas Sholat</h3>
						</div>
						<div class="officials-grid">
							<div class="official-item">
								<i class="fas fa-user"></i>
								<div class="official-info">
									<div class="label">Imam</div>
									<div class="name">{{ $idulFitri->imam ?? 'Belum Ditentukan' }}</div>
								</div>
							</div>
							<div class="official-item">
								<i class="fas fa-book"></i>
								<div class="official-info">
									<div class="label">Khatib</div>
									<div class="name">{{ $idulFitri->khatib ?? 'Belum Ditentukan' }}</div>
								</div>
							</div>
							<div class="official-item">
								<i class="fas fa-microphone-alt"></i>
								<div class="official-info">
									<div class="label">Muadzin</div>
									<div class="name">{{ $idulFitri->muadzin ?? 'Belum Ditentukan' }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			@else
			<div class="idul-card">
				<div class="idul-header">
					<i class="fas fa-moon"></i>
					<h2>Sholat Idul Fitri</h2>
				</div>
				<div class="empty-state">
					<i class="fas fa-calendar-times"></i>
					<h3>Belum Ada Jadwal</h3>
					<p>Jadwal sholat Idul Fitri akan diumumkan kemudian</p>
				</div>
			</div>
			@endif
		</div>
		
		<div class="footer">
			{!! $settings['footer'] ?? 'Hak Cipta © 2025 Ali Mochtar Development System' !!}
		</div>
	</div>
	
	<script>
		// Array nama hari dalam Bahasa Indonesia
		const hariIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
		
		// Array nama bulan dalam Bahasa Indonesia
		const bulanIndo = [
			'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
			'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
		];
		
		function updateDateTime() {
			const now = new Date();
			
			// Format dengan Bahasa Indonesia manual
			const hari = hariIndo[now.getDay()];
			const tanggal = now.getDate();
			const bulan = bulanIndo[now.getMonth()];
			const tahun = now.getFullYear();
			const jam = now.getHours().toString().padStart(2, '0');
			const menit = now.getMinutes().toString().padStart(2, '0');
			const detik = now.getSeconds().toString().padStart(2, '0');
			
			const formattedDateTime = `${hari}, ${tanggal} ${bulan} ${tahun} | ${jam}:${menit}:${detik} WIB`;
			document.getElementById('datetime').textContent = formattedDateTime;
		}
		
		updateDateTime();
		setInterval(updateDateTime, 1000);
	</script>
</body>
</html>