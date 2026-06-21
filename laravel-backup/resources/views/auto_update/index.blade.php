{{-- resources/views/auto_update/index.blade.php --}}
@extends('layouts.admin')

@section('main-content')
<div class="container-fluid">
	<h1 class="h3 mb-4 text-gray-800">
		<i class="fas fa-sync-alt"></i> Pengaturan Auto-Update Jadwal Sholat
	</h1>

	@if(session('success'))
	<div class="alert alert-success alert-dismissible fade show" role="alert">
		<i class="fas fa-check-circle"></i> {{ session('success') }}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	@endif

	@if(session('error'))
	<div class="alert alert-danger alert-dismissible fade show" role="alert">
		<i class="fas fa-exclamation-circle"></i> {{ session('error') }}
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	@endif

	<!-- Debug Info -->
	<div class="alert alert-info">
		<strong>Debug Info:</strong><br>
		Current City in Database: {{ $setting->auto_update_city ?? 'Not set' }}<br>
		Current Country: {{ $setting->auto_update_country ?? 'Not set' }}<br>
		Last Updated: {{ $setting->updated_at ?? 'Never' }}
	</div>

	<div class="row">
		<div class="col-lg-8">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">Form Pengaturan Auto-Update</h6>
				</div>
				<div class="card-body">
					<form action="{{ route('auto_update.settings') }}" method="POST" id="autoUpdateForm">
						@csrf
						
						<div class="form-group">
							<div class="custom-control custom-switch">
								<input type="checkbox" class="custom-control-input" id="auto_update_jadwal" 
								name="auto_update_jadwal" value="1" 
								{{ $setting->auto_update_jadwal ? 'checked' : '' }}>
								<label class="custom-control-label" for="auto_update_jadwal">
									<strong>Aktifkan Auto-Update Jadwal Sholat</strong>
								</label>
							</div>
							<small class="form-text text-muted">
								Jika diaktifkan, jadwal sholat akan diperbarui secara otomatis dari API eksternal
							</small>
						</div>

						<div id="autoUpdateOptions" style="{{ $setting->auto_update_jadwal ? '' : 'display: none;' }}">
							<div class="form-group">
								<label for="auto_update_frequency">Frekuensi Update</label>
								<select class="form-control" id="auto_update_frequency" name="auto_update_frequency">
									<option value="daily" {{ ($setting->auto_update_frequency ?? 'daily') == 'daily' ? 'selected' : '' }}>
										Harian
									</option>
									<option value="weekly" {{ ($setting->auto_update_frequency ?? '') == 'weekly' ? 'selected' : '' }}>
										Mingguan
									</option>
									<option value="monthly" {{ ($setting->auto_update_frequency ?? '') == 'monthly' ? 'selected' : '' }}>
										Bulanan
									</option>
								</select>
								<small class="form-text text-muted">
									Frekuensi pembaruan jadwal sholat
								</small>
							</div>

							<div class="form-group">
								<label for="auto_update_time">Waktu Update</label>
								<input type="time" class="form-control" id="auto_update_time" 
								name="auto_update_time" value="{{ substr($setting->auto_update_time ?? '00:00:00', 0, 5) }}">
								<small class="form-text text-muted">
									Waktu ketika sistem akan melakukan update otomatis
								</small>
							</div>

							<div class="row">
								<div class="col-md-6">
									<div class="form-group">
										<label for="auto_update_city">Kota</label>
										<input type="text" class="form-control" id="auto_update_city" 
										name="auto_update_city" value="{{ old('auto_update_city', $setting->auto_update_city ?? 'Jakarta') }}"
										placeholder="Contoh: Cilegon, Jakarta, Bandung" required>
										<small class="text-muted">Current value: {{ $setting->auto_update_city ?? 'Jakarta' }}</small>
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label for="auto_update_country">Negara</label>
										<input type="text" class="form-control" id="auto_update_country" 
										name="auto_update_country" value="{{ old('auto_update_country', $setting->auto_update_country ?? 'Indonesia') }}"
										placeholder="Contoh: Indonesia" required>
									</div>
								</div>
							</div>

							<div class="form-group">
								<label for="auto_update_method">Metode Perhitungan</label>
								<select class="form-control" id="auto_update_method" name="auto_update_method">
									<option value="11" {{ ($setting->auto_update_method ?? 11) == 11 ? 'selected' : '' }}>
										Kementerian Agama RI (Metode 11)
									</option>
									<option value="20" {{ ($setting->auto_update_method ?? 11) == 20 ? 'selected' : '' }}>
										Kementerian Agama RI (Metode 20)
									</option>
									<option value="1" {{ ($setting->auto_update_method ?? 11) == 1 ? 'selected' : '' }}>
										University of Islamic Sciences, Karachi
									</option>
									<option value="2" {{ ($setting->auto_update_method ?? 11) == 2 ? 'selected' : '' }}>
										Islamic Society of North America
									</option>
									<option value="3" {{ ($setting->auto_update_method ?? 11) == 3 ? 'selected' : '' }}>
										Muslim World League
									</option>
									<option value="4" {{ ($setting->auto_update_method ?? 11) == 4 ? 'selected' : '' }}>
										Umm Al-Qura University, Makkah
									</option>
									<option value="5" {{ ($setting->auto_update_method ?? 11) == 5 ? 'selected' : '' }}>
										Egyptian General Authority of Survey
									</option>
								</select>
								<small class="form-text text-muted">
									Metode perhitungan waktu sholat yang digunakan
								</small>
							</div>

							<div class="alert alert-info">
								<i class="fas fa-info-circle"></i>
								<strong>Informasi:</strong> Jadwal sholat akan diupdate secara otomatis berdasarkan lokasi 
								<strong><span id="displayCity">{{ $setting->auto_update_city ?? 'Jakarta' }}</span>, <span id="displayCountry">{{ $setting->auto_update_country ?? 'Indonesia' }}</span></strong> 
								dengan metode yang dipilih. Pastikan koneksi internet stabil.
							</div>
						</div>

						<div class="form-group">
							<button type="submit" class="btn btn-primary">
								<i class="fas fa-save"></i> Simpan Pengaturan
							</button>
							<a href="{{ route('jadwal_sholat.index') }}" class="btn btn-secondary">
								<i class="fas fa-arrow-left"></i> Kembali
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>

		<div class="col-lg-4">
			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">Update Manual</h6>
				</div>
				<div class="card-body">
					<p>Lakukan update manual jika diperlukan:</p>
					
					<!-- Tombol Update Manual dengan Modal -->
					<button type="button" class="btn btn-warning btn-block" data-toggle="modal" data-target="#confirmUpdateModal">
						<i class="fas fa-sync-alt"></i> Update Manual Sekarang
					</button>
					
					<hr>
					
					<h6 class="font-weight-bold">Status Auto-Update:</h6>
					@if($setting->auto_update_jadwal ?? false)
					<span class="badge badge-success">Aktif</span>
					<p class="mt-2 small">
						<i class="fas fa-clock"></i> Update {{ $setting->auto_update_frequency ?? 'harian' }} 
						pukul {{ substr($setting->auto_update_time ?? '00:00:00', 0, 5) }}<br>
						<i class="fas fa-map-marker-alt"></i> {{ $setting->auto_update_city ?? 'Jakarta' }}, 
						{{ $setting->auto_update_country ?? 'Indonesia' }}
					</p>
					@else
					<span class="badge badge-danger">Nonaktif</span>
					<p class="mt-2 small text-muted">
						Auto-update sedang tidak aktif. Aktifkan untuk update otomatis.
					</p>
					@endif

					<hr>
					<h6 class="font-weight-bold">Data Tersimpan:</h6>
					<p class="small mb-0">
						<strong>ID Record:</strong> {{ $setting->id }}<br>
						<strong>Last Update:</strong> {{ $setting->updated_at ? $setting->updated_at->format('d M Y H:i:s') : 'Never' }}<br>
						<strong>City in DB:</strong> {{ $setting->auto_update_city ?? 'Not set' }}
					</p>
				</div>
			</div>

			<div class="card shadow mb-4">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">Riwayat Update</h6>
				</div>
				<div class="card-body">
					<div class="list-group list-group-flush" id="updateLog">
						<div class="list-group-item text-center">
							<i class="fas fa-spinner fa-spin"></i> Memuat riwayat...
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- MODAL KONFIRMASI UPDATE MANUAL (MODERN & INFORMATIF) -->
<div class="modal fade" id="confirmUpdateModal" tabindex="-1" role="dialog" aria-labelledby="confirmUpdateModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content border-0 shadow-lg">
			<div class="modal-header bg-warning text-white border-0">
				<h5 class="modal-title" id="confirmUpdateModalLabel">
					<i class="fas fa-sync-alt fa-spin mr-2"></i>
					Konfirmasi Update Manual
				</h5>
				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body p-4">
				<!-- Informasi Update -->
				<div class="text-center mb-4">
					<div class="icon-circle bg-warning-light mx-auto mb-3" style="width: 80px; height: 80px; border-radius: 50%; background-color: #fff3cd; display: flex; align-items: center; justify-content: center;">
						<i class="fas fa-exclamation-triangle fa-3x text-warning"></i>
					</div>
					<h4 class="font-weight-bold">Yakin ingin melakukan update manual?</h4>
					<p class="text-muted">Proses ini akan mengambil data jadwal sholat terbaru dari API eksternal.</p>
				</div>

				<!-- Info Detail Update -->
				<div class="card bg-light border-0 mb-4">
					<div class="card-body p-3">
						<h6 class="font-weight-bold text-primary mb-3">
							<i class="fas fa-info-circle mr-2"></i>Detail Update:
						</h6>
						<div class="row">
							<div class="col-6">
								<small class="text-muted d-block">Kota</small>
								<span class="font-weight-bold" id="modalCity">{{ $setting->auto_update_city ?? 'Jakarta' }}</span>
							</div>
							<div class="col-6">
								<small class="text-muted d-block">Negara</small>
								<span class="font-weight-bold" id="modalCountry">{{ $setting->auto_update_country ?? 'Indonesia' }}</span>
							</div>
						</div>
						<hr class="my-2">
						<div class="row">
							<div class="col-6">
								<small class="text-muted d-block">Metode</small>
								<span class="font-weight-bold">Kemenag RI (Metode 11)</span>
							</div>
							<div class="col-6">
								<small class="text-muted d-block">Terakhir Update</small>
								<span class="font-weight-bold">{{ $setting->last_auto_update ? $setting->last_auto_update->format('d M Y H:i') : 'Belum pernah' }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Peringatan -->
				<div class="alert alert-warning border-0" role="alert">
					<div class="d-flex">
						<div class="mr-3">
							<i class="fas fa-clock fa-2x"></i>
						</div>
						<div>
							<strong>Perhatian!</strong><br>
							<small>Proses update membutuhkan koneksi internet yang stabil. Halaman akan dimuat ulang setelah update selesai.</small>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer border-0 bg-light">
				<button type="button" class="btn btn-secondary px-4" data-dismiss="modal">
					<i class="fas fa-times mr-2"></i>Batal
				</button>
				<a href="{{ route('auto_update.manual') }}" class="btn btn-warning px-4" id="confirmUpdateBtn">
					<i class="fas fa-sync-alt mr-2"></i>Ya, Update Sekarang
				</a>
			</div>
		</div>
	</div>
</div>

<!-- MODAL LOADING (UNTUK PROSES UPDATE) -->
<div class="modal fade" id="loadingModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
		<div class="modal-content border-0 shadow-lg">
			<div class="modal-body text-center p-4">
				<div class="spinner-border text-warning mb-3" style="width: 3rem; height: 3rem;" role="status">
					<span class="sr-only">Loading...</span>
				</div>
				<h5 class="font-weight-bold">Memproses Update</h5>
				<p class="text-muted small mb-0">Sedang mengambil data jadwal sholat terbaru...</p>
				<div class="progress mt-3" style="height: 5px;">
					<div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" style="width: 100%"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- MODAL HASIL UPDATE -->
<div class="modal fade" id="resultModal" tabindex="-1" role="dialog">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content border-0 shadow-lg" id="resultModalContent">
			<!-- Konten akan diisi oleh JavaScript -->
		</div>
	</div>
</div>
@endsection

@push('scripts')
<script>
	document.getElementById('auto_update_jadwal').addEventListener('change', function() {
		document.getElementById('autoUpdateOptions').style.display = this.checked ? 'block' : 'none';
	});

    // Update display city when input changes
	document.getElementById('auto_update_city').addEventListener('input', function() {
		document.getElementById('displayCity').textContent = this.value || 'Jakarta';
		document.getElementById('modalCity').textContent = this.value || 'Jakarta';
	});

	document.getElementById('auto_update_country').addEventListener('input', function() {
		document.getElementById('displayCountry').textContent = this.value || 'Indonesia';
		document.getElementById('modalCountry').textContent = this.value || 'Indonesia';
	});

    // Validasi form
	document.getElementById('autoUpdateForm').addEventListener('submit', function(e) {
		if (document.getElementById('auto_update_jadwal').checked) {
			const city = document.getElementById('auto_update_city').value;
			const country = document.getElementById('auto_update_country').value;
			const time = document.getElementById('auto_update_time').value;
			
			if (!city || !country || !time) {
				e.preventDefault();
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Semua field harus diisi jika auto-update diaktifkan!',
					confirmButtonColor: '#0d6e6e'
				});
			}
		}
	});

    // Handle konfirmasi update manual
	document.getElementById('confirmUpdateBtn').addEventListener('click', function(e) {
		e.preventDefault();
		
        // Tutup modal konfirmasi
		$('#confirmUpdateModal').modal('hide');
		
        // Tampilkan modal loading
		$('#loadingModal').modal('show');
		
        // Lakukan request update
		fetch(this.href)
		.then(response => response.json())
		.then(data => {
			$('#loadingModal').modal('hide');
			
                // Tampilkan hasil update
			showResultModal(data);
			
                // Refresh log
			setTimeout(() => {
				loadUpdateLog();
			}, 1000);
		})
		.catch(error => {
			$('#loadingModal').modal('hide');
			
                // Tampilkan error
			showResultModal({
				success: false,
				message: 'Gagal melakukan update: ' + error.message
			});
		});
	});

    // Fungsi untuk menampilkan modal hasil update
	function showResultModal(data) {
		const modalContent = document.getElementById('resultModalContent');
		const isSuccess = data.success || data.message?.includes('berhasil');
		
		modalContent.innerHTML = `
            <div class="modal-header ${isSuccess ? 'bg-success' : 'bg-danger'} text-white border-0">
                <h5 class="modal-title">
                    <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                    ${isSuccess ? 'Update Berhasil' : 'Update Gagal'}
                </h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body p-4 text-center">
                <div class="icon-circle ${isSuccess ? 'bg-success-light' : 'bg-danger-light'} mx-auto mb-3" 
                     style="width: 80px; height: 80px; border-radius: 50%; background-color: ${isSuccess ? '#d4edda' : '#f8d7da'}; display: flex; align-items: center; justify-content: center;">
                    <i class="fas ${isSuccess ? 'fa-check fa-3x' : 'fa-times fa-3x'} ${isSuccess ? 'text-success' : 'text-danger'}"></i>
                </div>
                <h5 class="font-weight-bold mb-3">${isSuccess ? 'Update Manual Berhasil!' : 'Update Manual Gagal!'}</h5>
                <p class="text-muted mb-0">${data.message || (isSuccess ? 'Jadwal sholat berhasil diperbarui.' : 'Terjadi kesalahan saat melakukan update.')}</p>
			
			${isSuccess ? `
                    <div class="card bg-light border-0 mt-4">
                        <div class="card-body p-3 text-left">
                            <small class="text-muted d-block"><i class="fas fa-clock mr-2"></i>Waktu Update: ${new Date().toLocaleString('id-ID')}</small>
                            <small class="text-muted d-block"><i class="fas fa-map-marker-alt mr-2"></i>Lokasi: ${document.getElementById('auto_update_city').value || 'Jakarta'}, ${document.getElementById('auto_update_country').value || 'Indonesia'}</small>
                        </div>
                    </div>
				` : ''}
            </div>
            <div class="modal-footer border-0 bg-light">
                <button type="button" class="btn ${isSuccess ? 'btn-success' : 'btn-danger'} px-4" data-dismiss="modal">
                    <i class="fas fa-check mr-2"></i>Tutup
                </button>
				${isSuccess ? `
                    <button type="button" class="btn btn-primary px-4" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt mr-2"></i>Muat Ulang Halaman
                    </button>
					` : ''}
            </div>
				`;
				
				$('#resultModal').modal('show');
			}

    // Load update log
			function loadUpdateLog() {
				fetch('{{ route("auto_update.log") }}')
				.then(response => response.json())
				.then(data => {
					const logContainer = document.getElementById('updateLog');
					logContainer.innerHTML = '';
					
					if (data.logs.length === 0) {
						logContainer.innerHTML = '<div class="list-group-item text-center text-muted">Belum ada riwayat update</div>';
						return;
					}
					
					data.logs.forEach(log => {
						logContainer.innerHTML += `
                    <div class="list-group-item">
                        <div class="d-flex align-items-center">
                            <i class="fas ${log.status === 'success' ? 'fa-check-circle text-success' : 'fa-info-circle text-info'} mr-2"></i>
                            <div>
                                <small class="text-muted">${log.time}</small>
                                <p class="mb-0">${log.message}</p>
                            </div>
                        </div>
                    </div>
						`;
					});
				})
				.catch(error => {
					console.error('Error loading update log:', error);
					document.getElementById('updateLog').innerHTML = 
					'<div class="list-group-item text-center text-danger">Gagal memuat riwayat</div>';
				});
			}

    // Refresh log setiap 60 detik
			loadUpdateLog();
			setInterval(loadUpdateLog, 60000);
		</script>

		<style>
/* Custom Styles untuk Modal */
.modal-content {
	border-radius: 15px;
	overflow: hidden;
}

.modal-header {
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
}

.modal-footer {
	border-bottom-left-radius: 15px;
	border-bottom-right-radius: 15px;
}

.icon-circle {
	transition: all 0.3s ease;
}

.bg-warning-light {
	background-color: #fff3cd;
}

.bg-success-light {
	background-color: #d4edda;
}

.bg-danger-light {
	background-color: #f8d7da;
}

/* Animasi untuk modal */
.modal.fade .modal-dialog {
	transform: scale(0.8);
	transition: transform 0.3s ease;
}

.modal.show .modal-dialog {
	transform: scale(1);
}

/* Custom button hover */
.btn-warning:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
}

.btn-success:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.btn-danger:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

/* Progress bar animation */
.progress-bar {
	background-size: 1rem 1rem;
	animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
	from { background-position: 1rem 0; }
	to { background-position: 0 0; }
}
</style>
@endpush