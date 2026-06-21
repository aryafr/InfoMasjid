<!-- resources/views/layouts/admin.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="{{ $setting['nama_aplikasi'] ?? 'Sistem Informasi Masjid Digital' }}">
    <meta name="author" content="Ali Mochtar Development System">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $setting['nama_aplikasi'] ?? config('app.name', 'SIMasjid') }} - Panel Admin</title>

    <!-- Font Awesome -->
    <link href="{{ asset('vendor/fontawesome-free/css/all.min.css') }}" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap core CSS -->
    <link href="{{ asset('css/sb-admin-2.min.css') }}" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    
    <!-- SweetAlert2 -->
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- Favicon -->
    <link href="{{ isset($setting['favicon']) ? asset('storage/' . $setting['favicon']) : asset('img/favicon.png') }}" rel="icon" type="image/png">

    <!-- Islamic Admin Custom Styles -->
    <style>
        :root {
            --islamic-green: #1e5a3a;
            --islamic-gold: #c9a03d;
            --islamic-dark: #0a2e1f;
            --islamic-light: #f5f7f2;
            --islamic-maroon: #8b4513;
        }
        
        body {
            font-family: 'Poppins', 'Nunito', sans-serif;
            background: linear-gradient(135deg, #f5f7f2 0%, #e8ede5 100%);
        }
        
        /* Islamic Sidebar Style */
        .bg-gradient-primary {
            background: linear-gradient(180deg, var(--islamic-dark) 0%, var(--islamic-green) 100%) !important;
            position: relative;
            overflow: hidden;
        }
        
        .bg-gradient-primary::before {
            content: "";
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 150px;
            opacity: 0.05;
            color: white;
            pointer-events: none;
        }
        
        .bg-gradient-primary::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.03'%3E%3Cpath fill='white' d='M50,0 L61.8,19 L84.5,22.5 L69,38 L72.5,61.8 L50,70 L27.5,61.8 L31,38 L15.5,22.5 L38.2,19 L50,0 Z'/%3E%3Ccircle cx='50' cy='50' r='15' fill='white'/%3E%3C/svg%3E");
            background-repeat: repeat;
            background-size: 40px;
            pointer-events: none;
        }
        
        /* Sidebar Brand */
        .sidebar-brand {
            background: rgba(255,255,255,0.05);
            border-bottom: 2px solid var(--islamic-gold);
            position: relative;
        }
        
        .sidebar-brand-text {
            font-family: 'Amiri', serif;
            font-size: 1.1rem;
            letter-spacing: 1px;
        }
        
        /* Sidebar Navigation */
        .sidebar .nav-item .nav-link {
            color: rgba(255,255,255,0.85);
            border-left: 3px solid transparent;
            transition: all 0.3s ease;
        }
        
        .sidebar .nav-item .nav-link:hover {
            color: white;
            background: rgba(255,255,255,0.1);
            border-left-color: var(--islamic-gold);
            transform: translateX(5px);
        }
        
        .sidebar .nav-item.active .nav-link {
            color: white;
            background: rgba(255,255,255,0.15);
            border-left-color: var(--islamic-gold);
            font-weight: 600;
        }
        
        .sidebar .nav-item .nav-link i {
            color: var(--islamic-gold);
        }
        
        /* Sidebar Heading */
        .sidebar-heading {
            color: var(--islamic-gold);
            font-size: 0.7rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 700;
        }
        
        /* Topbar Style */
        .topbar {
            background: linear-gradient(135deg, #ffffff 0%, #fef9e6 100%);
            border-bottom: 3px solid var(--islamic-gold);
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .navbar-search .btn-primary {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
            border: none;
        }
        
        .navbar-search .btn-primary:hover {
            background: linear-gradient(135deg, var(--islamic-dark), var(--islamic-green));
        }
        
        /* Badge Style */
        .badge-success {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark)) !important;
        }
        
        /* Card Style */
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }
        
        .card-header {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
            color: white;
            border-radius: 15px 15px 0 0 !important;
            border-bottom: 2px solid var(--islamic-gold);
        }
        
        /* Button Style */
        .btn-primary {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
            border: none;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, var(--islamic-dark), var(--islamic-green));
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(30,90,58,0.3);
        }
        
        .btn-outline-primary {
            border-color: var(--islamic-green);
            color: var(--islamic-green);
        }
        
        .btn-outline-primary:hover {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
            border-color: transparent;
        }
        
        /* Footer Style */
        .sticky-footer {
            background: linear-gradient(135deg, var(--islamic-dark), var(--islamic-green));
            color: white;
            border-top: 2px solid var(--islamic-gold);
        }
        
        .sticky-footer a {
            color: var(--islamic-gold);
            text-decoration: none;
        }
        
        .sticky-footer a:hover {
            color: #ffd700;
        }
        
        /* Islamic Corner Decoration */
        .islamic-corner {
            position: fixed;
            width: 150px;
            height: 150px;
            pointer-events: none;
            z-index: 999;
            opacity: 0.3;
        }
        
        .corner-br {
            bottom: 0;
            right: 0;
            background: radial-gradient(circle at bottom right, var(--islamic-gold), transparent 70%);
            border-radius: 150px 0 0 0;
        }
        
        /* Profile Image Style */
        .img-profile {
            background: linear-gradient(135deg, var(--islamic-gold), #ffd700) !important;
            color: var(--islamic-dark) !important;
            font-weight: bold;
        }
        
        /* Dropdown Menu */
        .dropdown-menu {
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            border: none;
        }
        
        .dropdown-item:hover {
            background: linear-gradient(135deg, rgba(30,90,58,0.1), rgba(10,46,31,0.1));
            color: var(--islamic-dark);
        }
        
        /* Scroll to Top */
        .scroll-to-top {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
        }
        
        .scroll-to-top:hover {
            background: linear-gradient(135deg, var(--islamic-dark), var(--islamic-green));
            transform: translateY(-3px);
        }
        
        /* Table Style */
        .table {
            border-radius: 10px;
            overflow: hidden;
        }
        
        .table thead th {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
            color: white;
            border: none;
        }
        
        .table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(30,90,58,0.05);
        }
        
        /* Modal Style */
        .modal-content {
            border-radius: 15px;
            border: none;
        }
        
        .modal-header {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
            color: white;
            border-radius: 15px 15px 0 0;
        }
        
        .modal-header .close {
            color: white;
        }
        
        /* Alert Style */
        .alert {
            border-radius: 10px;
            border-left: 4px solid var(--islamic-gold);
        }
        
        /* Pagination */
        .page-link {
            color: var(--islamic-green);
        }
        
        .page-item.active .page-link {
            background: linear-gradient(135deg, var(--islamic-green), var(--islamic-dark));
            border-color: var(--islamic-dark);
        }
        
        /* Animation */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .main-content {
            animation: fadeInUp 0.5s ease-out;
        }
        
        /* Dashboard Card Style */
        .dashboard-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        
        .dashboard-card::before {
            content: "";
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            position: absolute;
            bottom: -20px;
            right: -20px;
            font-size: 80px;
            opacity: 0.05;
            color: var(--islamic-green);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .sidebar-brand-text {
                font-size: 0.9rem;
            }
        }
    </style>

    <!-- Additional CSS -->
    @stack('styles')
</head>
<body id="page-top">
    <div id="wrapper">
        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            <!-- Sidebar - Brand -->
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="{{ url('/home') }}">
                <div class="sidebar-brand-icon">
                    <img src="{{ isset($setting['logo']) ? asset('storage/' . $setting['logo']) : asset('img/logo.png') }}" 
                    alt="Logo" class="img-fluid" style="max-width: 50px; max-height: 50px;">
                </div>
                <div class="sidebar-brand-text mx-2">
                    <small>{{ Str::limit($setting['nama_aplikasi'] ?? config('app.name', 'SIMasjid'), 15) }}</small>
                </div>
            </a>

            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Nav Item - Dashboard -->
            <li class="nav-item {{ request()->routeIs('home') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('home') }}">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
            </li>

            @auth
            @php
            $roleName = optional(auth()->user()->role)->name;
            @endphp

            @if ($roleName === 'admin')
            <!-- Divider -->
            <hr class="sidebar-divider">

            <!-- Heading -->
            <div class="sidebar-heading">
                <i class="fas fa-mosque me-1"></i> Manajemen Masjid
            </div>

            <!-- Nav Item - Jadwal Sholat -->
            <li class="nav-item {{ request()->routeIs('jadwal_sholat.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('jadwal_sholat.index') }}">
                    <i class="fas fa-fw fa-clock"></i>
                    <span>Jadwal Sholat</span>
                </a>
            </li>

            <!-- Nav Item - Sholat Jumat -->
            <li class="nav-item {{ request()->routeIs('sholat_jumat.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('sholat_jumat.index') }}">
                    <i class="fas fa-fw fa-calendar-alt"></i>
                    <span>Sholat Jumat</span>
                </a>
            </li>

            <!-- Nav Item - Sholat Idul Fitri -->
            <li class="nav-item {{ request()->routeIs('idul-fitri.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('idul-fitri.index') }}">
                    <i class="fas fa-fw fa-moon"></i>
                    <span>Idul Fitri</span>
                </a>
            </li>

            <!-- Nav Item - Sholat Idul Adha -->
            <li class="nav-item {{ request()->routeIs('idul-adha.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('idul-adha.index') }}">
                    <i class="fas fa-fw fa-drumstick-bite"></i>
                    <span>Idul Adha</span>
                </a>
            </li>

            <!-- Nav Item - Pengumuman -->
            <li class="nav-item {{ request()->routeIs('pengumuman.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('pengumuman.index') }}">
                    <i class="fas fa-fw fa-bullhorn"></i>
                    <span>Pengumuman</span>
                </a>
            </li>

            <!-- Nav Item - Keuangan -->
            <li class="nav-item {{ request()->routeIs('keuangan.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('keuangan.index') }}">
                    <i class="fas fa-fw fa-hand-holding-heart"></i>
                    <span>Keuangan</span>
                </a>
            </li>

            <!-- Nav Item - QRIS -->
            <li class="nav-item {{ request()->routeIs('qris.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('qris.index') }}">
                    <i class="fas fa-fw fa-qrcode"></i>
                    <span>QRIS Donasi</span>
                </a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <!-- Heading -->
            <div class="sidebar-heading">
                <i class="fas fa-cog"></i> Pengaturan Sistem
            </div>

            <!-- Nav Item - Auto Update -->
            <li class="nav-item {{ request()->routeIs('auto_update.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('auto_update.index') }}">
                    <i class="fas fa-fw fa-sync-alt"></i>
                    <span>Auto-Update Jadwal</span>
                    @if($setting->auto_update_jadwal ?? false)
                    <span class="badge badge-success ml-2" style="font-size: 9px;">AKTIF</span>
                    @else
                    <span class="badge badge-secondary ml-2" style="font-size: 9px;">NONAKTIF</span>
                    @endif
                </a>
            </li>

            <!-- Nav Item - Rotasi Halaman -->
            <li class="nav-item {{ request()->routeIs('rotation.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('rotation.index') }}">
                    <i class="fas fa-fw fa-exchange-alt"></i>
                    <span>Rotasi Halaman TV</span>
                    @if($setting->rotation_enabled ?? true)
                    <span class="badge badge-success ml-2" style="font-size: 9px;">AKTIF</span>
                    @else
                    <span class="badge badge-secondary ml-2" style="font-size: 9px;">NONAKTIF</span>
                    @endif
                </a>
            </li>

            <!-- Nav Item - Pengaturan Aplikasi -->
            <li class="nav-item {{ request()->routeIs('settings.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('settings.edit') }}">
                    <i class="fas fa-fw fa-cog"></i>
                    <span>Pengaturan Aplikasi</span>
                </a>
            </li>

            <!-- Nav Item - Kelola Akun -->
            <li class="nav-item {{ request()->routeIs('users.*') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('users.index') }}">
                    <i class="fas fa-fw fa-users-cog"></i>
                    <span>Kelola Akun</span>
                </a>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider">

            <!-- Heading -->
            <div class="sidebar-heading">
                <i class="fas fa-chart-line"></i> Laporan & Export
            </div>

            <!-- Nav Item - Export Data -->
            <li class="nav-item">
                <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseExport" 
                aria-expanded="true" aria-controls="collapseExport">
                <i class="fas fa-fw fa-download"></i>
                <span>Export Data</span>
            </a>
            <div id="collapseExport" class="collapse" aria-labelledby="headingExport" data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                    <h6 class="collapse-header">Pilih Data:</h6>
                    <a class="collapse-item" href="{{ route('export.jadwal-sholat') }}">
                        <i class="fas fa-clock text-primary"></i> Jadwal Sholat
                    </a>
                    <a class="collapse-item" href="{{ route('export.pengumuman') }}">
                        <i class="fas fa-bullhorn text-warning"></i> Pengumuman
                    </a>
                    <a class="collapse-item" href="{{ route('export.keuangan') }}">
                        <i class="fas fa-hand-holding-heart text-success"></i> Keuangan
                    </a>
                </div>
            </div>
        </li>

        <!-- Nav Item - Laporan Keuangan -->
        <li class="nav-item {{ request()->routeIs('laporan.keuangan*') ? 'active' : '' }}">
            <a class="nav-link" href="{{ route('laporan.keuangan') }}">
                <i class="fas fa-fw fa-chart-bar"></i>
                <span>Laporan Keuangan</span>
            </a>
        </li>

        @endif

        @if ($roleName === 'petugas')
        <!-- Divider -->
        <hr class="sidebar-divider">

        <!-- Heading -->
        <div class="sidebar-heading">
            <i class="fas fa-tasks"></i> Menu Petugas
        </div>

        <!-- Nav Item - Jadwal Sholat -->
        <li class="nav-item">
            <a class="nav-link" href="{{ route('jadwal_sholat.index') }}">
                <i class="fas fa-fw fa-clock"></i>
                <span>Jadwal Sholat</span>
            </a>
        </li>

        <!-- Nav Item - Pengumuman -->
        <li class="nav-item">
            <a class="nav-link" href="{{ route('pengumuman.index') }}">
                <i class="fas fa-fw fa-bullhorn"></i>
                <span>Pengumuman</span>
            </a>
        </li>

        <!-- Nav Item - Keuangan -->
        <li class="nav-item">
            <a class="nav-link" href="{{ route('keuangan.index') }}">
                <i class="fas fa-fw fa-hand-holding-heart"></i>
                <span>Keuangan</span>
            </a>
        </li>

        <!-- Nav Item - QRIS -->
        <li class="nav-item">
            <a class="nav-link" href="{{ route('qris.embed') }}" target="_blank">
                <i class="fas fa-fw fa-qrcode"></i>
                <span>QRIS Donasi</span>
            </a>
        </li>
        @endif

        <!-- Divider -->
        <hr class="sidebar-divider">

        <!-- Heading -->
        <div class="sidebar-heading">
            <i class="fas fa-user"></i> Akun
        </div>

        <!-- Nav Item - Profile -->
        <li class="nav-item {{ request()->routeIs('profile') ? 'active' : '' }}">
            <a class="nav-link" href="{{ route('profile') }}">
                <i class="fas fa-fw fa-user"></i>
                <span>Profil Saya</span>
            </a>
        </li>

        <!-- Nav Item - About -->
        <li class="nav-item {{ request()->routeIs('about') ? 'active' : '' }}">
            <a class="nav-link" href="{{ route('about') }}">
                <i class="fas fa-fw fa-info-circle"></i>
                <span>Tentang Aplikasi</span>
            </a>
        </li>

        @endauth

        <!-- Divider -->
        <hr class="sidebar-divider d-none d-md-block">

        <!-- Sidebar Toggler -->
        <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div>

    </ul>
    <!-- End of Sidebar -->

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

        <!-- Main Content -->
        <div id="content">

            <!-- Topbar -->
            <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                <!-- Sidebar Toggle -->
                <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                    <i class="fa fa-bars"></i>
                </button>

                <!-- Topbar Search -->
                <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div class="input-group">
                        <input type="text" class="form-control bg-light border-0 small" placeholder="Cari..." aria-label="Search">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button">
                                <i class="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>

                <!-- Topbar Navbar -->
                <ul class="navbar-nav ml-auto">

                    <!-- Nav Item - Search Dropdown -->
                    <li class="nav-item dropdown no-arrow d-sm-none">
                        <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown">
                            <i class="fas fa-search fa-fw"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in">
                            <form class="form-inline mr-auto w-100 navbar-search">
                                <div class="input-group">
                                    <input type="text" class="form-control bg-light border-0 small" placeholder="Cari...">
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button">
                                            <i class="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>

                    <!-- Nav Item - Alerts -->
                    <li class="nav-item dropdown no-arrow mx-1">
                        <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown">
                            <i class="fas fa-bell fa-fw"></i>
                            <span class="badge badge-danger badge-counter">3+</span>
                        </a>
                        <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in">
                            <h6 class="dropdown-header bg-gradient-primary text-white">
                                <i class="fas fa-bell me-2"></i> Notifikasi
                            </h6>
                            <a class="dropdown-item d-flex align-items-center" href="#">
                                <div class="mr-3">
                                    <div class="icon-circle bg-warning">
                                        <i class="fas fa-clock text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div class="small text-gray-500">Waktu Sholat</div>
                                    <span class="font-weight-bold">Waktu Dzuhur akan segera masuk</span>
                                </div>
                            </a>
                            <a class="dropdown-item text-center small text-gray-500" href="#">Lihat Semua</a>
                        </div>
                    </li>

                    <div class="topbar-divider d-none d-sm-block"></div>

                    <!-- Nav Item - User Information -->
                    <li class="nav-item dropdown no-arrow">
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown">
                            <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{ Auth::user()->name }}</span>
                            <div class="img-profile rounded-circle d-flex align-items-center justify-content-center" 
                            style="width: 32px; height: 32px;">
                            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                        </div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in">
                        <a class="dropdown-item" href="{{ route('profile') }}">
                            <i class="fas fa-user fa-sm fa-fw mr-2 text-primary"></i>
                            Profil
                        </a>
                        <a class="dropdown-item" href="{{ route('settings.edit') }}">
                            <i class="fas fa-cog fa-sm fa-fw mr-2 text-primary"></i>
                            Pengaturan
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-danger"></i>
                            Keluar
                        </a>
                    </div>
                </li>

            </ul>

        </nav>
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="container-fluid main-content">
            @yield('main-content')
        </div>
        <!-- /.container-fluid -->

    </div>
    <!-- End of Main Content -->

    <!-- Footer -->
    <footer class="sticky-footer">
        <div class="container my-auto">
            <div class="copyright text-center my-auto">
                <div class="mb-1">
                    <i class="fas fa-mosque me-1"></i>
                    <i class="fas fa-star-and-crescent me-1"></i>
                    <i class="fas fa-quran me-1"></i>
                </div>
                @if(isset($setting['footer']))
                {!! $setting['footer'] !!}
                @else
                <span>
                    <i class="far fa-copyright"></i> {{ now()->year }} 
                    <a href="https://wa.me/628179851011" target="_blank" style="text-decoration: none;">
                        <i class="fas fa-heart text-danger"></i> Ali Mochtar Development System
                    </a>
                </span>
                <div class="mt-1">
                    <small class="opacity-75">
                        <i class="fas fa-code-branch"></i> Versi 3.0 | 
                        <i class="fas fa-sync-alt"></i> Auto-Update Aktif | 
                        <i class="fas fa-tv"></i> TV Masjid Digital
                    </small>
                </div>
                @endif
            </div>
        </div>
    </footer>
    <!-- End of Footer -->

</div>
<!-- End of Content Wrapper -->

</div>
<!-- End of Page Wrapper -->

<!-- Scroll to Top Button-->
<a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
</a>

<!-- Islamic Corner Decoration -->
<div class="islamic-corner corner-br"></div>

<!-- Logout Modal-->
<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="fas fa-sign-out-alt me-2"></i> Konfirmasi Keluar
                </h5>
                <button class="close" type="button" data-dismiss="modal">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body text-center py-4">
                <i class="fas fa-question-circle fa-3x text-warning mb-3"></i>
                <p>Apakah Anda yakin ingin keluar dari sistem?</p>
                <small class="text-muted">Sesi Anda akan berakhir</small>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">
                    <i class="fas fa-times"></i> Batal
                </button>
                <a class="btn btn-danger" href="{{ route('logout') }}" 
                onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                <i class="fas fa-sign-out-alt"></i> Keluar
            </a>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                @csrf
            </form>
        </div>
    </div>
</div>
</div>

<!-- Scripts -->
<script src="{{ asset('vendor/jquery/jquery.min.js') }}"></script>
<script src="{{ asset('vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('vendor/jquery-easing/jquery.easing.min.js') }}"></script>
<script src="{{ asset('js/sb-admin-2.min.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Custom Scripts -->
<script>
        // Auto-hide alert setelah 5 detik
    $(document).ready(function() {
        setTimeout(function() {
            $('.alert').fadeOut('slow');
        }, 5000);
        
            // Add fade animation to cards
        $('.card').addClass('fade-in');
    });

        // Konfirmasi sebelum menghapus dengan SweetAlert
    function confirmDelete(event, formId, itemName = 'data') {
        event.preventDefault();
        Swal.fire({
            title: 'Hapus ' + itemName + '?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            background: '#fff',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById(formId).submit();
            }
        });
    }

        // Format Rupiah
    function formatRupiah(angka) {
        if (!angka) return 'Rp 0';
        var number_string = angka.toString().replace(/[^,\d]/g, ''),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);
        
        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        
        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        return 'Rp ' + rupiah;
    }

        // Show success notification
    function showSuccess(message) {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: message,
            timer: 3000,
            showConfirmButton: false,
            background: '#fff'
        });
    }

        // Show error notification
    function showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: message,
            confirmButtonColor: '#1e5a3a'
        });
    }

        // Update waktu sholat real-time
    function updatePrayerTimes() {
        $.ajax({
            url: '/api/prayer-times',
            method: 'GET',
            success: function(data) {
                if (data.nextPrayer) {
                    $('#nextPrayerName').text(data.nextPrayer.name);
                    $('#nextPrayerTime').text(data.nextPrayer.time);
                    $('#countdown').text(data.countdown);
                }
            }
        });
    }

        // Update every minute
    if (typeof updatePrayerTimes === 'function') {
        setInterval(updatePrayerTimes, 60000);
    }
</script>

<!-- Stack untuk scripts tambahan -->
@stack('scripts')
</body>
</html>