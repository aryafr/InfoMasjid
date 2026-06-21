<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Keuangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\KeuanganExport;

class KeuanganController extends Controller
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
		$keuangan = Keuangan::orderBy('tanggal', 'desc')->get();
		$totalPemasukan = Keuangan::sum('pemasukan');
		$totalPengeluaran = Keuangan::sum('pengeluaran');
		$saldo = $totalPemasukan - $totalPengeluaran;
		return view('keuangan.index', compact('keuangan', 'totalPemasukan', 'totalPengeluaran', 'saldo'));
	}

	public function create()
	{
		return view('keuangan.create');
	}

	public function store(Request $request)
	{
		$request->validate([
			'tanggal' => 'required|date',
			'deskripsi' => 'required|string|max:255',
			'pemasukan' => 'nullable|numeric|min:0',
			'pengeluaran' => 'nullable|numeric|min:0',
			'kategori' => 'nullable|string|max:100',
		]);

		$pemasukan = $request->pemasukan ?? 0;
		$pengeluaran = $request->pengeluaran ?? 0;
		
        // Calculate current balance
		$lastSaldo = Keuangan::orderBy('tanggal', 'desc')->first()->saldo ?? 0;
		$saldo = $lastSaldo + $pemasukan - $pengeluaran;

		Keuangan::create([
			'tanggal' => $request->tanggal,
			'deskripsi' => $request->deskripsi,
			'pemasukan' => $pemasukan,
			'pengeluaran' => $pengeluaran,
			'saldo' => $saldo,
			'kategori' => $request->kategori,
		]);

		return redirect()->route('keuangan.index')->with('success', 'Data keuangan berhasil ditambahkan.');
	}

	public function edit(Keuangan $keuangan)
	{
		return view('keuangan.edit', compact('keuangan'));
	}

	public function update(Request $request, Keuangan $keuangan)
	{
		$request->validate([
			'tanggal' => 'required|date',
			'deskripsi' => 'required|string|max:255',
			'pemasukan' => 'nullable|numeric|min:0',
			'pengeluaran' => 'nullable|numeric|min:0',
			'kategori' => 'nullable|string|max:100',
		]);

		$pemasukan = $request->pemasukan ?? 0;
		$pengeluaran = $request->pengeluaran ?? 0;

        // Recalculate balance from the beginning up to this record
		$previousRecords = Keuangan::where('tanggal', '<', $keuangan->tanggal)->orderBy('tanggal', 'desc')->first();
		$lastSaldo = $previousRecords ? $previousRecords->saldo : 0;
		$saldo = $lastSaldo + $pemasukan - $pengeluaran;

		$keuangan->update([
			'tanggal' => $request->tanggal,
			'deskripsi' => $request->deskripsi,
			'pemasukan' => $pemasukan,
			'pengeluaran' => $pengeluaran,
			'saldo' => $saldo,
			'kategori' => $request->kategori,
		]);

        // Update subsequent records' balances
		$subsequentRecords = Keuangan::where('tanggal', '>=', $keuangan->tanggal)->where('id', '!=', $keuangan->id)->orderBy('tanggal')->get();
		$currentSaldo = $saldo;
		foreach ($subsequentRecords as $record) {
			$currentSaldo = $currentSaldo + ($record->pemasukan ?? 0) - ($record->pengeluaran ?? 0);
			$record->update(['saldo' => $currentSaldo]);
		}

		return redirect()->route('keuangan.index')->with('success', 'Data keuangan berhasil diperbarui.');
	}

	public function destroy(Keuangan $keuangan)
	{
		$keuangan->delete();

        // Recalculate balances for subsequent records
		$records = Keuangan::orderBy('tanggal')->get();
		$saldo = 0;
		foreach ($records as $record) {
			$saldo = $saldo + ($record->pemasukan ?? 0) - ($record->pengeluaran ?? 0);
			$record->update(['saldo' => $saldo]);
		}

		return redirect()->route('keuangan.index')->with('success', 'Data keuangan berhasil dihapus.');
	}

	
    /**
     * Menampilkan halaman laporan keuangan
     */
    public function laporan(Request $request)
    {
    	$dari = $request->get('dari', date('Y-m-01'));
    	$sampai = $request->get('sampai', date('Y-m-t'));
    	
    	$keuangan = Keuangan::whereBetween('tanggal', [$dari, $sampai])
    	->orderBy('tanggal', 'desc')
    	->get();
    	
    	$totalPemasukan = $keuangan->sum('pemasukan');
    	$totalPengeluaran = $keuangan->sum('pengeluaran');
    	$saldo = $totalPemasukan - $totalPengeluaran;
    	
    	return view('keuangan.laporan', compact('keuangan', 'totalPemasukan', 'totalPengeluaran', 'saldo', 'dari', 'sampai'));
    }

    /**
     * Export laporan keuangan ke PDF
     */
    public function pdf(Request $request)
    {
    	$dari = $request->get('dari', date('Y-m-01'));
    	$sampai = $request->get('sampai', date('Y-m-t'));
    	
    	$keuangan = Keuangan::whereBetween('tanggal', [$dari, $sampai])
    	->orderBy('tanggal', 'desc')
    	->get();
    	
    	$totalPemasukan = $keuangan->sum('pemasukan');
    	$totalPengeluaran = $keuangan->sum('pengeluaran');
    	$saldo = $totalPemasukan - $totalPengeluaran;
    	
    	$pdf = Pdf::loadView('keuangan.laporan_pdf', compact('keuangan', 'totalPemasukan', 'totalPengeluaran', 'saldo', 'dari', 'sampai'));
    	
    	return $pdf->download('laporan-keuangan-'.$dari.'-'.$sampai.'.pdf');
    }

   /**
 * Export data keuangan ke Excel
 */
   public function export(Request $request)
   {
   	$type = $request->get('type', 'excel');
   	$dari = $request->get('dari', date('Y-m-01'));
   	$sampai = $request->get('sampai', date('Y-m-t'));
   	
   	if ($type == 'pdf') {
   		$keuangan = Keuangan::whereBetween('tanggal', [$dari, $sampai])
   		->orderBy('tanggal', 'desc')
   		->get();
   		
   		$totalPemasukan = $keuangan->sum('pemasukan');
   		$totalPengeluaran = $keuangan->sum('pengeluaran');
   		$saldo = $totalPemasukan - $totalPengeluaran;
   		
   		$pdf = Pdf::loadView('keuangan.laporan_pdf', compact('keuangan', 'totalPemasukan', 'totalPengeluaran', 'saldo', 'dari', 'sampai'));
   		return $pdf->download('laporan-keuangan-' . $dari . '-' . $sampai . '.pdf');
   	}
   	
   	return Excel::download(new KeuanganExport($dari, $sampai), 'laporan-keuangan-' . $dari . '-' . $sampai . '.xlsx');
   }

    /**
     * Import data keuangan dari Excel
     */
    public function import(Request $request)
    {
    	$request->validate([
    		'file' => 'required|mimes:xlsx,xls,csv'
    	]);

    	try {
    		Excel::import(new \App\Imports\KeuanganImport, $request->file('file'));
    		
            // Recalculate semua saldo setelah import
    		$this->recalculateAllSaldo();
    		
    		return redirect()->route('keuangan.index')->with('success', 'Data keuangan berhasil diimport.');
    	} catch (\Exception $e) {
    		return redirect()->back()->with('error', 'Gagal import data: '.$e->getMessage());
    	}
    }

    /**
     * Recalculate semua saldo (private method)
     */
    private function recalculateAllSaldo()
    {
    	$records = Keuangan::orderBy('tanggal')->get();
    	$saldo = 0;
    	foreach ($records as $record) {
    		$saldo = $saldo + ($record->pemasukan ?? 0) - ($record->pengeluaran ?? 0);
    		$record->update(['saldo' => $saldo]);
    	}
    }
}
