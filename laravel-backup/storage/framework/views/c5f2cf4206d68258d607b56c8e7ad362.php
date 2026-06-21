<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo e($setting['nama_aplikasi'] ?? config('app.name', 'Sistem Informasi Masjid Digital')); ?></title>

    <!-- Fonts -->
    <link href="<?php echo e(asset('vendor/fontawesome-free/css/all.min.css')); ?>" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link href="<?php echo e(asset('css/sb-admin-2.min.css')); ?>" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        :root {
            --primary-green: #1e3c2c;
            --secondary-green: #2d5a3b;
            --gold: #ffd700;
            --light-gold: #ffed4a;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
        }
        
        .bg-gradient-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            position: relative;
        }
        
        /* Islamic Pattern Background */
        .bg-gradient-primary::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.05'%3E%3Cpath fill='white' d='M50,0 L61.8,19 L84.5,22.5 L69,38 L72.5,61.8 L50,70 L27.5,61.8 L31,38 L15.5,22.5 L38.2,19 L50,0 Z'/%3E%3Ccircle cx='50' cy='50' r='15' fill='white'/%3E%3C/svg%3E");
            background-repeat: repeat;
            background-size: 60px;
            pointer-events: none;
        }
        
        .card {
            border-radius: 20px !important;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
        
        .form-control {
            border-radius: 30px !important;
            padding: 12px 20px;
            font-size: 14px;
        }
        
        .form-control:focus {
            box-shadow: 0 0 0 0.2rem rgba(45, 90, 59, 0.25);
            border-color: var(--secondary-green);
        }
        
        .btn {
            border-radius: 30px !important;
            padding: 12px 20px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-success {
            background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
            border: none;
        }
        
        .btn-success:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(45, 90, 59, 0.4);
            background: linear-gradient(135deg, var(--secondary-green), var(--primary-green));
        }
        
        .btn-outline-success {
            border-radius: 30px !important;
            border: 2px solid var(--secondary-green);
            color: var(--secondary-green);
        }
        
        .btn-outline-success:hover {
            background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
            border-color: transparent;
        }
        
        .input-group-text {
            border-radius: 30px 0 0 30px !important;
            background-color: #f8f9fc;
            border: none;
        }
        
        .input-group .form-control {
            border-radius: 0 30px 30px 0 !important;
        }
        
        /* Custom Checkbox */
        .custom-control-input:checked ~ .custom-control-label::before {
            background-color: var(--secondary-green);
            border-color: var(--secondary-green);
        }
        
        /* Animation */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .card {
            animation: fadeInUp 0.6s ease-out;
        }
        
        /* Islamic Corner Ornament */
        .islamic-corner {
            position: absolute;
            width: 100px;
            height: 100px;
            pointer-events: none;
        }
        
        .corner-tl {
            top: 0;
            left: 0;
            border-top: 3px solid var(--gold);
            border-left: 3px solid var(--gold);
            border-radius: 20px 0 0 0;
        }
        
        .corner-tr {
            top: 0;
            right: 0;
            border-top: 3px solid var(--gold);
            border-right: 3px solid var(--gold);
            border-radius: 0 20px 0 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .card {
                margin: 1rem !important;
            }
            
            .p-5 {
                padding: 1.5rem !important;
            }
        }
        
        /* Toast Notification */
        .toast-custom {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        }
        
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
        
        /* Loading Spinner */
        .spinner-custom {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.6s linear infinite;
            display: inline-block;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Password Strength Indicator */
        .password-strength {
            height: 4px;
            border-radius: 2px;
            margin-top: 8px;
            transition: all 0.3s ease;
        }
        
        .strength-weak { width: 33%; background: #dc3545; }
        .strength-medium { width: 66%; background: #ffc107; }
        .strength-strong { width: 100%; background: #28a745; }
        
        /* Floating Labels */
        .floating-label-group {
            position: relative;
            margin-bottom: 1.5rem;
        }
        
        .floating-label {
            position: absolute;
            left: 15px;
            top: 12px;
            color: #999;
            pointer-events: none;
            transition: 0.2s ease all;
            font-size: 14px;
        }
        
        .floating-input:focus ~ .floating-label,
        .floating-input:not(:placeholder-shown) ~ .floating-label {
            top: -10px;
            left: 10px;
            font-size: 11px;
            background: white;
            padding: 0 5px;
            color: var(--secondary-green);
        }
    </style>
    
    <!-- Favicon -->
    <link href="<?php echo e(isset($setting['favicon']) ? asset('storage/' . $setting['favicon']) : asset('img/favicon.png')); ?>" rel="icon" type="image/png">
</head>
<body class="bg-gradient-primary min-vh-100 d-flex justify-content-center align-items-center">

    <!-- Islamic Corner Ornaments -->
    <div class="islamic-corner corner-tl"></div>
    <div class="islamic-corner corner-tr"></div>

    <?php echo $__env->yieldContent('main-content'); ?>

    <!-- Scripts -->
    <script src="<?php echo e(asset('vendor/jquery/jquery.min.js')); ?>"></script>
    <script src="<?php echo e(asset('vendor/bootstrap/js/bootstrap.min.js')); ?>"></script>
    <script src="<?php echo e(asset('js/sb-admin-2.min.js')); ?>"></script>
    
    <!-- Custom Scripts -->
    <script>
        // Auto-hide alerts after 5 seconds
        $(document).ready(function() {
            setTimeout(function() {
                $('.alert').fadeOut('slow');
            }, 5000);
            
            // Add loading effect on form submit
            $('form').on('submit', function() {
                const submitBtn = $(this).find('button[type="submit"]');
                if (submitBtn.length) {
                    const originalText = submitBtn.html();
                    submitBtn.html('<span class="spinner-custom"></span> Memproses...');
                    submitBtn.prop('disabled', true);
                    
                    // Reset button after 3 seconds if no response (fallback)
                    setTimeout(function() {
                        submitBtn.html(originalText);
                        submitBtn.prop('disabled', false);
                    }, 3000);
                }
            });
        });
        
        // Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]+/)) strength++;
            if (password.match(/[A-Z]+/)) strength++;
            if (password.match(/[0-9]+/)) strength++;
            if (password.match(/[$@#&!]+/)) strength++;
            return strength;
        }
        
        // Toggle password visibility
        function togglePasswordVisibility(button) {
            const input = button.previousElementSibling;
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
        
        // Show toast notification
        function showToast(message, type = 'success') {
            const toast = $(`
                <div class="toast-custom alert alert-${type} alert-dismissible fade show" role="alert">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `);
            $('body').append(toast);
            setTimeout(() => toast.fadeOut('slow', function() { $(this).remove(); }), 5000);
        }
    </script>
</body>
</html><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/layouts/auth.blade.php ENDPATH**/ ?>