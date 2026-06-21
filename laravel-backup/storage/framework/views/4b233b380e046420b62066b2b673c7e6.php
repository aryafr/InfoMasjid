<!-- resources/views/sholat_jumat/index.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-praying-hands"></i> Kelola Sholat Jumat
		</h1>
		<a href="<?php echo e(route('sholat_jumat.create')); ?>" class="btn btn-primary btn-sm shadow-sm">
			<i class="fas fa-plus-circle"></i> Tambah Jadwal Sholat Jumat
		</a>
	</div>

	<?php if(session('success')): ?>
	<div class="alert alert-success alert-dismissible fade show" role="alert">
		<i class="fas fa-check-circle mr-2"></i> <?php echo e(session('success')); ?>

		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<?php endif; ?>

	<?php if(session('error')): ?>
	<div class="alert alert-danger alert-dismissible fade show" role="alert">
		<i class="fas fa-exclamation-circle mr-2"></i> <?php echo e(session('error')); ?>

		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<?php endif; ?>

	<!-- Info Card -->
	<div class="row mb-4">
		<div class="col-md-12">
			<div class="card border-left-success shadow">
				<div class="card-body">
					<div class="row">
						<div class="col-md-4">
							<div class="text-center">
								<i class="fas fa-calendar-alt fa-2x text-success mb-2"></i>
								<h6 class="font-weight-bold">Hari Ini</h6>
								<p class="mb-0"><?php echo e(\Carbon\Carbon::now('Asia/Jakarta')->translatedFormat('l, d F Y')); ?></p>
							</div>
						</div>
						<div class="col-md-4">
							<div class="text-center">
								<i class="fas fa-mosque fa-2x text-success mb-2"></i>
								<h6 class="font-weight-bold">Total Jadwal</h6>
								<p class="mb-0"><?php echo e($sholatJumat->count()); ?> Jadwal</p>
							</div>
						</div>
						<div class="col-md-4">
							<div class="text-center">
								<i class="fas fa-hourglass-half fa-2x text-success mb-2"></i>
								<h6 class="font-weight-bold">Jadwal Mendatang</h6>
								<p class="mb-0">
									<?php
									$upcoming = $sholatJumat->where('tanggal', '>=', \Carbon\Carbon::now('Asia/Jakarta')->startOfDay())->count();
									?>
									<?php echo e($upcoming); ?> Jadwal
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Data Table -->
	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">
				<i class="fas fa-list"></i> Daftar Jadwal Sholat Jumat
			</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th width="30">No</th>
							<th>Tanggal</th>
							<th>Hari</th>
							<th>Imam</th>
							<th>Khatib</th>
							<th>Muadzin</th>
							<th>Status</th>
							<th width="100">Aksi</th>
						</tr>
					</thead>
					<tbody>
						<?php $__currentLoopData = $sholatJumat; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
						<?php
						$today = \Carbon\Carbon::now('Asia/Jakarta')->startOfDay();
						$tanggalJumat = \Carbon\Carbon::parse($item->tanggal);
						$isUpcoming = $tanggalJumat->gte($today);
						$isToday = $tanggalJumat->isToday();
						$isPast = $tanggalJumat->lt($today);
						?>
						<tr>
							<td class="text-center"><?php echo e($index + 1); ?></td>
							<td class="text-nowrap">
								<span class="badge <?php echo e($isToday ? 'badge-success' : ($isUpcoming ? 'badge-info' : 'badge-secondary')); ?> p-2">
									<i class="fas fa-calendar-day"></i> <?php echo e(\Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y')); ?>

								</span>
							</td>
							<td>
								<span class="badge <?php echo e($isToday ? 'badge-success' : 'badge-light'); ?> p-2">
									<i class="fas fa-calendar-week"></i> <?php echo e(\Carbon\Carbon::parse($item->tanggal)->translatedFormat('l')); ?>

								</span>
							</td>
							<td>
								<?php if($item->imam): ?>
								<div class="d-flex align-items-center">
									<div class="avatar-circle bg-primary text-white mr-2" style="width: 30px; height: 30px; font-size: 12px;">
										<?php echo e(strtoupper(substr($item->imam, 0, 1))); ?>

									</div>
									<span><?php echo e($item->imam); ?></span>
								</div>
								<?php else: ?>
								<span class="text-muted">- Belum ditentukan -</span>
								<?php endif; ?>
							</td>
							<td>
								<?php if($item->khatib): ?>
								<div class="d-flex align-items-center">
									<div class="avatar-circle bg-success text-white mr-2" style="width: 30px; height: 30px; font-size: 12px;">
										<?php echo e(strtoupper(substr($item->khatib, 0, 1))); ?>

									</div>
									<span><?php echo e($item->khatib); ?></span>
								</div>
								<?php else: ?>
								<span class="text-muted">- Belum ditentukan -</span>
								<?php endif; ?>
							</td>
							<td>
								<?php if($item->muadzin): ?>
								<div class="d-flex align-items-center">
									<div class="avatar-circle bg-info text-white mr-2" style="width: 30px; height: 30px; font-size: 12px;">
										<?php echo e(strtoupper(substr($item->muadzin, 0, 1))); ?>

									</div>
									<span><?php echo e($item->muadzin); ?></span>
								</div>
								<?php else: ?>
								<span class="text-muted">- Belum ditentukan -</span>
								<?php endif; ?>
							</td>
							<td>
								<?php if($isToday): ?>
								<span class="badge badge-success">
									<i class="fas fa-check-circle"></i> Hari Ini
								</span>
								<?php elseif($isUpcoming): ?>
								<span class="badge badge-info">
									<i class="fas fa-hourglass-half"></i> Akan Datang
								</span>
								<?php else: ?>
								<span class="badge badge-secondary">
									<i class="fas fa-history"></i> Telah Berlalu
								</span>
								<?php endif; ?>
							</td>
							<td class="text-center">
								<a href="<?php echo e(route('sholat_jumat.edit', $item)); ?>" class="btn btn-sm btn-warning" data-toggle="tooltip" title="Edit">
									<i class="fas fa-edit"></i>
								</a>
								<form action="<?php echo e(route('sholat_jumat.destroy', $item)); ?>" method="POST" class="d-inline delete-form" id="delete-form-<?php echo e($item->id); ?>">
									<?php echo csrf_field(); ?>
									<?php echo method_field('DELETE'); ?>
									<button type="button" class="btn btn-sm btn-danger delete-btn" data-id="<?php echo e($item->id); ?>" data-tanggal="<?php echo e(\Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y')); ?>" data-toggle="tooltip" title="Hapus">
										<i class="fas fa-trash-alt"></i>
									</button>
								</form>
							</td>
						</tr>
						<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- Custom CSS -->
<style>
	.avatar-circle {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 14px;
	}
	.table-hover tbody tr:hover {
		background-color: rgba(10, 77, 104, 0.05);
	}
	.badge {
		font-size: 12px;
		font-weight: 500;
		padding: 5px 10px;
	}
	.btn-sm {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
	}
</style>

<!-- Custom Script -->
<script>
	document.addEventListener('DOMContentLoaded', function() {
        // Tooltip initialization
		if (typeof $ !== 'undefined' && $.fn.tooltip) {
			$('[data-toggle="tooltip"]').tooltip();
		}
		
        // Delete confirmation
		const deleteButtons = document.querySelectorAll('.delete-btn');
		
		deleteButtons.forEach(button => {
			button.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				const formId = this.getAttribute('data-id');
				const tanggal = this.getAttribute('data-tanggal') || 'jadwal ini';
				const form = document.getElementById(`delete-form-${formId}`);
				
                // Gunakan SweetAlert jika tersedia
				if (typeof Swal !== 'undefined' && Swal.fire) {
					Swal.fire({
						title: 'Apakah Anda yakin?',
						html: `Jadwal sholat Jumat tanggal <strong>${tanggal}</strong> akan dihapus secara permanen!`,
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#d33',
						cancelButtonColor: '#3085d6',
						confirmButtonText: 'Ya, hapus!',
						cancelButtonText: 'Batal'
					}).then((result) => {
						if (result.isConfirmed) {
							form.submit();
						}
					});
				} else {
                    // Fallback ke confirm biasa
					if (confirm(`Apakah Anda yakin ingin menghapus jadwal sholat Jumat tanggal ${tanggal}?`)) {
						form.submit();
					}
				}
			});
		});
	});
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/sholat_jumat/index.blade.php ENDPATH**/ ?>