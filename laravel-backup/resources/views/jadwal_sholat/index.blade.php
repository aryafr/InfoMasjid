<!-- resources/views/jadwal_sholat/index.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-mosque"></i> Kelola Jadwal Sholat
		</h1>
		<div>
			<a href="{{ route('jadwal_sholat.create') }}" class="btn btn-primary btn-sm shadow-sm">
				<i class="fas fa-plus-circle"></i> Tambah Jadwal
			</a>
			<div class="btn-group ml-2">
				<button type="button" class="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown">
					<i class="fas fa-download"></i> Export
				</button>
				<div class="dropdown-menu dropdown-menu-right">
					<a class="dropdown-item" href="{{ route('export.jadwal-sholat', ['type' => 'excel']) }}">
						<i class="fas fa-file-excel text-success"></i> Export ke Excel
					</a>
					<a class="dropdown-item" href="{{ route('export.jadwal-sholat', ['type' => 'pdf']) }}">
						<i class="fas fa-file-pdf text-danger"></i> Export ke PDF
					</a>
				</div>
			</div>
		</div>
	</div>

	@if(session('success'))
	<div class="alert alert-success alert-dismissible fade show" role="alert">
		<i class="fas fa-check-circle mr-2"></i> {{ session('success') }}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	@endif

	@if(session('error'))
	<div class="alert alert-danger alert-dismissible fade show" role="alert">
		<i class="fas fa-exclamation-circle mr-2"></i> {{ session('error') }}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	@endif

	<!-- Cards untuk menampilkan waktu sholat saat ini -->
	<div class="row mb-4">
		<div class="col-xl-2 col-md-4 col-sm-6 mb-3">
			<div class="card border-left-primary shadow h-100 py-2">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Subuh</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								@php
								$subuh = $jadwal->where('nama_sholat', 'Subuh')->first();
								@endphp
								{{ $subuh ? \Carbon\Carbon::parse($subuh->waktu)->format('H:i') : '--:--' }}
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-clock fa-2x text-gray-300"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-xl-2 col-md-4 col-sm-6 mb-3">
			<div class="card border-left-success shadow h-100 py-2">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-success text-uppercase mb-1">Dzuhur</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								@php
								$dzuhur = $jadwal->where('nama_sholat', 'Dzuhur')->first();
								@endphp
								{{ $dzuhur ? \Carbon\Carbon::parse($dzuhur->waktu)->format('H:i') : '--:--' }}
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-clock fa-2x text-gray-300"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-xl-2 col-md-4 col-sm-6 mb-3">
			<div class="card border-left-info shadow h-100 py-2">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-info text-uppercase mb-1">Ashar</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								@php
								$ashar = $jadwal->where('nama_sholat', 'Ashar')->first();
								@endphp
								{{ $ashar ? \Carbon\Carbon::parse($ashar->waktu)->format('H:i') : '--:--' }}
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-clock fa-2x text-gray-300"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-xl-2 col-md-4 col-sm-6 mb-3">
			<div class="card border-left-warning shadow h-100 py-2">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Maghrib</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								@php
								$maghrib = $jadwal->where('nama_sholat', 'Maghrib')->first();
								@endphp
								{{ $maghrib ? \Carbon\Carbon::parse($maghrib->waktu)->format('H:i') : '--:--' }}
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-clock fa-2x text-gray-300"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-xl-2 col-md-4 col-sm-6 mb-3">
			<div class="card border-left-danger shadow h-100 py-2">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-danger text-uppercase mb-1">Isya</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">
								@php
								$isya = $jadwal->where('nama_sholat', 'Isya')->first();
								@endphp
								{{ $isya ? \Carbon\Carbon::parse($isya->waktu)->format('H:i') : '--:--' }}
							</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-clock fa-2x text-gray-300"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-xl-2 col-md-4 col-sm-6 mb-3">
			<div class="card border-left-secondary shadow h-100 py-2">
				<div class="card-body">
					<div class="row no-gutters align-items-center">
						<div class="col mr-2">
							<div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">Total Jadwal</div>
							<div class="h5 mb-0 font-weight-bold text-gray-800">{{ $jadwal->count() }}</div>
						</div>
						<div class="col-auto">
							<i class="fas fa-calendar-alt fa-2x text-gray-300"></i>
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
				<i class="fas fa-list"></i> Daftar Jadwal Sholat
			</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered table-hover" id="dataTable" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th width="50">No</th>
							<th>Nama Sholat</th>
							<th>Waktu</th>
							<th>Status</th>
							<th width="120">Aksi</th>
						</tr>
					</thead>
					<tbody>
						@foreach ($jadwal as $index => $item)
						@php
						$now = \Carbon\Carbon::now('Asia/Jakarta');
						$waktuSholat = \Carbon\Carbon::parse($item->waktu);
						$isNext = $waktuSholat->format('H:i') >= $now->format('H:i');
						$diffMinutes = $now->diffInMinutes($waktuSholat, false);
						@endphp
						<tr>
							<td class="text-center">{{ $index + 1 }}</td>
							<td>
								<div class="d-flex align-items-center">
									<div class="icon-circle bg-{{ 
										$item->nama_sholat == 'Subuh' ? 'primary' : 
										($item->nama_sholat == 'Dzuhur' ? 'success' : 
										($item->nama_sholat == 'Ashar' ? 'info' : 
										($item->nama_sholat == 'Maghrib' ? 'warning' : 'danger'))) 
									}} text-white mr-3" style="width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
									<i class="fas fa-mosque"></i>
								</div>
								<div>
									<strong>{{ $item->nama_sholat }}</strong>
								</div>
							</div>
						</td>
						<td>
							<span class="badge badge-dark p-2" style="font-size: 14px;">
								<i class="fas fa-clock"></i> {{ \Carbon\Carbon::parse($item->waktu)->format('H:i') }} WIB
							</span>
						</td>
						<td>
							@if($isNext && $diffMinutes <= 60 && $diffMinutes > 0)
								<span class="badge badge-warning">
									<i class="fas fa-hourglass-half"></i> Akan datang dalam {{ $diffMinutes }} menit
								</span>
								@elseif($isNext)
								<span class="badge badge-secondary">
									<i class="fas fa-calendar"></i> Mendatang
								</span>
								@else
								<span class="badge badge-success">
									<i class="fas fa-check-circle"></i> Telah Berlalu
								</span>
								@endif
							</td>
							<td class="text-center">
								<a href="{{ route('jadwal_sholat.edit', $item) }}" class="btn btn-sm btn-warning" data-toggle="tooltip" title="Edit">
									<i class="fas fa-edit"></i>
								</a>
								<form action="{{ route('jadwal_sholat.destroy', $item) }}" method="POST" class="d-inline delete-form">
									@csrf
									@method('DELETE')
									<button type="submit" class="btn btn-sm btn-danger delete-btn" data-toggle="tooltip" title="Hapus">
										<i class="fas fa-trash-alt"></i>
									</button>
								</form>
							</td>
						</tr>
						@endforeach
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- Custom CSS -->
<style>
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
		$('[data-toggle="tooltip"]').tooltip();
		
        // Delete confirmation
		document.querySelectorAll('.delete-btn').forEach(button => {
			button.addEventListener('click', function(e) {
				e.preventDefault();
				const form = this.closest('.delete-form');
				
				Swal.fire({
					title: 'Apakah Anda yakin?',
					text: "Jadwal sholat akan dihapus secara permanen!",
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
@endsection