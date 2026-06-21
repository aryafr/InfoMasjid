<!-- resources/views/utama.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sistem Informasi Masjid</title>
	<link rel="icon" type="image/x-icon" href="<?php echo e(asset($settings['favicon'] ? 'storage/' . $settings['favicon'] : 'favicon.ico')); ?>">
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
			--success-color: #28a745;
			--info-color: #17a2b8;
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
			animation: gradientShift 10s ease infinite;
		}

		@keyframes gradientShift {
			0% { background: linear-gradient(135deg, #0a4d68, #088395); }
			50% { background: linear-gradient(135deg, #088395, #0a4d68); }
			100% { background: linear-gradient(135deg, #0a4d68, #088395); }
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
			text-shadow: 3px 3px 0 rgba(0,0,0,0.2), 6px 6px 0 rgba(0,0,0,0.1);
			opacity: 0.8;
			animation: kaligrafiFade 5s ease infinite;
		}

		.kaligrafi:hover {
			opacity: 1;
			transform: rotateY(360deg);
			transition: transform 1s ease, opacity 0.3s ease;
		}

		@keyframes kaligrafiFade {
			0%, 100% { opacity: 0.8; }
			50% { opacity: 0.5; }
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
			font-size: 4rem;
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
			font-size: 2rem;
			margin-top: 15px;
			background: rgba(0, 0, 0, 0.25);
			display: inline-block;
			padding: 10px 25px;
			border-radius: 30px;
			font-weight: 500;
			border: 1px solid rgba(255, 255, 255, 0.2);
			animation: pulse 1s ease infinite;
		}

		@keyframes pulse {
			0%, 100% { transform: scale(1); }
			50% { transform: scale(1.02); }
		}

		.running-text {
			font-size: 1.8rem;
			margin-top: 20px;
			background: rgba(0, 0, 0, 0.35);
			padding: 15px 25px;
			border-radius: 8px;
			border-left: 5px solid var(--secondary-color);
			max-width: 90%;
			margin-left: auto;
			margin-right: auto;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
			animation: fadeInOut 10s ease infinite;
		}

		@keyframes fadeInOut {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.7; }
		}

		.main-content {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
		}

		.jadwal-sholat {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.jadwal-sholat h2 {
			font-size: 2.5rem;
			margin-bottom: 20px;
			padding-bottom: 12px;
			position: relative;
			color: var(--secondary-color);
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.jadwal-sholat h2 i {
			animation: spin 5s linear infinite;
		}

		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}

		.jadwal-sholat h2:after {
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

		.sholat-list {
			display: flex;
			justify-content: center;
			gap: 20px;
			width: 100%;
			padding: 10px;
			overflow-x: auto;
			scrollbar-width: thin;
			scrollbar-color: var(--secondary-color) rgba(0, 0, 0, 0.2);
		}

		.sholat-card {
			background: rgba(255, 255, 255, 0.1);
			border-radius: 15px;
			padding: 20px;
			backdrop-filter: blur(12px);
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
			border: 2px solid rgba(255, 215, 0, 0.3);
			min-width: 180px;
			text-align: center;
			transition: transform 0.4s ease, box-shadow 0.4s ease;
			animation: fadeIn 1s ease-out forwards;
			perspective: 1000px;
		}

		.sholat-card:hover {
			transform: translateY(-10px) rotateX(5deg);
			box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
		}

		.sholat-card.active {
			border: 2px solid var(--success-color);
			animation: pulse 2s ease infinite;
		}

		.sholat-card i {
			font-size: 1.8rem;
			color: var(--secondary-color);
			margin-bottom: 10px;
			display: block;
			animation: spin 5s linear infinite;
		}

		.sholat-card .nama-sholat {
			font-size: 1.8rem;
			font-weight: 600;
			color: var(--text-light);
		}

		.sholat-card .waktu-sholat {
			font-size: 2rem;
			font-weight: 500;
			color: var(--secondary-color);
		}

		.footer {
			text-align: center;
			font-size: 1.2rem;
			margin-top: 25px;
			color: rgba(255, 255, 255, 0.8);
			padding: 15px;
			background: rgba(0, 0, 0, 0.25);
			border-radius: 8px;
			animation: fadeInOut 10s ease infinite;
		}

		/* Auto-Update Status */
		.auto-update-status {
			position: fixed;
			bottom: 20px;
			left: 20px;
			background: rgba(0, 0, 0, 0.6);
			backdrop-filter: blur(5px);
			padding: 8px 15px;
			border-radius: 30px;
			font-size: 0.9rem;
			border-left: 3px solid var(--info-color);
			z-index: 1000;
			display: flex;
			align-items: center;
			gap: 8px;
		}

		.auto-update-status i {
			color: var(--info-color);
			animation: spin 3s linear infinite;
		}

		.auto-update-status .badge {
			background: var(--info-color);
			color: white;
			padding: 3px 8px;
			border-radius: 12px;
			font-size: 0.7rem;
			margin-left: 5px;
		}

		.auto-update-status.active i {
			color: var(--success-color);
		}

		.auto-update-status.active .badge {
			background: var(--success-color);
		}

		@keyframes fadeIn {
			from { opacity: 0; transform: translateY(30px); }
			to { opacity: 1; transform: translateY(0); }
		}

		@media (max-width: 1366px) {
			.header h1 { font-size: 3.5rem; }
			.kaligrafi { font-size: 4rem; }
			.datetime { font-size: 1.8rem; }
			.running-text { font-size: 1.6rem; }
			.jadwal-sholat h2 { font-size: 2.2rem; }
			.sholat-card .nama-sholat { font-size: 1.6rem; }
			.sholat-card .waktu-sholat { font-size: 1.8rem; }
			.sholat-card { min-width: 160px; }
			.auto-update-status { bottom: 10px; left: 10px; }
		}

		@media (max-width: 1024px) {
			.container { max-width: 90%; }
			.kaligrafi { font-size: 3.5rem; }
			.sholat-list { gap: 15px; }
			.sholat-card { min-width: 140px; }
		}

		@media (max-width: 768px) {
			.header h1 { font-size: 2.8rem; }
			.kaligrafi {
				font-size: 3rem;
				top: 10px;
			}
			.kaligrafi-allah { right: 15px; }
			.kaligrafi-muhammad { left: 15px; }
			.datetime { font-size: 1.6rem; padding: 8px 15px; }
			.running-text {
				font-size: 1.4rem;
				max-width: 95%;
				padding: 10px 15px;
			}
			.jadwal-sholat h2 { font-size: 2rem; }
			.sholat-card .nama-sholat { font-size: 1.4rem; }
			.sholat-card .waktu-sholat { font-size: 1.6rem; }
			.sholat-card { min-width: 120px; padding: 15px; }
			.footer { font-size: 1rem; }
		}
	</style>
</head>
<body>
	<div class="kaligrafi kaligrafi-allah">ﷲ</div>
	<div class="kaligrafi kaligrafi-muhammad">ﷺ</div>

	<!-- Auto-Update Status -->
	<?php if($settings->auto_update_jadwal ?? false): ?>
	<div class="auto-update-status active" id="autoUpdateStatus">
		<i class="fas fa-sync-alt fa-spin"></i>
		<span>Auto-Update Aktif</span>
		<span class="badge"><?php echo e($settings->auto_update_city ?? 'Jakarta'); ?></span>
	</div>
	<?php else: ?>
	<div class="auto-update-status" id="autoUpdateStatus">
		<i class="fas fa-clock"></i>
		<span>Update Manual</span>
	</div>
	<?php endif; ?>

	<div class="container">
		<div class="header">
			<h1 id="nama-masjid"><?php echo e($settings['nama_aplikasi'] ?? 'Masjid Al-Ikhlas'); ?></h1>
			<div class="datetime" id="datetime"></div>
			<?php if($settings['running_text']): ?>
			<marquee class="running-text"><?php echo e($settings['running_text']); ?></marquee>
			<?php endif; ?>
		</div>
		<div class="main-content">
			<div class="jadwal-sholat">
				<h2><i class="fas fa-mosque"></i> Jadwal Sholat</h2>
				<div class="sholat-list">
					<?php
					$now = \Carbon\Carbon::now('Asia/Jakarta');
					$currentHour = $now->format('H:i');
					?>
					<?php $__currentLoopData = $jadwalSholat; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $jadwal): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
					<div class="sholat-card <?php echo e(\Carbon\Carbon::parse($jadwal->waktu)->format('H:i') <= $currentHour && \Carbon\Carbon::parse($jadwal->waktu)->addMinutes(30)->format('H:i') >= $currentHour ? 'active' : ''); ?>">
						<i class="fas fa-mosque"></i>
						<div class="nama-sholat"><?php echo e($jadwal->nama_sholat); ?></div>
						<div class="waktu-sholat"><?php echo e(\Carbon\Carbon::parse($jadwal->waktu)->format('H:i')); ?></div>
					</div>
					<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
				</div>
			</div>
		</div>
		<div class="footer">
			<?php echo $settings['footer'] ?? 'Hak Cipta © 2025 Ali Mochtar Development System'; ?>

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

        // Auto-refresh dengan notifikasi (sama seperti di welcome)
		document.addEventListener('DOMContentLoaded', function() {
			const marquee = document.querySelector('marquee');
			if (marquee) {
				marquee.style.transition = 'all 0.5s ease';
				marquee.addEventListener('animationiteration', () => {
					marquee.stop();
					setTimeout(() => marquee.start(), 5000);
				});
			}

			let lastTimestamp = null;
			let refreshInterval = 30000;
			let failedAttempts = 0;
			const maxFailedAttempts = 5;

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
					
                    // Update status auto-update
					const statusDiv = document.getElementById('autoUpdateStatus');
					if (statusDiv) {
						if (data.auto_update_status) {
							statusDiv.className = 'auto-update-status active';
							statusDiv.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Auto-Update Aktif</span><span class="badge">' + data.auto_update_location + '</span>';
						}
					}
					
					failedAttempts = 0;
					
					if (lastTimestamp && newTimestamp && newTimestamp !== lastTimestamp) {
						console.log('Data updated:', data.updated_data);
						showUpdateNotification(data.updated_data);
						
						setTimeout(() => {
							window.location.reload();
						}, 2000);
					}
					
					lastTimestamp = newTimestamp;
					
				} catch (error) {
					console.error('Error checking for updates:', error);
					failedAttempts++;
					
					if (failedAttempts >= maxFailedAttempts) {
						refreshInterval = 60000;
					}
				}
			}

			function showUpdateNotification(updatedData) {
				const notification = document.createElement('div');
				notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #0d6e6e, #088395);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 9999;
                    animation: slideInRight 0.5s ease;
                    border-left: 4px solid #ffd700;
				`;
				
				const dataList = updatedData.map(item => {
					return item.replace('_', ' ').replace('jadwal sholat', 'Jadwal Sholat');
				}).join(', ');
				
				notification.innerHTML = `
                    <i class="fas fa-sync-alt fa-spin" style="margin-right: 10px;"></i>
                    <strong>Data Diperbarui!</strong><br>
                    <small>${dataList} telah diupdate. Memuat ulang...</small>
				`;
				
				document.body.appendChild(notification);
				
				setTimeout(() => {
					notification.style.animation = 'slideOutRight 0.5s ease';
					setTimeout(() => notification.remove(), 500);
				}, 1800);
			}

			const style = document.createElement('style');
			style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
			`;
			document.head.appendChild(style);

			checkForUpdates();
			setInterval(checkForUpdates, refreshInterval);

			document.addEventListener('visibilitychange', function() {
				if (document.hidden) {
					refreshInterval = 60000;
				} else {
					refreshInterval = 30000;
					checkForUpdates();
				}
			});
		});
	</script>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\utama.blade.php ENDPATH**/ ?>