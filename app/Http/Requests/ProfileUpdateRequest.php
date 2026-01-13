<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique(User::class)->ignore($this->user()->id),
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'
            ],
            'specialty' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:500'],
            'google_maps_link' => ['nullable', 'url', 'max:500'],
            'address' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex' => 'O link personalizado deve conter apenas letras minúsculas, números e hífens.',
            'slug.unique' => 'Este link já está sendo utilizado por outro profissional.',
        ];
    }
}
