<!-- resources/views/settings/rotation.blade.php -->


<?php $__env->startSection('content'); ?>
<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="card">
				<div class="card-header">
					<h3>Pengaturan Rotasi Halaman</h3>
				</div>
				<div class="card-body">
					<form method="POST" action="<?php echo e(route('settings.update')); ?>" enctype="multipart/form-data">
						<?php echo csrf_field(); ?>
						<?php echo method_field('PUT'); ?>
						
						<div class="form-group mb-3">
							<label for="rotation_enabled">Aktifkan Rotasi Halaman</label>
							<select name="rotation_enabled" id="rotation_enabled" class="form-control">
								<option value="1" <?php echo e($setting->rotation_enabled ? 'selected' : ''); ?>>Ya</option>
								<option value="0" <?php echo e(!$setting->rotation_enabled ? 'selected' : ''); ?>>Tidak</option>
							</select>
							<small class="form-text text-muted">Jika dinonaktifkan, hanya halaman pertama yang akan ditampilkan</small>
						</div>
						
						<div class="form-group mb-3">
							<label for="rotation_interval">Interval Rotasi (detik)</label>
							<input type="number" name="rotation_interval" id="rotation_interval" 
							class="form-control" value="<?php echo e($setting->rotation_interval ?? 10); ?>" 
							min="1" max="3600" required>
							<small class="form-text text-muted">Minimal 1 detik, maksimal 3600 detik (1 jam)</small>
						</div>
						
						<div class="form-group mb-3">
							<label>Halaman yang Ditampilkan</label>
							<div class="table-responsive">
								<table class="table table-bordered">
									<thead>
										<tr>
											<th>Pilih</th>
											<th>Nama Halaman</th>
											<th>URL Route</th>
										</tr>
									</thead>
									<tbody>
										<?php
										$pages = [
										['url' => 'welcome.embed', 'name' => 'Dashboard Lengkap'],
										['url' => 'utama.embed', 'name' => 'Jadwal Sholat'],
										['url' => 'keuangan.embed', 'name' => 'Rincian Keuangan']
										];
										$selectedPages = $setting->rotation_pages ?? [];
										?>
										
										<?php $__currentLoopData = $pages; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $page): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
										<?php
										$isActive = false;
										foreach($selectedPages as $sp) {
											if($sp['url'] == $page['url'] && isset($sp['active']) && $sp['active']) {
												$isActive = true;
												break;
											}
										}
										?>
										<tr>
											<td>
												<input type="checkbox" name="rotation_pages[<?php echo e($loop->index); ?>][active]" 
												value="1" <?php echo e($isActive ? 'checked' : ''); ?>>
												<input type="hidden" name="rotation_pages[<?php echo e($loop->index); ?>][url]" value="<?php echo e($page['url']); ?>">
												<input type="hidden" name="rotation_pages[<?php echo e($loop->index); ?>][name]" value="<?php echo e($page['name']); ?>">
											</td>
											<td><?php echo e($page['name']); ?></td>
											<td><code><?php echo e($page['url']); ?></code></td>
										</tr>
										<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
									</tbody>
								</table>
							</div>
							<small class="form-text text-muted">Pilih halaman yang ingin ditampilkan dalam rotasi</small>
						</div>
						
						<div class="form-group">
							<button type="submit" class="btn btn-primary">Simpan Pengaturan</button>
							<a href="<?php echo e(route('rotator')); ?>" class="btn btn-info" target="_blank">Lihat Hasil Rotasi</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
	document.getElementById('rotation_enabled').addEventListener('change', function() {
		const intervalInput = document.getElementById('rotation_interval');
		intervalInput.disabled = !this.checked;
	});
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\settings\rotation.blade.php ENDPATH**/ ?>