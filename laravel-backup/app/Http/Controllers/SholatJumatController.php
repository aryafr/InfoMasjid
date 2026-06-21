<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\SholatJumat;
use Illuminate\Http\Request;

class SholatJumatController extends Controller
{

	protected $setting;

	public function __construct()
	{
		$this->middleware('auth');
		$this->setting = AppSetting::firstOrCreate([], [
			'nama_aplikasi' => 'Masjid Al-Ikhlas',
			'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y'),
            // Add other default settings if needed
		]);
		view()->share('setting', $this->setting);
	}

	public function index()
	{
		$sholatJumat = SholatJumat::where('tanggal', '>=', now()->startOfWeek())->get();
		return view('sholat_jumat.index', compact('sholatJumat'));
	}

	public function create()
	{
		return view('sholat_jumat.create');
	}

	public function store(Request $request)
	{
		$request->validate([
			'imam' => 'nullable|string|max:255',
			'khatib' => 'nullable|string|max:255',
			'muadzin' => 'nullable|string|max:255',
			'tanggal' => 'required|date',
		]);
		SholatJumat::create($request->all());
		return redirect()->route('sholat_jumat.index')->with('success', 'Jadwal sholat Jumat berhasil ditambahkan.');
	}

	public function edit(SholatJumat $sholat_jumat)
	{
		return view('sholat_jumat.edit', compact('sholat_jumat'));
	}

	public function update(Request $request, SholatJumat $sholat_jumat)
	{
		$request->validate([
			'imam' => 'nullable|string|max:255',
			'khatib' => 'nullable|string|max:255',
			'muadzin' => 'nullable|string|max:255',
			'tanggal' => 'required|date',
		]);
		$sholat_jumat->update($request->all());
		return redirect()->route('sholat_jumat.index')->with('success', 'Jadwal sholat Jumat berhasil diperbarui.');
	}

	public function destroy(SholatJumat $sholat_jumat)
	{
		$sholat_jumat->delete();
		return redirect()->route('sholat_jumat.index')->with('success', 'Jadwal sholat Jumat berhasil dihapus.');
	}
}
