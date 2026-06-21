<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->orderBy('name')->get();
        $setting = AppSetting::first();

        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'Masjid Al-Ikhlas',
                'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y')
            ]);
        }

        return view('users.index', compact('users', 'setting'));
    }

    public function create()
    {
        $roles = Role::all();
        $setting = AppSetting::firstOrCreate([
            'nama_aplikasi' => 'Masjid Al-Ikhlas',
            'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y')
        ]);

        return view('users.create', compact('roles', 'setting'));
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $setting = AppSetting::first();
        
        if (!$setting) {
            $setting = AppSetting::create([
                'nama_aplikasi' => 'Masjid Al-Ikhlas',
                'footer' => 'Copyright &copy; <a href="https://wa.me/628179851011" target="_blank">Ali Mochtar Development System</a> ' . date('Y')
            ]);
        }

        return view('users.edit', compact('user', 'roles', 'setting'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            'password' => 'required|confirmed|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'password' => $request->password,
        ]);

        return redirect()->route('users.index')->with('success', 'Akun berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|confirmed|min:6',
        ]);

        $data = $request->only(['name', 'last_name', 'email', 'role_id']);

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return redirect()->route('users.index')->with('success', 'Akun berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Proteksi: Admin tidak bisa menghapus akun admin lain
        // Admin tidak bisa menghapus akun sendiri
        // Hanya petugas yang bisa dihapus
        
        if ($user->role && $user->role->name == 'admin') {
            return redirect()->route('users.index')->with('error', 'Tidak dapat menghapus akun Administrator!');
        }
        
        if (Auth::user()->id == $user->id) {
            return redirect()->route('users.index')->with('error', 'Tidak dapat menghapus akun sendiri!');
        }
        
        $user->delete();
        return redirect()->route('users.index')->with('success', 'Akun berhasil dihapus.');
    }
}