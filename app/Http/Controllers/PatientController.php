<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function searchByCpf(Request $request)
    {
        $cpf = preg_replace('/\D/', '', $request->cpf);

        if (strlen($cpf) !== 11) {
            return response()->json(null);
        }

        $patient = Patient::where('cpf', $cpf)->first();

        return response()->json($patient);
    }
}
