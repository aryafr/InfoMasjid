<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\RoleWidget;
use App\Models\User;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    protected $setting;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');

        // Ambil atau buat pengaturan aplikasi
        $this->setting = AppSetting::first() ?? AppSetting::create([
            'nama_aplikasi' => 'Masjid Al-Ikhlas',
            'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y'),
            'favicon' => 'path/to/default-favicon.ico'
        ]);

        // Share ke semua view secara otomatis
        view()->share('setting', $this->setting);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $widget = [
            'users' => User::count()
        ];

        return view('home', compact('widget'));
    }
}
