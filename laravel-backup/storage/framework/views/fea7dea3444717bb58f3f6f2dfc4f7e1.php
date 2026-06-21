


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-moon"></i> Jadwal Sholat Idul Fitri
		</h1>
		<a href="<?php echo e(route('idul-fitri.create')); ?>" class="btn btn-primary">
			<i class="fas fa-plus"></i> Tambah Jadwal
		</a>
	</div>

	<?php if(session('success')): ?>
	<div class="alert alert-success"><?php echo e(session('success')); ?></div>
	<?php endif; ?>

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Daftar Jadwal Idul Fitri</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th>Tahun</th>
							<th>Tanggal</th>
							<th>Imam</th>
							<th>Khatib</th>
							<th>Muadzin</th>
							<th>Waktu</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						<?php $__empty_1 = true; $__currentLoopData = $sholatIdulFitri; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
						<tr>
							<td><?php echo e($item->tahun); ?></td>
							<td><?php echo e(\Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y')); ?></td>
							<td><?php echo e($item->imam ?? '-'); ?></td>
							<td><?php echo e($item->khatib ?? '-'); ?></td>
							<td><?php echo e($item->muadzin ?? '-'); ?></td>
							<td><?php echo e($item->waktu ? \Carbon\Carbon::parse($item->waktu)->format('H:i') : '07:00'); ?> WIB</td>
							<td>
								<a href="<?php echo e(route('idul-fitri.edit', $item)); ?>" class="btn btn-warning btn-sm">
									<i class="fas fa-edit"></i>
								</a>
								<form action="<?php echo e(route('idul-fitri.destroy', $item)); ?>" method="POST" class="d-inline">
									<?php echo csrf_field(); ?>
									<?php echo method_field('DELETE'); ?>
									<button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin menghapus?')">
										<i class="fas fa-trash"></i>
									</button>
								</form>
							</td>
						</tr>
						<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
						<tr>
							<td colspan="7" class="text-center">Belum ada data jadwal Idul Fitri</td>
						</tr>
						<?php endif; ?>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\idul-fitri\index.blade.php ENDPATH**/ ?>