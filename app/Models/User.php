<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'cro',
        'cro_state',
        'phone',
        'is_admin',
        'slug',
        'specialty',
        'bio',
        'avatar_path',
        'google_maps_link',
        'address',
    ];


    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_admin' => 'boolean',
        ];
    }

    protected function setSlugAttribute($value): void
    {
        $this->attributes['slug'] = Str::slug($value);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(StandardAvailability::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }

    public function anamnesisQuestions(): HasMany
    {
        return $this->hasMany(AnamnesisQuestion::class);
    }

    public function anamnesisResponses(): HasMany
    {
        return $this->hasMany(AnamnesisResponse::class);
    }

    public function patientFiles(): HasMany
    {
        return $this->hasMany(PatientFile::class);
    }
}
