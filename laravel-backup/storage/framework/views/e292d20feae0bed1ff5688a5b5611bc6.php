<!-- resources/views/keuangan/create.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-plus-circle"></i> Tambah Transaksi Keuangan
		</h1>
		<a href="<?php echo e(route('keuangan.index')); ?>" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-8 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-info-circle"></i> Form Transaksi
					</h6>
				</div>
				<div class="card-body">
					<form action="<?php echo e(route('keuangan.store')); ?>" method="POST" id="keuanganForm">
						<?php echo csrf_field(); ?>

						<div class="form-group">
							<label for="tanggal">Tanggal <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
								</div>
								<input type="date" class="form-control <?php $__errorArgs = ['tanggal'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
								id="tanggal" name="tanggal" value="<?php echo e(old('tanggal', date('Y-m-d'))); ?>" required>
							</div>
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

						<div class="form-group">
							<label for="deskripsi">Deskripsi <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-align-left"></i></span>
								</div>
								<input type="text" class="form-control <?php $__errorArgs = ['deskripsi'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
								id="deskripsi" name="deskripsi" value="<?php echo e(old('deskripsi')); ?>" required placeholder="Contoh: Infak Jumat, Pembelian ATK, dll">
							</div>
							<?php $__errorArgs = ['deskripsi'];
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
							<label for="kategori">Kategori</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-tag"></i></span>
								</div>
								<select class="form-control <?php $__errorArgs = ['kategori'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" id="kategori" name="kategori">
									<option value="" <?php echo e(old('kategori') == '' ? 'selected' : ''); ?>>- Pilih Kategori -</option>
									<option value="Infak" <?php echo e(old('kategori') == 'Infak' ? 'selected' : ''); ?>>Infak</option>
									<option value="Sumbangan" <?php echo e(old('kategori') == 'Sumbangan' ? 'selected' : ''); ?>>Sumbangan</option>
									<option value="Donatur" <?php echo e(old('kategori') == 'Donatur' ? 'selected' : ''); ?>>Donatur Tetap</option>
									<option value="Zakat" <?php echo e(old('kategori') == 'Zakat' ? 'selected' : ''); ?>>Zakat</option>
									<option value="Operasional" <?php echo e(old('kategori') == 'Operasional' ? 'selected' : ''); ?>>Operasional</option>
									<option value="Konsumsi" <?php echo e(old('kategori') == 'Konsumsi' ? 'selected' : ''); ?>>Konsumsi</option>
									<option value="Perawatan" <?php echo e(old('kategori') == 'Perawatan' ? 'selected' : ''); ?>>Perawatan</option>
									<option value="Inventaris" <?php echo e(old('kategori') == 'Inventaris' ? 'selected' : ''); ?>>Inventaris</option>
									<option value="Pembangunan" <?php echo e(old('kategori') == 'Pembangunan' ? 'selected' : ''); ?>>Pembangunan</option>
									<option value="Kegiatan" <?php echo e(old('kategori') == 'Kegiatan' ? 'selected' : ''); ?>>Kegiatan</option>
									<option value="Utilitas" <?php echo e(old('kategori') == 'Utilitas' ? 'selected' : ''); ?>>Utilitas (Listrik/Air)</option>
								</select>
							</div>
							<?php $__errorArgs = ['kategori'];
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

						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label for="pemasukan">Pemasukan (Rp)</label>
									<div class="input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"><i class="fas fa-arrow-down text-success"></i></span>
										</div>
										<input type="number" class="form-control <?php $__errorArgs = ['pemasukan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
										id="pemasukan" name="pemasukan" step="1" value="<?php echo e(old('pemasukan')); ?>" placeholder="0">
									</div>
									<?php $__errorArgs = ['pemasukan'];
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
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<label for="pengeluaran">Pengeluaran (Rp)</label>
									<div class="input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"><i class="fas fa-arrow-up text-danger"></i></span>
										</div>
										<input type="number" class="form-control <?php $__errorArgs = ['pengeluaran'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
										id="pengeluaran" name="pengeluaran" step="1" value="<?php echo e(old('pengeluaran')); ?>" placeholder="0">
									</div>
									<?php $__errorArgs = ['pengeluaran'];
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
							</div>
						</div>

						<hr>

						<div class="alert alert-info">
							<i class="fas fa-info-circle"></i>
							<strong>Informasi:</strong> Saldo akan dihitung secara otomatis berdasarkan transaksi sebelumnya.
						</div>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Simpan Transaksi
							</button>
							<a href="<?php echo e(route('keuangan.index')); ?>" class="btn btn-secondary btn-lg px-4">
								<i class="fas fa-times"></i> Batal
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
    // Auto format number as Rupiah
	const pemasukanInput = document.getElementById('pemasukan');
	const pengeluaranInput = document.getElementById('pengeluaran');
	
	function formatRupiah(value) {
		return new Intl.NumberFormat('id-ID').format(value);
	}
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\keuangan\create.blade.php ENDPATH**/ ?>