<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id'   => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'slug' => $user->slug,
                    'avatar_path' => $user->avatar_path
                        ? \Illuminate\Support\Facades\Storage::url($user->avatar_path)
                        : null,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'translations' => function () {
                $locale = app()->getLocale();
                $path = base_path("lang/$locale.json");
                return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
            },
        ];
    }
}
