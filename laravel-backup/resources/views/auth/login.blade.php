@extends('layouts.auth')

@section('main-content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
            <div class="card o-hidden border-0 shadow-lg my-5" style="backdrop-filter: blur(10px); background: rgba(255,255,255,0.95);">
                <div class="card-body p-0">
                    <div class="row">
                        <!-- Islamic Ornamental Background Column -->
                        <div class="col-lg-6 d-none d-lg-block position-relative" style="
                        background: linear-gradient(135deg, #1e3c2c 0%, #2d5a3b 100%);
                        position: relative;
                        overflow: hidden;">

                        <!-- Islamic Geometric Pattern Overlay -->
                        <div class="position-absolute w-100 h-100" style="
                        background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" opacity=\"0.1\"><path fill=\"white\" d=\"M50,0 L61.8,19 L84.5,22.5 L69,38 L72.5,61.8 L50,70 L27.5,61.8 L31,38 L15.5,22.5 L38.2,19 L50,0 Z\"/><circle cx=\"50\" cy=\"50\" r=\"15\" fill=\"white\"/></svg>');
                        background-repeat: repeat;
                        background-size: 60px;">
                    </div>

                    <!-- Animated gradient overlay -->
                    <div class="position-absolute w-100 h-100" style="
                    background: linear-gradient(125deg, 
                        rgba(30,60,44,0.8) 0%, 
                        rgba(45,90,59,0.6) 50%,
                        rgba(30,60,44,0.8) 100%);
                        animation: gradientShift 8s ease infinite;">
                    </div>

                    <!-- Islamic Calligraphy & Mosque Silhouette -->
                    <div class="position-absolute w-100 h-100 d-flex flex-column justify-content-between p-5">
                        <div class="text-center text-white mt-5">
                            <div class="mb-3">
                                <i class="fas fa-mosque fa-4x" style="opacity: 0.9; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));"></i>
                            </div>
                            <h3 class="text-white mb-3" style="font-family: 'Amiri', serif; font-size: 1.8rem;">
                                وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ
                            </h3>
                            <p class="text-white-50 small">"Dan tidak ada taufikku melainkan dengan pertolongan Allah"</p>
                        </div>

                        <div class="text-center text-white mb-5">
                            <div class="mb-3">
                                <div class="d-flex justify-content-center gap-2">
                                    <i class="fas fa-star-and-crescent fa-2x"></i>
                                    <i class="fas fa-quran fa-2x mx-2"></i>
                                    <i class="fas fa-star-and-crescent fa-2x"></i>
                                </div>
                            </div>
                            <p class="small text-white-50 mb-1">Sistem Informasi Masjid Digital</p>
                            <p class="small text-white-50">Modern | Terintegrasi | Berkah</p>
                            <div class="mt-3">
                                <span class="badge bg-warning text-dark">Version 3.0</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-6">
                    <div class="p-5">
                        <div class="text-center">
                            <!-- Dynamic Logo with Islamic Border -->
                            <div class="mb-3 position-relative d-inline-block">
                                <div class="rounded-circle p-2" style="background: linear-gradient(135deg, #1e3c2c, #2d5a3b);">
                                    <img src="{{ isset($setting['logo']) ? asset('storage/' . $setting['logo']) : asset('img/logo.png') }}" 
                                    alt="Logo" 
                                    class="rounded-circle img-fluid" 
                                    style="width: 80px; height: 80px; object-fit: cover; border: 3px solid #ffd700;">
                                </div>
                                <div class="position-absolute top-0 end-0">
                                    <span class="badge rounded-pill bg-warning" style="font-size: 8px;">
                                        <i class="fas fa-check-circle"></i>
                                    </span>
                                </div>
                            </div>
                            <h2 class="h4 text-gray-900 mb-2">{{ $setting['nama_aplikasi'] ?? config('app.name', 'Sistem Informasi Masjid') }}</h2>
                            <p class="text-muted small mb-4">Masukkan kredensial untuk mengakses dashboard</p>
                        </div>

                        @if ($errors->any())
                        <div class="alert alert-danger border-left-danger alert-dismissible fade show" role="alert" style="background: #f8d7da; border-left: 4px solid #dc3545;">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-exclamation-circle me-2"></i>
                                <strong>Gagal masuk!</strong> Periksa kembali email dan password Anda.
                            </div>
                            <ul class="pl-4 my-2 mb-0 small">
                                @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                        @endif

                        @if (session('success'))
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <i class="fas fa-check-circle me-2"></i>
                            {{ session('success') }}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                        @endif

                        <form method="POST" action="{{ route('login') }}" class="user" id="loginForm">
                            @csrf

                            <div class="form-group mb-3">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-light border-0" style="border-radius: 30px 0 0 30px;">
                                            <i class="fas fa-envelope text-success"></i>
                                        </span>
                                    </div>
                                    <input type="email" 
                                    class="form-control border-0 bg-light @error('email') is-invalid @enderror" 
                                    name="email" 
                                    id="email"
                                    placeholder="Alamat Email" 
                                    value="{{ old('email') }}" 
                                    required 
                                    autofocus
                                    style="border-radius: 0 30px 30px 0;">
                                </div>
                                @error('email')
                                <small class="text-danger ms-3">{{ $message }}</small>
                                @enderror
                            </div>

                            <div class="form-group mb-3">
                                <div class="input-group" id="passwordGroup">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-light border-0" style="border-radius: 30px 0 0 30px;">
                                            <i class="fas fa-lock text-success"></i>
                                        </span>
                                    </div>
                                    <input type="password" 
                                    class="form-control border-0 bg-light @error('password') is-invalid @enderror" 
                                    name="password" 
                                    id="password"
                                    placeholder="Kata Sandi" 
                                    required
                                    style="border-radius: 0 30px 30px 0;">
                                    <div class="input-group-append">
                                        <button class="btn btn-light border-0 toggle-password" type="button" style="border-radius: 0 30px 30px 0;">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                @error('password')
                                <small class="text-danger ms-3">{{ $message }}</small>
                                @enderror
                            </div>

                            <div class="form-group mb-4">
                                <div class="custom-control custom-checkbox small">
                                    <input type="checkbox" class="custom-control-input" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                                    <label class="custom-control-label text-muted" for="remember">
                                        <i class="fas fa-save me-1"></i> {{ __('Ingat Saya') }}
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <button type="submit" class="btn btn-success btn-user btn-block" style="border-radius: 30px; padding: 12px;">
                                    <i class="fas fa-sign-in-alt me-2"></i>
                                    {{ __('Masuk ke Dashboard') }}
                                </button>
                            </div>
                        </form>

                        <div class="text-center mt-4">
                            <div class="mb-3">
                                <span class="text-muted">Atau</span>
                            </div>
                            <div class="d-grid gap-2">
                                @if (Route::has('password.request'))
                                <a class="small text-success" href="{{ route('password.request') }}">
                                    <i class="fas fa-key me-1"></i> {{ __('Lupa Kata Sandi?') }}
                                </a>
                                @endif
                                <a class="small text-success" href="{{ url('/') }}">
                                    <i class="fas fa-home me-1"></i> Kembali ke Beranda
                                </a>
                            </div>
                        </div>

                        <!-- Dynamic Footer -->
                        <div class="text-center mt-5 pt-3">
                            @if(isset($setting['footer']))
                            {!! $setting['footer'] !!}
                            @else
                            <p class="small text-muted mb-1">
                                <i class="fas fa-heart text-danger"></i> 
                                Developed with <i class="fas fa-code"></i> by 
                                <a href="https://wa.me/628179851011" target="_blank" class="text-success text-decoration-none fw-bold">
                                    Ali Mochtar Development System
                                </a>
                            </p>
                            <p class="small text-muted mb-0">
                                <i class="fas fa-copyright"></i> {{ now()->year }} Sistem Informasi Masjid Digital
                            </p>
                            <p class="small text-muted mt-1">
                                <i class="fas fa-clock"></i> Version 3.0 | 
                                <i class="fas fa-mosque"></i> Berkah untuk Umat
                            </p>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</div>

<style>
    @keyframes gradientShift {
        0% { opacity: 0.5; }
        50% { opacity: 0.8; }
        100% { opacity: 0.5; }
    }
    
    .gap-2 {
        gap: 0.5rem;
    }
    
    .d-grid {
        display: grid;
    }
    
    @media (max-width: 768px) {
        .p-5 {
            padding: 1.5rem !important;
        }
    }
    
    /* Loading state for button */
    .btn-success:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    /* Style for password toggle button */
    .toggle-password {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .toggle-password:hover {
        background-color: #e9ecef;
    }
    
    .toggle-password:active {
        transform: scale(0.95);
    }
</style>

<script>
    // Perbaikan fungsi toggle password
    document.addEventListener('DOMContentLoaded', function() {
        // Ambil semua tombol toggle password
        const toggleButtons = document.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Cari input password dalam group yang sama
                const passwordGroup = this.closest('.input-group');
                const passwordInput = passwordGroup.querySelector('input[type="password"], input[type="text"]');
                const icon = this.querySelector('i');
                
                if (passwordInput) {
                    // Toggle tipe input
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        passwordInput.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                }
            });
        });
    });
    
    // Add loading effect on form submit
    document.getElementById('loginForm')?.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Memproses...';
            submitBtn.disabled = true;
            
            // Reset if no response after 5 seconds
            setTimeout(() => {
                if (submitBtn.disabled) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 5000);
        }
    });
</script>
@endsection