<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\StandardAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Stevebauman\Location\Facades\Location;

class AvailabilityController extends Controller
{
    public function index()
    {
        return Inertia::render('Schedule/Index');
    }


    public function settings(Request $request)
    {
        $user = Auth::user();

        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = Location::get($ip);
        $tz = $position ? $position->timezone : 'America/Sao_Paulo';

        $availabilities = $user->availabilities()
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        $localizedAvailabilities = $availabilities->map(function ($availability) use ($tz) {
            $startLocal = \Carbon\Carbon::parse($availability->start_time, 'UTC')->tz($tz);
            $endLocal = \Carbon\Carbon::parse($availability->end_time, 'UTC')->tz($tz);
            return [
                'id' => $availability->id,
                'day_of_week' => $availability->day_of_week,
                'start_time' => $startLocal->format('H:i'),
                'end_time' => $endLocal->format('H:i'),
                'active' => $availability->active,
            ];
        })->values();

        return Inertia::render('Schedule/Settings', [
            'availabilities' => $localizedAvailabilities
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $user = Auth::user();

        // 1. Identifica o fuso horário (com seu fallback de teste)
        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = Location::get($ip);
        $tz = $position ? $position->timezone : 'America/Sao_Paulo';

        /** * 2. O ERRO ESTAVA AQUI: 
         * Criamos a data usando o dia atual como referência, mas setamos o H:i:s.
         * Em seguida, usamos next() ou setUnit para ajustar o dia da semana SEM resetar as horas.
         */
        $startLocal = Carbon::now($tz)->setTimeFromTimeString($request->start_time);
        $endLocal = Carbon::now($tz)->setTimeFromTimeString($request->end_time);

        // Ajusta para o dia da semana pretendido (0 = Domingo, 1 = Segunda, etc)
        // Usamos um cálculo simples de diferença de dias para não resetar o relógio
        $currentDay = $startLocal->dayOfWeek;
        $daysToAdd = $request->day_of_week - $currentDay;

        $startLocal->addDays($daysToAdd);
        $endLocal->addDays($daysToAdd);

        // 3. Converte para UTC (Linguagem do Banco)
        $startUtc = $startLocal->copy()->tz('UTC');
        $endUtc = $endLocal->copy()->tz('UTC');

        // 4. Extração de valores normalizados
        $utcDay = $startUtc->dayOfWeek;
        $utcStartTime = $startUtc->format('H:i:s');
        $utcEndTime = $endUtc->format('H:i:s');

        // 5. Verifica sobreposição (Overlap)
        $overlap = $user->availabilities()
            ->where('day_of_week', $utcDay)
            ->where(function ($query) use ($utcStartTime, $utcEndTime) {
                $query->where(function ($q) use ($utcStartTime, $utcEndTime) {
                    $q->where('start_time', '<', $utcEndTime)
                        ->where('end_time', '>', $utcStartTime);
                });
            })->exists();

        if ($overlap) {
            return back()->withErrors(['start_time' => 'Este horário conflita com outro em UTC.']);
        }

        // 6. Persistência
        $user->availabilities()->create([
            'day_of_week' => $utcDay,
            'start_time' => $utcStartTime,
            'end_time'   => $utcEndTime,
            'active'     => true
        ]);

        return back()->with('success', 'Horário salvo com sucesso (UTC).');
    }

    public function storeBulk(Request $request)
    {
        $request->validate([
            'slots' => 'required|array',
            'slots.*.day_of_week' => 'required|integer|between:0,6',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
        ]);

        $user = Auth::user();
        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = Location::get($ip);
        $tz = $position ? $position->timezone : 'America/Sao_Paulo';

        $errors = [];
        $createdCount = 0;

        DB::transaction(function () use ($request, $user, $tz, &$createdCount, &$errors) {
            foreach ($request->slots as $index => $slot) {
                $startLocal = Carbon::now($tz)->setTimeFromTimeString($slot['start_time']);
                $endLocal = Carbon::now($tz)->setTimeFromTimeString($slot['end_time']);

                $daysToAdd = $slot['day_of_week'] - $startLocal->dayOfWeek;
                $startLocal->addDays($daysToAdd);
                $endLocal->addDays($daysToAdd);

                $startUtc = $startLocal->copy()->tz('UTC');
                $endUtc = $endLocal->copy()->tz('UTC');

                $utcDay = $startUtc->dayOfWeek;
                $utcStartTime = $startUtc->format('H:i:s');
                $utcEndTime = $endUtc->format('H:i:s');

                $overlap = $user->availabilities()
                    ->where('day_of_week', $utcDay)
                    ->where(function ($query) use ($utcStartTime, $utcEndTime) {
                        $query->where('start_time', '<', $utcEndTime)
                            ->where('end_time', '>', $utcStartTime);
                    })->exists();

                if ($overlap) {
                    $errors[] = "O slot {$slot['start_time']} conflita com um horário existente.";
                    continue;
                }

                $user->availabilities()->create([
                    'day_of_week' => $utcDay,
                    'start_time' => $utcStartTime,
                    'end_time'   => $utcEndTime,
                    'active'     => true
                ]);

                $createdCount++;
            }
        });

        if (count($errors) > 0) {
            return back()->withErrors(['slots' => $errors]);
        }

        return back()->with('success', "{$createdCount} horários gerados com sucesso.");
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

        $user = Auth::user();

        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = Location::get($ip);
        $tz = $position ? $position->timezone : 'America/Sao_Paulo';

        $startDate = Carbon::parse($request->date, $tz)->startOfDay();
        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date, $tz)->endOfDay()
            : $startDate->copy()->endOfDay();

        $userId = $user->id;

        try {
            DB::transaction(function () use ($startDate, $endDate, $userId, $request, $tz) {
                $daysCount = $startDate->diffInDays($endDate);
                if ($daysCount > 90) {
                    throw new \Exception("Período limite de 90 dias excedido.");
                }

                Block::where('user_id', $userId)
                    ->whereBetween('date', [
                        $startDate->copy()->tz('UTC')->toDateString(),
                        $endDate->copy()->tz('UTC')->toDateString()
                    ])->delete();

                $currentDate = $startDate->copy();
                $blocks = [];

                while ($currentDate <= $endDate) {
                    if (!$request->full_day) {
                        $localStart = $currentDate->copy()->setTimeFromTimeString($request->start_time);
                        $localEnd = $currentDate->copy()->setTimeFromTimeString($request->end_time);

                        $blocks[] = [
                            'user_id'    => $userId,
                            'date'       => $localStart->copy()->tz('UTC')->toDateString(),
                            'full_day'   => false,
                            'start_time' => $localStart->copy()->tz('UTC')->format('H:i:s'),
                            'end_time'   => $localEnd->copy()->tz('UTC')->format('H:i:s'),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    } else {
                        $blocks[] = [
                            'user_id'    => $userId,
                            'date'       => $currentDate->copy()->tz('UTC')->toDateString(),
                            'full_day'   => true,
                            'start_time' => null,
                            'end_time'   => null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
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

    public function blocks(Request $request)
    {
        $user = Auth::user();
        $ip = ($request->ip() === '127.0.0.1') ? '104.28.199.163' : $request->ip();
        $position = \Stevebauman\Location\Facades\Location::get($ip);
        $tz = $position ? $position->timezone : 'America/Sao_Paulo';

        $blocks = $user->blocks()->orderBy('date', 'desc')->paginate(30);

        $blocks->getCollection()->transform(function ($block) use ($tz) {
            $startTimeLocal = null;
            $endTimeLocal = null;

            $dateOnly = \Carbon\Carbon::parse($block->date)->format('Y-m-d');
            $dateDisplay = $dateOnly;

            if (!$block->full_day && $block->start_time) {
                $startUtc = \Carbon\Carbon::parse($dateOnly . ' ' . $block->start_time, 'UTC');
                $endUtc = \Carbon\Carbon::parse($dateOnly . ' ' . $block->end_time, 'UTC');

                $startLocal = $startUtc->tz($tz);
                $endLocal = $endUtc->tz($tz);

                $dateDisplay = $startLocal->format('Y-m-d');
                $startTimeLocal = $startLocal->format('H:i');
                $endTimeLocal = $endLocal->format('H:i');
            }

            return [
                'id' => $block->id,
                'date' => $dateDisplay,
                'full_day' => (bool)$block->full_day,
                'start_time' => $startTimeLocal,
                'end_time' => $endTimeLocal,
            ];
        });

        return Inertia::render('Schedule/Blocks', [
            'blocks' => $blocks,
            'tz' => $tz
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

        return back()->with('success', 'Bloqueios removidos com sucesso.');
    }

    public function destroy($id)
    {
        Auth::user()->availabilities()->findOrFail($id)->delete();
        return back()->with('success', 'Horário removido com sucesso!');
    }

    public function bulkDestroySettings(Request $request)
    {
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return back()->with('error', 'Nenhum horário selecionado.');
        }

        Auth::user()->availabilities()
            ->whereIn('id', $ids)
            ->delete();

        return back()->with('success', 'Horários removidos com sucesso!');
    }
}
