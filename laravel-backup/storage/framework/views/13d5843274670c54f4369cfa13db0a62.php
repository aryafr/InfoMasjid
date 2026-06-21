<!-- resources/views/roles/index.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<h1 class="h3 mb-4 text-gray-800">Daftar Role</h1>

	<?php if(session('success')): ?>
	<div class="alert alert-success"><?php echo e(session('success')); ?></div>
	<?php endif; ?>

	<a href="<?php echo e(route('roles.create')); ?>" class="btn btn-primary mb-3">Tambah Role</a>

	<div class="card shadow">
		<div class="card-body">
			<table class="table table-bordered">
				<thead>
					<tr>
						<th>#</th>
						<th>Nama Role</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					<?php $__currentLoopData = $roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
					<tr>
						<td><?php echo e($index + 1); ?></td>
						<td><?php echo e($role->name); ?></td>
						<td>
							<a href="<?php echo e(route('roles.edit', $role->id)); ?>" class="btn btn-warning btn-sm">Edit</a>
							<form action="<?php echo e(route('roles.destroy', $role->id)); ?>" method="POST" style="display:inline-block;">
								<?php echo csrf_field(); ?>
								<?php echo method_field('DELETE'); ?>
								<button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Yakin hapus role ini?')">Hapus</button>
							</form>
						</td>
					</tr>
					<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
					<?php if($roles->isEmpty()): ?>
					<tr>
						<td colspan="3" class="text-center">Belum ada data role</td>
					</tr>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\roles\index.blade.php ENDPATH**/ ?>