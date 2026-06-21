<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halaman Tidak Ditemukan - Sistem Manajemen Masjid</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #059669;
            --dark: #1f2937;
            --light: #f9fafb;
            --gray: #6b7280;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8fafc;
            color: var(--dark);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            text-align: center;
        }
        
        .error-icon {
            font-size: 8rem;
            color: var(--primary);
            margin-bottom: 2rem;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-30px);}
            60% {transform: translateY(-15px);}
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--primary);
            font-weight: 700;
        }
        
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            color: var(--gray);
            max-width: 600px;
        }
        
        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            margin: 0.5rem;
            border: 2px solid var(--primary);
        }
        
        .btn:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .btn-outline {
            background-color: transparent;
            color: var(--primary);
        }
        
        .btn-outline:hover {
            background-color: var(--primary);
            color: white;
        }
        
        .initiative-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            margin-top: 3rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            max-width: 800px;
            text-align: center;
        }
        
        .initiative-title {
            font-size: 1.5rem;
            color: var(--secondary);
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        .initiative-description {
            margin-bottom: 1.5rem;
            color: var(--gray);
        }
        
        .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .feature-item {
            background-color: #eef2ff;
            color: var(--primary);
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .cta-text {
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .contact-info {
            margin-top: 1.5rem;
            font-size: 0.9rem;
        }
        
        .contact-info a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
        }
        
        .contact-info a:hover {
            text-decoration: underline;
        }
        
        .hashtags {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
            color: var(--gray);
            font-size: 0.8rem;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .error-icon {
                font-size: 6rem;
            }
            
            .error-message {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-container">
            <div class="error-icon">
                <i class="fas fa-mosque"></i>
            </div>
            <h1>404 - Halaman Tidak Ditemukan</h1>
            <p class="error-message">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman ini telah dipindahkan atau alamat URL yang Anda masukkan salah.
            </p>
            <div>
                <a href="/" class="btn">
                    <i class="fas fa-home"></i> Kembali ke Beranda
                </a>
                <a href="https://wa.me/628179851011" class="btn btn-outline">
                    <i class="fas fa-envelope"></i> Hubungi Kami
                </a>
            </div>
            
            <div class="initiative-card">
                <h2 class="initiative-title">✨ Inisiatif Besar untuk Indonesia yang Lebih Berkah! ✨</h2>
                <p class="initiative-description">
                    Saya akan <strong>membagikan aplikasi digital manajemen masjid ini secara GRATIS</strong> ke 1000 masjid di seluruh Indonesia. Aplikasi ini menampilkan jadwal sholat, laporan keuangan, pengumuman, hingga tampilan TV digital yang dinamis – semua bisa dikendalikan lewat satu dashboard admin.
                </p>
                
                <div class="features">
                    <span class="feature-item">
                        <i class="fas fa-check-circle"></i> GRATIS 100% untuk masjid
                    </span>
                    <span class="feature-item">
                        <i class="fas fa-tv"></i> Tampilan TV masjid
                    </span>
                    <span class="feature-item">
                        <i class="fas fa-clock"></i> Jadwal sholat otomatis
                    </span>
                    <span class="feature-item">
                        <i class="fas fa-chart-line"></i> Transparansi keuangan
                    </span>
                    <span class="feature-item">
                        <i class="fas fa-bullhorn"></i> Pengumuman real-time
                    </span>
                </div>
                
                <p class="cta-text">🎁 Ayo dukung gerakan ini!</p>
                <p>
                    Kami membuka kesempatan bagi para donatur yang ingin ikut serta dalam pengadaan perangkat seperti server lokal, hosting, TV, dan lainnya.
                </p>
                
                <div class="contact-info">
                    <p>🌐 Info selengkapnya dan cara mendukung:</p>
                    <p>
                        <a href="https://wa.me/628179851011" target="_blank">
                            <i class="fab fa-whatsapp"></i> WA Developer: 08179851011
                        </a>
                    </p>
                    <p>
                        <a href="mailto:alimochtar.id@gmail.com">
                            <i class="fas fa-envelope"></i> Email: alimochtar.id@gmail.com
                        </a>
                    </p>
                </div>
                
                <div class="hashtags">
                    <span>#MasjidDigital</span>
                    <span>#DigitalisasiMasjid</span>
                    <span>#AplikasiMasjid</span>
                    <span>#DonasiMasjid</span>
                    <span>#Gerakan1000Masjid</span>
                    <span>#TeknologiUntukUmat</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>