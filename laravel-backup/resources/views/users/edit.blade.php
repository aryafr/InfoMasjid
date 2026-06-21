<!-- resources/views/users/edit.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-user-edit"></i> Edit Akun
		</h1>
		<a href="{{ route('users.index') }}" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-8 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-edit"></i> Form Edit Akun: {{ $user->full_name }}
					</h6>
				</div>
				<div class="card-body">
					<form action="{{ route('users.update', $user->id) }}" method="POST" id="editUserForm">
						@csrf
						@method('PUT')

						<div class="form-group">
							<label for="name">Nama Depan <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-user"></i></span>
								</div>
								<input type="text" name="name" id="name" class="form-control @error('name') is-invalid @enderror" 
								value="{{ old('name', $user->name) }}" required>
							</div>
							@error('name')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="last_name">Nama Belakang</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-user-tag"></i></span>
								</div>
								<input type="text" name="last_name" id="last_name" class="form-control @error('last_name') is-invalid @enderror" 
								value="{{ old('last_name', $user->last_name) }}">
							</div>
							@error('last_name')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="email">Email <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-envelope"></i></span>
								</div>
								<input type="email" name="email" id="email" class="form-control @error('email') is-invalid @enderror" 
								value="{{ old('email', $user->email) }}" required>
							</div>
							@error('email')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="role_id">Role <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-tag"></i></span>
								</div>
								<select name="role_id" id="role_id" class="form-control @error('role_id') is-invalid @enderror" required>
									@foreach($roles as $role)
									<option value="{{ $role->id }}" {{ $user->role_id == $role->id ? 'selected' : '' }}>
										{{ ucfirst($role->name) }}
									</option>
									@endforeach
								</select>
							</div>
							@error('role_id')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="alert alert-info">
							<i class="fas fa-info-circle"></i>
							<strong>Informasi:</strong> Kosongkan field password jika tidak ingin mengubah password.
						</div>

						<div class="form-group">
							<label for="password">Password Baru</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-lock"></i></span>
								</div>
								<input type="password" name="password" id="password" class="form-control @error('password') is-invalid @enderror" 
								placeholder="Minimal 6 karakter">
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" id="togglePassword">
										<i class="fas fa-eye"></i>
									</button>
								</div>
							</div>
							@error('password')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="password_confirmation">Konfirmasi Password Baru</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-lock"></i></span>
								</div>
								<input type="password" name="password_confirmation" id="password_confirmation" class="form-control">
							</div>
						</div>

						<hr>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Update Akun
							</button>
							<a href="{{ route('users.index') }}" class="btn btn-secondary btn-lg px-4">
								<i class="fas fa-times"></i> Batal
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
    // Toggle password visibility
	document.getElementById('togglePassword')?.addEventListener('click', function() {
		const password = document.getElementById('password');
		const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
		password.setAttribute('type', type);
		this.querySelector('i').classList.toggle('fa-eye');
		this.querySelector('i').classList.toggle('fa-eye-slash');
	});
</script>
@endsection