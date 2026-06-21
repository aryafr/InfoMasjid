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
                                    <h1 class="h4 text-gray-900 mb-4">Atur Ulang Kata Sandi</h1>
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

                                <form method="POST" action="<?php echo e(route('password.update')); ?>" class="user">
                                    <?php echo csrf_field(); ?>

                                    <input type="hidden" name="token" value="<?php echo e($token); ?>">

                                    <div class="form-group">
                                        <input type="email" class="form-control form-control-user" name="email" placeholder="Alamat Email" value="<?php echo e($email ?? old('email')); ?>" required autofocus>
                                    </div>

                                    <div class="form-group">
                                        <input type="password" class="form-control form-control-user" name="password" placeholder="Kata Sandi Baru" required>
                                    </div>

                                    <div class="form-group">
                                        <input type="password" class="form-control form-control-user" name="password_confirmation" placeholder="Konfirmasi Kata Sandi" required>
                                    </div>

                                    <div class="form-group">
                                        <button type="submit" class="btn btn-primary btn-user btn-block">
                                            Simpan Kata Sandi Baru
                                        </button>
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.auth', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\auth\passwords\reset.blade.php ENDPATH**/ ?>