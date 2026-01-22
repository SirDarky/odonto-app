<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnamnesisResponse extends Model
{
    protected $fillable = [
        'patient_id',
        'user_id',
        'appointment_id',
        'form_content',
        'signature_file_id',
        'ip_address',
        'signed_at'
    ];

    protected $casts = [
        'form_content' => 'array',
        'signed_at' => 'datetime',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function signatureFile(): BelongsTo
    {
        return $this->belongsTo(PatientFile::class, 'signature_file_id');
    }
}
