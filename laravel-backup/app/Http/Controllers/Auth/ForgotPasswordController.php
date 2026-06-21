<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use App\Models\AppSetting;

class ForgotPasswordController extends Controller
{
    /*
    |----------------------------------------------------------------------
    | Password Reset Controller
    |----------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    public function __construct()
    {
        // Ambil atau buat AppSetting default
        $setting = AppSetting::first();

        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'Deteksi Penyakit Jantung',
                'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y')
            ]);
        }

        // Share ke semua view
        view()->share('setting', $setting);
    }
}
