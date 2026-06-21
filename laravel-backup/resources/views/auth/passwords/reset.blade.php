@extends('layouts.auth')

@section('main-content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
            <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">
                    <div class="row">
                        <div class="col-lg-6 d-none d-lg-block bg-password-image"></div>
                        <div class="col-lg-6">
                            <div class="p-5">
                                <div class="text-center">
                                    <h1 class="h4 text-gray-900 mb-4">Atur Ulang Kata Sandi</h1>
                                </div>

                                @if ($errors->any())
                                <div class="alert alert-danger border-left-danger" role="alert">
                                    <ul class="pl-4 my-2">
                                        @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                                @endif

                                <form method="POST" action="{{ route('password.update') }}" class="user">
                                    @csrf

                                    <input type="hidden" name="token" value="{{ $token }}">

                                    <div class="form-group">
                                        <input type="email" class="form-control form-control-user" name="email" placeholder="Alamat Email" value="{{ $email ?? old('email') }}" required autofocus>
                                    </div>

                                    <div class="form-group">
                                        <input type="password" class="form-control form-control-user" name="password" placeholder="Kata Sandi Baru" required>
                                    </div>

                                    <div class="form-group">
                                        <input type="password" class="form-control form-control-user" name="password_confirmation" placeholder="Konfirmasi Kata Sandi" required>
                                    </div>

                                    <div class="form-group">
                                        <button type="submit" class="btn btn-primary btn-user btn-block">
                                            Simpan Kata Sandi Baru
                                        </button>
                                    </div>

                                    <div class="text-center">
                                        <a class="small" href="{{ url('/') }}">
                                            ← Kembali ke Beranda
                                        </a>
                                    </div>

                                    <!-- Footer Dinamis -->
                                    <center>
                                        @if(isset($setting['footer']))
                                        {!! $setting['footer'] !!}
                                        @else
                                        <a href="https://wa.me/628179851011" target="_blank" style="font-size: 12px; text-decoration: none; color: gray;">
                                            Hak Cipta &copy; {{ now()->year }} Ali Mochtar Development System
                                        </a>
                                        @endif
                                    </center>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
