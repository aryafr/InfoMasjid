{{-- resources/views/rotation/index.blade.php --}}
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<div class="d-sm-flex align-items-center justify-content-between mb-4">
		<h1 class="h3 mb-0 text-gray-800">
			<i class="fas fa-exchange-alt"></i> Pengaturan Rotasi Halaman
		</h1>
		<div>
			<a href="{{ route('rotator') }}" class="btn btn-primary" target="_blank">
				<i class="fas fa-eye"></i> Lihat Hasil Rotasi
			</a>
		</div>
	</div>

	@if(session('success'))
	<div class="alert alert-success">{{ session('success') }}</div>
	@endif

	<div class="card shadow mb-4">
		<div class="card-header py-3">
			<h6 class="m-0 font-weight-bold text-primary">Pengaturan Rotasi Halaman</h6>
		</div>
		<div class="card-body">
			<form method="POST" action="{{ route('rotation.update') }}">
				@csrf
				@method('PUT')
				
				<div class="form-group">
					<label>Status Rotasi</label><br>
					<label class="switch">
						<input type="checkbox" name="rotation_enabled" value="1" {{ $setting->rotation_enabled ? 'checked' : '' }}>
						<span class="slider round"></span>
					</label>
					<small class="form-text text-muted">Aktifkan atau nonaktifkan rotasi halaman</small>
				</div>
				
				<div class="form-group">
					<label>Interval Rotasi (detik)</label>
					<input type="number" name="rotation_interval" class="form-control" value="{{ $setting->rotation_interval }}" min="1" max="3600" required>
					<small class="form-text text-muted">Minimal 1 detik, maksimal 3600 detik (1 jam)</small>
				</div>
				
				<hr>
				
				<h5>Halaman yang Ditampilkan</h5>
				<p class="text-muted">Centang halaman yang ingin ditampilkan dalam rotasi (Total 9 Halaman)</p>
				
				<div class="table-responsive">
					<table class="table table-bordered">
						<thead>
							<tr>
								<th width="50">Pilih</th>
								<th>Nama Halaman</th>
								<th>URL</th>
								<th>Keterangan</th>
							</tr>
						</thead>
						<tbody>
							@php
							$availablePages = [
							['url' => 'welcome-embed', 'name' => 'Dashboard Lengkap', 'desc' => 'Tampilan lengkap dengan jadwal sholat, jumat, pengumuman, dan keuangan'],
							['url' => 'utama-embed', 'name' => 'Jadwal Sholat', 'desc' => 'Tampilan fokus jadwal sholat 5 waktu'],
							['url' => 'keuangan-embed', 'name' => 'Rincian Keuangan', 'desc' => 'Tampilan detail laporan keuangan lengkap'],
							['url' => 'jumat-embed', 'name' => 'Jadwal Sholat Jumat', 'desc' => 'Informasi imam, khatib, dan muadzin sholat jumat'],
							['url' => 'pengumuman-embed', 'name' => 'Pengumuman', 'desc' => 'Daftar pengumuman terbaru untuk jamaah'],
							['url' => 'keuangan-summary-embed', 'name' => 'Ringkasan Keuangan', 'desc' => 'Ringkasan keuangan dengan grafik donat'],
							['url' => 'qris-embed', 'name' => 'QRIS Donasi', 'desc' => 'QR Code untuk donasi dan infak online'],
							['url' => 'idul-fitri-embed', 'name' => 'Idul Fitri', 'desc' => 'Jadwal sholat Idul Fitri dengan imam, khatib, muadzin'],
							['url' => 'idul-adha-embed', 'name' => 'Idul Adha', 'desc' => 'Jadwal sholat Idul Adha dengan imam, khatib, muadzin']
							];
							
							// PERBAIKAN: Decode JSON jika masih string
							$selectedPages = $setting->rotation_pages;
							if (is_string($selectedPages)) {
								$selectedPages = json_decode($selectedPages, true);
							}
							if (!is_array($selectedPages)) {
								$selectedPages = [];
							}
							@endphp
							
							@foreach($availablePages as $index => $page)
							@php
							$isActive = false;
							if (is_array($selectedPages) && count($selectedPages) > 0) {
								foreach($selectedPages as $sp) {
									if(isset($sp['url']) && $sp['url'] == $page['url'] && isset($sp['active']) && $sp['active'] == true) {
										$isActive = true;
										break;
									}
								}
							}
							@endphp
							<tr>
								<td class="text-center">
									<input type="checkbox" name="active_pages[]" value="{{ $page['url'] }}" 
									{{ $isActive ? 'checked' : '' }}>
								</td>
								<td><strong>{{ $page['name'] }}</strong></td>
								<td><code>{{ $page['url'] }}</code></td>
								<td><small class="text-muted">{{ $page['desc'] }}</small></td>
							</tr>
							@endforeach
						</tbody>
					</table>
				</div>
				
				<div class="alert alert-info mt-3">
					<i class="fas fa-info-circle"></i>
					<strong>Informasi:</strong> Total ada 9 halaman yang tersedia. Pilih halaman mana saja yang ingin ditampilkan dalam rotasi.
				</div>
				
				<button type="submit" class="btn btn-primary">
					<i class="fas fa-save"></i> Simpan Pengaturan
				</button>
			</form>
		</div>
	</div>
</div>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: .4s;
		border-radius: 34px;
	}
	.slider:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: .4s;
		border-radius: 50%;
	}
	input:checked + .slider {
		background-color: #28a745;
	}
	input:checked + .slider:before {
		transform: translateX(26px);
	}
</style>
@endsection