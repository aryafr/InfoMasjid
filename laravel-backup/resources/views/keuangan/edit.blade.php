<!-- resources/views/keuangan/edit.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-edit"></i> Edit Transaksi Keuangan
		</h1>
		<a href="{{ route('keuangan.index') }}" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-8 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-edit"></i> Form Edit Transaksi
					</h6>
				</div>
				<div class="card-body">
					<form action="{{ route('keuangan.update', $keuangan) }}" method="POST">
						@csrf
						@method('PUT')

						<div class="form-group">
							<label for="tanggal">Tanggal <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
								</div>
								<input type="date" class="form-control @error('tanggal') is-invalid @enderror" 
								id="tanggal" name="tanggal" value="{{ old('tanggal', $keuangan->tanggal) }}" required>
							</div>
							@error('tanggal')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="deskripsi">Deskripsi <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-align-left"></i></span>
								</div>
								<input type="text" class="form-control @error('deskripsi') is-invalid @enderror" 
								id="deskripsi" name="deskripsi" value="{{ old('deskripsi', $keuangan->deskripsi) }}" required>
							</div>
							@error('deskripsi')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="kategori">Kategori</label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-tag"></i></span>
								</div>
								<select class="form-control @error('kategori') is-invalid @enderror" id="kategori" name="kategori">
									<option value="" {{ old('kategori', $keuangan->kategori) == '' ? 'selected' : '' }}>- Pilih Kategori -</option>
									<option value="Infak" {{ old('kategori', $keuangan->kategori) == 'Infak' ? 'selected' : '' }}>Infak</option>
									<option value="Sumbangan" {{ old('kategori', $keuangan->kategori) == 'Sumbangan' ? 'selected' : '' }}>Sumbangan</option>
									<option value="Donatur" {{ old('kategori', $keuangan->kategori) == 'Donatur' ? 'selected' : '' }}>Donatur Tetap</option>
									<option value="Zakat" {{ old('kategori', $keuangan->kategori) == 'Zakat' ? 'selected' : '' }}>Zakat</option>
									<option value="Operasional" {{ old('kategori', $keuangan->kategori) == 'Operasional' ? 'selected' : '' }}>Operasional</option>
									<option value="Konsumsi" {{ old('kategori', $keuangan->kategori) == 'Konsumsi' ? 'selected' : '' }}>Konsumsi</option>
									<option value="Perawatan" {{ old('kategori', $keuangan->kategori) == 'Perawatan' ? 'selected' : '' }}>Perawatan</option>
									<option value="Inventaris" {{ old('kategori', $keuangan->kategori) == 'Inventaris' ? 'selected' : '' }}>Inventaris</option>
									<option value="Pembangunan" {{ old('kategori', $keuangan->kategori) == 'Pembangunan' ? 'selected' : '' }}>Pembangunan</option>
									<option value="Kegiatan" {{ old('kategori', $keuangan->kategori) == 'Kegiatan' ? 'selected' : '' }}>Kegiatan</option>
									<option value="Utilitas" {{ old('kategori', $keuangan->kategori) == 'Utilitas' ? 'selected' : '' }}>Utilitas</option>
								</select>
							</div>
							@error('kategori')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label for="pemasukan">Pemasukan (Rp)</label>
									<div class="input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"><i class="fas fa-arrow-down text-success"></i></span>
										</div>
										<input type="number" class="form-control @error('pemasukan') is-invalid @enderror" 
										id="pemasukan" name="pemasukan" step="1" value="{{ old('pemasukan', $keuangan->pemasukan) }}">
									</div>
									@error('pemasukan')
									<small class="text-danger">{{ $message }}</small>
									@enderror
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<label for="pengeluaran">Pengeluaran (Rp)</label>
									<div class="input-group">
										<div class="input-group-prepend">
											<span class="input-group-text"><i class="fas fa-arrow-up text-danger"></i></span>
										</div>
										<input type="number" class="form-control @error('pengeluaran') is-invalid @enderror" 
										id="pengeluaran" name="pengeluaran" step="1" value="{{ old('pengeluaran', $keuangan->pengeluaran) }}">
									</div>
									@error('pengeluaran')
									<small class="text-danger">{{ $message }}</small>
									@enderror
								</div>
							</div>
						</div>

						<div class="alert alert-warning">
							<i class="fas fa-exclamation-triangle"></i>
							<strong>Perhatian:</strong> Mengubah nilai pemasukan/pengeluaran akan mempengaruhi perhitungan saldo.
						</div>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Update Transaksi
							</button>
							<a href="{{ route('keuangan.index') }}" class="btn btn-secondary btn-lg px-4">
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