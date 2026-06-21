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
                                    <h1 class="h4 text-gray-900 mb-4">Konfirmasi Kata Sandi</h1>
                                    <p>Silakan konfirmasi kata sandi Anda sebelum melanjutkan.</p>
                                </div>

                                <?php if($errors->any()): ?>
                                <div class="alert alert-danger border-left-danger" role="alert">
                                    <ul class="pl-4 my-2">
                                        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <li><?php echo e($error); ?></li>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </ul>
                                </div>
                                <?php endif; ?>

                                <?php if(session('status')): ?>
                                <div class="alert alert-success border-left-success" role="alert">
                                    <?php echo e(session('status')); ?>

                                </div>
                                <?php endif; ?>

                                <form method="POST" action="<?php echo e(route('password.confirm')); ?>" class="user">
                                    <input type="hidden" name="_token" value="<?php echo e(csrf_token()); ?>">

                                    <div class="form-group">
                                        <input type="password" class="form-control form-control-user" name="password" placeholder="Kata Sandi" required autocomplete="current-password">
                                    </div>

                                    <div class="form-group">
                                        <button type="submit" class="btn btn-primary btn-user btn-block">
                                            Konfirmasi Kata Sandi
                                        </button>
                                    </div>
                                </form>

                                <hr>

                                <?php if(Route::has('password.request')): ?>
                                <div class="text-center">
                                    <a class="small" href="<?php echo e(route('password.request')); ?>">
                                        Lupa Kata Sandi?
                                    </a>
                                </div>
                                <?php endif; ?>
                            </div>
                            <div class="text-center">
                                <a class="small" href="<?php echo e(url('/')); ?>">
                                    ← Kembali ke Beranda
                                </a>
                            </div>

                            <!-- Footer Dinamis -->
                            <center>
                                <?php if(isset($setting['footer'])): ?>
                                <?php echo $setting['footer']; ?>

                                <?php else: ?>
                                <a href="https://wa.me/628179851011" target="_blank" style="font-size: 12px; text-decoration: none; color: gray;">
                                    Hak Cipta &copy; <?php echo e(now()->year); ?> Ali Mochtar Development System
                                </a>
                                <?php endif; ?>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.auth', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\auth\passwords\confirm.blade.php ENDPATH**/ ?>