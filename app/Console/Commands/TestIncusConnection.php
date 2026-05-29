<?php

namespace App\Console\Commands;

use App\Services\IncusApiClient;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:test-incus-connection')]
#[Description('Test connection to Incus API')]
class TestIncusConnection extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(IncusApiClient $incusClient)
    {
        try {
            $this->info('Testing connection to Incus API...');
            
            $serverInfo = $incusClient->getServerInfo();
            
            $this->info('Connected successfully to Incus API!');
            $this->table(['Key', 'Value'], [
                ['API Version', $serverInfo['metadata']['api_status']],
                ['Server Name', $serverInfo['metadata']['environment']['server']],
                ['Server Version', $serverInfo['metadata']['environment']['server_version']],
            ]);
            
        } catch (\Exception $e) {
            $this->error('Failed to connect to Incus API: ' . $e->getMessage());
            Log::error('Incus API connection failed: ' . $e->getMessage());
        }
    }
}
