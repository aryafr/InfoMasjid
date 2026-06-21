<!-- resources/views/rotator.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sistem Informasi Masjid - Rotating Display</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: 'Poppins', sans-serif;
			overflow: hidden;
		}

		.iframe-container {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border: none;
		}

		iframe {
			width: 100%;
			height: 100%;
			border: none;
			transition: opacity 0.5s ease-in-out;
		}

		.loading-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(135deg, #0a4d68, #088395);
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1000;
			transition: opacity 0.5s ease;
		}

		.loading-spinner {
			width: 50px;
			height: 50px;
			border: 4px solid rgba(255, 255, 255, 0.3);
			border-top: 4px solid #ffd700;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}

		.page-indicator {
			position: fixed;
			bottom: 20px;
			right: 20px;
			background: rgba(0, 0, 0, 0.7);
			backdrop-filter: blur(10px);
			padding: 8px 16px;
			border-radius: 30px;
			font-size: 0.9rem;
			color: white;
			z-index: 1001;
			font-family: monospace;
			display: flex;
			align-items: center;
			gap: 10px;
			border-left: 3px solid #ffd700;
		}

		.page-indicator .page-name {
			font-weight: bold;
			color: #ffd700;
		}

		.page-indicator .countdown {
			background: rgba(255, 255, 255, 0.2);
			padding: 2px 8px;
			border-radius: 20px;
			font-size: 0.8rem;
		}

		.page-indicator button {
			background: rgba(255, 215, 0, 0.3);
			border: none;
			color: white;
			padding: 4px 10px;
			border-radius: 20px;
			cursor: pointer;
			transition: all 0.3s ease;
		}

		.page-indicator button:hover {
			background: rgba(255, 215, 0, 0.6);
			transform: scale(1.05);
		}

		.settings-panel {
			position: fixed;
			bottom: 20px;
			left: 20px;
			background: rgba(0, 0, 0, 0.7);
			backdrop-filter: blur(10px);
			padding: 5px 12px;
			border-radius: 20px;
			font-size: 0.7rem;
			color: rgba(255, 255, 255, 0.7);
			z-index: 1001;
			cursor: pointer;
			transition: all 0.3s ease;
		}

		.settings-panel:hover {
			background: rgba(0, 0, 0, 0.9);
			transform: scale(1.05);
		}

		.auto-update-notification {
			position: fixed;
			top: 20px;
			right: 20px;
			background: rgba(0, 0, 0, 0.8);
			backdrop-filter: blur(10px);
			padding: 10px 20px;
			border-radius: 8px;
			color: #ffd700;
			font-size: 0.8rem;
			z-index: 1002;
			transform: translateX(150%);
			transition: transform 0.3s ease;
			border-left: 3px solid #ffd700;
		}

		.auto-update-notification.show {
			transform: translateX(0);
		}

		@media (max-width: 768px) {
			.page-indicator {
				bottom: 10px;
				right: 10px;
				padding: 5px 12px;
				font-size: 0.75rem;
			}
			.settings-panel {
				bottom: 10px;
				left: 10px;
				font-size: 0.6rem;
			}
		}
	</style>
</head>
<body>
	<div class="loading-overlay" id="loadingOverlay">
		<div class="loading-spinner"></div>
	</div>

	<div class="page-indicator" id="pageIndicator">
		<span>📄 Halaman:</span>
		<span class="page-name" id="pageName">Memuat...</span>
		<span class="countdown" id="countdown">--s</span>
		<button onclick="skipToNext()">⏩ Skip</button>
	</div>



	<div class="auto-update-notification" id="notification">
		<i class="fas fa-sync-alt"></i> Pengaturan diperbarui, memuat ulang...
	</div>

	<div class="iframe-container">
		<iframe id="contentFrame" src="" title="Rotating Content"></iframe>
	</div>

	<script>
        // Data awal dari server
		let rotationInterval = <?php echo e($rotationInterval); ?>;
		let rotationEnabled = <?php echo e($rotationEnabled ? 'true' : 'false'); ?>;
		let pages = <?php echo json_encode($rotationPages, 15, 512) ?>;

        // Filter halaman yang aktif
		let activePages = pages.filter(page => page.active === true);

		let currentIndex = 0;
		let countdown = rotationInterval;
		let countdownIntervalId = null;
		let isLoading = false;
		let checkIntervalId = null;

        // Fungsi untuk memuat halaman
		function loadPage(index) {
			if (isLoading) return;

			isLoading = true;
			const iframe = document.getElementById('contentFrame');
			const loadingOverlay = document.getElementById('loadingOverlay');
			const pageName = document.getElementById('pageName');

			loadingOverlay.style.display = 'flex';

			if (activePages[index] && activePages[index].name) {
				pageName.textContent = activePages[index].name;
			}

			if (activePages[index] && activePages[index].url) {
				const routeName = activePages[index].url;
				iframe.src = `/${routeName}`;
			}

			resetCountdown();
		}

        // Fungsi untuk reset countdown
		function resetCountdown() {
			if (countdownIntervalId) {
				clearInterval(countdownIntervalId);
			}

			countdown = rotationInterval;
			updateCountdownDisplay();

			if (rotationEnabled && activePages.length > 1) {
				countdownIntervalId = setInterval(() => {
					if (countdown > 0 && !isLoading) {
						countdown--;
						updateCountdownDisplay();

						if (countdown === 0) {
							nextPage();
						}
					}
				}, 1000);
			}
		}

        // Update tampilan countdown
		function updateCountdownDisplay() {
			const countdownEl = document.getElementById('countdown');
			if (countdownEl) {
				countdownEl.textContent = `${countdown}s`;

				if (countdown <= 3) {
					countdownEl.style.background = '#dc3545';
					countdownEl.style.animation = 'pulse 0.5s ease infinite';
				} else {
					countdownEl.style.background = 'rgba(255, 255, 255, 0.2)';
					countdownEl.style.animation = 'none';
				}
			}
		}

        // Pindah ke halaman berikutnya
		function nextPage() {
			if (isLoading || !rotationEnabled || activePages.length <= 1) return;

			currentIndex = (currentIndex + 1) % activePages.length;
			loadPage(currentIndex);
		}

		function skipToNext() {
			if (isLoading || !rotationEnabled || activePages.length <= 1) return;
			nextPage();
		}

		function openSettings() {
			window.open('/rotation', '_blank');
		}

        // Tampilkan notifikasi
		function showNotification(message) {
			const notification = document.getElementById('notification');
			notification.innerHTML = `<i class="fas fa-sync-alt fa-spin"></i> ${message}`;
			notification.classList.add('show');

			setTimeout(() => {
				notification.classList.remove('show');
			}, 3000);
		}

        // Ambil pengaturan terbaru dari server
		async function fetchLatestSettings() {
			try {
				const response = await fetch('/rotation-settings?_=' + Date.now());
				const data = await response.json();

				let hasChanges = false;

                // Cek apakah ada perubahan interval
				if (data.interval !== rotationInterval) {
					rotationInterval = data.interval;
					document.getElementById('intervalDisplay').textContent = rotationInterval;
					hasChanges = true;
					showNotification(`Interval berubah menjadi ${rotationInterval} detik`);
				}

                // Cek apakah ada perubahan status enabled
				if (data.enabled !== rotationEnabled) {
					rotationEnabled = data.enabled;
					hasChanges = true;
					showNotification(rotationEnabled ? 'Rotasi diaktifkan' : 'Rotasi dinonaktifkan');
				}

                // Cek apakah ada perubahan halaman aktif
				const newPages = data.pages;
				const newActivePages = newPages.filter(page => page.active === true);
				const oldActiveUrls = activePages.map(p => p.url).sort().join(',');
				const newActiveUrls = newActivePages.map(p => p.url).sort().join(',');

				if (oldActiveUrls !== newActiveUrls) {
					pages = newPages;
					activePages = newActivePages;
					hasChanges = true;

                    // Reset index jika perlu
					if (currentIndex >= activePages.length) {
						currentIndex = 0;
					}

                    // Jika tidak ada halaman aktif, gunakan default
					if (activePages.length === 0) {
						activePages = [{url: 'welcome-embed', name: 'Dashboard Lengkap', active: true}];
					}

					showNotification(`Halaman yang ditampilkan: ${activePages.length} halaman`);
				}

                // Jika ada perubahan, reload halaman saat ini
				if (hasChanges && !isLoading) {
                    // Reset timer
					if (countdownIntervalId) {
						clearInterval(countdownIntervalId);
						countdownIntervalId = null;
					}

                    // Reload halaman saat ini dengan pengaturan baru
					if (activePages.length > 0 && currentIndex < activePages.length) {
						loadPage(currentIndex);
					} else if (activePages.length > 0) {
						currentIndex = 0;
						loadPage(0);
					}

					resetCountdown();
				}

			} catch (error) {
				console.error('Error fetching rotation settings:', error);
			}
		}

        // Event listener untuk iframe
		document.getElementById('contentFrame').addEventListener('load', function() {
			setTimeout(() => {
				const loadingOverlay = document.getElementById('loadingOverlay');
				loadingOverlay.style.display = 'none';
				isLoading = false;
				if (rotationEnabled && activePages.length > 1) {
					resetCountdown();
				}
			}, 500);
		});

		document.getElementById('contentFrame').addEventListener('error', function() {
			console.error('Failed to load page');
			isLoading = false;
			const loadingOverlay = document.getElementById('loadingOverlay');
			loadingOverlay.style.display = 'none';

			setTimeout(() => {
				if (activePages.length > 0) {
					loadPage(currentIndex);
				}
			}, 5000);
		});

        // Keyboard shortcut
		document.addEventListener('keydown', function(e) {
			if (e.key === 'ArrowRight') {
				nextPage();
			} else if (e.key === ' ' || e.key === 'Space') {
				e.preventDefault();
				skipToNext();
			} else if (e.key === 's' || e.key === 'S') {
				openSettings();
			}
		});

        // Cek pengaturan setiap 5 detik (lebih cepat untuk responsif)
		setInterval(fetchLatestSettings, 5000);

        // Mulai rotasi
		if (activePages.length > 0) {
			loadPage(0);
		} else {
			document.getElementById('pageName').textContent = 'Tidak ada halaman';
		}

		const style = document.createElement('style');
		style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
		`;
		document.head.appendChild(style);
	</script>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\rotator.blade.php ENDPATH**/ ?>