
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<title>QRIS - Masjid Al-Ikhlas</title>
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
		
		/* Animasi background */
		@keyframes gradientShift {
			0% { background: linear-gradient(135deg, #0a4d68, #088395); }
			50% { background: linear-gradient(135deg, #088395, #0a4d68); }
			100% { background: linear-gradient(135deg, #0a4d68, #088395); }
		}
		
		body {
			animation: gradientShift 15s ease infinite;
		}
		
		/* Kaligrafi Background */
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
		
		.kaligrafi-allah {
			right: 30px;
		}
		
		.kaligrafi-muhammad {
			left: 30px;
		}
		
		/* Container Utama - Fullscreen */
		.container {
			position: relative;
			z-index: 1;
			height: 100vh;
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 15px 25px;
		}
		
		/* Header - Tetap di atas */
		.header {
			text-align: center;
			margin-bottom: 15px;
			flex-shrink: 0;
		}
		
		.header h1 {
			font-size: 1.8rem;
			background: linear-gradient(to right, #ffd700, #ffffff);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			letter-spacing: 1px;
			margin-bottom: 5px;
		}
		
		.datetime {
			font-size: 0.8rem;
			background: rgba(0,0,0,0.3);
			display: inline-block;
			padding: 3px 12px;
			border-radius: 20px;
		}
		
		/* Main Content - Area konten utama */
		.main-content {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 0;
			padding: 10px 0;
		}
		
		/* QRIS Card - Layout 2 Kolom */
		.qris-card {
			background: rgba(255, 255, 255, 0.12);
			backdrop-filter: blur(10px);
			border-radius: 20px;
			border: 2px solid rgba(255, 215, 0, 0.3);
			box-shadow: 0 10px 40px rgba(0,0,0,0.25);
			width: 100%;
			max-width: 1100px;
			overflow: hidden;
			transition: transform 0.3s ease, box-shadow 0.3s ease;
			animation: fadeInUp 0.6s ease-out;
		}
		
		.qris-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 15px 50px rgba(0,0,0,0.3);
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
		
		/* Header Card */
		.qris-header {
			background: linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2));
			padding: 15px 20px;
			text-align: center;
			border-bottom: 1px solid rgba(255,215,0,0.3);
		}
		
		.qris-header h2 {
			font-size: 1.4rem;
			font-weight: 600;
			color: #ffd700;
			letter-spacing: 1px;
		}
		
		.qris-header h2 i {
			margin-right: 10px;
			animation: pulse 2s ease infinite;
		}
		
		@keyframes pulse {
			0%, 100% { transform: scale(1); }
			50% { transform: scale(1.05); }
		}
		
		/* Body Card - Layout 2 Kolom */
		.qris-body {
			padding: 40px;
			display: flex;
			gap: 40px;
			flex-wrap: wrap;
		}
		
		/* Kolom Kiri - Informasi Rekening */
		.info-column {
			flex: 1;
			min-width: 250px;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		
		.qris-description {
			font-size: 0.95rem;
			line-height: 1.5;
			color: rgba(255,255,255,0.9);
			margin-bottom: 25px;
			text-align: left;
		}
		
		/* Bank Info */
		.bank-info {
			background: rgba(0, 0, 0, 0.35);
			border-radius: 15px;
			padding: 20px;
			text-align: left;
			border-left: 5px solid #ffd700;
			margin-bottom: 25px;
		}
		
		.bank-info h4 {
			color: #ffd700;
			margin-bottom: 15px;
			font-size: 1rem;
			display: flex;
			align-items: center;
			gap: 10px;
		}
		
		.bank-info h4 i {
			font-size: 1.1rem;
		}
		
		.bank-info p {
			margin: 10px 0;
			color: rgba(255,255,255,0.9);
			font-size: 0.9rem;
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 5px 0;
			border-bottom: 1px solid rgba(255,255,255,0.1);
		}
		
		.bank-info p:last-child {
			border-bottom: none;
		}
		
		.bank-info i {
			width: 25px;
			color: #ffd700;
			font-size: 0.9rem;
		}
		
		.bank-info strong {
			color: #ffd700;
			font-weight: 600;
		}
		
		/* Status Badge */
		.status-badge {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 10px 25px;
			border-radius: 30px;
			font-size: 0.85rem;
			font-weight: 600;
			background: rgba(0, 230, 118, 0.2);
			color: #00e676;
			border: 1px solid rgba(0,230,118,0.3);
			animation: blink 3s ease infinite;
			width: fit-content;
		}
		
		@keyframes blink {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.85; }
		}
		
		/* Kolom Kanan - QRIS Image */
		.qris-column {
			flex: 1;
			min-width: 250px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		
		.qris-image {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
		}
		
		.qris-image img {
			max-width: 320px;
			width: 100%;
			height: auto;
			border-radius: 20px;
			box-shadow: 0 10px 30px rgba(0,0,0,0.3);
			border: 3px solid rgba(255,215,0,0.3);
			transition: transform 0.3s ease, box-shadow 0.3s ease;
			cursor: pointer;
			background: white;
			padding: 10px;
		}
		
		.qris-image img:hover {
			transform: scale(1.02);
			box-shadow: 0 15px 40px rgba(0,0,0,0.4);
			border-color: #ffd700;
		}
		
		.scan-hint {
			margin-top: 15px;
			font-size: 0.7rem;
			color: rgba(255,215,0,0.8);
			display: flex;
			align-items: center;
			gap: 8px;
		}
		
		.scan-hint i {
			font-size: 0.8rem;
		}
		
		/* Running Text */
		.running-text-container {
			background: rgba(0, 0, 0, 0.35);
			border-radius: 8px;
			padding: 8px 12px;
			margin-top: 10px;
			overflow: hidden;
			flex-shrink: 0;
		}
		
		.running-text {
			white-space: nowrap;
			animation: marquee 25s linear infinite;
			font-size: 0.8rem;
			letter-spacing: 0.5px;
		}
		
		.running-text i {
			margin-right: 8px;
			color: #ffd700;
		}
		
		@keyframes marquee {
			0% { transform: translateX(100%); }
			100% { transform: translateX(-100%); }
		}
		
		/* Footer */
		.footer {
			text-align: center;
			margin-top: 10px;
			padding-top: 8px;
			border-top: 1px solid rgba(255,255,255,0.15);
			font-size: 0.6rem;
			opacity: 0.6;
			flex-shrink: 0;
		}
		
		/* Loading */
		.loading {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: rgba(0,0,0,0.85);
			backdrop-filter: blur(10px);
			color: white;
			padding: 15px 25px;
			border-radius: 10px;
			z-index: 9999;
			display: none;
			font-size: 0.9rem;
			border-left: 3px solid #ffd700;
		}
		
		/* Animasi fade out */
		.fade-out {
			animation: fadeOut 0.5s ease forwards;
		}
		
		@keyframes fadeOut {
			from { opacity: 1; }
			to { opacity: 0; }
		}
		
		/* Responsive untuk TV/Layar Besar (1920px+) */
		@media (min-width: 1920px) {
			.qris-card {
				max-width: 1300px;
			}
			.qris-header h2 {
				font-size: 1.8rem;
			}
			.qris-body {
				padding: 60px;
				gap: 60px;
			}
			.qris-image img {
				max-width: 450px;
			}
			.qris-description {
				font-size: 1.1rem;
			}
			.bank-info h4 {
				font-size: 1.2rem;
			}
			.bank-info p {
				font-size: 1rem;
			}
			.status-badge {
				font-size: 1rem;
				padding: 12px 30px;
			}
			.header h1 {
				font-size: 2.2rem;
			}
			.datetime {
				font-size: 1rem;
			}
		}
		
		/* Responsive untuk tablet */
		@media (max-width: 1024px) {
			.qris-body {
				padding: 30px;
				gap: 30px;
			}
			.qris-image img {
				max-width: 280px;
			}
			.bank-info p {
				font-size: 0.8rem;
			}
		}
		
		/* Responsive untuk mobile - jadikan 1 kolom */
		@media (max-width: 768px) {
			.container {
				padding: 10px 15px;
			}
			.qris-body {
				padding: 20px;
				flex-direction: column;
				gap: 25px;
			}
			.qris-image img {
				max-width: 250px;
			}
			.qris-description {
				font-size: 0.8rem;
				text-align: center;
			}
			.bank-info p {
				font-size: 0.75rem;
			}
			.bank-info {
				padding: 15px;
			}
			.status-badge {
				padding: 8px 20px;
				font-size: 0.75rem;
			}
			.kaligrafi {
				font-size: 3.5rem;
			}
			.kaligrafi-allah {
				right: 15px;
			}
			.kaligrafi-muhammad {
				left: 15px;
			}
			.header h1 {
				font-size: 1.4rem;
			}
		}
		
		/* Untuk layar sedang */
		@media (max-width: 900px) and (min-width: 769px) {
			.qris-body {
				flex-direction: column;
				gap: 30px;
			}
			.info-column {
				order: 1;
			}
			.qris-column {
				order: 2;
			}
			.qris-image img {
				max-width: 300px;
			}
		}
	</style>
</head>
<body>
	<!-- Kaligrafi Background -->
	<div class="kaligrafi kaligrafi-allah">ﷲ</div>
	<div class="kaligrafi kaligrafi-muhammad">ﷺ</div>
	
	<div class="container" id="mainContainer">
		<div class="header">
			<h1><?php echo e($settings['nama_aplikasi'] ?? 'Masjid Al-Ikhlas'); ?></h1>
			<div class="datetime" id="datetime"></div>
		</div>
		
		<div class="main-content">
			<div class="qris-card">
				<div class="qris-header">
					<h2>
						<i class="fas fa-qrcode"></i> 
						QRIS Donasi & Infak
					</h2>
				</div>
				<div class="qris-body">
					<?php if(isset($qris) && $qris): ?>
					<!-- KOLOM KIRI: Informasi Rekening -->
					<div class="info-column">
						<?php if($qris->keterangan): ?>
						<div class="qris-description">
							<i class="fas fa-info-circle" style="color: #ffd700; margin-right: 8px;"></i>
							<?php echo nl2br(e($qris->keterangan)); ?>

						</div>
						<?php endif; ?>
						
						<?php if($qris->bank || $qris->nomor_rekening || $qris->atas_nama): ?>
						<div class="bank-info">
							<h4>
								<i class="fas fa-university"></i> 
								Informasi Rekening
							</h4>
							<?php if($qris->bank): ?>
							<p>
								<i class="fas fa-building"></i> 
								<strong>Bank:</strong> <span style="margin-left: 5px;"><?php echo e($qris->bank); ?></span>
							</p>
							<?php endif; ?>
							<?php if($qris->nomor_rekening): ?>
							<p>
								<i class="fas fa-credit-card"></i> 
								<strong>No. Rekening:</strong> <span style="margin-left: 5px; font-family: monospace; font-size: 1.1rem;"><?php echo e($qris->nomor_rekening); ?></span>
							</p>
							<?php endif; ?>
							<?php if($qris->atas_nama): ?>
							<p>
								<i class="fas fa-user"></i> 
								<strong>Atas Nama:</strong> <span style="margin-left: 5px;"><?php echo e($qris->atas_nama); ?></span>
							</p>
							<?php endif; ?>
						</div>
						<?php endif; ?>
						
						<div class="status-badge">
							<i class="fas fa-check-circle"></i> 
							QRIS Aktif - Siap Digunakan
						</div>
					</div>
					
					<!-- KOLOM KANAN: QRIS Image -->
					<div class="qris-column">
						<div class="qris-image">
							<img src="<?php echo e($qris->gambar_url); ?>" alt="<?php echo e($qris->nama); ?>" id="qrisImage">
						</div>
						<div class="scan-hint">
							<i class="fas fa-phone-alt"></i>
							<i class="fas fa-qrcode"></i>
							<span>Scan QR Code untuk Donasi</span>
						</div>
					</div>
					<?php else: ?>
					<div style="text-align: center; padding: 40px; width: 100%;">
						<i class="fas fa-qrcode" style="font-size: 4rem; color: rgba(255,215,0,0.5); margin-bottom: 20px; display: block;"></i>
						<h3 style="color: #ffd700; font-size: 1.2rem;">Belum Ada QRIS Tersedia</h3>
						<p style="color: rgba(255,255,255,0.7); margin-top: 10px; font-size: 0.9rem;">Silakan hubungi admin untuk menambahkan QRIS donasi.</p>
					</div>
					<?php endif; ?>
				</div>
			</div>
		</div>
		
		<!-- Running Text -->
		<?php if($settings['running_text'] ?? false): ?>
		<div class="running-text-container">
			<div class="running-text">
				<i class="fas fa-bullhorn"></i> <?php echo e($settings['running_text']); ?>

			</div>
		</div>
		<?php endif; ?>
		
		<div class="footer">
			<?php echo $settings['footer'] ?? 'Hak Cipta © 2025 Ali Mochtar Development System'; ?>

		</div>
	</div>
	
	<div class="loading" id="loading">
		<i class="fas fa-spinner fa-spin"></i> Memperbarui data...
	</div>
	
	<script>
        // Update datetime
		function updateDateTime() {
			const now = new Date();
			const options = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				timeZone: 'Asia/Jakarta'
			};
			const datetimeElement = document.getElementById('datetime');
			if (datetimeElement) {
				datetimeElement.textContent = now.toLocaleString('id-ID', options);
			}
		}
		updateDateTime();
		setInterval(updateDateTime, 1000);
		
        // Auto-refresh untuk update QRIS
        let refreshInterval = 30000; // 30 detik
        let lastTimestamp = null;
        
        function fadeOutAndRefresh() {
        	const container = document.getElementById('mainContainer');
        	if (container) {
        		container.classList.add('fade-out');
        		setTimeout(() => {
        			window.location.reload();
        		}, 500);
        	} else {
        		window.location.reload();
        	}
        }
        
        async function checkForUpdates() {
        	try {
        		const response = await fetch('<?php echo e(route("data.timestamp")); ?>', {
        			method: 'GET',
        			headers: {
        				'Cache-Control': 'no-cache',
        				'Pragma': 'no-cache',
        				'X-Requested-With': 'XMLHttpRequest'
        			}
        		});
        		
        		if (!response.ok) {
        			throw new Error('Network response was not ok');
        		}
        		
        		const data = await response.json();
        		const newTimestamp = data.timestamp;
        		
        		if (lastTimestamp && newTimestamp && newTimestamp !== lastTimestamp) {
        			console.log('QRIS data updated, refreshing...');
        			fadeOutAndRefresh();
        		}
        		
        		lastTimestamp = newTimestamp;
        		
        	} catch (error) {
        		console.error('Error checking for updates:', error);
        	}
        }
        
        // Mulai auto-refresh jika QRIS tersedia
        <?php if(isset($qris) && $qris): ?>
        checkForUpdates();
        setInterval(checkForUpdates, refreshInterval);
        <?php endif; ?>
        
        // Fungsi untuk memperbesar gambar saat diklik
        const qrisImage = document.getElementById('qrisImage');
        if (qrisImage) {
        	qrisImage.addEventListener('click', function() {
        		this.style.transform = 'scale(1.05)';
        		setTimeout(() => {
        			this.style.transform = 'scale(1)';
        		}, 300);
        	});
        }
        
        // Cegah scrolling pada body
        document.body.addEventListener('touchmove', function(e) {
        	e.preventDefault();
        }, { passive: false });
    </script>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/qris/embed.blade.php ENDPATH**/ ?>