


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-edit"></i> Edit QRIS
		</h1>
		<a href="<?php echo e(route('qris.index')); ?>" class="btn btn-secondary">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<?php if($errors->any()): ?>
	<div class="alert alert-danger">
		<ul class="mb-0">
			<?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
			<li><?php echo e($error); ?></li>
			<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
		</ul>
	</div>
	<?php endif; ?>

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Form Edit QRIS</h6>
		</div>
		<div class="card-body">
			<form action="<?php echo e(route('qris.update', $qris)); ?>" method="POST" enctype="multipart/form-data">
				<?php echo csrf_field(); ?>
				<?php echo method_field('PUT'); ?>
				
				<div class="form-group">
					<label for="nama">Nama QRIS <span class="text-danger">*</span></label>
					<input type="text" name="nama" id="nama" 
					class="form-control <?php $__errorArgs = ['nama'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
					value="<?php echo e(old('nama', $qris->nama)); ?>" required>
					<?php $__errorArgs = ['nama'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
					<div class="invalid-feedback"><?php echo e($message); ?></div>
					<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
				</div>

				<div class="form-group">
					<label>Gambar QRIS Saat Ini</label><br>
					<?php if($qris->gambar): ?>
					<img src="<?php echo e($qris->gambar_url); ?>" alt="<?php echo e($qris->nama); ?>" 
					style="width: 150px; height: 150px; object-fit: cover; border: 1px solid #ddd;">
					<?php else: ?>
					<span class="text-muted">Tidak ada gambar</span>
					<?php endif; ?>
				</div>

				<div class="form-group">
					<label for="gambar">Ganti Gambar QRIS (Opsional)</label>
					<input type="file" name="gambar" id="gambar" 
					class="form-control-file <?php $__errorArgs = ['gambar'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
					accept="image/*">
					<small class="form-text text-muted">Format: JPG, PNG, GIF. Maksimal 2MB</small>
					<?php $__errorArgs = ['gambar'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
					<div class="invalid-feedback"><?php echo e($message); ?></div>
					<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
				</div>

				<div class="form-group">
					<label for="keterangan">Keterangan</label>
					<textarea name="keterangan" id="keterangan" 
					class="form-control <?php $__errorArgs = ['keterangan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
					rows="3"><?php echo e(old('keterangan', $qris->keterangan)); ?></textarea>
					<?php $__errorArgs = ['keterangan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
					<div class="invalid-feedback"><?php echo e($message); ?></div>
					<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
				</div>

				<div class="row">
					<div class="col-md-4">
						<div class="form-group">
							<label for="bank">Bank</label>
							<input type="text" name="bank" id="bank" 
							class="form-control <?php $__errorArgs = ['bank'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
							value="<?php echo e(old('bank', $qris->bank)); ?>">
							<?php $__errorArgs = ['bank'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
							<div class="invalid-feedback"><?php echo e($message); ?></div>
							<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-group">
							<label for="nomor_rekening">Nomor Rekening</label>
							<input type="text" name="nomor_rekening" id="nomor_rekening" 
							class="form-control <?php $__errorArgs = ['nomor_rekening'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
							value="<?php echo e(old('nomor_rekening', $qris->nomor_rekening)); ?>">
							<?php $__errorArgs = ['nomor_rekening'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
							<div class="invalid-feedback"><?php echo e($message); ?></div>
							<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-group">
							<label for="atas_nama">Atas Nama</label>
							<input type="text" name="atas_nama" id="atas_nama" 
							class="form-control <?php $__errorArgs = ['atas_nama'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
							value="<?php echo e(old('atas_nama', $qris->atas_nama)); ?>">
							<?php $__errorArgs = ['atas_nama'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
							<div class="invalid-feedback"><?php echo e($message); ?></div>
							<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label for="status">Status <span class="text-danger">*</span></label>
					<select name="status" id="status" class="form-control <?php $__errorArgs = ['status'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" required>
						<option value="nonaktif" <?php echo e(old('status', $qris->status) == 'nonaktif' ? 'selected' : ''); ?>>Nonaktif</option>
						<option value="aktif" <?php echo e(old('status', $qris->status) == 'aktif' ? 'selected' : ''); ?>>Aktif</option>
					</select>
					<small class="form-text text-muted">Hanya satu QRIS yang dapat berstatus Aktif</small>
					<?php $__errorArgs = ['status'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
					<div class="invalid-feedback"><?php echo e($message); ?></div>
					<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
				</div>

				<div class="form-group">
					<button type="submit" class="btn btn-primary">
						<i class="fas fa-save"></i> Update
					</button>
					<a href="<?php echo e(route('qris.index')); ?>" class="btn btn-secondary">
						<i class="fas fa-times"></i> Batal
					</a>
				</div>
			</form>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\qris\edit.blade.php ENDPATH**/ ?>