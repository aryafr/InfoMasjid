-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Bulan Mei 2026 pada 09.20
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

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `qris`
--
ALTER TABLE `qris`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `qris`
--
ALTER TABLE `qris`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
