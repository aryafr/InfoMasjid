<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\JadwalSholat;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\JadwalSholatExport;

class JadwalSholatController extends Controller
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
		$jadwal = JadwalSholat::all();
		return view('jadwal_sholat.index', compact('jadwal'));
	}

	public function create()
	{
		return view('jadwal_sholat.create');
	}

	public function store(Request $request)
	{
		$request->validate([
			'nama_sholat' => 'required|string|max:255',
			'waktu' => 'required',
		]);
		JadwalSholat::create($request->all());
		return redirect()->route('jadwal_sholat.index')->with('success', 'Jadwal sholat berhasil ditambahkan.');
	}

	public function edit(JadwalSholat $jadwal_sholat)
	{
		return view('jadwal_sholat.edit', compact('jadwal_sholat'));
	}

	public function update(Request $request, JadwalSholat $jadwal_sholat)
	{
		$request->validate([
			'nama_sholat' => 'required|string|max:255',
			'waktu' => 'required',
		]);
		$jadwal_sholat->update($request->all());
		return redirect()->route('jadwal_sholat.index')->with('success', 'Jadwal sholat berhasil diperbarui.');
	}

	public function destroy(JadwalSholat $jadwal_sholat)
	{
		$jadwal_sholat->delete();
		return redirect()->route('jadwal_sholat.index')->with('success', 'Jadwal sholat berhasil dihapus.');
	}

	 /**
     * Export data jadwal sholat ke Excel/PDF
     */
	 public function export(Request $request)
	 {
        $type = $request->get('type', 'excel'); // excel atau pdf
        
        if ($type == 'pdf') {
        	$jadwal = JadwalSholat::all();
        	$pdf = Pdf::loadView('jadwal_sholat.export_pdf', compact('jadwal'));
        	return $pdf->download('jadwal-sholat-'.date('Y-m-d').'.pdf');
        }
        
        // Default: export ke Excel
        return Excel::download(new JadwalSholatExport, 'jadwal-sholat-'.date('Y-m-d').'.xlsx');
    }

    /**
     * Import data jadwal sholat dari Excel
     */
    public function import(Request $request)
    {
    	$request->validate([
    		'file' => 'required|mimes:xlsx,xls,csv'
    	]);

    	try {
    		Excel::import(new \App\Imports\JadwalSholatImport, $request->file('file'));
    		return redirect()->route('jadwal_sholat.index')->with('success', 'Data jadwal sholat berhasil diimport.');
    	} catch (\Exception $e) {
    		return redirect()->back()->with('error', 'Gagal import data: '.$e->getMessage());
    	}
    }
}
