<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Patient;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/patient/{id}', function($id) {
    $patient = Patient::find($id);
    
    if (!$patient) {
        return response()->json([
            'error' => 'Patient not found',
            'code' => 404
        ], 404);
    }

    return response()->json([
        'age' => $patient->age,
        'gender' => $patient->gender,
        'name' => $patient->name
    ]);
})->middleware('auth:api');