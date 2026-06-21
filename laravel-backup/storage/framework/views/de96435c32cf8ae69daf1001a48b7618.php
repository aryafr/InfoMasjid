


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">Pengaturan Aplikasi</h1>
	</div>

	<?php if(session('success')): ?>
	<div class="alert alert-success alert-dismissible fade show" role="alert">
		<?php echo e(session('success')); ?>

		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">×</span>
		</button>
	</div>
	<?php endif; ?>

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
			<ul class="nav nav-tabs card-header-tabs" id="settingsTab" role="tablist">
				<li class="nav-item">
					<a class="nav-link active" id="general-tab" data-toggle="tab" href="#general" role="tab">
						<i class="fas fa-cog"></i> Umum
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" id="autoupdate-tab" data-toggle="tab" href="#autoupdate" role="tab">
						<i class="fas fa-sync-alt"></i> Auto-Update Jadwal
						<?php if($setting->auto_update_jadwal): ?>
						<span class="badge badge-success ml-2">AKTIF</span>
						<?php else: ?>
						<span class="badge badge-secondary ml-2">NONAKTIF</span>
						<?php endif; ?>
					</a>
				</li>
			</ul>
		</div>
		<div class="card-body">
			<form action="<?php echo e(route('settings.update')); ?>" method="POST" enctype="multipart/form-data" id="settingsForm">
				<?php echo csrf_field(); ?>
				<?php echo method_field('PUT'); ?>

				<div class="tab-content" id="settingsTabContent">
					
					<div class="tab-pane fade show active" id="general" role="tabpanel">
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label for="nama_aplikasi">Nama Aplikasi <span class="text-danger">*</span></label>
									<input type="text" class="form-control" id="nama_aplikasi" name="nama_aplikasi" 
									value="<?php echo e(old('nama_aplikasi', $setting->nama_aplikasi ?? '')); ?>" required>
								</div>

								<div class="form-group">
									<label for="footer">Footer Text</label>
									<textarea class="form-control" id="footer" name="footer" rows="3"><?php echo e(old('footer', $setting->footer ?? '')); ?></textarea>
									<small class="text-muted">HTML diperbolehkan</small>
								</div>

								<div class="form-group">
									<label for="running_text">Teks Berjalan</label>
									<textarea class="form-control" id="running_text" name="running_text" rows="3"><?php echo e(old('running_text', $setting->running_text ?? '')); ?></textarea>
								</div>
							</div>

							<div class="col-md-6">
								<div class="form-group">
									<label for="favicon">Favicon</label>
									<div class="custom-file">
										<input type="file" class="custom-file-input" id="favicon" name="favicon" accept=".ico,.png,.jpg,.jpeg,.gif">
										<label class="custom-file-label" for="favicon">Pilih file favicon</label>
									</div>
									<?php if($setting->favicon): ?>
									<div class="mt-3">
										<p class="mb-1">Favicon Saat Ini:</p>
										<img src="<?php echo e(asset('storage/' . $setting->favicon)); ?>" width="64" height="64" class="img-thumbnail d-block">
										<small class="text-muted">Rekomendasi: 64x64 px (format .ico atau .png)</small>
									</div>
									<?php endif; ?>
								</div>
							</div>
						</div>

						<hr class="my-4">

						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label for="logo">Logo Aplikasi</label>
									<div class="custom-file">
										<input type="file" class="custom-file-input" id="logo" name="logo" accept=".png,.jpg,.jpeg,.gif,.svg">
										<label class="custom-file-label" for="logo">Pilih file logo</label>
									</div>
									<?php if($setting->logo): ?>
									<div class="mt-3">
										<p class="mb-1">Logo Saat Ini:</p>
										<img src="<?php echo e(asset('storage/' . $setting->logo)); ?>" class="img-thumbnail" style="max-height: 150px; width: auto;">
										<small class="text-muted">Rekomendasi: maksimal 300x150 px (format .png dengan background transparan)</small>
									</div>
									<?php endif; ?>
								</div>
							</div>

							<div class="col-md-6">
								<div class="form-group">
									<label for="background">Background Sidebar</label>
									<div class="custom-file">
										<input type="file" class="custom-file-input" id="background" name="background" accept=".jpg,.jpeg,.png,.gif">
										<label class="custom-file-label" for="background">Pilih file background</label>
									</div>
									<?php if($setting->background): ?>
									<div class="mt-3">
										<p class="mb-1">Background Saat Ini:</p>
										<img src="<?php echo e(asset('storage/' . $setting->background)); ?>" class="img-thumbnail" style="max-height: 150px; width: 100%; object-fit: cover;">
										<small class="text-muted">Rekomendasi: 1920x1080 px (format .jpg atau .png)</small>
									</div>
									<?php endif; ?>
								</div>
							</div>
						</div>
					</div>

					
					<div class="tab-pane fade" id="autoupdate" role="tabpanel">
						<div class="row">
							<div class="col-lg-8">
								<div class="form-group">
									<div class="custom-control custom-switch">
										<input type="checkbox" class="custom-control-input" id="auto_update_jadwal" 
										name="auto_update_jadwal" value="1" 
										<?php echo e($setting->auto_update_jadwal ? 'checked' : ''); ?>>
										<label class="custom-control-label" for="auto_update_jadwal">
											<strong>Aktifkan Auto-Update Jadwal Sholat</strong>
										</label>
									</div>
									<small class="form-text text-muted">
										Jika diaktifkan, jadwal sholat akan diperbarui secara otomatis dari API eksternal
									</small>
								</div>

								<div id="autoUpdateOptions" style="<?php echo e($setting->auto_update_jadwal ? '' : 'display: none;'); ?>">
									<div class="form-group">
										<label for="auto_update_frequency">Frekuensi Update</label>
										<select class="form-control" id="auto_update_frequency" name="auto_update_frequency">
											<option value="daily" <?php echo e(($setting->auto_update_frequency ?? 'daily') == 'daily' ? 'selected' : ''); ?>>Harian</option>
											<option value="weekly" <?php echo e(($setting->auto_update_frequency ?? '') == 'weekly' ? 'selected' : ''); ?>>Mingguan</option>
											<option value="monthly" <?php echo e(($setting->auto_update_frequency ?? '') == 'monthly' ? 'selected' : ''); ?>>Bulanan</option>
										</select>
										<small class="form-text text-muted">Frekuensi pembaruan jadwal sholat</small>
									</div>

									<div class="form-group">
										<label for="auto_update_time">Waktu Update</label>
										<input type="time" class="form-control" id="auto_update_time" 
										name="auto_update_time" value="<?php echo e(substr($setting->auto_update_time ?? '00:00:00', 0, 5)); ?>">
										<small class="form-text text-muted">Waktu ketika sistem akan melakukan update otomatis</small>
									</div>

									<div class="row">
										<div class="col-md-6">
											<div class="form-group">
												<label for="auto_update_city">Kota</label>
												<input type="text" class="form-control" id="auto_update_city" 
												name="auto_update_city" value="<?php echo e($setting->auto_update_city ?? 'Jakarta'); ?>"
												placeholder="Contoh: Jakarta" required>
											</div>
										</div>
										<div class="col-md-6">
											<div class="form-group">
												<label for="auto_update_country">Negara</label>
												<input type="text" class="form-control" id="auto_update_country" 
												name="auto_update_country" value="<?php echo e($setting->auto_update_country ?? 'Indonesia'); ?>"
												placeholder="Contoh: Indonesia" required>
											</div>
										</div>
									</div>

									<div class="form-group">
										<label for="auto_update_method">Metode Perhitungan</label>
										<select class="form-control" id="auto_update_method" name="auto_update_method">
											<option value="11" <?php echo e(($setting->auto_update_method ?? 11) == 11 ? 'selected' : ''); ?>>Kementerian Agama RI (Metode 11)</option>
											<option value="20" <?php echo e(($setting->auto_update_method ?? 11) == 20 ? 'selected' : ''); ?>>Kementerian Agama RI (Metode 20)</option>
											<option value="1" <?php echo e(($setting->auto_update_method ?? 11) == 1 ? 'selected' : ''); ?>>University of Islamic Sciences, Karachi</option>
											<option value="2" <?php echo e(($setting->auto_update_method ?? 11) == 2 ? 'selected' : ''); ?>>Islamic Society of North America</option>
											<option value="3" <?php echo e(($setting->auto_update_method ?? 11) == 3 ? 'selected' : ''); ?>>Muslim World League</option>
											<option value="4" <?php echo e(($setting->auto_update_method ?? 11) == 4 ? 'selected' : ''); ?>>Umm Al-Qura University, Makkah</option>
											<option value="5" <?php echo e(($setting->auto_update_method ?? 11) == 5 ? 'selected' : ''); ?>>Egyptian General Authority of Survey</option>
										</select>
										<small class="form-text text-muted">Metode perhitungan waktu sholat yang digunakan</small>
									</div>

									<div class="alert alert-info">
										<i class="fas fa-info-circle"></i>
										<strong>Informasi:</strong> Jadwal sholat akan diupdate secara otomatis berdasarkan lokasi 
										<strong><?php echo e($setting->auto_update_city ?? 'Jakarta'); ?>, <?php echo e($setting->auto_update_country ?? 'Indonesia'); ?></strong> 
										dengan metode yang dipilih. Pastikan koneksi internet stabil.
									</div>

									<?php if($setting->last_auto_update): ?>
									<div class="alert alert-secondary">
										<i class="fas fa-clock"></i>
										<strong>Terakhir update:</strong> <?php echo e(\Carbon\Carbon::parse($setting->last_auto_update)->format('d M Y H:i:s')); ?>

									</div>
									<?php endif; ?>
								</div>
							</div>

							<div class="col-lg-4">
								<div class="card shadow-sm">
									<div class="card-header bg-info text-white">
										<i class="fas fa-info-circle"></i> Informasi Auto-Update
									</div>
									<div class="card-body">
										<p><strong>Status:</strong> 
											<?php if($setting->auto_update_jadwal): ?>
											<span class="badge badge-success">Aktif</span>
											<?php else: ?>
											<span class="badge badge-danger">Nonaktif</span>
											<?php endif; ?>
										</p>
										<p><strong>Frekuensi:</strong> <?php echo e(ucfirst($setting->auto_update_frequency ?? 'daily')); ?></p>
										<p><strong>Waktu:</strong> <?php echo e(substr($setting->auto_update_time ?? '00:00:00', 0, 5)); ?> WIB</p>
										<p><strong>Lokasi:</strong> <?php echo e($setting->auto_update_city ?? 'Jakarta'); ?>, <?php echo e($setting->auto_update_country ?? 'Indonesia'); ?></p>
										<hr>
										<p class="mb-0"><small>Data diambil dari API Aladhan.com</small></p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr class="my-4">

				<div class="text-right">
					<button type="submit" class="btn btn-primary">
						<i class="fas fa-save mr-2"></i> Simpan Semua Perubahan
					</button>
					<a href="<?php echo e(route('home')); ?>" class="btn btn-secondary">
						<i class="fas fa-arrow-left mr-2"></i> Kembali
					</a>
				</div>
			</form>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
<script>
    // Tampilkan/sembunyikan opsi auto-update
	document.getElementById('auto_update_jadwal').addEventListener('change', function() {
		document.getElementById('autoUpdateOptions').style.display = this.checked ? 'block' : 'none';
	});

    // Menampilkan nama file di input file
	document.querySelectorAll('.custom-file-input').forEach(function(input) {
		input.addEventListener('change', function(e) {
			var fileName = e.target.files[0] ? e.target.files[0].name : 'Pilih file';
			var nextSibling = e.target.nextElementSibling;
			nextSibling.innerText = fileName;
		});
	});

    // Validasi form sebelum submit
	document.getElementById('settingsForm').addEventListener('submit', function(e) {
		if (document.getElementById('auto_update_jadwal').checked) {
			const city = document.getElementById('auto_update_city').value;
			const country = document.getElementById('auto_update_country').value;
			const time = document.getElementById('auto_update_time').value;
			
			if (!city || !country || !time) {
				e.preventDefault();
				alert('Semua field auto-update harus diisi jika fitur diaktifkan!');
				
                // Buka tab auto-update
				$('#autoupdate-tab').tab('show');
			}
		}
	});

    // Simpan posisi tab terakhir
	$(document).ready(function() {
        // Jika ada error di tab auto-update, buka tab tersebut
		<?php if($errors->hasAny(['auto_update_frequency', 'auto_update_time', 'auto_update_city', 'auto_update_country', 'auto_update_method'])): ?>
		$('#autoupdate-tab').tab('show');
		<?php endif; ?>
	});
</script>
<?php $__env->stopPush(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\settings\edit.blade.php ENDPATH**/ ?>