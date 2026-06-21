<!-- resources/views/welcome.blade.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Informasi Masjid</title>
    <link rel="icon" type="image/x-icon" href="<?php echo e(asset(isset($settings['favicon']) && $settings['favicon'] ? 'storage/' . $settings['favicon'] : 'favicon.ico')); ?>">
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
            --danger-color: #dc3545;
            --info-color: #17a2b8;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
            background: var(--bg-gradient);
            color: var(--text-light);
            overflow: hidden;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
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
            position: relative;
        }

        .header h1 {
            font-size: 3rem;
            margin: 0;
            letter-spacing: 1px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            background: linear-gradient(to right, #ffd700, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding: 0 20px;
        }
        
        .datetime {
            font-size: 1.5rem;
            margin-top: 10px;
            background: rgba(0, 0, 0, 0.2);
            display: inline-block;
            padding: 8px 20px;
            border-radius: 30px;
            font-weight: 500;
            animation: pulse 1s ease infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        .running-text {
            font-size: 1.4rem;
            margin-top: 15px;
            background: rgba(0, 0, 0, 0.3);
            padding: 12px 20px;
            border-radius: 5px;
            border-left: 4px solid var(--secondary-color);
            max-width: 80%;
            margin-left: auto;
            margin-right: auto;
            animation: fadeInOut 10s ease infinite;
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .main-content {
            display: flex;
            flex: 1;
            gap: 20px;
            flex-direction: row;
            align-items: stretch;
        }
        
        .panel {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .panel:hover {
            transform: translateY(-5px) rotateX(5deg);
            box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
        }
        
        .jadwal-sholat h2, .sholat-jumat h2, .pengumuman h2, .keuangan h2 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            padding-bottom: 10px;
            position: relative;
            color: var(--secondary-color);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .jadwal-sholat h2 i, .sholat-jumat h2 i, .pengumuman h2 i, .keuangan h2 i {
            animation: spin 5s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .jadwal-sholat h2:after, .sholat-jumat h2:after, .pengumuman h2:after, .keuangan h2:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 50px;
            height: 3px;
            background: var(--secondary-color);
            border-radius: 3px;
        }
        
        .jadwal-sholat table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 1.1rem;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .jadwal-sholat th, .jadwal-sholat td {
            padding: 10px;
            text-align: left;
        }
        
        .jadwal-sholat th {
            background: var(--secondary-color);
            color: var(--accent-color);
            font-weight: 600;
        }
        
        .jadwal-sholat tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .jadwal-sholat tr:nth-child(odd) {
            background: rgba(0, 0, 0, 0.1);
        }
        
        .jadwal-sholat tr:hover {
            background: rgba(255, 215, 0, 0.1);
        }
        
        .jadwal-sholat tr.active {
            border: 2px solid var(--success-color);
            animation: pulse 2s ease infinite;
        }
        
        .sholat-jumat .card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid var(--secondary-color);
            transition: all 0.3s ease;
            animation: fadeIn 0.6s ease-out;
        }
        
        .sholat-jumat .card:hover {
            transform: scale(1.02) rotateX(5deg);
            background: rgba(255, 255, 255, 0.15);
        }
        
        .sholat-jumat .card p {
            margin: 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.1rem;
        }
        
        .sholat-jumat .card p i {
            color: var(--secondary-color);
            transition: transform 0.3s ease;
        }
        
        .sholat-jumat .card p:hover i {
            transform: translateY(-2px);
        }
        
        .sholat-jumat .card .date-badge {
            background: var(--primary-color);
            color: var(--text-light);
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            animation: blink 3s ease infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .pengumuman .announcement-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .pengumuman .announcement-item {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.5s ease-out forwards;
        }
        
        .pengumuman .announcement-item i {
            color: var(--secondary-color);
            font-size: 1.2rem;
            animation: spin 3s linear infinite;
        }
        
        .pengumuman .announcement-item p {
            margin: 0;
            font-size: 1rem;
            line-height: 1.5;
        }
        
        .pengumuman .no-announcement {
            display: flex;
            align-items: center;
            gap: 10px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .pengumuman .no-announcement i {
            color: var(--secondary-color);
        }
        
        .pengumuman .btn, .keuangan .btn {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 15px;
            background: var(--primary-color);
            color: var(--text-light);
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.9rem;
            position: relative;
            overflow: hidden;
            transition: background 0.3s ease;
        }
        
        .pengumuman .btn::after, .keuangan .btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.4s ease, height 0.4s ease;
        }
        
        .pengumuman .btn:hover::after, .keuangan .btn:hover::after {
            width: 200px;
            height: 200px;
        }
        
        .pengumuman .btn:hover, .keuangan .btn:hover {
            background: var(--accent-color);
        }
        
        .keuangan .finance-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
        }
        
        .keuangan .finance-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 0;
            font-size: 1.1rem;
        }
        
        .keuangan .finance-item i {
            color: var(--secondary-color);
            animation: blink 2s ease infinite;
        }
        
        .keuangan .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            overflow: hidden;
            margin-top: 5px;
        }
        
        .keuangan .progress-bar .progress {
            height: 100%;
            transition: width 1s ease;
        }
        
        .keuangan .progress-bar.income .progress {
            background: var(--success-color);
        }
        
        .keuangan .progress-bar.expense .progress {
            background: var(--danger-color);
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
        
        .footer {
            text-align: center;
            font-size: 0.9rem;
            margin-top: 20px;
            color: rgba(255, 255, 255, 0.7);
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            animation: fadeInOut 10s ease infinite;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .panel {
            animation: fadeIn 0.6s ease-out forwards;
            perspective: 1000px;
        }
        
        .panel:nth-child(2) { animation-delay: 0.1s; }
        .panel:nth-child(3) { animation-delay: 0.2s; }
        .panel:nth-child(4) { animation-delay: 0.3s; }
        
        @media (max-width: 1366px) {
            .header h1 {
                font-size: 2.5rem;
            }
            .kaligrafi {
                font-size: 4rem;
            }
            .datetime, .running-text {
                font-size: 1.2rem;
            }
            .jadwal-sholat h2, .sholat-jumat h2, .pengumuman h2, .keuangan h2 {
                font-size: 1.6rem;
            }
            .jadwal-sholat table, .sholat-jumat .card p, .pengumuman .announcement-item p, .keuangan .finance-item {
                font-size: 1rem;
            }
        }
        
        @media (max-width: 1024px) {
            .main-content {
                flex-direction: column;
            }
            .panel {
                flex: none;
                width: 100%;
            }
            .kaligrafi {
                font-size: 3.5rem;
            }
            .auto-update-status {
                bottom: 10px;
                left: 10px;
                font-size: 0.8rem;
                padding: 5px 10px;
            }
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            .kaligrafi {
                font-size: 3rem;
                top: 10px;
            }
            .kaligrafi-allah {
                right: 20px;
            }
            .kaligrafi-muhammad {
                left: 20px;
            }
            .running-text {
                max-width: 95%;
                font-size: 1rem;
            }
            .jadwal-sholat h2, .sholat-jumat h2, .pengumuman h2, .keuangan h2 {
                font-size: 1.4rem;
            }
            .jadwal-sholat table, .sholat-jumat .card p, .pengumuman .announcement-item p, .keuangan .finance-item {
                font-size: 0.9rem;
            }
            .sholat-jumat .card .date-badge, .pengumuman .btn, .keuangan .btn {
                font-size: 0.8rem;
                padding: 6px 12px;
            }
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
            <div class="panel jadwal-sholat">
                <h2><i class="fas fa-mosque"></i> Jadwal Sholat</h2>
                <table>
                    <tr>
                        <th>Sholat</th>
                        <th>Waktu</th>
                    </tr>
                    <?php
                    $now = \Carbon\Carbon::now('Asia/Jakarta');
                    $currentHour = $now->format('H:i');
                    ?>
                    <?php $__currentLoopData = $jadwalSholat; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $jadwal): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr class="<?php echo e(\Carbon\Carbon::parse($jadwal->waktu)->format('H:i') <= $currentHour && \Carbon\Carbon::parse($jadwal->waktu)->addMinutes(30)->format('H:i') >= $currentHour ? 'active' : ''); ?>">
                        <td><?php echo e($jadwal->nama_sholat); ?></td>
                        <td><?php echo e(\Carbon\Carbon::parse($jadwal->waktu)->format('H:i')); ?></td>
                    </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </table>
            </div>
            <div class="panel sholat-jumat">
                <h2><i class="fas fa-pray"></i> Sholat Jumat</h2>
                <div class="card">
                    <?php if($sholatJumat): ?>
                    <p><i class="fas fa-calendar-alt"></i> <strong>Tanggal:</strong> <span class="date-badge"><?php echo e(\Carbon\Carbon::parse($sholatJumat->tanggal)->translatedFormat('d F Y')); ?></span></p>
                    <p><i class="fas fa-user"></i> <strong>Imam:</strong> <?php echo e($sholatJumat->imam ?? 'Belum Ditetapkan'); ?></p>
                    <p><i class="fas fa-book"></i> <strong>Khatib:</strong> <?php echo e($sholatJumat->khatib ?? 'Belum Ditetapkan'); ?></p>
                    <p><i class="fas fa-microphone"></i> <strong>Muadzin:</strong> <?php echo e($sholatJumat->muadzin ?? 'Belum Ditetapkan'); ?></p>
                    <?php else: ?>
                    <p><i class="fas fa-calendar-alt"></i> <strong>Tanggal:</strong> Belum Ditetapkan</p>
                    <p><i class="fas fa-user"></i> <strong>Imam:</strong> Belum Ditetapkan</p>
                    <p><i class="fas fa-book"></i> <strong>Khatib:</strong> Belum Ditetapkan</p>
                    <p><i class="fas fa-microphone"></i> <strong>Muadzin:</strong> Belum Ditetapkan</p>
                    <?php endif; ?>
                </div>
            </div>
            <div class="panel pengumuman">
                <h2><i class="fas fa-bullhorn"></i> Pengumuman</h2>
                <?php if($pengumuman->isEmpty()): ?>
                <div class="no-announcement">
                    <i class="fas fa-info-circle"></i>
                    <p>Tidak ada pengumuman mendatang.</p>
                </div>
                <?php else: ?>
                <ul class="announcement-list">
                    <?php $__currentLoopData = $pengumuman; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <li class="announcement-item" style="animation-delay: <?php echo e($index * 0.2); ?>s;">
                        <i class="fas fa-bullhorn"></i>
                        <p><strong><?php echo e(\Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y')); ?>:</strong> <?php echo e($item->isi); ?></p>
                    </li>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </ul>
                <?php endif; ?>
            </div>
            <div class="panel keuangan">
                <h2><i class="fas fa-wallet"></i> Keuangan</h2>
                <div class="finance-card">
                    <div class="finance-item">
                        <i class="fas fa-arrow-up" style="color: var(--success-color);"></i>
                        <p><strong>Total Pemasukan:</strong> Rp <?php echo e(number_format($keuanganSummary['total_pemasukan'], 2, ',', '.')); ?></p>
                    </div>
                    <div class="progress-bar income">
                        <div class="progress" style="width: <?php echo e($keuanganSummary['total_pemasukan'] > 0 ? min(($keuanganSummary['total_pemasukan'] / ($keuanganSummary['total_pemasukan'] + $keuanganSummary['total_pengeluaran']) * 100), 100) : 0); ?>%;"></div>
                    </div>
                    <div class="finance-item">
                        <i class="fas fa-arrow-down" style="color: var(--danger-color);"></i>
                        <p><strong>Total Pengeluaran:</strong> Rp <?php echo e(number_format($keuanganSummary['total_pengeluaran'], 2, ',', '.')); ?></p>
                    </div>
                    <div class="progress-bar expense">
                        <div class="progress" style="width: <?php echo e($keuanganSummary['total_pengeluaran'] > 0 ? min(($keuanganSummary['total_pengeluaran'] / ($keuanganSummary['total_pemasukan'] + $keuanganSummary['total_pengeluaran']) * 100), 100) : 0); ?>%;"></div>
                    </div>
                    <div class="finance-item">
                        <i class="fas fa-balance-scale"></i>
                        <p><strong>Saldo:</strong> Rp <?php echo e(number_format($keuanganSummary['saldo'], 2, ',', '.')); ?></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <?php echo $settings['footer'] ?? 'Hak Cipta © 2025 Ali Mochtar Development System'; ?>

        </div>
    </div>

    <script>
        // Fungsi update datetime
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
        
        // Auto-refresh dengan notifikasi
        document.addEventListener('DOMContentLoaded', function() {
            const marquee = document.querySelector('marquee');
            if (marquee) {
                marquee.style.transition = 'all 0.5s ease';
                marquee.addEventListener('animationiteration', () => {
                    marquee.stop();
                    setTimeout(() => marquee.start(), 5000);
                });
            }
            
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseover', () => {
                    btn.style.transform = 'scale(1.05) translateZ(10px)';
                });
                btn.addEventListener('mouseout', () => {
                    btn.style.transform = 'scale(1)';
                });
            });

            // Auto-refresh logic dengan notifikasi
            let lastTimestamp = null;
            let refreshInterval = 30000; // 30 detik
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
                    
                    // Reset failed attempts on success
                    failedAttempts = 0;
                    
                    if (lastTimestamp && newTimestamp && newTimestamp !== lastTimestamp) {
                        console.log('Data updated:', data.updated_data);
                        showUpdateNotification(data.updated_data);
                        
                        // Reload halaman setelah delay singkat
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                    
                    lastTimestamp = newTimestamp;
                    
                } catch (error) {
                    console.error('Error checking for updates:', error);
                    failedAttempts++;
                    
                    if (failedAttempts >= maxFailedAttempts) {
                        refreshInterval = 60000; // 1 menit
                        console.log('Reducing check frequency due to errors');
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
                    return item.replace('_', ' ').replace('jadwal sholat', 'Jadwal Sholat')
                    .replace('sholat jumat', 'Sholat Jumat')
                    .replace('pengumuman', 'Pengumuman')
                    .replace('keuangan', 'Keuangan');
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

            // Tambahkan CSS untuk animasi
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            // Mulai pengecekan
            checkForUpdates();
            setInterval(checkForUpdates, refreshInterval);

            // Tambahkan event listener untuk visibility change
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    refreshInterval = 60000; // Kurangi frekuensi saat tab tidak aktif
                } else {
                    refreshInterval = 30000; // Kembali normal saat tab aktif
                    checkForUpdates(); // Cek segera saat kembali
                }
            });
        });
    </script>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/welcome.blade.php ENDPATH**/ ?>