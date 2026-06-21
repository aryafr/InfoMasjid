<!-- resources/views/jadwal_sholat/create.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-plus-circle"></i> Tambah Jadwal Sholat
		</h1>
		<a href="<?php echo e(route('jadwal_sholat.index')); ?>" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-6 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-info-circle"></i> Form Tambah Jadwal Sholat
					</h6>
				</div>
				<div class="card-body">
					<form action="<?php echo e(route('jadwal_sholat.store')); ?>" method="POST" id="createForm">
						<?php echo csrf_field(); ?>

						<div class="form-group">
							<label for="nama_sholat">Nama Sholat <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-mosque"></i></span>
								</div>
								<select name="nama_sholat" id="nama_sholat" class="form-control <?php $__errorArgs = ['nama_sholat'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" required>
									<option value="">-- Pilih Nama Sholat --</option>
									<option value="Subuh" <?php echo e(old('nama_sholat') == 'Subuh' ? 'selected' : ''); ?>>Subuh</option>
									<option value="Dzuhur" <?php echo e(old('nama_sholat') == 'Dzuhur' ? 'selected' : ''); ?>>Dzuhur</option>
									<option value="Ashar" <?php echo e(old('nama_sholat') == 'Ashar' ? 'selected' : ''); ?>>Ashar</option>
									<option value="Maghrib" <?php echo e(old('nama_sholat') == 'Maghrib' ? 'selected' : ''); ?>>Maghrib</option>
									<option value="Isya" <?php echo e(old('nama_sholat') == 'Isya' ? 'selected' : ''); ?>>Isya</option>
								</select>
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Pilih nama sholat yang sesuai
							</small>
							<?php $__errorArgs = ['nama_sholat'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
							<small class="text-danger"><?php echo e($message); ?></small>
							<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
						</div>

						<div class="form-group">
							<label for="waktu">Waktu <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-clock"></i></span>
								</div>
								<input type="time" name="waktu" id="waktu" class="form-control <?php $__errorArgs = ['waktu'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
								value="<?php echo e(old('waktu')); ?>" required>
								<div class="input-group-append">
									<span class="input-group-text">WIB</span>
								</div>
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Masukkan waktu dalam format 24 jam (HH:MM)
							</small>
							<?php $__errorArgs = ['waktu'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
							<small class="text-danger"><?php echo e($message); ?></small>
							<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
						</div>

						<hr>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Simpan Jadwal
							</button>
							<a href="<?php echo e(route('jadwal_sholat.index')); ?>" class="btn btn-secondary btn-lg px-4">
								<i class="fas fa-times"></i> Batal
							</a>
						</div>
					</form>
				</div>
			</div>

			<!-- Informasi Card -->
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-info">
						<i class="fas fa-lightbulb"></i> Tips Pengisian
					</h6>
				</div>
				<div class="card-body">
					<ul class="mb-0">
						<li>Pastikan nama sholat sesuai dengan urutan yang benar</li>
						<li>Waktu sholat menggunakan format 24 jam (contoh: 04:30 untuk Subuh)</li>
						<li>Urutan jadwal akan ditampilkan berdasarkan nama sholat</li>
						<li>Jadwal yang sudah disimpan akan langsung tampil di TV Display</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\jadwal_sholat\create.blade.php ENDPATH**/ ?>