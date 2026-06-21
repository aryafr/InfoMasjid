<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\AppSetting; // Import model AppSetting
use Illuminate\Http\Request;

class RoleController extends Controller
{

    public function index()
    {
        // Ambil setting
        $setting = AppSetting::first();

        // Jika belum ada, buat default
        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'Masjid Al-Ikhlas',
                'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y')
            ]);
        }

        $roles = Role::all();
        return view('roles.index', compact('roles', 'setting')); // Pass setting ke view
    }

    public function create()
    {
        // Ambil setting
        $setting = AppSetting::first();

        // Jika belum ada, buat default
        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'Deteksi Penyakit Jantung',
                'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y')
            ]);
        }

        return view('roles.create', compact('setting')); // Pass setting ke view
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:roles']);
        Role::create($request->all());
        return redirect()->route('roles.index')->with('success', 'Role berhasil ditambahkan');
    }

    public function edit(Role $role)
    {
        // Ambil setting
        $setting = AppSetting::first();

        // Jika belum ada, buat default
        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'Deteksi Penyakit Jantung',
                'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y')
            ]);
        }

        return view('roles.edit', compact('role', 'setting')); // Pass setting ke view
    }

    public function update(Request $request, Role $role)
    {
        $request->validate(['name' => 'required|unique:roles,name,' . $role->id]);
        $role->update($request->all());
        return redirect()->route('roles.index')->with('success', 'Role berhasil diperbarui');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role berhasil dihapus');
    }
}
