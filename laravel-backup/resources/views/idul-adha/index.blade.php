{{-- resources/views/idul-adha/index.blade.php --}}
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-drumstick-bite"></i> Jadwal Sholat Idul Adha
		</h1>
		<a href="{{ route('idul-adha.create') }}" class="btn btn-primary">
			<i class="fas fa-plus"></i> Tambah Jadwal
		</a>
	</div>

	@if(session('success'))
	<div class="alert alert-success">{{ session('success') }}</div>
	@endif

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Daftar Jadwal Idul Adha</h6>
		</div>
		<div class="card-body">
			<div class="table-responsive">
				<table class="table table-bordered" width="100%" cellspacing="0">
					<thead>
						<tr>
							<th>Tahun</th>
							<th>Tanggal</th>
							<th>Imam</th>
							<th>Khatib</th>
							<th>Muadzin</th>
							<th>Waktu</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody>
						@forelse($sholatIdulAdha as $item)
						<tr>
							<td>{{ $item->tahun }}</td>
							<td>{{ \Carbon\Carbon::parse($item->tanggal)->translatedFormat('d F Y') }}</td>
							<td>{{ $item->imam ?? '-' }}</td>
							<td>{{ $item->khatib ?? '-' }}</td>
							<td>{{ $item->muadzin ?? '-' }}</td>
							<td>{{ $item->waktu ? \Carbon\Carbon::parse($item->waktu)->format('H:i') : '07:00' }} WIB</td>
							<td>
								<a href="{{ route('idul-adha.edit', $item) }}" class="btn btn-warning btn-sm">
									<i class="fas fa-edit"></i>
								</a>
								<form action="{{ route('idul-adha.destroy', $item) }}" method="POST" class="d-inline">
									@csrf
									@method('DELETE')
									<button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin menghapus?')">
										<i class="fas fa-trash"></i>
									</button>
								</form>
							</td>
						</tr>
						@empty
						<tr>
							<td colspan="7" class="text-center">Belum ada data jadwal Idul Adha</td>
						</tr>
						@endforelse
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
@endsection