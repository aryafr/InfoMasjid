<!-- resources/views/sholat_jumat/create.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-plus-circle"></i> Tambah Jadwal Sholat Jumat
		</h1>
		<a href="{{ route('sholat_jumat.index') }}" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-8 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-info-circle"></i> Form Tambah Jadwal Sholat Jumat
					</h6>
				</div>
				<div class="card-body">
					<form action="{{ route('sholat_jumat.store') }}" method="POST" id="createForm">
						@csrf

						<div class="form-group">
							<label for="tanggal">Tanggal <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
								</div>
								<input type="date" name="tanggal" id="tanggal" class="form-control @error('tanggal') is-invalid @enderror" 
								value="{{ old('tanggal') }}" required>
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Pilih tanggal pelaksanaan sholat Jumat
							</small>
							@error('tanggal')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="imam">Imam</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-user"></i></span>
								</div>
								<input type="text" name="imam" id="imam" class="form-control @error('imam') is-invalid @enderror" 
								value="{{ old('imam') }}" placeholder="Masukkan nama imam">
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Nama imam yang akan memimpin sholat Jumat
							</small>
							@error('imam')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="khatib">Khatib</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-chalkboard-user"></i></span>
								</div>
								<input type="text" name="khatib" id="khatib" class="form-control @error('khatib') is-invalid @enderror" 
								value="{{ old('khatib') }}" placeholder="Masukkan nama khatib">
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Nama khatib yang akan menyampaikan khutbah
							</small>
							@error('khatib')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="muadzin">Muadzin</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-microphone-alt"></i></span>
								</div>
								<input type="text" name="muadzin" id="muadzin" class="form-control @error('muadzin') is-invalid @enderror" 
								value="{{ old('muadzin') }}" placeholder="Masukkan nama muadzin">
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Nama muadzin yang akan mengumandangkan adzan
							</small>
							@error('muadzin')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<hr>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Simpan Jadwal
							</button>
							<a href="{{ route('sholat_jumat.index') }}" class="btn btn-secondary btn-lg px-4">
								<i class="fas fa-times"></i> Batal
							</a>
						</div>
					</form>
				</div>
			</div>

			<!-- Informasi Card -->
			<div class="card shadow mb-4 border-left-warning">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-warning">
						<i class="fas fa-lightbulb"></i> Informasi
					</h6>
				</div>
				<div class="card-body">
					<ul class="mb-0">
						<li>Sholat Jumat dilaksanakan setiap hari Jumat pukul 12:00 WIB</li>
						<li>Pastikan data imam, khatib, dan muadzin diisi dengan benar</li>
						<li>Jadwal yang sudah lewat akan ditandai dengan status "Telah Berlalu"</li>
						<li>Jadwal hari ini akan ditandai dengan status "Hari Ini"</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
    // Set default date to next Friday
	document.addEventListener('DOMContentLoaded', function() {
		const tanggalInput = document.getElementById('tanggal');
		if (tanggalInput && !tanggalInput.value) {
			const today = new Date();
			const day = today.getDay();
			const daysUntilFriday = (5 - day + 7) % 7 || 7;
			const nextFriday = new Date(today);
			nextFriday.setDate(today.getDate() + daysUntilFriday);
			tanggalInput.value = nextFriday.toISOString().split('T')[0];
		}
	});
</script>
@endsection