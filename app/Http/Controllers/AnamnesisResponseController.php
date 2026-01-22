<?php

namespace App\Http\Controllers;

use App\Models\AnamnesisQuestion;
use App\Models\AnamnesisResponse;
use App\Models\Patient;
use App\Models\PatientFile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Stevebauman\Location\Facades\Location;

class AnamnesisResponseController extends Controller
{
    /**
     * Exibe o formulário público para o paciente preencher
     */
    public function create($slug)
    {
        $user = User::where('slug', $slug)->firstOrFail();

        $questions = AnamnesisQuestion::where('user_id', $user->id)
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return Inertia::render('Public/Anamnesis/Create', [
            'dentist' => $user,
            'questions' => $questions
        ]);
    }

    public function store(Request $request, $slug)
    {
        $user = User::where('slug', $slug)->firstOrFail();

        $cpfLimpo = preg_replace('/\D/', '', $request->cpf);
        $phoneLimpo = preg_replace('/\D/', '', $request->phone);

        $request->merge([
            'cpf' => $cpfLimpo,
            'phone' => $phoneLimpo
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'cpf' => 'required|string|size:11',
            'email' => 'required|email',
            'phone' => 'required|string|min:10|max:11',
            'answers' => 'required|array',
            'signature' => 'required|string',
        ]);

        Log::info('Dados recebidos no Backend:', [
            'cpf' => $request->cpf,
            'answers_count' => count($request->answers)
        ]);

        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = Location::get($ip);
        $tz = $position ? $position->timezone : 'America/Sao_Paulo';

        try {
            return DB::transaction(function () use ($request, $user, $tz) {

                $patient = Patient::where('cpf', $request->cpf)->first();

                $dataToSave = [
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                ];

                if ($patient) {
                    if (str_contains($dataToSave['name'], '*')) unset($dataToSave['name']);
                    if (str_contains($dataToSave['email'], '*')) unset($dataToSave['email']);
                    if (str_contains($dataToSave['phone'], '*')) unset($dataToSave['phone']);

                    $patient->update($dataToSave);
                } else {
                    $patient = Patient::create(array_merge(['cpf' => $request->cpf], $dataToSave));
                }

                $signatureData = $request->signature;
                $image = str_replace('data:image/png;base64,', '', $signatureData);
                $image = str_replace(' ', '+', $image);
                $fileName = 'signatures/' . Str::uuid() . '.png';

                Storage::disk('private')->put($fileName, base64_decode($image));

                $file = PatientFile::create([
                    'user_id' => $user->id,
                    'patient_id' => $patient->id,
                    'file_path' => $fileName,
                    'file_type' => 'signature',
                    'mime_type' => 'image/png'
                ]);

                $response = AnamnesisResponse::create([
                    'patient_id' => $patient->id,
                    'user_id' => $user->id,
                    'form_content' => $request->answers,
                    'signature_file_id' => $file->id,
                    'ip_address' => $request->ip(),
                    'signed_at' => Carbon::now($tz)->tz('UTC'),
                ]);

                Log::info('Resposta salva com sucesso ID: ' . $response->id);

                return redirect()->route('public.profile', $user->slug)
                    ->with('success', 'Ficha de saúde enviada com sucesso!');
            });
        } catch (\Exception $e) {
            Log::error('Falha ao salvar anamnese: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Erro interno ao salvar os dados.']);
        }
    }

    public function showPatientHistory($id)
    {
        $responses = AnamnesisResponse::where('patient_id', $id)
            ->where('user_id', Auth::id())
            ->with('signatureFile')
            ->latest()
            ->get()
            ->map(function ($response) {
                if ($response->signatureFile) {
                    $response->signature_url = route('files.view', $response->signatureFile->id);
                }
                return $response;
            });

        return Inertia::render('Patients/AnamnesisHistory', [
            'responses' => $responses
        ]);
    }

    public function viewFile(PatientFile $patientFile)
    {
        if ($patientFile->user_id !== Auth::id()) {
            abort(403, 'Você não tem permissão para ver este arquivo.');
        }

        $path = $patientFile->file_path;

        if (!Storage::disk('private')->exists($path)) {
            abort(404, 'Arquivo não encontrado no servidor.');
        }

        $file = Storage::disk('private')->get($path);
        $type = $patientFile->mime_type ?? 'image/png';

        return response($file)->header('Content-Type', $type);
    }
}
