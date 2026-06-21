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
(1, '2027', '2027-03-10', 'Ustadz Dr. Abdullah, M.Ag', 'KH. Ma\'ruf Khozin', 'Saiful Anwar', '07:00:00', '1 Syawal 1446 H', NULL, '2026-05-14 08:47:24');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `sholat_idul_fitri`
--
ALTER TABLE `sholat_idul_fitri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sholat_idul_fitri_tahun_unique` (`tahun`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `sholat_idul_fitri`
--
ALTER TABLE `sholat_idul_fitri`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
