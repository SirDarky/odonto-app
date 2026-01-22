<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

    public function searchByCpfPublic(Request $request)
    {
        $cpf = preg_replace('/\D/', '', $request->cpf);

        if (strlen($cpf) !== 11) {
            return response()->json(null);
        }

        $patient = Patient::where('cpf', $cpf)->first();

        if (!$patient) {
            return response()->json(null);
        }

        $emailParts = explode('@', $patient->email);
        $maskedEmail = Str::mask($emailParts[0], '*', 3) . '@' . $emailParts[1];

        return response()->json([
            'id' => $patient->id,
            'name' => Str::mask($patient->name, '*', 3),
            'phone' => Str::mask($patient->phone, '*', -4, 4),
            'email' => $maskedEmail,
        ]);
    }

    public function show($id)
    {
        $patient = Patient::findOrFail($id);

        return response()->json([
            'id' => $patient->id,
            'name' => $patient->name,
            'phone' => $patient->phone,
            'cpf' => $patient->cpf,
            'email' => $patient->email,
        ]);
    }
}
