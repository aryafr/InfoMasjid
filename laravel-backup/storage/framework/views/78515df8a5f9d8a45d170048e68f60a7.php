<!-- resources/views/pengumuman/create.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-plus-circle"></i> Tambah Pengumuman
		</h1>
		<a href="<?php echo e(route('pengumuman.index')); ?>" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-8 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-info-circle"></i> Form Tambah Pengumuman
					</h6>
				</div>
				<div class="card-body">
					<form action="<?php echo e(route('pengumuman.store')); ?>" method="POST" id="createForm">
						<?php echo csrf_field(); ?>

						<div class="form-group">
							<label for="isi">Isi Pengumuman <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-bullhorn"></i></span>
								</div>
								<textarea name="isi" id="isi" class="form-control <?php $__errorArgs = ['isi'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
								rows="5" required placeholder="Tulis isi pengumuman di sini..."><?php echo e(old('isi')); ?></textarea>
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Tulis pengumuman yang ingin disampaikan kepada jamaah
							</small>
							<div class="mt-2 text-muted small">
								<span id="charCount">0</span> karakter
							</div>
							<?php $__errorArgs = ['isi'];
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
							<label for="tanggal">Tanggal <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
								</div>
								<input type="date" name="tanggal" id="tanggal" class="form-control <?php $__errorArgs = ['tanggal'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
								value="<?php echo e(old('tanggal', date('Y-m-d'))); ?>" required>
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Tanggal pengumuman akan ditampilkan
							</small>
							<?php $__errorArgs = ['tanggal'];
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

						<!-- Preview Card -->
						<div class="card bg-light mb-3">
							<div class="card-header">
								<i class="fas fa-eye"></i> Pratinjau
							</div>
							<div class="card-body">
								<div id="previewContent" class="text-muted">
									Pratinjau akan muncul di sini...
								</div>
							</div>
						</div>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Simpan Pengumuman
							</button>
							<a href="<?php echo e(route('pengumuman.index')); ?>" class="btn btn-secondary btn-lg px-4">
								<i class="fas fa-times"></i> Batal
							</a>
						</div>
					</form>
				</div>
			</div>

			<!-- Tips Card -->
			<div class="card shadow mb-4 border-left-info">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-info">
						<i class="fas fa-lightbulb"></i> Tips Menulis Pengumuman
					</h6>
				</div>
				<div class="card-body">
					<ul class="mb-0">
						<li>Gunakan bahasa yang jelas dan mudah dipahami</li>
						<li>Sebutkan waktu, tempat, dan pihak yang terkait</li>
						<li>Untuk pengumuman penting, gunakan format yang menonjol</li>
						<li>Pengumuman akan ditampilkan di running text TV Display</li>
						<li>Pengumuman dengan tanggal mendatang akan otomatis tampil</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
    // Character counter
	const textarea = document.getElementById('isi');
	const charCount = document.getElementById('charCount');
	const previewContent = document.getElementById('previewContent');
	
	function updatePreview() {
		const text = textarea.value;
		charCount.textContent = text.length;
		
		if (text.trim() === '') {
			previewContent.innerHTML = '<em class="text-muted">Pratinjau akan muncul di sini...</em>';
		} else {
			previewContent.innerHTML = text.replace(/\n/g, '<br>');
		}
	}
	
	textarea.addEventListener('input', updatePreview);
	updatePreview();
	
    // Set default date to today if empty
	const tanggalInput = document.getElementById('tanggal');
	if (!tanggalInput.value) {
		tanggalInput.value = new Date().toISOString().split('T')[0];
	}
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\pengumuman\create.blade.php ENDPATH**/ ?>