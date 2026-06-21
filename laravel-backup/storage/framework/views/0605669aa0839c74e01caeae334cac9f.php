


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-qrcode"></i> Manajemen QRIS
		</h1>
		<a href="<?php echo e(route('qris.create')); ?>" class="btn btn-primary">
			<i class="fas fa-plus"></i> Tambah QRIS
		</a>
	</div>

	<?php if(session('success')): ?>
	<div class="alert alert-success alert-dismissible fade show" role="alert">
		<?php echo e(session('success')); ?>

		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<?php endif; ?>

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Daftar QRIS</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th width="50">No</th>
							<th>Nama</th>
							<th>Gambar</th>
							<th>Status</th>
							<th>Bank</th>
							<th>Atas Nama</th>
							<th width="150">Aksi</th>
						</tr>
					</thead>
					<tbody>
						<?php $__empty_1 = true; $__currentLoopData = $qrisList; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $qris): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
						<tr>
							<td class="text-center"><?php echo e($index + 1); ?></td>
							<td><?php echo e($qris->nama); ?></td>
							<td class="text-center">
								<?php if($qris->gambar): ?>
								<img src="<?php echo e($qris->gambar_url); ?>" alt="<?php echo e($qris->nama); ?>" 
								style="width: 50px; height: 50px; object-fit: cover;">
								<?php else: ?>
								<span class="text-muted">Tidak ada gambar</span>
								<?php endif; ?>
							</td>
							<td>
								<?php if($qris->status == 'aktif'): ?>
								<span class="badge badge-success">Aktif</span>
								<?php else: ?>
								<span class="badge badge-secondary">Nonaktif</span>
								<?php endif; ?>
							</td>
							<td><?php echo e($qris->bank ?? '-'); ?></td>
							<td><?php echo e($qris->atas_nama ?? '-'); ?></td>
							<td class="text-center">
								<div class="btn-group" role="group">
									<a href="<?php echo e(route('qris.show', $qris->id)); ?>" 
										class="btn btn-info btn-sm" title="Lihat">
										<i class="fas fa-eye"></i>
									</a>
									<a href="<?php echo e(route('qris.edit', $qris->id)); ?>" 
										class="btn btn-warning btn-sm" title="Edit">
										<i class="fas fa-edit"></i>
									</a>
									<?php if($qris->status != 'aktif'): ?>
									<form action="<?php echo e(route('qris.set-aktif', $qris->id)); ?>" 
										method="POST" class="d-inline">
										<?php echo csrf_field(); ?>
										<?php echo method_field('PUT'); ?>
										<button type="submit" class="btn btn-success btn-sm" 
										onclick="return confirm('Aktifkan QRIS ini?')" title="Aktifkan">
										<i class="fas fa-check-circle"></i>
									</button>
								</form>
								<?php endif; ?>
								<form action="<?php echo e(route('qris.destroy', $qris->id)); ?>" 
									method="POST" class="d-inline">
									<?php echo csrf_field(); ?>
									<?php echo method_field('DELETE'); ?>
									<button type="submit" class="btn btn-danger btn-sm" 
									onclick="return confirm('Yakin ingin menghapus QRIS ini?')" title="Hapus">
									<i class="fas fa-trash"></i>
								</button>
							</form>
						</div>
					</td>
				</tr>
				<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
				<tr>
					<td colspan="7" class="text-center">Belum ada data QRIS</td>
				</tr>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
</div>
</div>
</div>
<?php $__env->stopSection(); ?>

<?php $__env->startPush('styles'); ?>
<link href="https://cdn.datatables.net/1.10.24/css/dataTables.bootstrap4.min.css" rel="stylesheet">
<?php $__env->stopPush(); ?>

<?php $__env->startPush('scripts'); ?>
<script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.24/js/dataTables.bootstrap4.min.js"></script>
<script>
	$(document).ready(function() {
		$('#dataTable').DataTable({
			"language": {
				"url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Indonesian.json"
			}
		});
	});
</script>
<?php $__env->stopPush(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\qris\index.blade.php ENDPATH**/ ?>