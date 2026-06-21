<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        Role::insert([
            ['name' => 'admin'],
            ['name' => 'user'],
            ['name' => 'karyawan'],
        ]);
    }
}
