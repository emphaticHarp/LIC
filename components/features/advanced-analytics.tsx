"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  FileText, 
  Shield,
  Download,
  Filter,
  Calendar
} from "lucide-react";

interface AnalyticsData {
  customers: any;
  policies: any;
  claims: any;
  revenue: any;
}

interface TimeSeriesData {
  date: string;
  value: number;
  label: string;
}

export function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [customers, policies, claims, revenue] = await Promise.all([
        fetch(`/api/ai?type=customer&timeframe=${timeframe}`).then(r => r.json()),
        fetch(`/api/ai?type=policy&timeframe=${timeframe}`).then(r => r.json()),
        fetch(`/api/ai?type=claims&timeframe=${timeframe}`).then(r => r.json()),
        fetch(`/api/ai?type=revenue&timeframe=${timeframe}`).then(r => r.json())
      ]);

      setAnalyticsData({
        customers: customers.success ? customers.data : null,
        policies: policies.success ? policies.data : null,
        claims: claims.success ? claims.data : null,
        revenue: revenue.success ? revenue.data : null
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSeriesData = (): TimeSeriesData[] => {
    const data = [];
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        date: months[date.getMonth()],
        value: Math.floor(Math.random() * 100000) + 50000,
        label: date.toLocaleDateString()
      });
    }
    
    return data;
  };

  const generateCustomerSegmentation = () => [
    { name: 'New Customers', value: 35, color: '#3b82f6' },
    { name: 'Active', value: 45, color: '#10b981' },
    { name: 'At Risk', value: 15, color: '#f59e0b' },
    { name: 'Churned', value: 5, color: '#ef4444' }
  ];

  const generatePolicyDistribution = () => [
    { type: 'Term Life', count: 450, revenue: 11250000 },
    { type: 'Whole Life', count: 380, revenue: 19000000 },
    { type: 'Endowment', count: 220, revenue: 8800000 },
    { type: 'ULIP', count: 150, revenue: 7500000 }
  ];

  const generatePerformanceMetrics = () => [
    { metric: 'Conversion Rate', current: 12.5, previous: 11.2, trend: 'up' },
    { metric: 'Avg Policy Value', current: 45000, previous: 42000, trend: 'up' },
    { metric: 'Claim Processing Time', current: 5.2, previous: 6.8, trend: 'down' },
    { metric: 'Customer Satisfaction', current: 4.3, previous: 4.1, trend: 'up' }
  ];

  const exportData = (format: 'csv' | 'pdf') => {
    // Implementation for data export
    console.log(`Exporting data as ${format}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timeSeriesData = generateTimeSeriesData();
  const customerSegmentation = generateCustomerSegmentation();
  const policyDistribution = generatePolicyDistribution();
  const performanceMetrics = generatePerformanceMetrics();

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Advanced Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Comprehensive business intelligence and performance metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{analyticsData?.revenue?.totalRevenue ? 
                    (analyticsData.revenue.totalRevenue / 10000000).toFixed(1) : '5.25'}Cr
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15% from last period
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData?.customers?.activeCustomers || '2,100'}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% growth
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsData?.policies?.activePolicies || '2,500'}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  84% renewal rate
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Claims Processed</p>
                <p className="text-2xl font-bold text-orange-600">
                  {analyticsData?.claims?.approvedClaims || '85'}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  7 day avg processing
                </p>
              </div>
              <Shield className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue performance over last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
            <CardDescription>Distribution of customers by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegmentation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerSegmentation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Policy Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Distribution by Type</CardTitle>
          <CardDescription>Number of policies and revenue by policy type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={policyDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Policy Count" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Metrics</CardTitle>
          <CardDescription>Business performance indicators and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{metric.metric}</div>
                  <div className="text-sm text-gray-600">
                    Previous: {metric.previous} → Current: {metric.current}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={metric.trend === 'up' ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {metric.trend === 'up' ? '+' : '-'}
                    {Math.abs(((metric.current - metric.previous) / metric.previous * 100)).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Comprehensive data breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Current</th>
                  <th className="text-right p-2">Previous</th>
                  <th className="text-right p-2">Change</th>
                  <th className="text-right p-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">New Customers</td>
                  <td className="p-2 text-right">150</td>
                  <td className="p-2 text-right">125</td>
                  <td className="p-2 text-right text-green-600">+20%</td>
                  <td className="p-2 text-right">📈</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Policy Renewals</td>
                  <td className="p-2 text-right">210</td>
                  <td className="p-2 text-right">195</td>
                  <td className="p-2 text-right text-green-600">+7.7%</td>
                  <td className="p-2 text-right">📈</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Claims Approved</td>
                  <td className="p-2 text-right">85</td>
                  <td className="p-2 text-right">92</td>
                  <td className="p-2 text-right text-red-600">-7.6%</td>
                  <td className="p-2 text-right">📉</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Revenue per Customer</td>
                  <td className="p-2 text-right">₹25,000</td>
                  <td className="p-2 text-right">₹22,500</td>
                  <td className="p-2 text-right text-green-600">+11.1%</td>
                  <td className="p-2 text-right">📈</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
