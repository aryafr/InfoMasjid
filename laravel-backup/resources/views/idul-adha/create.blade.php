{{-- resources/views/idul-adha/create.blade.php --}}
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-plus-circle"></i> Tambah Jadwal Idul Adha
		</h1>
		<a href="{{ route('idul-adha.index') }}" class="btn btn-secondary">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Form Tambah Jadwal</h6>
		</div>
		<div class="card-body">
			<form action="{{ route('idul-adha.store') }}" method="POST">
				@csrf
				
				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label>Tahun <span class="text-danger">*</span></label>
							<input type="number" name="tahun" class="form-control @error('tahun') is-invalid @enderror" 
							value="{{ old('tahun', date('Y')) }}" required>
							@error('tahun')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Tanggal <span class="text-danger">*</span></label>
							<input type="date" name="tanggal" class="form-control @error('tanggal') is-invalid @enderror" 
							value="{{ old('tanggal') }}" required>
							@error('tanggal')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-4">
						<div class="form-group">
							<label>Imam</label>
							<input type="text" name="imam" class="form-control @error('imam') is-invalid @enderror" 
							value="{{ old('imam') }}">
							@error('imam')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-group">
							<label>Khatib</label>
							<input type="text" name="khatib" class="form-control @error('khatib') is-invalid @enderror" 
							value="{{ old('khatib') }}">
							@error('khatib')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-group">
							<label>Muadzin</label>
							<input type="text" name="muadzin" class="form-control @error('muadzin') is-invalid @enderror" 
							value="{{ old('muadzin') }}">
							@error('muadzin')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label>Waktu</label>
							<input type="time" name="waktu" class="form-control @error('waktu') is-invalid @enderror" 
							value="{{ old('waktu', '07:00') }}">
							@error('waktu')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label>Keterangan</label>
							<input type="text" name="keterangan" class="form-control @error('keterangan') is-invalid @enderror" 
							value="{{ old('keterangan') }}" placeholder="Contoh: 10 Dzulhijjah 1446 H">
							@error('keterangan')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
				</div>

				<button type="submit" class="btn btn-primary">
					<i class="fas fa-save"></i> Simpan
				</button>
				<a href="{{ route('idul-adha.index') }}" class="btn btn-secondary">
					<i class="fas fa-times"></i> Batal
				</a>
			</form>
		</div>
	</div>
</div>
@endsection