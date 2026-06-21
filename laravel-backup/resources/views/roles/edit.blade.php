<!-- resources/views/roles/index.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<h1 class="h3 mb-4 text-gray-800">Edit Role</h1>

	<div class="card shadow">
		<div class="card-body">
			<form action="{{ route('roles.update', $role->id) }}" method="POST">
				@csrf
				@method('PUT')
				<div class="form-group">
					<label for="name">Nama Role</label>
					<input type="text" name="name" class="form-control @error('name') is-invalid @enderror"
					value="{{ old('name', $role->name) }}" required>
					@error('name')
					<div class="invalid-feedback">{{ $message }}</div>
					@enderror
				</div>

				<button class="btn btn-success" type="submit">Update</button>
				<a href="{{ route('roles.index') }}" class="btn btn-secondary">Kembali</a>
			</form>
		</div>
	</div>
</div>
@endsection
