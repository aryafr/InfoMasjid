<?php $__env->startSection('main-content'); ?>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
            <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">
                    <div class="row">
                        <div class="col-lg-6 d-none d-lg-block bg-password-image"></div>
                        <div class="col-lg-6">
                            <div class="p-5">
                                <div class="text-center">
                                    <h1 class="h4 text-gray-900 mb-4">Verifikasi Alamat Email Anda</h1>
                                </div>

                                <?php if(session('resent')): ?>
                                <div class="alert alert-success border-left-success" role="alert">
                                    Tautan verifikasi baru telah dikirim ke alamat email Anda.
                                </div>
                                <?php endif; ?>

                                Sebelum melanjutkan, silakan periksa email Anda untuk menemukan tautan verifikasi.
                                Jika Anda belum menerima email tersebut,
                                <a href="<?php echo e(route('verification.resend')); ?>">klik di sini untuk meminta yang baru</a>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.auth', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\auth\verify.blade.php ENDPATH**/ ?>