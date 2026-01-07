<?php

namespace App\Http\Controllers;

use App\Models\Block;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Schedule/Index');
    }

    public function settings()
    {
        $user = Auth::user();

        return Inertia::render('Schedule/Settings', [
            'availabilities' => $user->availabilities()
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $start = $request->start_time;
        $end = $request->end_time;
        $day = $request->day_of_week;

        $overlap = Auth::user()->availabilities()
            ->where('day_of_week', $day)
            ->where(function ($query) use ($start, $end) {
                $query->where(function ($q) use ($start, $end) {
                    $q->where('start_time', '<', $end)
                        ->where('end_time', '>', $start);
                });
            })->exists();

        if ($overlap) {
            return back()->withErrors([
                'start_time' => 'Este horário conflita com uma grade já existente neste dia.'
            ]);
        }

        $request->user()->availabilities()->create($validated);

        return back()->with('success', 'Horário configurado com sucesso!');
    }

    public function storeBlock(Request $request)
    {
        $request->validate([
            'date'       => 'required|date',
            'end_date'   => 'nullable|date|after_or_equal:date',
            'full_day'   => 'required|boolean',
            'start_time' => 'nullable|required_if:full_day,false|date_format:H:i',
            'end_time'   => 'nullable|required_if:full_day,false|date_format:H:i|after:start_time',
        ]);

        $startDate = Carbon::parse($request->date);

        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : $startDate->copy();

        $userId = Auth::id();
        $blocks = [];

        try {
            DB::transaction(function () use ($startDate, $endDate, $userId, $request, &$blocks) {

                $daysCount = $startDate->diffInDays($endDate);
                if ($daysCount > 90) {
                    throw new \Exception("Período muito longo. O limite máximo permitido é de 90 dias.");
                }

                Auth::user()->blocks()
                    ->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->delete();

                $currentDate = $startDate->copy();
                while ($currentDate <= $endDate) {
                    $blocks[] = [
                        'user_id'    => $userId,
                        'date'       => $currentDate->toDateString(),
                        'full_day'   => $request->full_day,
                        'start_time' => $request->full_day ? null : $request->start_time,
                        'end_time'   => $request->full_day ? null : $request->end_time,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $currentDate->addDay();
                }

                if (!empty($blocks)) {
                    Block::insert($blocks);
                }
            });

            return back()->with('success', 'Agenda atualizada com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['date' => $e->getMessage()]);
        }
    }

    public function blocks()
    {
        return Inertia::render('Schedule/Blocks', [
            'blocks' => Auth::user()->blocks()
                ->orderBy('date', 'desc')
                ->paginate(30)
        ]);
    }

    public function destroyBlock($id)
    {
        Auth::user()->blocks()->findOrFail($id)->delete();
        return back()->with('success', 'Bloqueio removido!');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:blocks,id,user_id,' . Auth::id(),
        ]);

        Auth::user()->blocks()->whereIn('id', $request->ids)->delete();

        $totalRemaining = Auth::user()->blocks()->count();

        if ($totalRemaining === 0) {
            return redirect()->route('schedule.blocks.index')->with('success', 'Todos os itens removidos.');
        }

        return redirect()->route('schedule.blocks.index', ['page' => 1])
            ->with('success', 'Bloqueios removidos.');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $availability = $user->availabilities()->findOrFail($id);

        $availability->delete();

        return back()->with('success', 'Horário removido com sucesso!');
    }
}
