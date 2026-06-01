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
    
    // Instance action routes
    Route::post('/incus/instance/{name}/start', [App\Http\Controllers\IncusController::class, 'startInstance'])->name('incus.instance.start');
    Route::post('/incus/instance/{name}/stop', [App\Http\Controllers\IncusController::class, 'stopInstance'])->name('incus.instance.stop');
    Route::post('/incus/instance/{name}/restart', [App\Http\Controllers\IncusController::class, 'restartInstance'])->name('incus.instance.restart');
});

require __DIR__.'/settings.php';
