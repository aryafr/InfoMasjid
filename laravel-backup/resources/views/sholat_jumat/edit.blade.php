<!-- resources/views/sholat_jumat/edit.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-edit"></i> Edit Jadwal Sholat Jumat
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
						<i class="fas fa-edit"></i> Form Edit: {{ \Carbon\Carbon::parse($sholat_jumat->tanggal)->translatedFormat('l, d F Y') }}
					</h6>
				</div>
				<div class="card-body">
					<form action="{{ route('sholat_jumat.update', $sholat_jumat) }}" method="POST">
						@csrf
						@method('PUT')

						<div class="form-group">
							<label for="tanggal">Tanggal <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
								</div>
								<input type="date" name="tanggal" id="tanggal" class="form-control @error('tanggal') is-invalid @enderror" 
								value="{{ old('tanggal', $sholat_jumat->tanggal) }}" required>
							</div>
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
								value="{{ old('imam', $sholat_jumat->imam) }}" placeholder="Masukkan nama imam">
							</div>
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
								value="{{ old('khatib', $sholat_jumat->khatib) }}" placeholder="Masukkan nama khatib">
							</div>
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
								value="{{ old('muadzin', $sholat_jumat->muadzin) }}" placeholder="Masukkan nama muadzin">
							</div>
							@error('muadzin')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<hr>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Update Jadwal
							</button>
							<a href="{{ route('sholat_jumat.index') }}" class="btn btn-secondary btn-lg px-4">
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