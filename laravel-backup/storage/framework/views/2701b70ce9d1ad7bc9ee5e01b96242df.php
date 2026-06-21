<!-- resources/views/users/index.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-users-cog"></i> Kelola Akun
		</h1>
		<a href="<?php echo e(route('users.create')); ?>" class="btn btn-primary btn-sm shadow-sm">
			<i class="fas fa-plus-circle"></i> Tambah Akun
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

	<!-- DataTales Example -->
	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">
				<i class="fas fa-list"></i> Daftar Akun Pengguna
			</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th width="30">No</th>
							<th>Nama Lengkap</th>
							<th>Email</th>
							<th>Role</th>
							<th>Tanggal Dibuat</th>
							<th width="120">Aksi</th>
						</tr>
					</thead>
					<tbody>
						<?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
						<tr>
							<td class="text-center"><?php echo e($index + 1); ?></td>
							<td>
								<div class="d-flex align-items-center">
									<div class="avatar-circle bg-primary text-white mr-3">
										<?php echo e(strtoupper(substr($user->name, 0, 1))); ?>

									</div>
									<div>
										<strong><?php echo e($user->full_name); ?></strong>
									</div>
								</div>
							</td>
							<td><?php echo e($user->email); ?></td>
							<td>
								<?php if($user->role): ?>
								<?php if($user->role->name == 'admin'): ?>
								<span class="badge badge-danger px-3 py-2">
									<i class="fas fa-shield-alt"></i> Administrator
								</span>
								<?php else: ?>
								<span class="badge badge-info px-3 py-2">
									<i class="fas fa-user"></i> <?php echo e(ucfirst($user->role->name)); ?>

								</span>
								<?php endif; ?>
								<?php else: ?>
								<span class="badge badge-secondary">Tidak Ada Role</span>
								<?php endif; ?>
							</td>
							<td><?php echo e($user->created_at->format('d/m/Y H:i')); ?></td>
							<td class="text-center">
								<a href="<?php echo e(route('users.edit', $user->id)); ?>" class="btn btn-sm btn-warning" data-toggle="tooltip" title="Edit">
									<i class="fas fa-edit"></i>
								</a>
								
								<?php if(auth()->user()->role && auth()->user()->role->name == 'admin'): ?>
								<?php if($user->role && $user->role->name == 'admin' && auth()->user()->id == $user->id): ?>
								<!-- Admin yang sedang login - tidak bisa hapus diri sendiri -->
								<button class="btn btn-sm btn-secondary" disabled data-toggle="tooltip" title="Tidak dapat menghapus akun sendiri">
									<i class="fas fa-trash-alt"></i>
								</button>
								<?php elseif($user->role && $user->role->name == 'admin'): ?>
								<!-- Admin lain - tidak bisa dihapus oleh admin lain -->
								<button class="btn btn-sm btn-secondary" disabled data-toggle="tooltip" title="Tidak dapat menghapus akun Administrator">
									<i class="fas fa-trash-alt"></i>
								</button>
								<?php else: ?>
								<!-- Petugas - bisa dihapus -->
								<form action="<?php echo e(route('users.destroy', $user->id)); ?>" method="POST" class="d-inline delete-form">
									<?php echo csrf_field(); ?>
									<?php echo method_field('DELETE'); ?>
									<button type="submit" class="btn btn-sm btn-danger delete-btn" data-toggle="tooltip" title="Hapus">
										<i class="fas fa-trash-alt"></i>
									</button>
								</form>
								<?php endif; ?>
								<?php endif; ?>
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
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 18px;
	}
	.table-hover tbody tr:hover {
		background-color: rgba(10, 77, 104, 0.05);
	}
	.badge {
		font-size: 12px;
		font-weight: 500;
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
		$('[data-toggle="tooltip"]').tooltip();
		
        // Delete confirmation
		document.querySelectorAll('.delete-btn').forEach(button => {
			button.addEventListener('click', function(e) {
				e.preventDefault();
				const form = this.closest('.delete-form');
				
				Swal.fire({
					title: 'Apakah Anda yakin?',
					text: "Data pengguna akan dihapus secara permanen!",
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
			});
		});
	});
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views/users/index.blade.php ENDPATH**/ ?>