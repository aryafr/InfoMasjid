<!-- resources/views/jadwal_sholat/export_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Export Jadwal Sholat</title>
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
			border-bottom: 2px solid #4CAF50;
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
		}
		th {
			background-color: #4CAF50;
			color: white;
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
		.badge {
			display: inline-block;
			padding: 3px 8px;
			border-radius: 4px;
			font-size: 11px;
			font-weight: bold;
		}
		.badge-success {
			background-color: #28a745;
			color: white;
		}
		.badge-warning {
			background-color: #ffc107;
			color: #333;
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>Data Jadwal Sholat</h1>
		<p><?php echo e(\App\Models\AppSetting::first()->nama_aplikasi ?? 'Masjid Digital'); ?></p>
		<p>Tanggal Export: <?php echo e(\Carbon\Carbon::now()->format('d F Y H:i:s')); ?> WIB</p>
	</div>

	<table>
		<thead>
			<tr>
				<th width="30">No</th>
				<th>Nama Sholat</th>
				<th>Waktu</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			<?php $__currentLoopData = $jadwal; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
			<?php
			$now = \Carbon\Carbon::now('Asia/Jakarta');
			$waktuSholat = \Carbon\Carbon::parse($item->waktu);
			$isNext = $waktuSholat->format('H:i') >= $now->format('H:i');
			?>
			<tr>
				<td><?php echo e($index + 1); ?></td>
				<td><strong><?php echo e($item->nama_sholat); ?></strong></td>
				<td><?php echo e(\Carbon\Carbon::parse($item->waktu)->format('H:i')); ?> WIB</td>
				<td>
					<?php if($isNext): ?>
					<span class="badge badge-warning">Mendatang</span>
					<?php else: ?>
					<span class="badge badge-success">Telah Berlalu</span>
					<?php endif; ?>
				</td>
			</tr>
			<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
		</tbody>
	</table>

	<div class="footer">
		<p>Dicetak oleh sistem <?php echo e(\App\Models\AppSetting::first()->nama_aplikasi ?? 'Masjid Digital'); ?></p>
		<p>&copy; <?php echo e(date('Y')); ?> - Hak Cipta Dilindungi</p>
	</div>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\jadwal_sholat\export_pdf.blade.php ENDPATH**/ ?>