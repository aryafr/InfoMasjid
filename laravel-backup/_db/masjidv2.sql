-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Bulan Mei 2026 pada 08.38
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `masjidv2`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `app_settings`
--

CREATE TABLE `app_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_aplikasi` varchar(255) NOT NULL DEFAULT 'Deteksi Penyakit Jantung',
  `favicon` varchar(255) DEFAULT NULL,
  `background` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `footer` text DEFAULT NULL,
  `running_text` text DEFAULT NULL,
  `auto_update_jadwal` tinyint(1) NOT NULL DEFAULT 0,
  `auto_update_frequency` varchar(255) NOT NULL DEFAULT 'daily',
  `auto_update_time` time NOT NULL DEFAULT '00:00:00',
  `auto_update_city` varchar(255) NOT NULL DEFAULT 'Jakarta',
  `auto_update_country` varchar(255) NOT NULL DEFAULT 'Indonesia',
  `auto_update_method` int(11) NOT NULL DEFAULT 11,
  `rotation_interval` int(11) NOT NULL DEFAULT 10,
  `rotation_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `rotation_pages` longtext DEFAULT NULL,
  `last_auto_update` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `app_settings`
--

INSERT INTO `app_settings` (`id`, `nama_aplikasi`, `favicon`, `background`, `logo`, `footer`, `running_text`, `auto_update_jadwal`, `auto_update_frequency`, `auto_update_time`, `auto_update_city`, `auto_update_country`, `auto_update_method`, `rotation_interval`, `rotation_enabled`, `rotation_pages`, `last_auto_update`, `created_at`, `updated_at`) VALUES
(1, 'MASJID AL-IKHLAS', 'settings/N8GrzxWzAP1VtC0tyfmyLi8c4FWbT3QDIr5L4fYf.png', 'settings/MoTmNXn3rFl0DEx3a2t8MkSS9UDHL64T60Dtlb1e.png', 'settings/330aBhDGtrSDu7TPNakaikmpZZl22NR1lOlDn7S3.png', 'Copyright 2025 Ali Mochtar Development System', '🌙 \"Hati yang tenang ada pada mereka yang selalu mengingat Allah. Mari perbanyak zikir dan shalat berjamaah.\"\r\n📖 “Ingatlah, hanya dengan mengingat Allah hati menjadi tenang.”\r\n— (QS. Ar-Ra’d: 28)', 1, 'daily', '00:00:00', 'Cilegon', 'Indonesia', 11, 12, 1, '[{\"url\":\"welcome-embed\",\"name\":\"Dashboard Lengkap\",\"active\":false},{\"url\":\"utama-embed\",\"name\":\"Jadwal Sholat\",\"active\":false},{\"url\":\"keuangan-embed\",\"name\":\"Rincian Keuangan\",\"active\":false},{\"url\":\"jumat-embed\",\"name\":\"Jadwal Sholat Jumat\",\"active\":false},{\"url\":\"pengumuman-embed\",\"name\":\"Pengumuman\",\"active\":false},{\"url\":\"keuangan-summary-embed\",\"name\":\"Ringkasan Keuangan\",\"active\":false},{\"url\":\"qris-embed\",\"name\":\"QRIS Donasi\",\"active\":false},{\"url\":\"idul-fitri-embed\",\"name\":\"Idul Fitri\",\"active\":true},{\"url\":\"idul-adha-embed\",\"name\":\"Idul Adha\",\"active\":true}]', '2026-04-19 13:41:04', '2025-04-17 02:39:21', '2026-05-14 07:38:28'),
(3, 'Masjid Al-Ikhlas', NULL, NULL, NULL, 'Copyright &copy; <a href=\"https://wa.me/628179851011\" target=\"_blank\">Ali Mochtar Development System</a> 2026', NULL, 0, 'daily', '00:00:00', 'Jakarta', 'Indonesia', 11, 12, 1, '[{\"url\":\"welcome-embed\",\"name\":\"Dashboard Lengkap\",\"active\":false},{\"url\":\"utama-embed\",\"name\":\"Jadwal Sholat\",\"active\":false},{\"url\":\"keuangan-embed\",\"name\":\"Rincian Keuangan\",\"active\":false},{\"url\":\"jumat-embed\",\"name\":\"Jadwal Sholat Jumat\",\"active\":false},{\"url\":\"pengumuman-embed\",\"name\":\"Pengumuman\",\"active\":false},{\"url\":\"keuangan-summary-embed\",\"name\":\"Ringkasan Keuangan\",\"active\":false},{\"url\":\"qris-embed\",\"name\":\"QRIS Donasi\",\"active\":false},{\"url\":\"idul-fitri-embed\",\"name\":\"Idul Fitri\",\"active\":true},{\"url\":\"idul-adha-embed\",\"name\":\"Idul Adha\",\"active\":true}]', NULL, '2026-04-18 18:15:14', '2026-05-14 07:38:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwal_sholat`
--

CREATE TABLE `jadwal_sholat` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_sholat` varchar(255) NOT NULL,
  `waktu` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jadwal_sholat`
--

INSERT INTO `jadwal_sholat` (`id`, `nama_sholat`, `waktu`, `created_at`, `updated_at`) VALUES
(1, 'Subuh', '04:38:00', NULL, '2026-04-18 16:06:59'),
(2, 'Dzuhur', '11:55:00', NULL, '2026-04-18 16:06:59'),
(3, 'Ashar', '15:16:00', NULL, '2026-04-18 16:06:59'),
(4, 'Maghrib', '17:54:00', NULL, '2026-04-18 16:06:59'),
(5, 'Isya', '19:04:00', NULL, '2026-04-18 16:06:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `keuangan`
--

CREATE TABLE `keuangan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `deskripsi` varchar(255) NOT NULL,
  `pemasukan` decimal(15,2) NOT NULL DEFAULT 0.00,
  `pengeluaran` decimal(15,2) NOT NULL DEFAULT 0.00,
  `saldo` decimal(15,2) NOT NULL DEFAULT 0.00,
  `kategori` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `keuangan`
--

INSERT INTO `keuangan` (`id`, `tanggal`, `deskripsi`, `pemasukan`, `pengeluaran`, `saldo`, `kategori`, `created_at`, `updated_at`) VALUES
(1, '2026-03-01', 'Saldo Awal Bulan Maret', 15000000.00, 0.00, 15000000.00, 'Saldo Awal', '2026-02-28 17:00:00', '2026-02-28 17:00:00'),
(2, '2026-03-05', 'Infak Jumat (29 Jamaah)', 1450000.00, 0.00, 16450000.00, 'Infak', '2026-03-05 06:00:00', '2026-03-05 06:00:00'),
(3, '2026-03-07', 'Donatur Tetap - Bapak H. Ahmad', 500000.00, 0.00, 16950000.00, 'Donatur', '2026-03-07 03:00:00', '2026-03-07 03:00:00'),
(4, '2026-03-10', 'Pembelian Perlengkapan Kebersihan', 0.00, 350000.00, 16600000.00, 'Operasional', '2026-03-10 01:30:00', '2026-03-10 01:30:00'),
(5, '2026-03-12', 'Infak Jumat (35 Jamaah)', 1750000.00, 0.00, 18350000.00, 'Infak', '2026-03-12 06:00:00', '2026-03-12 06:00:00'),
(6, '2026-03-15', 'Pembayaran Listrik & Air', 0.00, 1250000.00, 17100000.00, 'Utilitas', '2026-03-15 02:00:00', '2026-03-15 02:00:00'),
(7, '2026-03-18', 'Donasi Pembangunan Taman Wudhu', 2500000.00, 0.00, 19600000.00, 'Donasi Khusus', '2026-03-18 09:00:00', '2026-03-18 09:00:00'),
(8, '2026-03-20', 'Belanja Konsumsi Takjil (Ramadan)', 0.00, 800000.00, 18800000.00, 'Kegiatan', '2026-03-20 08:00:00', '2026-03-20 08:00:00'),
(9, '2026-03-25', 'Zakat Fitrah (50 orang x Rp45.000)', 2250000.00, 0.00, 21050000.00, 'Zakat', '2026-03-25 13:00:00', '2026-03-25 13:00:00'),
(10, '2026-03-28', 'Penyaluran Zakat Fitrah ke Mustahik', 0.00, 2250000.00, 18800000.00, 'Zakat', '2026-03-28 03:00:00', '2026-03-28 03:00:00'),
(11, '2026-04-01', 'Saldo Awal Bulan April', 18800000.00, 0.00, 18800000.00, 'Saldo Awal', '2026-03-31 17:00:00', '2026-03-31 17:00:00'),
(12, '2026-04-02', 'Infak Jumat (40 Jamaah)', 2000000.00, 0.00, 20800000.00, 'Infak', '2026-04-02 06:00:00', '2026-04-02 06:00:00'),
(13, '2026-04-09', 'Infak Jumat (38 Jamaah)', 1900000.00, 0.00, 22700000.00, 'Infak', '2026-04-09 06:00:00', '2026-04-09 06:00:00'),
(14, '2026-04-14', 'Pembelian Sound System Portable', 0.00, 3500000.00, 19200000.00, 'Inventaris', '2026-04-14 04:00:00', '2026-04-14 04:00:00'),
(15, '2026-04-16', 'Iuran Kebersihan Bulanan', 0.00, 400000.00, 18800000.00, 'Operasional', '2026-04-16 01:00:00', '2026-04-16 01:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('sam@gmail.com', '$2y$12$oPOrWwSJ1mmORBSFqV1bkeawUgX/xk/LkxsdJXYIsBBl4Y4z8bnYW', '2025-04-18 10:31:07');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengumuman`
--

CREATE TABLE `pengumuman` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `isi` text NOT NULL,
  `tanggal` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pengumuman`
--

INSERT INTO `pengumuman` (`id`, `isi`, `tanggal`, `created_at`, `updated_at`) VALUES
(1, 'Kajian rutin setiap malam Sabtu selepas Isya di Masjid Al-Hikmah.', '2026-07-23', '2025-07-23 15:01:44', '2026-03-03 17:16:24'),
(2, 'Penggalangan dana untuk renovasi atap masjid dimulai pekan ini.', '2026-07-26', '2025-07-23 15:01:44', '2026-03-04 15:39:57'),
(3, 'Mohon jamaah menjaga kebersihan dan ketertiban area masjid.', '2025-07-29', '2025-07-23 15:01:44', '2025-07-23 15:32:15'),
(4, 'Sholat subuh berjamaah dilanjutkan dengan kuliah subuh setiap hari Ahad.', '2025-08-09', '2025-07-23 17:43:26', '2025-07-23 17:44:08'),
(5, 'Pelatihan tata cara pengurusan jenazah akan diadakan pekan depan.', '2025-08-17', '2025-07-23 17:43:26', '2025-07-23 17:44:21'),
(6, 'Dipersilakan jamaah yang ingin wakaf Al-Quran melalui pengurus masjid.', '2025-08-20', '2025-07-23 17:43:26', '2025-07-23 17:44:32'),
(7, 'Jadwal buka puasa bersama dan shalat tarawih perdana akan dimulai pada tanggal 1 Ramadan 1447 H.', '2026-04-25', '2026-04-01 01:00:00', '2026-04-01 01:00:00'),
(8, 'Pendaftaran santri baru TPQ Al-Ikhlas dibuka mulai 1 Mei 2026. Segera daftarkan putra-putri Anda.', '2026-05-01', '2026-04-10 02:00:00', '2026-04-10 02:00:00'),
(9, 'Kajian Islam Ahad Pagi: \"Menjemput Berkah Ramadan\" bersama Ustadz Dr. Abdullah, M.A. Pukul 07.00 WIB.', '2026-04-20', '2026-04-15 12:30:00', '2026-04-15 12:30:00'),
(10, 'Lowongan untuk petugas kebersihan masjid (shift malam). Hubungi Bpk. Hasan (0812-xxxx-xxxx).', '2026-04-30', '2026-04-18 00:15:00', '2026-04-18 00:15:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `qris`
--

CREATE TABLE `qris` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `nomor_rekening` varchar(100) DEFAULT NULL,
  `bank` varchar(100) DEFAULT NULL,
  `atas_nama` varchar(255) DEFAULT NULL,
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `qris`
--

INSERT INTO `qris` (`id`, `nama`, `gambar`, `keterangan`, `nomor_rekening`, `bank`, `atas_nama`, `status`, `created_at`, `updated_at`) VALUES
(1, 'QRIS Masjid Al-Ikhlas', 'qris/1778590299_QRIS_DKM_AL_IKHLAS.JPG', 'Scan QR Code ini untuk berdonasi atau membayar infak', '3335559915', 'Bank Syariah Indonesia', 'DKM AL IKHLAS', 'aktif', '2026-05-12 11:52:11', '2026-05-12 13:10:39');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'admin', '2025-04-18 09:30:33', '2025-04-18 09:30:33'),
(2, 'petugas', '2025-04-18 09:30:33', '2025-04-18 09:30:33');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sholat_idul_adha`
--

CREATE TABLE `sholat_idul_adha` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tahun` year(4) NOT NULL,
  `tanggal` date NOT NULL,
  `imam` varchar(255) DEFAULT NULL,
  `khatib` varchar(255) DEFAULT NULL,
  `muadzin` varchar(255) DEFAULT NULL,
  `waktu` time DEFAULT '07:00:00',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sholat_idul_adha`
--

INSERT INTO `sholat_idul_adha` (`id`, `tahun`, `tanggal`, `imam`, `khatib`, `muadzin`, `waktu`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, '2026', '2026-05-27', 'Prof. Dr. H. Nur Kholis, MA', 'Ustadz Fauzan Akbar', 'Bilal', '06:30:00', '10 Dzulhijjah 1446 H', NULL, '2026-05-14 08:20:01');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sholat_idul_fitri`
--

CREATE TABLE `sholat_idul_fitri` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tahun` year(4) NOT NULL,
  `tanggal` date NOT NULL,
  `imam` varchar(255) DEFAULT NULL,
  `khatib` varchar(255) DEFAULT NULL,
  `muadzin` varchar(255) DEFAULT NULL,
  `waktu` time DEFAULT '07:00:00',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sholat_idul_fitri`
--

INSERT INTO `sholat_idul_fitri` (`id`, `tahun`, `tanggal`, `imam`, `khatib`, `muadzin`, `waktu`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, '2027', '2027-03-10', 'Ustadz Dr. Abdullah, M.Ag', 'KH. Ma\'ruf Khozin', 'Saiful Anwar', '07:00:00', '1 Syawal 1446 H', NULL, '2026-05-14 08:19:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sholat_jumat`
--

CREATE TABLE `sholat_jumat` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `imam` varchar(255) DEFAULT NULL,
  `khatib` varchar(255) DEFAULT NULL,
  `muadzin` varchar(255) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sholat_jumat`
--

INSERT INTO `sholat_jumat` (`id`, `imam`, `khatib`, `muadzin`, `tanggal`, `created_at`, `updated_at`) VALUES
(1, 'Ustad Abdul Muin', 'Ustad Abdul Muin', 'Ahmad Najib', '2025-07-25', '2025-07-23 14:53:52', '2025-07-23 14:53:52'),
(2, 'Ust. Ahmad Fauzi', 'KH. Mahmud Hasan', 'Ali Maulana', '2025-08-01', '2025-07-23 14:59:32', '2025-07-23 15:00:59'),
(3, 'Ust. Rizal Hakim', 'KH. Zainuddin', 'Fadli Rahman', '2025-08-08', '2025-07-23 14:59:32', '2025-07-23 15:01:09'),
(5, 'Ustadz Dr. Nurcholis, M.Ag', 'KH. Ma\'ruf Khozin', 'Saiful Anwar', '2026-05-01', '2026-04-18 11:00:00', '2026-04-18 11:00:00'),
(6, 'Ustadz Fauzan Akbar', 'Ustadz Fauzan Akbar', 'Hamzah', '2026-05-08', '2026-04-18 11:00:00', '2026-04-18 11:00:00'),
(7, 'KH. Syamsul Arifin', 'Prof. Dr. H. Nur Kholis, MA', 'Bilal', '2026-05-15', '2026-04-18 11:00:00', '2026-04-18 11:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `last_name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role_id`) VALUES
(1, 'Admin', 'Sholeh', 'adminsholeh@admin.com', NULL, '$2y$12$wLiQ7qCJ7wDHc.GKxTXziutjhZoOmOjJLTYn3HCRTaDE4fpe/BoEG', 'j1aj9NedCzGAKl5qdrTbDkilxaQUUbs8GzaarVxiWdaSbzv7OyclMxtoX0qL', '2025-04-05 03:24:59', '2026-04-18 17:52:28', 1),
(22, 'Samsuri', 'Wijaya', 'sam@sam.com', NULL, '$2y$12$Tq6LBvMqlgdkUcEpGb7ZPO7MvdAu5e5hJzAwHvacKWPY/BryB3Etq', NULL, '2026-04-18 18:15:40', '2026-04-18 18:15:40', 2),
(24, 'Bendahara', 'Masjid', 'bendahara@masjid.com', '2026-03-31 17:00:00', '$2y$12$q2W5k5pP8XH9Z1aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5A6bC7dE8fG', NULL, '2026-04-01 01:00:00', '2026-04-01 01:00:00', 2),
(25, 'Petugas', 'Keamanan', 'satpam@masjid.com', '2026-04-01 17:00:00', '$2y$12$q2W5k5pP8XH9Z1aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5A6bC7dE8fG', NULL, '2026-04-02 02:00:00', '2026-04-02 02:00:00', 2),
(26, 'Operator', 'Takmir', 'operator@masjid.com', '2026-04-02 17:00:00', '$2y$12$q2W5k5pP8XH9Z1aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5A6bC7dE8fG', NULL, '2026-04-03 03:00:00', '2026-04-03 03:00:00', 2);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `jadwal_sholat`
--
ALTER TABLE `jadwal_sholat`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `keuangan`
--
ALTER TABLE `keuangan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `qris`
--
ALTER TABLE `qris`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `sholat_idul_adha`
--
ALTER TABLE `sholat_idul_adha`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sholat_idul_adha_tahun_unique` (`tahun`);

--
-- Indeks untuk tabel `sholat_idul_fitri`
--
ALTER TABLE `sholat_idul_fitri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sholat_idul_fitri_tahun_unique` (`tahun`);

--
-- Indeks untuk tabel `sholat_jumat`
--
ALTER TABLE `sholat_jumat`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jadwal_sholat`
--
ALTER TABLE `jadwal_sholat`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `keuangan`
--
ALTER TABLE `keuangan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `qris`
--
ALTER TABLE `qris`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `sholat_idul_adha`
--
ALTER TABLE `sholat_idul_adha`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `sholat_idul_fitri`
--
ALTER TABLE `sholat_idul_fitri`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `sholat_jumat`
--
ALTER TABLE `sholat_jumat`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
