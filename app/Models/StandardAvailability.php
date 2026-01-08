<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class StandardAvailability extends Model
{
    protected $fillable = ['user_id', 'day_of_week', 'start_time', 'end_time', 'slot_duration', 'active'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getLocalStartTimeAttribute()
    {
        $tz = Auth::user()->timezone ?? 'UTC';
        return Carbon::createFromFormat('H:i:s', $this->attributes['start_time'], 'UTC')
            ->tz($tz)
            ->format('H:i');
    }

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];
}
