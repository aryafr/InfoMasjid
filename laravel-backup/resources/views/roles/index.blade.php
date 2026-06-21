<!-- resources/views/roles/index.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<h1 class="h3 mb-4 text-gray-800">Daftar Role</h1>

	@if (session('success'))
	<div class="alert alert-success">{{ session('success') }}</div>
	@endif

	<a href="{{ route('roles.create') }}" class="btn btn-primary mb-3">Tambah Role</a>

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
					@foreach ($roles as $index => $role)
					<tr>
						<td>{{ $index + 1 }}</td>
						<td>{{ $role->name }}</td>
						<td>
							<a href="{{ route('roles.edit', $role->id) }}" class="btn btn-warning btn-sm">Edit</a>
							<form action="{{ route('roles.destroy', $role->id) }}" method="POST" style="display:inline-block;">
								@csrf
								@method('DELETE')
								<button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Yakin hapus role ini?')">Hapus</button>
							</form>
						</td>
					</tr>
					@endforeach
					@if ($roles->isEmpty())
					<tr>
						<td colspan="3" class="text-center">Belum ada data role</td>
					</tr>
					@endif
				</tbody>
			</table>
		</div>
	</div>
</div>
@endsection
