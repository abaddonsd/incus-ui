<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Make dashboard accessible in development but protected with auth
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    // Incus API routes - protected in all environments
    Route::get('/incus', [App\Http\Controllers\IncusController::class, 'index'])->name('incus.info');
    Route::get('/incus/instances', [App\Http\Controllers\IncusController::class, 'instances'])->name('incus.instances');
    Route::get('/incus/instance/{name}', [App\Http\Controllers\IncusController::class, 'instance'])->name('incus.instance');
});

require __DIR__.'/settings.php';
