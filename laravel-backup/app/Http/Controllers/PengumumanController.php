<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\PengumumanExport;

class PengumumanController extends Controller
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
		$pengumuman = Pengumuman::all();
		return view('pengumuman.index', compact('pengumuman'));
	}

	public function create()
	{
		return view('pengumuman.create');
	}

	public function store(Request $request)
	{
		$request->validate([
			'isi' => 'required|string',
			'tanggal' => 'required|date',
		]);
		Pengumuman::create($request->all());
		return redirect()->route('pengumuman.index')->with('success', 'Pengumuman berhasil ditambahkan.');
	}

	public function edit(Pengumuman $pengumuman)
	{
		return view('pengumuman.edit', compact('pengumuman'));
	}

	public function update(Request $request, Pengumuman $pengumuman)
	{
		$request->validate([
			'isi' => 'required|string',
			'tanggal' => 'required|date',
		]);
		$pengumuman->update($request->all());
		return redirect()->route('pengumuman.index')->with('success', 'Pengumuman berhasil diperbarui.');
	}

	public function destroy(Pengumuman $pengumuman)
	{
		$pengumuman->delete();
		return redirect()->route('pengumuman.index')->with('success', 'Pengumuman berhasil dihapus.');
	}

	/**
     * Export data pengumuman ke Excel/PDF
     */
	public function export(Request $request)
	{
		$type = $request->get('type', 'excel');
		
		if ($type == 'pdf') {
			$pengumuman = Pengumuman::all();
			$pdf = Pdf::loadView('pengumuman.export_pdf', compact('pengumuman'));
			return $pdf->download('pengumuman-'.date('Y-m-d').'.pdf');
		}
		
		return Excel::download(new PengumumanExport, 'pengumuman-'.date('Y-m-d').'.xlsx');
	}
}
