<!-- resources/views/keuangan/index.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-wallet"></i> Kelola Keuangan
		</h1>
		<div>
			<a href="<?php echo e(route('keuangan.create')); ?>" class="btn btn-primary btn-sm shadow-sm">
				<i class="fas fa-plus-circle"></i> Tambah Transaksi
			</a>
			<div class="btn-group ml-2">
				<button type="button" class="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown">
					<i class="fas fa-download"></i> Export
				</button>
				<div class="dropdown-menu dropdown-menu-right">
					<a class="dropdown-item" href="<?php echo e(route('export.keuangan', ['type' => 'excel'])); ?>">
						<i class="fas fa-file-excel text-success"></i> Export ke Excel
					</a>
					<a class="dropdown-item" href="<?php echo e(route('export.keuangan', ['type' => 'pdf'])); ?>">
						<i class="fas fa-file-pdf text-danger"></i> Export ke PDF
					</a>
				</div>
			</div>
			<a href="<?php echo e(route('laporan.keuangan')); ?>" class="btn btn-info btn-sm shadow-sm ml-2">
				<i class="fas fa-chart-line"></i> Laporan
			</a>
		</div>
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

	<!-- Summary Cards -->
	<div class="row mb-4">
		<div class="col-xl-4 col-md-6 mb-4">
			<div class="card border-left-success shadow h-100">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-success text-uppercase mb-1">
								<i class="fas fa-arrow-down"></i> Total Pemasukan
							</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								Rp <?php echo e(number_format($totalPemasukan, 0, ',', '.')); ?>

							</div>
							<div class="mt-2 small text-muted">
								<i class="fas fa-chart-line"></i> 
								<?php
								$lastMonthIncome = \App\Models\Keuangan::whereMonth('tanggal', now()->subMonth())->sum('pemasukan');
								$diffIncome = $totalPemasukan - $lastMonthIncome;
								$percentIncome = $lastMonthIncome > 0 ? ($diffIncome / $lastMonthIncome) * 100 : 0;
								?>
								<?php if($diffIncome > 0): ?>
								<span class="text-success"><i class="fas fa-arrow-up"></i> <?php echo e(number_format($percentIncome, 1)); ?>%</span>
								<?php elseif($diffIncome < 0): ?>
								<span class="text-danger"><i class="fas fa-arrow-down"></i> <?php echo e(number_format(abs($percentIncome), 1)); ?>%</span>
								<?php else: ?>
								<span class="text-muted">0%</span>
								<?php endif; ?>
								dari bulan lalu
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-chart-line fa-2x text-gray-300"></i>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="col-xl-4 col-md-6 mb-4">
			<div class="card border-left-danger shadow h-100">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
								<i class="fas fa-arrow-up"></i> Total Pengeluaran
							</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								Rp <?php echo e(number_format($totalPengeluaran, 0, ',', '.')); ?>

							</div>
							<div class="mt-2 small text-muted">
								<i class="fas fa-chart-line"></i>
								<?php
								$lastMonthExpense = \App\Models\Keuangan::whereMonth('tanggal', now()->subMonth())->sum('pengeluaran');
								$diffExpense = $totalPengeluaran - $lastMonthExpense;
								$percentExpense = $lastMonthExpense > 0 ? ($diffExpense / $lastMonthExpense) * 100 : 0;
								?>
								<?php if($diffExpense > 0): ?>
								<span class="text-danger"><i class="fas fa-arrow-up"></i> <?php echo e(number_format($percentExpense, 1)); ?>%</span>
								<?php elseif($diffExpense < 0): ?>
								<span class="text-success"><i class="fas fa-arrow-down"></i> <?php echo e(number_format(abs($percentExpense), 1)); ?>%</span>
								<?php else: ?>
								<span class="text-muted">0%</span>
								<?php endif; ?>
								dari bulan lalu
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-chart-pie fa-2x text-gray-300"></i>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="col-xl-4 col-md-6 mb-4">
			<div class="card border-left-primary shadow h-100">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
								<i class="fas fa-wallet"></i> Saldo
							</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								Rp <?php echo e(number_format($saldo, 0, ',', '.')); ?>

							</div>
							<div class="mt-2 small text-muted">
								<i class="fas fa-calendar-week"></i> Saldo terkini
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-coins fa-2x text-gray-300"></i>
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
				<i class="fas fa-list"></i> Daftar Transaksi
			</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th width="30">No</th>
							<th>Tanggal</th>
							<th>Deskripsi</th>
							<th>Kategori</th>
							<th>Pemasukan</th>
							<th>Pengeluaran</th>
							<th>Saldo</th>
							<th width="100">Aksi</th>
						</tr>
					</thead>
					<tbody>
						<?php $__currentLoopData = $keuangan; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
						<tr>
							<td class="text-center"><?php echo e($index + 1); ?></td>
							<td class="text-nowrap">
								<span class="badge badge-info p-2">
									<i class="fas fa-calendar-day"></i> 
									<?php echo e(\Carbon\Carbon::parse($item->tanggal)->translatedFormat('d M Y')); ?>

								</span>
							</td>
							<td>
								<div class="d-flex align-items-center">
									<div class="icon-circle bg-<?php echo e($item->pemasukan > 0 ? 'success' : 'danger'); ?> text-white mr-2" 
										style="width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
										<i class="fas fa-<?php echo e($item->pemasukan > 0 ? 'arrow-down' : 'arrow-up'); ?>"></i>
									</div>
									<span><?php echo e(\Illuminate\Support\Str::limit($item->deskripsi, 50)); ?></span>
								</div>
							</td>
							<td>
								<?php if($item->kategori): ?>
								<span class="badge badge-secondary">
									<i class="fas fa-tag"></i> <?php echo e($item->kategori); ?>

								</span>
								<?php else: ?>
								<span class="text-muted">-</span>
								<?php endif; ?>
							</td>
							<td class="text-success font-weight-bold">
								<?php if($item->pemasukan > 0): ?>
								Rp <?php echo e(number_format($item->pemasukan, 0, ',', '.')); ?>

								<?php else: ?>
								-
								<?php endif; ?>
							</td>
							<td class="text-danger font-weight-bold">
								<?php if($item->pengeluaran > 0): ?>
								Rp <?php echo e(number_format($item->pengeluaran, 0, ',', '.')); ?>

								<?php else: ?>
								-
								<?php endif; ?>
							</td>
							<td>
								<span class="badge <?php echo e($item->saldo >= 0 ? 'badge-success' : 'badge-danger'); ?> p-2">
									Rp <?php echo e(number_format($item->saldo, 0, ',', '.')); ?>

								</span>
							</td>
							<td class="text-center">
								<a href="<?php echo e(route('keuangan.edit', $item)); ?>" class="btn btn-sm btn-warning" data-toggle="tooltip" title="Edit">
									<i class="fas fa-edit"></i>
								</a>
								<form action="<?php echo e(route('keuangan.destroy', $item)); ?>" method="POST" class="d-inline delete-form" id="delete-form-<?php echo e($item->id); ?>">
									<?php echo csrf_field(); ?>
									<?php echo method_field('DELETE'); ?>
									<button type="button" class="btn btn-sm btn-danger delete-btn" data-id="<?php echo e($item->id); ?>" data-deskripsi="<?php echo e(\Illuminate\Support\Str::limit($item->deskripsi, 30)); ?>" data-toggle="tooltip" title="Hapus">
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
	.icon-circle {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
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
				const deskripsi = this.getAttribute('data-deskripsi') || 'transaksi ini';
				const form = document.getElementById(`delete-form-${formId}`);
				
				if (typeof Swal !== 'undefined' && Swal.fire) {
					Swal.fire({
						title: 'Apakah Anda yakin?',
						html: `Transaksi "<strong>${deskripsi}</strong>" akan dihapus secara permanen!`,
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
					if (confirm(`Apakah Anda yakin ingin menghapus ${deskripsi}?`)) {
						form.submit();
					}
				}
			});
		});
	});
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/keuangan/index.blade.php ENDPATH**/ ?>