<!-- resources/views/pengumuman.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sistem Informasi Masjid - Pengumuman</title>
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
		
		/* Kaligrafi */
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
		
		/* Container */
		.container {
			position: relative;
			z-index: 1;
			height: 100vh;
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 20px 30px;
		}
		
		/* Header */
		.header {
			text-align: center;
			margin-bottom: 20px;
			flex-shrink: 0;
		}
		
		.header h1 {
			font-size: 2rem;
			background: linear-gradient(to right, #ffd700, #ffffff);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			letter-spacing: 1px;
		}
		
		.datetime {
			font-size: 0.9rem;
			background: rgba(0,0,0,0.3);
			display: inline-block;
			padding: 5px 15px;
			border-radius: 30px;
			margin-top: 5px;
		}
		
		/* Main Announcement Card - FULLSCREEN */
		.announcement-container {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 0;
			margin-bottom: 15px;
		}
		
		.announcement-card {
			background: rgba(0, 0, 0, 0.4);
			backdrop-filter: blur(10px);
			border-radius: 30px;
			padding: 40px 50px;
			border-left: 8px solid #ffd700;
			box-shadow: 0 20px 50px rgba(0,0,0,0.3);
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			animation: fadeIn 0.5s ease;
		}
		
		@keyframes fadeIn {
			from {
				opacity: 0;
				transform: scale(0.98);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}
		}
		
		/* Header Card */
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30px;
			padding-bottom: 15px;
			border-bottom: 2px solid rgba(255,215,0,0.3);
		}
		
		.card-header i {
			font-size: 2.5rem;
			color: #ffd700;
		}
		
		.date-badge {
			background: rgba(255, 215, 0, 0.2);
			color: #ffd700;
			padding: 8px 20px;
			border-radius: 40px;
			font-size: 1.1rem;
			font-weight: 600;
		}
		
		.date-badge i {
			font-size: 0.9rem;
			margin-right: 8px;
		}
		
		/* Announcement Content - TEKS BESAR */
		.announcement-content {
			font-size: 2rem;
			line-height: 1.5;
			font-weight: 600;
			color: #ffffff;
			text-align: center;
			word-break: break-word;
			padding: 20px;
		}
		
		/* Progress Indicator */
		.progress-container {
			flex-shrink: 0;
			margin-top: 10px;
			margin-bottom: 10px;
		}
		
		.progress-bar {
			height: 4px;
			background: rgba(255,255,255,0.2);
			border-radius: 4px;
			overflow: hidden;
		}
		
		.progress-fill {
			height: 100%;
			background: #ffd700;
			width: 0%;
			transition: width linear;
		}
		
		/* Indicator Dots */
		.indicator-container {
			display: flex;
			justify-content: center;
			gap: 12px;
			margin-top: 10px;
			flex-shrink: 0;
		}
		
		.indicator-dot {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background: rgba(255,255,255,0.3);
			transition: all 0.3s ease;
			cursor: pointer;
		}
		
		.indicator-dot.active {
			background: #ffd700;
			width: 25px;
			border-radius: 10px;
		}
		
		/* Running Text */
		.running-text-container {
			background: rgba(0, 0, 0, 0.4);
			border-radius: 8px;
			padding: 10px 15px;
			overflow: hidden;
			flex-shrink: 0;
		}
		
		.running-text {
			white-space: nowrap;
			animation: marquee 25s linear infinite;
			font-size: 0.85rem;
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
			font-size: 0.65rem;
			opacity: 0.6;
			flex-shrink: 0;
		}
		
		/* Responsive */
		@media (max-width: 1024px) {
			.container { padding: 15px 20px; }
			.announcement-card { padding: 30px 35px; }
			.announcement-content { font-size: 1.6rem; }
			.card-header i { font-size: 2rem; }
			.date-badge { font-size: 0.9rem; padding: 5px 15px; }
			.header h1 { font-size: 1.6rem; }
		}
		
		@media (max-width: 768px) {
			.announcement-content { font-size: 1.3rem; }
			.announcement-card { padding: 20px 25px; }
		}
		
		/* No Data */
		.no-data {
			text-align: center;
			padding: 50px;
		}
		.no-data i {
			font-size: 4rem;
			opacity: 0.5;
			margin-bottom: 20px;
			display: block;
		}
		.no-data p {
			font-size: 1.5rem;
			opacity: 0.7;
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
		
		<div class="announcement-container" id="announcementContainer">
			<!-- Konten akan diisi oleh JavaScript -->
			<div class="announcement-card" id="announcementCard">
				<div class="card-header">
					<i class="fas fa-bullhorn"></i>
					<span class="date-badge" id="announcementDate">
						<i class="fas fa-calendar-alt"></i> Memuat...
					</span>
				</div>
				<div class="announcement-content" id="announcementContent">
					Memuat pengumuman...
				</div>
			</div>
		</div>
		
		<!-- Progress Bar -->
		<div class="progress-container">
			<div class="progress-bar">
				<div class="progress-fill" id="progressFill"></div>
			</div>
		</div>
		
		<!-- Indicator Dots -->
		<div class="indicator-container" id="indicatorContainer">
			<!-- Dots akan diisi oleh JavaScript -->
		</div>
		
		@if($settings['running_text'] ?? false)
		<div class="running-text-container">
			<div class="running-text">
				<i class="fas fa-bullhorn"></i> {{ $settings['running_text'] }}
			</div>
		</div>
		@endif
		
		<div class="footer">
			{!! $settings['footer'] ?? 'Hak Cipta © 2025 Ali Mochtar Development System' !!}
		</div>
	</div>
	
	<script>
        // Data pengumuman dari server
		const announcements = @json($pengumuman);
        const displayDuration = 8000; // 8 detik per pengumuman
        let currentIndex = 0;
        let intervalId = null;
        let progressIntervalId = null;
        
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
        	document.getElementById('datetime').textContent = now.toLocaleString('id-ID', options);
        }
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        // Update display announcement
        function displayAnnouncement(index) {
        	if (!announcements.length) {
        		document.getElementById('announcementContent').innerHTML = '<i class="fas fa-inbox"></i> Belum ada pengumuman';
        		document.getElementById('announcementDate').innerHTML = '<i class="fas fa-calendar-alt"></i> -';
        		return;
        	}
        	
        	const item = announcements[index];
        	const date = new Date(item.tanggal);
        	const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        	
            // Update content dengan animasi fade
        	const card = document.getElementById('announcementCard');
        	card.style.animation = 'none';
            card.offsetHeight; // trigger reflow
            card.style.animation = 'fadeIn 0.5s ease';
            
            document.getElementById('announcementContent').innerHTML = item.isi;
            document.getElementById('announcementDate').innerHTML = `<i class="fas fa-calendar-alt"></i> ${formattedDate}`;
            
            // Update active dot
            updateActiveDot(index);
        }
        
        // Update active dot indicator
        function updateActiveDot(index) {
        	const dots = document.querySelectorAll('.indicator-dot');
        	dots.forEach((dot, i) => {
        		if (i === index) {
        			dot.classList.add('active');
        		} else {
        			dot.classList.remove('active');
        		}
        	});
        }
        
        // Create indicator dots
        function createIndicators() {
        	const container = document.getElementById('indicatorContainer');
        	container.innerHTML = '';
        	
        	if (!announcements.length) {
        		const dot = document.createElement('div');
        		dot.className = 'indicator-dot active';
        		container.appendChild(dot);
        		return;
        	}
        	
        	announcements.forEach((_, index) => {
        		const dot = document.createElement('div');
        		dot.className = 'indicator-dot';
        		if (index === currentIndex) dot.classList.add('active');
        		dot.addEventListener('click', () => {
                    // Reset progress
        			resetProgress();
                    // Change to selected announcement
        			currentIndex = index;
        			displayAnnouncement(currentIndex);
        			startProgress();
        		});
        		container.appendChild(dot);
        	});
        }
        
        // Progress bar animation
        function startProgress() {
        	if (progressIntervalId) clearInterval(progressIntervalId);
        	
        	const progressFill = document.getElementById('progressFill');
        	progressFill.style.width = '0%';
        	progressFill.style.transition = 'none';
            progressFill.offsetHeight; // trigger reflow
            progressFill.style.transition = `width ${displayDuration}ms linear`;
            
            setTimeout(() => {
            	progressFill.style.width = '100%';
            }, 10);
        }
        
        function resetProgress() {
        	const progressFill = document.getElementById('progressFill');
        	progressFill.style.transition = 'none';
        	progressFill.style.width = '0%';
        	if (progressIntervalId) clearInterval(progressIntervalId);
        }
        
        // Next announcement
        function nextAnnouncement() {
        	if (!announcements.length) return;
        	
        	currentIndex = (currentIndex + 1) % announcements.length;
        	displayAnnouncement(currentIndex);
        	startProgress();
        }
        
        // Start rotation
        function startRotation() {
        	if (intervalId) clearInterval(intervalId);
        	
        	if (announcements.length > 1) {
        		intervalId = setInterval(nextAnnouncement, displayDuration);
        		startProgress();
        	} else if (announcements.length === 1) {
                // Hanya 1 pengumuman, tidak perlu rotasi
        		const progressFill = document.getElementById('progressFill');
        		progressFill.style.width = '100%';
        		progressFill.style.background = '#ffd700';
        	}
        }
        
        // Initialize
        function init() {
        	createIndicators();
        	if (announcements.length) {
        		displayAnnouncement(0);
        		startRotation();
        	} else {
        		document.getElementById('announcementContent').innerHTML = `
                    <div class="no-data">
                        <i class="fas fa-inbox"></i>
                        <p>Belum ada pengumuman tersedia</p>
                    </div>
        		`;
        		document.getElementById('announcementDate').innerHTML = '<i class="fas fa-calendar-alt"></i> -';
        		const progressFill = document.getElementById('progressFill');
        		progressFill.style.width = '100%';
        		progressFill.style.background = '#6c757d';
        	}
        }
        
        init();
    </script>
</body>
</html>