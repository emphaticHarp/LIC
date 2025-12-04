"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  HardDrive as Memory,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Activity,
  Zap,
  Shield
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  details?: any;
}

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    api: ServiceHealth;
    external: ServiceHealth;
    memory: ServiceHealth;
  };
  metrics: {
    responseTime: number;
    errorRate: number;
    throughput: number;
    uptime: number;
  };
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  service: string;
}

export function InfrastructureMonitoring() {
  const [healthData, setHealthData] = useState<HealthCheck | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchHealthData();
    fetchAlerts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHealthData();
      fetchAlerts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/monitoring?type=health');
      const data = await response.json();
      setHealthData(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/monitoring?type=alerts');
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const generatePerformanceData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      data.push({
        time: time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        responseTime: Math.random() * 200 + 50,
        throughput: Math.random() * 100 + 20,
        errorRate: Math.random() * 5
      });
    }
    
    return data;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'down':
      case 'unhealthy':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const performanceData = generatePerformanceData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Infrastructure Monitoring
              </CardTitle>
              <CardDescription>
                Real-time system health and performance metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor(healthData?.status || 'unknown')}>
                {getStatusIcon(healthData?.status || 'unknown')}
                System {healthData?.status || 'Unknown'}
              </Badge>
              <Button variant="outline" size="sm" onClick={fetchHealthData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleString('en-IN')}
          </div>
        </CardContent>
      </Card>

      {/* Service Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="font-medium">Database</span>
              </div>
              <Badge className={getStatusColor(healthData?.services?.database?.status || 'unknown')}>
                {getStatusIcon(healthData?.services?.database?.status || 'unknown')}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <div>Response: {healthData?.services?.database?.responseTime || 0}ms</div>
              <div>Connections: {healthData?.services?.database?.details?.activeConnections || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span className="font-medium">API Server</span>
              </div>
              <Badge className={getStatusColor(healthData?.services?.api?.status || 'unknown')}>
                {getStatusIcon(healthData?.services?.api?.status || 'unknown')}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <div>Response: {healthData?.services?.api?.responseTime || 0}ms</div>
              <div>Endpoints: {healthData?.services?.api?.details?.activeEndpoints || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                <span className="font-medium">External APIs</span>
              </div>
              <Badge className={getStatusColor(healthData?.services?.external?.status || 'unknown')}>
                {getStatusIcon(healthData?.services?.external?.status || 'unknown')}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <div>Response: {healthData?.services?.external?.responseTime || 0}ms</div>
              <div>Services: 3 active</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Memory className="w-4 h-4" />
                <span className="font-medium">Memory</span>
              </div>
              <Badge className={getStatusColor(healthData?.services?.memory?.status || 'unknown')}>
                {getStatusIcon(healthData?.services?.memory?.status || 'unknown')}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              <div>Usage: {healthData?.services?.memory?.details?.usagePercent || '0%'}</div>
              <div>Heap: {healthData?.services?.memory?.details?.heapUsed || '0MB'}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>Last 60 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Throughput Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Throughput</CardTitle>
            <CardDescription>Requests per minute</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="throughput" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Metrics</CardTitle>
          <CardDescription>Current performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-gray-600">{healthData?.metrics?.responseTime || 0}ms</span>
              </div>
              <Progress value={Math.min((healthData?.metrics?.responseTime || 0) / 2, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-gray-600">{(healthData?.metrics?.errorRate || 0).toFixed(2)}%</span>
              </div>
              <Progress value={(healthData?.metrics?.errorRate || 0) * 20} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Throughput</span>
                <span className="text-sm text-gray-600">{healthData?.metrics?.throughput || 0} req/min</span>
              </div>
              <Progress value={Math.min((healthData?.metrics?.throughput || 0) / 2, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-gray-600">{healthData?.metrics?.uptime || 0} hours</span>
              </div>
              <Progress value={Math.min((healthData?.metrics?.uptime || 0) / 24 * 100, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
          <CardDescription>System resource consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span className="font-medium">CPU Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Memory className="w-4 h-4" />
                <span className="font-medium">Memory Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span className="font-medium">Disk Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current</span>
                  <span>23%</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            System Alerts
          </CardTitle>
          <CardDescription>
            Recent system alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.slice(0, 10).map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {getStatusIcon(alert.type)}
                      <div>
                        <div className="font-medium text-sm">{alert.message}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {alert.service} • {new Date(alert.timestamp).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                </Alert>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <div>No active alerts</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
