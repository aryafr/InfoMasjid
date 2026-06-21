{{-- resources/views/qris/create.blade.php --}}
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-plus-circle"></i> Tambah QRIS
		</h1>
		<a href="{{ route('qris.index') }}" class="btn btn-secondary">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Form Tambah QRIS</h6>
		</div>
		<div class="card-body">
			<form action="{{ route('qris.store') }}" method="POST" enctype="multipart/form-data">
				@csrf
				
				<div class="form-group">
					<label for="nama">Nama QRIS <span class="text-danger">*</span></label>
					<input type="text" name="nama" id="nama" 
					class="form-control @error('nama') is-invalid @enderror" 
					value="{{ old('nama') }}" required>
					@error('nama')
					<div class="invalid-feedback">{{ $message }}</div>
					@enderror
				</div>

				<div class="form-group">
					<label for="gambar">Gambar QRIS <span class="text-danger">*</span></label>
					<input type="file" name="gambar" id="gambar" 
					class="form-control-file @error('gambar') is-invalid @enderror" 
					accept="image/*" required>
					<small class="form-text text-muted">Format: JPG, PNG, GIF. Maksimal 2MB</small>
					@error('gambar')
					<div class="invalid-feedback">{{ $message }}</div>
					@enderror
				</div>

				<div class="form-group">
					<label for="keterangan">Keterangan</label>
					<textarea name="keterangan" id="keterangan" 
					class="form-control @error('keterangan') is-invalid @enderror" 
					rows="3">{{ old('keterangan') }}</textarea>
					@error('keterangan')
					<div class="invalid-feedback">{{ $message }}</div>
					@enderror
				</div>

				<div class="row">
					<div class="col-md-4">
						<div class="form-group">
							<label for="bank">Bank</label>
							<input type="text" name="bank" id="bank" 
							class="form-control @error('bank') is-invalid @enderror" 
							value="{{ old('bank') }}" placeholder="Contoh: Bank Syariah Indonesia">
							@error('bank')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-group">
							<label for="nomor_rekening">Nomor Rekening</label>
							<input type="text" name="nomor_rekening" id="nomor_rekening" 
							class="form-control @error('nomor_rekening') is-invalid @enderror" 
							value="{{ old('nomor_rekening') }}">
							@error('nomor_rekening')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
					<div class="col-md-4">
						<div class="form-group">
							<label for="atas_nama">Atas Nama</label>
							<input type="text" name="atas_nama" id="atas_nama" 
							class="form-control @error('atas_nama') is-invalid @enderror" 
							value="{{ old('atas_nama') }}">
							@error('atas_nama')
							<div class="invalid-feedback">{{ $message }}</div>
							@enderror
						</div>
					</div>
				</div>

				<div class="form-group">
					<label for="status">Status <span class="text-danger">*</span></label>
					<select name="status" id="status" class="form-control @error('status') is-invalid @enderror" required>
						<option value="nonaktif" {{ old('status') == 'nonaktif' ? 'selected' : '' }}>Nonaktif</option>
						<option value="aktif" {{ old('status') == 'aktif' ? 'selected' : '' }}>Aktif</option>
					</select>
					<small class="form-text text-muted">Hanya satu QRIS yang dapat berstatus Aktif</small>
					@error('status')
					<div class="invalid-feedback">{{ $message }}</div>
					@enderror
				</div>

				<div class="form-group">
					<button type="submit" class="btn btn-primary">
						<i class="fas fa-save"></i> Simpan
					</button>
					<a href="{{ route('qris.index') }}" class="btn btn-secondary">
						<i class="fas fa-times"></i> Batal
					</a>
				</div>
			</form>
		</div>
	</div>
</div>
@endsection