<?php
// app/Http/Controllers/SholatIdulFitriController.php

namespace App\Http\Controllers;

use App\Models\SholatIdulFitri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SholatIdulFitriController extends Controller
{
	public function index()
	{
		$sholatIdulFitri = SholatIdulFitri::orderBy('tahun', 'desc')->get();
		return view('idul-fitri.index', compact('sholatIdulFitri'));
	}

	public function create()
	{
		return view('idul-fitri.create');
	}

	public function store(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'tahun' => 'required|integer|min:2020|max:2100|unique:sholat_idul_fitri,tahun',
			'tanggal' => 'required|date',
			'imam' => 'nullable|string|max:255',
			'khatib' => 'nullable|string|max:255',
			'muadzin' => 'nullable|string|max:255',
			'waktu' => 'nullable|date_format:H:i',
			'keterangan' => 'nullable|string'
		]);

		if ($validator->fails()) {
			return redirect()->back()->withErrors($validator)->withInput();
		}

		SholatIdulFitri::create($request->all());

		return redirect()->route('idul-fitri.index')
		->with('success', 'Jadwal Sholat Idul Fitri berhasil ditambahkan!');
	}

	public function edit(SholatIdulFitri $idulFitri)
	{
		return view('idul-fitri.edit', compact('idulFitri'));
	}

	public function update(Request $request, SholatIdulFitri $idulFitri)
	{
		$validator = Validator::make($request->all(), [
			'tahun' => 'required|integer|min:2020|max:2100|unique:sholat_idul_fitri,tahun,' . $idulFitri->id,
			'tanggal' => 'required|date',
			'imam' => 'nullable|string|max:255',
			'khatib' => 'nullable|string|max:255',
			'muadzin' => 'nullable|string|max:255',
			'waktu' => 'nullable|date_format:H:i',
			'keterangan' => 'nullable|string'
		]);

		if ($validator->fails()) {
			return redirect()->back()->withErrors($validator)->withInput();
		}

		$idulFitri->update($request->all());

		return redirect()->route('idul-fitri.index')
		->with('success', 'Jadwal Sholat Idul Fitri berhasil diupdate!');
	}

	public function destroy(SholatIdulFitri $idulFitri)
	{
		$idulFitri->delete();
		return redirect()->route('idul-fitri.index')
		->with('success', 'Jadwal Sholat Idul Fitri berhasil dihapus!');
	}

	public function embed()
	{
		$settings = \App\Models\AppSetting::first();
		$idulFitri = SholatIdulFitri::tahunIni()->first();
		
		return view('idul-fitri-embed', compact('settings', 'idulFitri'));
	}
}