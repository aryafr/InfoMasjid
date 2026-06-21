{{-- resources/views/qris/index.blade.php --}}
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-qrcode"></i> Manajemen QRIS
		</h1>
		<a href="{{ route('qris.create') }}" class="btn btn-primary">
			<i class="fas fa-plus"></i> Tambah QRIS
		</a>
	</div>

	@if(session('success'))
	<div class="alert alert-success alert-dismissible fade show" role="alert">
		{{ session('success') }}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	@endif

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Daftar QRIS</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th width="50">No</th>
							<th>Nama</th>
							<th>Gambar</th>
							<th>Status</th>
							<th>Bank</th>
							<th>Atas Nama</th>
							<th width="150">Aksi</th>
						</tr>
					</thead>
					<tbody>
						@forelse($qrisList as $index => $qris)
						<tr>
							<td class="text-center">{{ $index + 1 }}</td>
							<td>{{ $qris->nama }}</td>
							<td class="text-center">
								@if($qris->gambar)
								<img src="{{ $qris->gambar_url }}" alt="{{ $qris->nama }}" 
								style="width: 50px; height: 50px; object-fit: cover;">
								@else
								<span class="text-muted">Tidak ada gambar</span>
								@endif
							</td>
							<td>
								@if($qris->status == 'aktif')
								<span class="badge badge-success">Aktif</span>
								@else
								<span class="badge badge-secondary">Nonaktif</span>
								@endif
							</td>
							<td>{{ $qris->bank ?? '-' }}</td>
							<td>{{ $qris->atas_nama ?? '-' }}</td>
							<td class="text-center">
								<div class="btn-group" role="group">
									<a href="{{ route('qris.show', $qris->id) }}" 
										class="btn btn-info btn-sm" title="Lihat">
										<i class="fas fa-eye"></i>
									</a>
									<a href="{{ route('qris.edit', $qris->id) }}" 
										class="btn btn-warning btn-sm" title="Edit">
										<i class="fas fa-edit"></i>
									</a>
									@if($qris->status != 'aktif')
									<form action="{{ route('qris.set-aktif', $qris->id) }}" 
										method="POST" class="d-inline">
										@csrf
										@method('PUT')
										<button type="submit" class="btn btn-success btn-sm" 
										onclick="return confirm('Aktifkan QRIS ini?')" title="Aktifkan">
										<i class="fas fa-check-circle"></i>
									</button>
								</form>
								@endif
								<form action="{{ route('qris.destroy', $qris->id) }}" 
									method="POST" class="d-inline">
									@csrf
									@method('DELETE')
									<button type="submit" class="btn btn-danger btn-sm" 
									onclick="return confirm('Yakin ingin menghapus QRIS ini?')" title="Hapus">
									<i class="fas fa-trash"></i>
								</button>
							</form>
						</div>
					</td>
				</tr>
				@empty
				<tr>
					<td colspan="7" class="text-center">Belum ada data QRIS</td>
				</tr>
				@endforelse
			</tbody>
		</table>
	</div>
</div>
</div>
</div>
@endsection

@push('styles')
<link href="https://cdn.datatables.net/1.10.24/css/dataTables.bootstrap4.min.css" rel="stylesheet">
@endpush

@push('scripts')
<script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.24/js/dataTables.bootstrap4.min.js"></script>
<script>
	$(document).ready(function() {
		$('#dataTable').DataTable({
			"language": {
				"url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Indonesian.json"
			}
		});
	});
</script>
@endpush