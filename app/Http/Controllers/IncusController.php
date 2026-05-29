<?php

namespace App\Http\Controllers;

use App\Services\IncusApiClient;
use Illuminate\Http\Request;

class IncusController extends Controller
{
    protected IncusApiClient $incusClient;

    public function __construct(IncusApiClient $incusClient)
    {
        $this->incusClient = $incusClient;
    }

    /**
     * Display the Incus server information.
     */
    public function index()
    {
        try {
            $serverInfo = $this->incusClient->getServerInfo();
            return response()->json($serverInfo);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch Incus server info: ' . $e->getMessage());
            // Return actual error instead of mock data
            return response()->json([
                'error' => 'Failed to connect to Incus API',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List all instances.
     */
    public function instances()
    {
        try {
            $instances = $this->incusClient->getInstances();
            return response()->json($instances);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch Incus instances: ' . $e->getMessage());
            // Return actual error instead of mock data
            return response()->json([
                'error' => 'Failed to connect to Incus API',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific instance details.
     */
    public function instance(string $name)
    {
        try {
            $instance = $this->incusClient->getInstance($name);
            return response()->json($instance);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch Incus instance details: ' . $e->getMessage());
            // Return actual error instead of mock data
            return response()->json([
                'error' => 'Failed to connect to Incus API',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
