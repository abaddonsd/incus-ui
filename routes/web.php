<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Make dashboard accessible in development
if (app()->environment('local')) {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
}

Route::middleware(['auth', 'verified'])->group(function () {
    // Incus API routes
    Route::get('/incus', [App\Http\Controllers\IncusController::class, 'index'])->name('incus.info');
    Route::get('/incus/instances', [App\Http\Controllers\IncusController::class, 'instances'])->name('incus.instances');
    Route::get('/incus/instance/{name}', [App\Http\Controllers\IncusController::class, 'instance'])->name('incus.instance');
});

require __DIR__.'/settings.php';
