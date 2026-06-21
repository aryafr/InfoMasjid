<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    // Tujuan redirect setelah login
    protected $redirectTo = '/home';

    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    // Menampilkan form login dengan setting aplikasi
    public function showLoginForm()
    {
        $setting = AppSetting::first() ? AppSetting::first()->toArray() : [];
        return view('auth.login', compact('setting'));
    }

    // Menampilkan pesan setelah login
    protected function redirectTo()
    {
        session()->flash('success', 'Anda berhasil login!');
        return $this->redirectTo;
    }

    // Override logout untuk redirect ke halaman welcome
    public function logout(Request $request)
    {
        $this->guard()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Anda telah logout.');
    }
}
