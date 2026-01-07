<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StandardAvailability extends Model
{
    protected $fillable = ['user_id', 'day_of_week', 'start_time', 'end_time', 'slot_duration', 'active'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
