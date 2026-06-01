<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class IncusApiClient
{
    protected Client $client;
    protected string $baseUrl;
    protected string $certPath;

    public function __construct()
    {
        $this->baseUrl = 'https://localhost:8443';
        $this->certPath = base_path('certs');
        
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'verify' => false, // Disable SSL verification for self-signed certificates
            'timeout' => 30,
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
            'curl' => [
                CURLOPT_SSLCERT => $this->certPath . '/client.crt',
                CURLOPT_SSLKEY => $this->certPath . '/client.key',
                CURLOPT_SSL_VERIFYPEER => false,
            ],
        ]);
    }

    /**
     * Make a GET request to the Incus API
     */
    public function get(string $endpoint, array $options = [])
    {
        try {
            $response = $this->client->get($endpoint, $options);
            return json_decode($response->getBody()->getContents(), true);
        } catch (RequestException $e) {
            Log::error('Incus API GET error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Make a POST request to the Incus API
     */
    public function post(string $endpoint, array $data = [], array $options = [])
    {
        try {
            $response = $this->client->post($endpoint, [
                'json' => $data,
                ...$options
            ]);
            return json_decode($response->getBody()->getContents(), true);
        } catch (RequestException $e) {
            Log::error('Incus API POST error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Make a PUT request to the Incus API
     */
    public function put(string $endpoint, array $data = [], array $options = [])
    {
        try {
            $response = $this->client->put($endpoint, [
                'json' => $data,
                ...$options
            ]);
            return json_decode($response->getBody()->getContents(), true);
        } catch (RequestException $e) {
            Log::error('Incus API PUT error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Make a DELETE request to the Incus API
     */
    public function delete(string $endpoint, array $options = [])
    {
        try {
            $response = $this->client->delete($endpoint, $options);
            return json_decode($response->getBody()->getContents(), true);
        } catch (RequestException $e) {
            Log::error('Incus API DELETE error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get the Incus server information
     */
    public function getServerInfo()
    {
        return $this->get('/1.0');
    }

    /**
     * List all instances
     */
    public function getInstances()
    {
        return $this->get('/1.0/instances?recursion=2');
    }

    /**
     * Get instance details
     */
    public function getInstance(string $name)
    {
        return $this->get("/1.0/instances/{$name}");
    }

    /**
     * Create a new instance
     */
    public function createInstance(array $data)
    {
        return $this->post('/1.0/instances', $data);
    }

    /**
     * Update an instance
     */
    public function updateInstance(string $name, array $data)
    {
        return $this->put("/1.0/instances/{$name}", $data);
    }

    /**
     * Delete an instance
     */
    public function deleteInstance(string $name)
    {
        return $this->delete("/1.0/instances/{$name}");
    }

    /**
     * Start an instance
     */
    public function startInstance(string $name)
    {
        return $this->put("/1.0/instances/{$name}/state", [
            'action' => 'start',
        ]);
    }

    /**
     * Stop an instance
     */
    public function stopInstance(string $name)
    {
        return $this->put("/1.0/instances/{$name}/state", [
            'action' => 'stop',
        ]);
    }

    /**
     * Restart an instance
     */
    public function restartInstance(string $name)
    {
        return $this->put("/1.0/instances/{$name}/state", [
            'action' => 'restart',
        ]);
    }
}