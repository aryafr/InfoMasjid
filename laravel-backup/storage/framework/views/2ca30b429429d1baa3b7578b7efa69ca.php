<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sistem Informasi Masjid - Jadwal Sholat Jumat</title>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
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
		
		.kaligrafi {
			position: absolute;
			top: 20px;
			font-family: 'Amiri', serif;
			font-size: 5rem;
			opacity: 0.15;
			z-index: 0;
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
			padding: 15px 40px 10px 40px;
		}
		
		.header {
			text-align: center;
			margin-bottom: 12px;
			flex-shrink: 0;
		}
		
		.header h1 {
			font-size: 2rem;
			background: linear-gradient(to right, #ffd700, #ffffff);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			margin-bottom: 5px;
		}
		
		.datetime {
			font-size: 0.85rem;
			background: rgba(0,0,0,0.3);
			display: inline-block;
			padding: 4px 12px;
			border-radius: 30px;
		}
		
		.jumat-card {
			background: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(10px);
			border-radius: 25px;
			padding: 15px 25px;
			border: 1px solid rgba(255, 215, 0, 0.3);
			box-shadow: 0 15px 40px rgba(0,0,0,0.2);
			flex: 1;
			display: flex;
			flex-direction: column;
			min-height: 0;
		}
		
		.jumat-header {
			text-align: center;
			border-bottom: 2px solid #ffd700;
			padding-bottom: 10px;
			margin-bottom: 15px;
			flex-shrink: 0;
		}
		
		.jumat-header i {
			font-size: 2rem;
			color: #ffd700;
			margin-bottom: 5px;
		}
		
		.jumat-header h2 {
			font-size: 1.5rem;
			color: #ffd700;
			letter-spacing: 1px;
		}
		
		.jumat-header p {
			font-size: 0.7rem;
			opacity: 0.8;
			margin-top: 3px;
		}
		
		.info-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 15px;
			margin-bottom: 15px;
			flex-shrink: 0;
		}
		
		.info-item {
			background: rgba(0, 0, 0, 0.35);
			border-radius: 18px;
			padding: 20px 12px;
			text-align: center;
			transition: transform 0.3s ease;
			border: 1px solid rgba(255,215,0,0.2);
		}
		
		.info-item:hover {
			transform: translateY(-3px);
			background: rgba(0, 0, 0, 0.5);
		}
		
		.info-item i {
			font-size: 2.2rem;
			color: #ffd700;
			margin-bottom: 12px;
		}
		
		.info-item .label {
			font-size: 1rem;
			text-transform: uppercase;
			letter-spacing: 2px;
			opacity: 0.9;
			font-weight: 600;
			margin-bottom: 8px;
		}
		
		.info-item .value {
			font-size: 1.6rem;
			font-weight: 800;
			margin-top: 8px;
			color: #ffd700;
			word-break: break-word;
			line-height: 1.3;
		}
		
		.jumat-time-section {
			text-align: center;
			margin-top: 10px;
			margin-bottom: 5px;
			padding: 12px;
			background: rgba(0, 0, 0, 0.25);
			border-radius: 18px;
			flex-shrink: 0;
		}
		
		.jumat-time-section h3 {
			font-size: 1.2rem;
			color: #ffd700;
			margin-bottom: 8px;
		}
		
		.jumat-time {
			font-size: 2.5rem;
			font-weight: 800;
			color: #ffffff;
			background: rgba(0,0,0,0.3);
			display: inline-block;
			padding: 8px 25px;
			border-radius: 40px;
			letter-spacing: 1px;
		}
		
		.jumat-time i {
			color: #ffd700;
			margin-right: 8px;
		}
		
		.jadwal-mendatang-badge {
			background: #ffd700;
			color: #0a4d68;
			padding: 4px 12px;
			border-radius: 20px;
			font-size: 0.7rem;
			font-weight: bold;
			display: inline-block;
			margin-top: 8px;
		}
		
		.running-text-container {
			background: rgba(0, 0, 0, 0.4);
			border-radius: 8px;
			padding: 8px 15px;
			margin-top: 8px;
			margin-bottom: 5px;
			overflow: hidden;
			flex-shrink: 0;
		}
		
		.running-text {
			white-space: nowrap;
			animation: marquee 25s linear infinite;
			font-size: 0.9rem;
			letter-spacing: 0.5px;
			font-weight: 500;
		}
		
		.running-text i {
			margin-right: 8px;
			color: #ffd700;
		}
		
		@keyframes marquee {
			0% { transform: translateX(100%); }
			100% { transform: translateX(-100%); }
		}
		
		.footer {
			text-align: center;
			margin-top: 5px;
			padding-top: 5px;
			border-top: 1px solid rgba(255,255,255,0.15);
			font-size: 0.7rem;
			opacity: 0.7;
			flex-shrink: 0;
		}
		
		@media (max-width: 1024px) {
			.container { padding: 10px 25px 8px 25px; }
			.jumat-card { padding: 12px 20px; }
			.info-grid { gap: 12px; }
			.info-item { padding: 15px 10px; }
			.info-item i { font-size: 1.8rem; }
			.info-item .label { font-size: 0.85rem; }
			.info-item .value { font-size: 1.3rem; }
			.jumat-time { font-size: 2rem; padding: 6px 20px; }
		}
		
		@media (max-width: 768px) {
			.info-grid { grid-template-columns: repeat(2, 1fr); }
			.info-item .value { font-size: 1.2rem; }
			.jumat-time { font-size: 1.8rem; padding: 5px 15px; }
			.running-text { font-size: 0.8rem; }
		}
		
		.no-data {
			text-align: center;
			padding: 40px;
		}
		.no-data i {
			font-size: 3rem;
			opacity: 0.5;
			margin-bottom: 15px;
			display: block;
		}
		.no-data p {
			font-size: 1.2rem;
			opacity: 0.7;
		}
	</style>
</head>
<body>
	<div class="kaligrafi kaligrafi-allah">ﷲ</div>
	<div class="kaligrafi kaligrafi-muhammad">ﷺ</div>
	
	<div class="container">
		<div class="header">
			<h1><?php echo e($settings['nama_aplikasi'] ?? 'Masjid Al-Ikhlas'); ?></h1>
			<div class="datetime" id="datetime"></div>
		</div>
		<br>
		<div class="jumat-card">
			<div class="jumat-header">
				<i class="fas fa-mosque"></i>
				<h2>Jadwal Sholat Jumat</h2>
				<p>Informasi Imam, Khatib & Muadzin</p>
			</div>
			
			<?php
			$sholatJumat = isset($sholatJumat) ? $sholatJumat : null;
			?>
			
			<?php if($sholatJumat && isset($sholatJumat->tanggal)): ?>
			<?php
			// Format tanggal Indonesia dengan aman
			$tanggalObj = \Carbon\Carbon::parse($sholatJumat->tanggal);
			$today = \Carbon\Carbon::today('Asia/Jakarta');
			$isToday = $tanggalObj->isToday();
			$isMendatang = $tanggalObj->greaterThan($today);
			
			// Array untuk konversi ke Bahasa Indonesia
			$hariMap = [
			'Sunday' => 'Ahad',
			'Monday' => 'Senin',
			'Tuesday' => 'Selasa',
			'Wednesday' => 'Rabu',
			'Thursday' => 'Kamis',
			'Friday' => 'Jumat',
			'Saturday' => 'Sabtu'
			];
			$bulanMap = [
			'January' => 'Januari',
			'February' => 'Februari',
			'March' => 'Maret',
			'April' => 'April',
			'May' => 'Mei',
			'June' => 'Juni',
			'July' => 'Juli',
			'August' => 'Agustus',
			'September' => 'September',
			'October' => 'Oktober',
			'November' => 'November',
			'December' => 'Desember'
			];
			
			$hariInggris = $tanggalObj->format('l');
			$hari = isset($hariMap[$hariInggris]) ? $hariMap[$hariInggris] : $hariInggris;
			$tanggal = $tanggalObj->format('j');
			$bulanInggris = $tanggalObj->format('F');
			$bulan = isset($bulanMap[$bulanInggris]) ? $bulanMap[$bulanInggris] : $bulanInggris;
			$tahun = $tanggalObj->format('Y');
			$formattedDate = "$hari, $tanggal $bulan $tahun";
			?>
			<div class="info-grid">
				<div class="info-item">
					<i class="fas fa-calendar-alt"></i>
					<div class="label">Tanggal</div>
					<div class="value"><?php echo e($formattedDate); ?></div>
					<?php if($isToday): ?>
					<div class="jadwal-mendatang-badge" style="background: #28a745;"><i class="fas fa-clock"></i> Hari Ini</div>
					<?php elseif($isMendatang): ?>
					<div class="jadwal-mendatang-badge"><i class="fas fa-calendar-week"></i> Jadwal Jumat Mendatang</div>
					<?php endif; ?>
				</div>
				<div class="info-item">
					<i class="fas fa-user"></i>
					<div class="label">Imam</div>
					<div class="value"><?php echo e($sholatJumat->imam ?? 'Belum Ditetapkan'); ?></div>
				</div>
				<div class="info-item">
					<i class="fas fa-book"></i>
					<div class="label">Khatib</div>
					<div class="value"><?php echo e($sholatJumat->khatib ?? 'Belum Ditetapkan'); ?></div>
				</div>
				<div class="info-item">
					<i class="fas fa-microphone-alt"></i>
					<div class="label">Muadzin</div>
					<div class="value"><?php echo e($sholatJumat->muadzin ?? 'Belum Ditetapkan'); ?></div>
				</div>
			</div>
			
			
			<?php else: ?>
			<div class="no-data">
				<i class="fas fa-calendar-times"></i>
				<p>Belum ada jadwal Sholat Jumat untuk minggu mendatang</p>
			</div>
			<?php endif; ?>
		</div>
		
		<?php if(isset($settings['running_text']) && $settings['running_text']): ?>
		<div class="running-text-container">
			<div class="running-text">
				<i class="fas fa-bullhorn"></i> <?php echo e($settings['running_text']); ?>

			</div>
		</div>
		<?php endif; ?>
		
		<div class="footer">
			<?php echo isset($settings['footer']) ? $settings['footer'] : 'Hak Cipta © 2025 Ali Mochtar Development System | Masjid Al-Ikhlas'; ?>

		</div>
	</div>
	
	<script>
		function updateDateTime() {
			const now = new Date();
			
            // Array untuk hari dan bulan dalam Bahasa Indonesia
			const hariIndonesia = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
			const bulanIndonesia = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
			
			const hari = hariIndonesia[now.getDay()];
			const tanggal = now.getDate();
			const bulan = bulanIndonesia[now.getMonth()];
			const tahun = now.getFullYear();
			
			let jam = now.getHours();
			let menit = now.getMinutes();
			let detik = now.getSeconds();
			
            // Format jam, menit, detik dengan leading zero
			jam = jam.toString().padStart(2, '0');
			menit = menit.toString().padStart(2, '0');
			detik = detik.toString().padStart(2, '0');
			
			const formattedDateTime = `${hari}, ${tanggal} ${bulan} ${tahun} pukul ${jam}.${menit}.${detik}`;
			const datetimeElement = document.getElementById('datetime');
			if (datetimeElement) {
				datetimeElement.textContent = formattedDateTime;
			}
		}
		
        // Jalankan saat halaman加载
		if (document.getElementById('datetime')) {
			updateDateTime();
			setInterval(updateDateTime, 1000);
		}
	</script>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/jumat.blade.php ENDPATH**/ ?>