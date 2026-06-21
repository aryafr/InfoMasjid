<!-- resources/views/settings/rotation.blade.php -->
@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-8">
			<div class="card">
				<div class="card-header">
					<h3>Pengaturan Rotasi Halaman</h3>
				</div>
				<div class="card-body">
					<form method="POST" action="{{ route('settings.update') }}" enctype="multipart/form-data">
						@csrf
						@method('PUT')
						
						<div class="form-group mb-3">
							<label for="rotation_enabled">Aktifkan Rotasi Halaman</label>
							<select name="rotation_enabled" id="rotation_enabled" class="form-control">
								<option value="1" {{ $setting->rotation_enabled ? 'selected' : '' }}>Ya</option>
								<option value="0" {{ !$setting->rotation_enabled ? 'selected' : '' }}>Tidak</option>
							</select>
							<small class="form-text text-muted">Jika dinonaktifkan, hanya halaman pertama yang akan ditampilkan</small>
						</div>
						
						<div class="form-group mb-3">
							<label for="rotation_interval">Interval Rotasi (detik)</label>
							<input type="number" name="rotation_interval" id="rotation_interval" 
							class="form-control" value="{{ $setting->rotation_interval ?? 10 }}" 
							min="1" max="3600" required>
							<small class="form-text text-muted">Minimal 1 detik, maksimal 3600 detik (1 jam)</small>
						</div>
						
						<div class="form-group mb-3">
							<label>Halaman yang Ditampilkan</label>
							<div class="table-responsive">
								<table class="table table-bordered">
									<thead>
										<tr>
											<th>Pilih</th>
											<th>Nama Halaman</th>
											<th>URL Route</th>
										</tr>
									</thead>
									<tbody>
										@php
										$pages = [
										['url' => 'welcome.embed', 'name' => 'Dashboard Lengkap'],
										['url' => 'utama.embed', 'name' => 'Jadwal Sholat'],
										['url' => 'keuangan.embed', 'name' => 'Rincian Keuangan']
										];
										$selectedPages = $setting->rotation_pages ?? [];
										@endphp
										
										@foreach($pages as $page)
										@php
										$isActive = false;
										foreach($selectedPages as $sp) {
											if($sp['url'] == $page['url'] && isset($sp['active']) && $sp['active']) {
												$isActive = true;
												break;
											}
										}
										@endphp
										<tr>
											<td>
												<input type="checkbox" name="rotation_pages[{{ $loop->index }}][active]" 
												value="1" {{ $isActive ? 'checked' : '' }}>
												<input type="hidden" name="rotation_pages[{{ $loop->index }}][url]" value="{{ $page['url'] }}">
												<input type="hidden" name="rotation_pages[{{ $loop->index }}][name]" value="{{ $page['name'] }}">
											</td>
											<td>{{ $page['name'] }}</td>
											<td><code>{{ $page['url'] }}</code></td>
										</tr>
										@endforeach
									</tbody>
								</table>
							</div>
							<small class="form-text text-muted">Pilih halaman yang ingin ditampilkan dalam rotasi</small>
						</div>
						
						<div class="form-group">
							<button type="submit" class="btn btn-primary">Simpan Pengaturan</button>
							<a href="{{ route('rotator') }}" class="btn btn-info" target="_blank">Lihat Hasil Rotasi</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

<script>
	document.getElementById('rotation_enabled').addEventListener('change', function() {
		const intervalInput = document.getElementById('rotation_interval');
		intervalInput.disabled = !this.checked;
	});
</script>
@endsection