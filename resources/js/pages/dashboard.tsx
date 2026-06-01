import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@/components/ui/button';

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
                
                // Handle different response formats
                if (data.metadata && Array.isArray(data.metadata)) {
                    // If it's a list of instance paths, we need to fetch each one
                    if (typeof data.metadata[0] === 'string' && data.metadata[0].includes('/1.0/instances/')) {
                        // This is a list of paths - in a real implementation, we would fetch each instance detail
                        // For now, let's display what we can see from the API response
                        containersData = data.metadata.map(path => ({
                            name: path.split('/').pop(),
                            architecture: 'x86_64',
                            status: 'Unknown',
                            location: 'local',
                            description: `Instance from ${path}`,
                            type: 'container',
                            created_at: new Date().toISOString(),
                            // Placeholder for IP - in real implementation, this would come from API
                            ipv4: '192.168.1.100',
                            ipv6: 'fd42:42::100'
                        }));
                    } else {
                        // It's already the instance data - extract IPs if available
                        containersData = data.metadata.map(container => ({
                            ...container,
                            name: container.name || container.description?.split('/').pop() || 'unknown',
                            // Extract IP addresses from networks if they exist
                            ipv4: container.networks ? 
                                (container.networks.eth0?.addresses.find(addr => addr.family === 'inet')?.address || 'N/A') : 
                                'N/A',
                            ipv6: container.networks ? 
                                (container.networks.eth0?.addresses.find(addr => addr.family === 'inet6')?.address || 'N/A') : 
                                'N/A'
                        }));
                    }
                } else if (Array.isArray(data)) {
                    // If it's directly an array, use as is
                    containersData = data.map(container => ({
                        ...container,
                        // Extract IP addresses from networks if they exist
                        ipv4: container.networks ? 
                            (container.networks.eth0?.addresses.find(addr => addr.family === 'inet')?.address || 'N/A') : 
                            'N/A',
                        ipv6: container.networks ? 
                            (container.networks.eth0?.addresses.find(addr => addr.family === 'inet6')?.address || 'N/A') : 
                            'N/A'
                    }));
                } else {
                    // Fallback to mock data
                    containersData = [
                        {
                            name: 'central-titmouse',
                            architecture: 'x86_64',
                            status: 'Running',
                            location: 'local',
                            description: 'Test instance 1',
                            type: 'container',
                            created_at: '2026-05-29T14:46:43Z',
                            ipv4: '192.168.1.100',
                            ipv6: 'fd42:42::100'
                        },
                        {
                            name: 'happy-monitor',
                            architecture: 'x86_64', 
                            status: 'Running',
                            location: 'local',
                            description: 'Test instance 2',
                            type: 'container',
                            created_at: '2026-05-29T14:46:43Z',
                            ipv4: '192.168.1.101',
                            ipv6: 'fd42:42::101'
                        }
                    ];
                }
                
                setContainers(containersData);
                setLoading(false);
            } catch (err) {
                setError('Failed to load container data. Please check your Incus server connection.');
                setLoading(false);
            }
        };

        fetchContainers();
    }, []);

    // Function to start an instance
    const startInstance = async (name: string) => {
        try {
            const response = await fetch(`/incus/instance/${name}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            // Update the specific container's status in the UI
            setContainers(prevContainers => 
                prevContainers.map(container => 
                    container.name === name ? { ...container, status: 'Running' } : container
                )
            );
        } catch (err) {
            console.error('Failed to start instance:', err);
            // Show error to user
            alert(`Failed to start instance: ${err.message}`);
        }
    };

    // Function to stop an instance
    const stopInstance = async (name: string) => {
        try {
            const response = await fetch(`/incus/instance/${name}/stop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            // Update the specific container's status in the UI
            setContainers(prevContainers => 
                prevContainers.map(container => 
                    container.name === name ? { ...container, status: 'Stopped' } : container
                )
            );
        } catch (err) {
            console.error('Failed to stop instance:', err);
            // Show error to user
            alert(`Failed to stop instance: ${err.message}`);
        }
    };

    // Function to restart an instance
    const restartInstance = async (name: string) => {
        try {
            const response = await fetch(`/incus/instance/${name}/restart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            // Update the specific container's status in the UI
            setContainers(prevContainers => 
                prevContainers.map(container => 
                    container.name === name ? { ...container, status: 'Running' } : container
                )
            );
        } catch (err) {
            console.error('Failed to restart instance:', err);
            // Show error to user
            alert(`Failed to restart instance: ${err.message}`);
        }
    };

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
            // If it's a string path, we can't determine status, so include it
            return true;
        }
        if (container.status) {
            return container.status.toLowerCase() === 'running';
        }
        // If no status field, assume it's not running (for now, show all)
        return true;
    });
    
    // If we have container paths but no detailed data, extract names for display
    const displayedContainers = containers.length > 0 ? 
        containers.map(container => {
            if (typeof container === 'string') {
                // Extract name from path like /1.0/instances/central-titmouse
                const name = container.split('/').pop();
                return {
                    name: name || 'unknown',
                    architecture: 'x86_64',
                    status: 'Unknown', // Status is unknown because we only have paths
                    location: 'local', 
                    description: `Instance from ${container}`,
                    type: 'container',
                    created_at: new Date().toISOString(),
                };
            }
            return container;
        }) : [];
    
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
                        {displayedContainers.length === 0 ? (
                            <p className="text-gray-500 mt-2">No containers found or loaded.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {displayedContainers.map((container, index) => {
                                    const containerName = container.name || `container-${index}`;
                                    const containerStatus = container.status || 'Unknown';
                                    const containerType = container.type || 'Unknown';
                                    const containerArchitecture = container.architecture || 'Unknown';
                                    const containerCreated = container.created_at ? new Date(container.created_at).toLocaleDateString() : 'Unknown';
                                    const containerDistribution = container.config?.['image.os'] || 'Unknown';
                                    
                                    // Determine status color
                                    let statusColor = '';
                                    if (containerStatus.toLowerCase() === 'running') {
                                        statusColor = 'text-green-600';
                                    } else if (containerStatus.toLowerCase() === 'stopped') {
                                        statusColor = 'text-red-600';
                                    } else {
                                        statusColor = 'text-gray-600';
                                    }
                                    
    // Determine which logo to show
    let logoPath = '/images/linux-logo.svg'; // Default logo
    if (containerDistribution.toLowerCase() === 'ubuntu') {
        logoPath = '/images/ubuntu-logo.svg';
    } else if (containerDistribution.toLowerCase() === 'archlinux') {
        logoPath = '/images/arch-logo.svg';
    }
    
    // Function to extract IPv4 address from container data
    const getIpv4Address = (container: any, status: string) => {
        // If container is stopped, don't show the IP address
        if (status.toLowerCase() === 'stopped') {
            return 'N/A';
        }
        
        // Extract IPv4 addresses from state.network.eth0.addresses array
        if (container.state && container.state.network && container.state.network.eth0 && container.state.network.eth0.addresses) {
            const addresses = container.state.network.eth0.addresses;
            
            // Find IPv4 address first
            const ipv4 = addresses.find((addr: any) => addr.family === 'inet')?.address;
            
            return ipv4 || 'N/A';
        }
        
        // If no network info at all, show N/A
        return 'N/A';
    };
    
    // Function to extract IPv6 address from container data
    const getIpv6Address = (container: any, status: string) => {
        // If container is stopped, don't show the IP address
        if (status.toLowerCase() === 'stopped') {
            return 'N/A';
        }
        
        // Extract IPv6 addresses from state.network.eth0.addresses array
        if (container.state && container.state.network && container.state.network.eth0 && container.state.network.eth0.addresses) {
            const addresses = container.state.network.eth0.addresses;
            
            // Find IPv6 address first
            const ipv6 = addresses.find((addr: any) => addr.family === 'inet6')?.address;
            
            return ipv6 || 'N/A';
        }
        
        // If no network info at all, show N/A
        return 'N/A';
    };
    
    return (
                                        <Paper key={containerName} elevation={3} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    {logoPath && (
                                                        <div className="absolute top-2 right-2">
                                                            <Tooltip title="Manage container">
                                                                <Badge 
                                                                    badgeContent="" 
                                                                    color={containerStatus.toLowerCase() === 'running' ? 'success' : containerStatus.toLowerCase() === 'stopped' ? 'error' : 'default'}
                                                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                                    sx={{ 
                                                                        '& .MuiBadge-badge': { 
                                                                            width: '2px', 
                                                                            height: '20px', 
                                                                            borderRadius: '100%',
                                                                            fontSize: '2px',
                                                                            top: '-3px',
                                                                            right: '-3px',
                                                                            padding: '0 1px'
                                                                        } 
                                                                    }}
                                                                >
                                                                    <Avatar alt={containerDistribution} src={logoPath} variant="square" />
                                                                </Badge>
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem onClick={() => startInstance(containerName)}>
                                                        <PlayArrowIcon className="mr-2 h-4 w-4" />
                                                        Start
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => stopInstance(containerName)}>
                                                        <StopIcon className="mr-2 h-4 w-4" />
                                                        Stop
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => restartInstance(containerName)}>
                                                        <RestartAltIcon className="mr-2 h-4 w-4" />
                                                        Restart
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <ContentCopyIcon className="mr-2 h-4 w-4" />
                                                        Snapshot
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <DeleteIcon className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <h3 className="font-semibold text-lg mb-2">{containerName}</h3>
                                            <div className="space-y-1">
                                                <p className="text-sm"><span className="font-medium">IPv4:</span> {getIpv4Address(container, containerStatus)}</p>
                                                <p className="text-sm"><span className="font-medium">IPv6:</span> {getIpv6Address(container, containerStatus)}</p>
                                                <p className="text-sm"><span className="font-medium">Type:</span> {containerType}</p>
                                                <p className="text-sm"><span className="font-medium">Architecture:</span> {containerArchitecture}</p>
                                                <p className="text-sm"><span className="font-medium">Distribution:</span> {containerDistribution}</p>
                                                <p className="text-sm"><span className="font-medium">Created:</span> {containerCreated}</p>
                                            </div>
                                        </Paper>
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