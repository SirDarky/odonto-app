<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Block extends Model
{
    protected $fillable = ['user_id', 'date', 'full_day', 'start_time', 'end_time'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
