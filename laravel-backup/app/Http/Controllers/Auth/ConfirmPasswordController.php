<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\ConfirmsPasswords;
use App\Models\AppSetting;

class ConfirmPasswordController extends Controller
{
    /*
    |----------------------------------------------------------------------
    | Confirm Password Controller
    |----------------------------------------------------------------------
    |
    | This controller is responsible for handling password confirmations and
    | uses a simple trait to include the behavior. You're free to explore
    | this trait and override any functions that require customization.
    |
    */

    use ConfirmsPasswords;

    /**
     * Where to redirect users when the intended url fails.
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
        $this->middleware('auth');

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
