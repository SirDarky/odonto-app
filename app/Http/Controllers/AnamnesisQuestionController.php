<?php

namespace App\Http\Controllers;

use App\Models\AnamnesisQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnamnesisQuestionController extends Controller
{
    public function index()
    {
        $questions = Auth::user()->anamnesisQuestions()
            ->orderBy('order')
            ->get();

        return Inertia::render('Anamnesis/Index', [
            'questions' => $questions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'type' => 'required|in:boolean,text,textarea,checkbox,radio',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'nullable|integer'
        ]);

        if (!isset($validated['order'])) {
            $validated['order'] = Auth::user()->anamnesisQuestions()->count();
        }

        Auth::user()->anamnesisQuestions()->create($validated);

        return redirect()->back()->with('success', 'Pergunta adicionada!');
    }

    public function bulkDestroy()
    {
        DB::transaction(function () {
            Auth::user()->anamnesisQuestions()->delete();
        });

        return redirect()->back()->with('success', 'Ficha limpa com sucesso!');
    }

    public function update(Request $request, AnamnesisQuestion $question)
    {
        if ($question->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'type' => 'required|in:boolean,text,textarea,checkbox,radio',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'nullable|integer'
        ]);

        $question->update($validated);

        return redirect()->back()->with('success', 'Pergunta atualizada!');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:anamnesis_questions,id'
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->ids as $index => $id) {
                Auth::user()->anamnesisQuestions()
                    ->where('id', $id)
                    ->update(['order' => $index]);
            }
        });

        return redirect()->back()->with('success', 'Ordem atualizada!');
    }

    public function replaceTemplate(Request $request)
    {
        $request->validate([
            'questions' => 'required|array',
            'questions.*.text' => 'required|string|max:255',
            'questions.*.type' => 'required|in:boolean,text,textarea,checkbox,radio',
            'questions.*.options' => 'nullable|array',
        ]);

        DB::transaction(function () use ($request) {
            $user = Auth::user();

            $user->anamnesisQuestions()->delete();

            $newQuestions = collect($request->questions)->map(function ($q, $index) use ($user) {
                return [
                    'user_id'     => $user->id,
                    'text'        => $q['text'],
                    'type'        => $q['type'],
                    'options'     => isset($q['options']) ? json_encode($q['options']) : null,
                    'is_required' => true,
                    'is_active'   => true,
                    'order'       => $index,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            })->toArray();

            AnamnesisQuestion::insert($newQuestions);
        });

        return redirect()->route('settings.anamnesis.index')->with('success', 'Template aplicado com sucesso!');
    }

    public function destroy(AnamnesisQuestion $question)
    {
        if ($question->user_id !== Auth::id()) {
            abort(403);
        }

        $question->delete();

        return redirect()->back()->with('success', 'Pergunta removida!');
    }
}
