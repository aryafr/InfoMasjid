<!-- resources/views/keuangan-summary.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sistem Informasi Masjid - Ringkasan Keuangan</title>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
			padding: 15px 25px;
		}

		/* Header */
		.header {
			text-align: center;
			margin-bottom: 12px;
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
			margin-top: 3px;
		}

		/* Stats Cards - 3 kolom dengan warna kontras */
		.stats-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 15px;
			margin-bottom: 15px;
			flex-shrink: 0;
		}

		.stat-card {
			background: rgba(0, 0, 0, 0.35);
			backdrop-filter: blur(10px);
			border-radius: 12px;
			padding: 12px 15px;
			text-align: center;
			transition: transform 0.2s ease;
		}

		/* Warna Kontras untuk setiap card */
		.stat-card.income {
			border-left: 4px solid #00e676;
			border-right: 1px solid rgba(0,230,118,0.3);
			box-shadow: 0 0 15px rgba(0,230,118,0.1);
		}
		.stat-card.income i { color: #00e676; text-shadow: 0 0 5px rgba(0,230,118,0.5); }
		.stat-card.income .stat-value { color: #00e676; }

		.stat-card.expense {
			border-left: 4px solid #ff6b6b;
			border-right: 1px solid rgba(255,107,107,0.3);
			box-shadow: 0 0 15px rgba(255,107,107,0.1);
		}
		.stat-card.expense i { color: #ff6b6b; text-shadow: 0 0 5px rgba(255,107,107,0.5); }
		.stat-card.expense .stat-value { color: #ff6b6b; }

		.stat-card.balance {
			border-left: 4px solid #ffd700;
			border-right: 1px solid rgba(255,215,0,0.3);
			box-shadow: 0 0 15px rgba(255,215,0,0.1);
			background: linear-gradient(135deg, rgba(0,0,0,0.4), rgba(255,215,0,0.1));
		}
		.stat-card.balance i { color: #ffd700; text-shadow: 0 0 5px rgba(255,215,0,0.5); }
		.stat-card.balance .stat-value { color: #ffd700; }

		.stat-card i {
			font-size: 1.8rem;
			margin-bottom: 5px;
		}

		.stat-label {
			font-size: 0.7rem;
			text-transform: uppercase;
			letter-spacing: 1px;
			opacity: 0.8;
			color: #e0e0e0;
		}

		.stat-value {
			font-size: 1.3rem;
			font-weight: 700;
			margin-top: 5px;
			letter-spacing: 0.5px;
		}

		/* Chart & Transaction - 2 kolom */
		.dashboard-row {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 15px;
			flex: 1;
			min-height: 0;
		}

		.chart-container {
			background: rgba(0, 0, 0, 0.35);
			backdrop-filter: blur(10px);
			border-radius: 12px;
			padding: 12px;
			border: 1px solid rgba(255,215,0,0.2);
			display: flex;
			flex-direction: column;
		}

		.chart-container h3 {
			text-align: center;
			font-size: 0.9rem;
			margin-bottom: 8px;
			color: #ffd700;
			flex-shrink: 0;
		}

		.chart-wrapper {
			flex: 1;
			min-height: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		canvas {
			max-height: 100%;
			max-width: 100%;
		}

		.transactions-container {
			background: rgba(0, 0, 0, 0.35);
			backdrop-filter: blur(10px);
			border-radius: 12px;
			padding: 12px;
			border: 1px solid rgba(255,215,0,0.2);
			display: flex;
			flex-direction: column;
		}

		.transactions-container h3 {
			font-size: 0.9rem;
			margin-bottom: 8px;
			color: #ffd700;
			flex-shrink: 0;
		}

		.transaction-list {
			flex: 1;
			overflow-y: auto;
			min-height: 0;
		}

		.transaction-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px;
			border-bottom: 1px solid rgba(255,255,255,0.1);
		}

		.transaction-item:last-child {
			border-bottom: none;
		}

		.transaction-info {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.transaction-icon {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.9rem;
		}
		.transaction-icon.income { 
			background: rgba(0, 230, 118, 0.2); 
			color: #00e676;
			box-shadow: 0 0 5px rgba(0,230,118,0.3);
		}
		.transaction-icon.expense { 
			background: rgba(255, 107, 107, 0.2); 
			color: #ff6b6b;
			box-shadow: 0 0 5px rgba(255,107,107,0.3);
		}

		.transaction-desc { 
			font-size: 0.8rem; 
			font-weight: 500;
			color: #ffffff;
		}
		.transaction-date { 
			font-size: 0.65rem; 
			opacity: 0.7;
			color: #c0c0c0;
		}
		.transaction-amount { 
			font-size: 0.85rem; 
			font-weight: 700;
		}
		.transaction-amount.income { 
			color: #00e676;
			text-shadow: 0 0 2px rgba(0,230,118,0.3);
		}
		.transaction-amount.expense { 
			color: #ff6b6b;
			text-shadow: 0 0 2px rgba(255,107,107,0.3);
		}

		.footer {
			text-align: center;
			margin-top: 10px;
			padding-top: 6px;
			border-top: 1px solid rgba(255,255,255,0.15);
			font-size: 0.6rem;
			opacity: 0.6;
			flex-shrink: 0;
		}

		/* Scrollbar */
		.transaction-list::-webkit-scrollbar {
			width: 4px;
		}
		.transaction-list::-webkit-scrollbar-track {
			background: rgba(255,255,255,0.1);
			border-radius: 4px;
		}
		.transaction-list::-webkit-scrollbar-thumb {
			background: #ffd700;
			border-radius: 4px;
		}

		/* Responsive */
		@media (max-width: 1024px) {
			.container { padding: 12px 20px; }
			.stat-value { font-size: 1.1rem; }
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

		<!-- Stats Cards dengan Warna Kontras -->
		<div class="stats-grid">
			<div class="stat-card income">
				<i class="fas fa-arrow-down"></i>
				<div class="stat-label">Total Pemasukan</div>
				<div class="stat-value">Rp <?php echo e(number_format($totalPemasukan, 0, ',', '.')); ?></div>
			</div>
			<div class="stat-card expense">
				<i class="fas fa-arrow-up"></i>
				<div class="stat-label">Total Pengeluaran</div>
				<div class="stat-value">Rp <?php echo e(number_format($totalPengeluaran, 0, ',', '.')); ?></div>
			</div>
			<div class="stat-card balance">
				<i class="fas fa-wallet"></i>
				<div class="stat-label">Saldo Akhir</div>
				<div class="stat-value">Rp <?php echo e(number_format($saldo, 0, ',', '.')); ?></div>
			</div>
		</div>

		<div class="dashboard-row">
			<div class="chart-container">
				<h3><i class="fas fa-chart-pie"></i> Grafik Keuangan</h3>
				<div class="chart-wrapper">
					<canvas id="financeChart"></canvas>
				</div>
			</div>

			<div class="transactions-container">
				<h3><i class="fas fa-history"></i> Transaksi Terbaru</h3>
				<div class="transaction-list">
					<?php $__empty_1 = true; $__currentLoopData = $recentTransactions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
					<div class="transaction-item">
						<div class="transaction-info">
							<div class="transaction-icon <?php echo e($item->pemasukan > 0 ? 'income' : 'expense'); ?>">
								<i class="fas fa-<?php echo e($item->pemasukan > 0 ? 'arrow-down' : 'arrow-up'); ?>"></i>
							</div>
							<div>
								<div class="transaction-desc"><?php echo e(\Illuminate\Support\Str::limit($item->deskripsi, 30)); ?></div>
								<div class="transaction-date"><?php echo e(\Carbon\Carbon::parse($item->tanggal)->translatedFormat('d M Y')); ?></div>
							</div>
						</div>
						<div class="transaction-amount <?php echo e($item->pemasukan > 0 ? 'income' : 'expense'); ?>">
							<?php echo e($item->pemasukan > 0 ? '+' : '-'); ?> Rp <?php echo e(number_format($item->pemasukan > 0 ? $item->pemasukan : $item->pengeluaran, 0, ',', '.')); ?>

						</div>
					</div>
					<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
					<div class="text-center" style="padding: 30px;">
						<i class="fas fa-inbox fa-2x" style="opacity: 0.5; color: #ffd700;"></i>
						<p style="margin-top: 10px; color: #ccc;">Belum ada transaksi</p>
					</div>
					<?php endif; ?>
				</div>
			</div>
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
				timeZone: 'Asia/Jakarta'
			};
			document.getElementById('datetime').textContent = now.toLocaleString('id-ID', options);
		}
		updateDateTime();
		setInterval(updateDateTime, 1000);

        // Chart dengan warna kontras
		const ctx = document.getElementById('financeChart').getContext('2d');
		new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: ['Pemasukan', 'Pengeluaran'],
				datasets: [{
					data: [<?php echo e($totalPemasukan); ?>, <?php echo e($totalPengeluaran); ?>],
					backgroundColor: ['#00e676', '#ff6b6b'],
					borderColor: '#ffffff',
					borderWidth: 2,
					hoverOffset: 10
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				cutout: '60%',
				plugins: {
					legend: {
						position: 'bottom',
						labels: { 
							color: '#ffffff', 
							font: { size: 11, weight: 'bold' },
							padding: 10
						}
					},
					tooltip: {
						callbacks: {
							label: function(context) {
								let label = context.label || '';
								let value = context.raw || 0;
								let total = context.dataset.data.reduce((a, b) => a + b, 0);
								let percentage = ((value / total) * 100).toFixed(1);
								return `${label}: Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
							}
						}
					}
				}
			}
		});
	</script>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/keuangan-summary.blade.php ENDPATH**/ ?>