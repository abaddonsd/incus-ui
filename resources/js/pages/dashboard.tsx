import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [containers, setContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch containers data from Laravel API
    useEffect(() => {
        const fetchContainers = async () => {
            try {
                const response = await fetch('/incus/instances');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Extract container information from the API response
                let containersData = [];
                if (data.metadata && Array.isArray(data.metadata)) {
                    containersData = data.metadata;
                } else if (Array.isArray(data)) {
                    containersData = data;
                }
                
                setContainers(containersData);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch containers:', err);
                setError('Failed to load container data. Please check your Incus server connection.');
                setLoading(false);
            }
        };

        fetchContainers();
    }, []);

    if (loading) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <div className="flex h-full items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <div className="flex h-full items-center justify-center">
                            <div className="text-red-500">{error}</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Filter only running containers for display
    const runningContainers = containers.filter(container => {
        // Handle different possible data formats from Incus API
        if (typeof container === 'string') {
            // If it's a string path, we can't determine status, so skip it
            return false;
        }
        if (container.status) {
            return container.status.toLowerCase() === 'running';
        }
        // If no status field, assume it's not running (for now, show all)
        return true;
    });
    
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border md:min-h-min dark:border-sidebar-border">
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Running Containers</h2>
                        <p className="text-gray-500">Dashboard is loading container data. Please check the browser console for details.</p>
                        {runningContainers.length === 0 ? (
                            <p className="text-gray-500 mt-2">No running containers found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {runningContainers.map((container, index) => {
                                    const containerName = container.name || `container-${index}`;
                                    const containerStatus = container.status || 'Unknown';
                                    const containerType = container.type || 'Unknown';
                                    const containerArchitecture = container.architecture || 'Unknown';
                                    const containerCreated = container.created_at ? new Date(container.created_at).toLocaleDateString() : 'Unknown';
                                    
                                    return (
                                        <div key={containerName} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <h3 className="font-semibold text-lg mb-2">{containerName}</h3>
                                            <div className="space-y-1">
                                                <p className="text-sm"><span className="font-medium">Status:</span> {containerStatus}</p>
                                                <p className="text-sm"><span className="font-medium">Type:</span> {containerType}</p>
                                                <p className="text-sm"><span className="font-medium">Architecture:</span> {containerArchitecture}</p>
                                                <p className="text-sm"><span className="font-medium">Created:</span> {containerCreated}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};