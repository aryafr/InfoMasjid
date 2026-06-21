<?php
// app/Http/Controllers/QrisController.php

namespace App\Http\Controllers;

use App\Models\Qris;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class QrisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    	$qrisList = Qris::orderBy('status', 'desc')->orderBy('created_at', 'desc')->get();
    	return view('qris.index', compact('qrisList'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    	return view('qris.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    	$validator = Validator::make($request->all(), [
    		'nama' => 'required|string|max:255',
    		'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    		'keterangan' => 'nullable|string',
    		'nomor_rekening' => 'nullable|string|max:100',
    		'bank' => 'nullable|string|max:100',
    		'atas_nama' => 'nullable|string|max:255',
    		'status' => 'required|in:aktif,nonaktif'
    	]);

    	if ($validator->fails()) {
    		return redirect()->back()->withErrors($validator)->withInput();
    	}

        // Upload gambar
    	if ($request->hasFile('gambar')) {
    		$file = $request->file('gambar');
    		$filename = time() . '_' . $file->getClientOriginalName();
    		$path = $file->storeAs('qris', $filename, 'public');
    	}

    	Qris::create([
    		'nama' => $request->nama,
    		'gambar' => $path,
    		'keterangan' => $request->keterangan,
    		'nomor_rekening' => $request->nomor_rekening,
    		'bank' => $request->bank,
    		'atas_nama' => $request->atas_nama,
    		'status' => $request->status
    	]);

        // Jika status yang diinput adalah 'aktif', nonaktifkan QRIS lain
    	if ($request->status === 'aktif') {
    		Qris::where('id', '!=', Qris::latest()->first()->id)
    		->update(['status' => 'nonaktif']);
    	}

    	return redirect()->route('qris.index')
    	->with('success', 'QRIS berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Qris $qris)
    {
    	return view('qris.show', compact('qris'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Qris $qris)
    {
    	return view('qris.edit', compact('qris'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Qris $qris)
    {
    	$validator = Validator::make($request->all(), [
    		'nama' => 'required|string|max:255',
    		'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    		'keterangan' => 'nullable|string',
    		'nomor_rekening' => 'nullable|string|max:100',
    		'bank' => 'nullable|string|max:100',
    		'atas_nama' => 'nullable|string|max:255',
    		'status' => 'required|in:aktif,nonaktif'
    	]);

    	if ($validator->fails()) {
    		return redirect()->back()->withErrors($validator)->withInput();
    	}

    	$data = [
    		'nama' => $request->nama,
    		'keterangan' => $request->keterangan,
    		'nomor_rekening' => $request->nomor_rekening,
    		'bank' => $request->bank,
    		'atas_nama' => $request->atas_nama,
    		'status' => $request->status
    	];

        // Upload gambar baru jika ada
    	if ($request->hasFile('gambar')) {
            // Hapus gambar lama
    		if ($qris->gambar && Storage::disk('public')->exists($qris->gambar)) {
    			Storage::disk('public')->delete($qris->gambar);
    		}
    		
    		$file = $request->file('gambar');
    		$filename = time() . '_' . $file->getClientOriginalName();
    		$data['gambar'] = $file->storeAs('qris', $filename, 'public');
    	}

    	$qris->update($data);

        // Jika status diupdate menjadi 'aktif', nonaktifkan QRIS lain
    	if ($request->status === 'aktif') {
    		Qris::where('id', '!=', $qris->id)
    		->update(['status' => 'nonaktif']);
    	}

    	return redirect()->route('qris.index')
    	->with('success', 'QRIS berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Qris $qris)
    {
        // Hapus file gambar
    	if ($qris->gambar && Storage::disk('public')->exists($qris->gambar)) {
    		Storage::disk('public')->delete($qris->gambar);
    	}

    	$qris->delete();

    	return redirect()->route('qris.index')
    	->with('success', 'QRIS berhasil dihapus!');
    }

    /**
     * Set status QRIS menjadi aktif
     */
    public function setAktif(Qris $qris)
    {
        // Nonaktifkan semua QRIS
    	Qris::query()->update(['status' => 'nonaktif']);
    	
        // Aktifkan QRIS yang dipilih
    	$qris->update(['status' => 'aktif']);

    	return redirect()->route('qris.index')
    	->with('success', 'QRIS berhasil diaktifkan!');
    }

    /**
     * Display QRIS for public view (embed)
     */
    public function embed()
    {
    	$qris = Qris::aktif()->first();
    	return view('qris.embed', compact('qris'));
    }
}