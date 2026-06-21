<!-- resources/views/pengumuman/edit.blade.php -->
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<!-- Page Heading -->
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-edit"></i> Edit Pengumuman
		</h1>
		<a href="{{ route('pengumuman.index') }}" class="btn btn-secondary btn-sm shadow-sm">
			<i class="fas fa-arrow-left"></i> Kembali
		</a>
	</div>

	<div class="row">
		<div class="col-lg-8 mx-auto">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">
						<i class="fas fa-edit"></i> Form Edit Pengumuman
					</h6>
				</div>
				<div class="card-body">
					<form action="{{ route('pengumuman.update', $pengumuman) }}" method="POST">
						@csrf
						@method('PUT')

						<div class="form-group">
							<label for="isi">Isi Pengumuman <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-bullhorn"></i></span>
								</div>
								<textarea name="isi" id="isi" class="form-control @error('isi') is-invalid @enderror" 
								rows="5" required placeholder="Tulis isi pengumuman di sini...">{{ old('isi', $pengumuman->isi) }}</textarea>
							</div>
							<small class="form-text text-muted">
								<i class="fas fa-info-circle"></i> Tulis pengumuman yang ingin disampaikan kepada jamaah
							</small>
							<div class="mt-2 text-muted small">
								<span id="charCount">{{ strlen($pengumuman->isi) }}</span> karakter
							</div>
							@error('isi')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<div class="form-group">
							<label for="tanggal">Tanggal <span class="text-danger">*</span></label>
							<div class="input-group">
								<div class="input-group-prepend">
									<span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
								</div>
								<input type="date" name="tanggal" id="tanggal" class="form-control @error('tanggal') is-invalid @enderror" 
								value="{{ old('tanggal', $pengumuman->tanggal) }}" required>
							</div>
							@error('tanggal')
							<small class="text-danger">{{ $message }}</small>
							@enderror
						</div>

						<hr>

						<!-- Preview Card -->
						<div class="card bg-light mb-3">
							<div class="card-header">
								<i class="fas fa-eye"></i> Pratinjau
							</div>
							<div class="card-body">
								<div id="previewContent">{{ nl2br(e($pengumuman->isi)) }}</div>
							</div>
						</div>

						<div class="form-group text-center">
							<button type="submit" class="btn btn-primary btn-lg px-5">
								<i class="fas fa-save"></i> Update Pengumuman
							</button>
							<a href="{{ route('pengumuman.index') }}" class="btn btn-secondary btn-lg px-4">
								<i class="fas fa-times"></i> Batal
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
    // Character counter
	const textarea = document.getElementById('isi');
	const charCount = document.getElementById('charCount');
	const previewContent = document.getElementById('previewContent');
	
	function updatePreview() {
		const text = textarea.value;
		charCount.textContent = text.length;
		
		if (text.trim() === '') {
			previewContent.innerHTML = '<em class="text-muted">Pratinjau akan muncul di sini...</em>';
		} else {
			previewContent.innerHTML = text.replace(/\n/g, '<br>');
		}
	}
	
	textarea.addEventListener('input', updatePreview);
</script>
@endsection