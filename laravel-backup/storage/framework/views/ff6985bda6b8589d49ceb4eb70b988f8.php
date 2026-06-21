


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-qrcode"></i> Detail QRIS
		</h1>
		<div>
			<a href="<?php echo e(route('qris.edit', $qris->id)); ?>" class="btn btn-warning">
				<i class="fas fa-edit"></i> Edit
			</a>
			<a href="<?php echo e(route('qris.index')); ?>" class="btn btn-secondary">
				<i class="fas fa-arrow-left"></i> Kembali
			</a>
		</div>
	</div>

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Informasi QRIS</h6>
		</div>
		<div class="card-body">
			<div class="row">
				<div class="col-md-4 text-center">
					<?php if($qris->gambar): ?>
					<img src="<?php echo e($qris->gambar_url); ?>" alt="<?php echo e($qris->nama); ?>" 
					style="width: 250px; height: 250px; object-fit: contain; border: 1px solid #ddd;">
					<?php else: ?>
					<div class="alert alert-warning">Tidak ada gambar</div>
					<?php endif; ?>
					
					<div class="mt-3">
						<?php if($qris->status == 'aktif'): ?>
						<span class="badge badge-success badge-lg">Status: Aktif</span>
						<?php else: ?>
						<span class="badge badge-secondary badge-lg">Status: Nonaktif</span>
						<?php endif; ?>
					</div>
				</div>
				<div class="col-md-8">
					<table class="table table-bordered">
						<tr>
							<th width="150">Nama QRIS</th>
							<td><?php echo e($qris->nama); ?></td>
						</tr>
						<tr>
							<th>Keterangan</th>
							<td><?php echo e($qris->keterangan ?? '-'); ?></td>
						</tr>
						<tr>
							<th>Bank</th>
							<td><?php echo e($qris->bank ?? '-'); ?></td>
						</tr>
						<tr>
							<th>Nomor Rekening</th>
							<td><?php echo e($qris->nomor_rekening ?? '-'); ?></td>
						</tr>
						<tr>
							<th>Atas Nama</th>
							<td><?php echo e($qris->atas_nama ?? '-'); ?></td>
						</tr>
						<tr>
							<th>Dibuat Pada</th>
							<td><?php echo e($qris->created_at ? $qris->created_at->format('d/m/Y H:i:s') : '-'); ?></td>
						</tr>
						<tr>
							<th>Terakhir Update</th>
							<td><?php echo e($qris->updated_at ? $qris->updated_at->format('d/m/Y H:i:s') : '-'); ?></td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\qris\show.blade.php ENDPATH**/ ?>