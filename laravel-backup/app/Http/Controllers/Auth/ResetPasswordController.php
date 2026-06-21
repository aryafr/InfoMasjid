<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\ResetsPasswords;
use App\Models\AppSetting;

class ResetPasswordController extends Controller
{
    /*
    |----------------------------------------------------------------------
    | Password Reset Controller
    |----------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');

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

    /**
     * Set the user's password.
     *
     * @param  \Illuminate\Contracts\Auth\CanResetPassword  $user
     * @param  string  $password
     * @return void
     */
    protected function setUserPassword($user, $password)
    {
        $user->password = $password;
    }
}
