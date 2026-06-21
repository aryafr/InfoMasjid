<!-- resources/views/jadwal_sholat/edit.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-edit"></i> Edit Jadwal Sholat
		</h1>
		<a href="{{ route('jadwal_sholat.index') }}" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-6 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-edit"></i> Form Edit: {{ $jadwal_sholat->nama_sholat }}
					</h6>
				</div>
				<div class="card-body">
					<form action="{{ route('jadwal_sholat.update', $jadwal_sholat) }}" method="POST">
						@csrf
						@method('PUT')

						<div class="form-group">
							<label for="nama_sholat">Nama Sholat <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-mosque"></i></span>
								</div>
								<select name="nama_sholat" id="nama_sholat" class="form-control @error('nama_sholat') is-invalid @enderror" required>
									<option value="Subuh" {{ old('nama_sholat', $jadwal_sholat->nama_sholat) == 'Subuh' ? 'selected' : '' }}>Subuh</option>
									<option value="Dzuhur" {{ old('nama_sholat', $jadwal_sholat->nama_sholat) == 'Dzuhur' ? 'selected' : '' }}>Dzuhur</option>
									<option value="Ashar" {{ old('nama_sholat', $jadwal_sholat->nama_sholat) == 'Ashar' ? 'selected' : '' }}>Ashar</option>
									<option value="Maghrib" {{ old('nama_sholat', $jadwal_sholat->nama_sholat) == 'Maghrib' ? 'selected' : '' }}>Maghrib</option>
									<option value="Isya" {{ old('nama_sholat', $jadwal_sholat->nama_sholat) == 'Isya' ? 'selected' : '' }}>Isya</option>
								</select>
							</div>
							@error('nama_sholat')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="waktu">Waktu <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-clock"></i></span>
								</div>
								<input type="time" name="waktu" id="waktu" class="form-control @error('waktu') is-invalid @enderror" 
								value="{{ old('waktu', $jadwal_sholat->waktu) }}" required>
								<div class="input-group-append">
									<span class="input-group-text">WIB</span>
								</div>
							</div>
							@error('waktu')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<hr>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Update Jadwal
							</button>
							<a href="{{ route('jadwal_sholat.index') }}" class="btn btn-secondary btn-lg px-4">
								<i class="fas fa-times"></i> Batal
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection