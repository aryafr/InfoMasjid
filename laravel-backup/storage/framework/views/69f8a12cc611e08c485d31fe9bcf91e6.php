<!-- resources/views/roles/index.blade.php -->


<?php $__env->startSection('main-content'); ?>
<div class="container-fluid">
	<h1 class="h3 mb-4 text-gray-800">Edit Role</h1>

	<div class="card shadow">
		<div class="card-body">
			<form action="<?php echo e(route('roles.update', $role->id)); ?>" method="POST">
				<?php echo csrf_field(); ?>
				<?php echo method_field('PUT'); ?>
				<div class="form-group">
					<label for="name">Nama Role</label>
					<input type="text" name="name" class="form-control <?php $__errorArgs = ['name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>"
					value="<?php echo e(old('name', $role->name)); ?>" required>
					<?php $__errorArgs = ['name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
					<div class="invalid-feedback"><?php echo e($message); ?></div>
					<?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
				</div>

				<button class="btn btn-success" type="submit">Update</button>
				<a href="<?php echo e(route('roles.index')); ?>" class="btn btn-secondary">Kembali</a>
			</form>
		</div>
	</div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH F:\PROJECT LARAVEL\MASJID-DIGITAL-V2\resources\views\roles\edit.blade.php ENDPATH**/ ?>