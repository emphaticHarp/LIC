"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, TrendingUp, Download } from "lucide-react";

export function DataAnalytics() {
  const [timeRange, setTimeRange] = useState("month");
  const [reportType, setReportType] = useState("sales");

  const analyticsData = {
    sales: {
      title: "Sales Analytics",
      metrics: [
        { label: "Total Policies Sold", value: 245, change: "+12%", trend: "up" },
        { label: "Total Premium", value: "₹2.5M", change: "+18%", trend: "up" },
        { label: "Average Premium", value: "₹10,204", change: "+5%", trend: "up" },
        { label: "Conversion Rate", value: "32%", change: "+8%", trend: "up" },
      ],
      topPerformers: [
        { name: "Rajesh Kumar", policies: 45, premium: "₹4.5L" },
        { name: "Priya Sharma", policies: 38, premium: "₹3.8L" },
        { name: "Amit Patel", policies: 32, premium: "₹3.2L" },
      ],
    },
    claims: {
      title: "Claims Analytics",
      metrics: [
        { label: "Total Claims", value: 89, change: "+5%", trend: "up" },
        { label: "Approved Claims", value: 78, change: "+6%", trend: "up" },
        { label: "Claim Settlement Ratio", value: "87.6%", change: "+2%", trend: "up" },
        { label: "Avg Settlement Time", value: "12 days", change: "-2 days", trend: "down" },
      ],
      topPerformers: [
        { name: "Health Claims", count: 45, amount: "₹45L" },
        { name: "Life Claims", count: 32, amount: "₹80L" },
        { name: "Accident Claims", count: 12, amount: "₹15L" },
      ],
    },
    customers: {
      title: "Customer Analytics",
      metrics: [
        { label: "New Customers", value: 156, change: "+22%", trend: "up" },
        { label: "Customer Retention", value: "85%", change: "+3%", trend: "up" },
        { label: "Customer Satisfaction", value: "4.5/5", change: "+0.2", trend: "up" },
        { label: "Churn Rate", value: "3.2%", change: "-0.5%", trend: "down" },
      ],
      topPerformers: [
        { name: "High Value", count: 45, revenue: "₹2.5M" },
        { name: "Medium Value", count: 120, revenue: "₹4.2M" },
        { name: "Low Value", count: 180, revenue: "₹1.8M" },
      ],
    },
  };

  const currentData = analyticsData[reportType as keyof typeof analyticsData];

  const exportReport = () => {
    alert(`Exporting ${reportType} report for ${timeRange}...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Data Analytics & Reporting
          </CardTitle>
          <CardDescription>Comprehensive business analytics and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Analytics</SelectItem>
                  <SelectItem value="claims">Claims Analytics</SelectItem>
                  <SelectItem value="customers">Customer Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={exportReport} className="w-full md:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">{currentData.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {currentData.metrics.map((metric, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp
                      className={`w-4 h-4 ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Top Performers</h3>
            <div className="space-y-2">
              {currentData.topPerformers.map((performer, idx) => (
                <div key={idx} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{performer.name}</p>
                    <p className="text-sm text-gray-600">
                      {reportType === "sales"
                        ? `${(performer as any).policies} policies`
                        : reportType === "claims"
                        ? `${(performer as any).count} claims`
                        : `${(performer as any).count} customers`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {reportType === "sales"
                        ? (performer as any).premium
                        : reportType === "claims"
                        ? (performer as any).amount
                        : (performer as any).revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Key Insights</h3>
            <div className="space-y-2">
              {reportType === "sales" && (
                <>
                  <Alert className="border-blue-200 bg-blue-50">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 ml-2">
                      Sales performance up 12% this month. Focus on converting warm leads to close the gap.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-green-200 bg-green-50">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 ml-2">
                      Top 3 agents account for 35% of total sales. Consider mentoring programs for other agents.
                    </AlertDescription>
                  </Alert>
                </>
              )}
              {reportType === "claims" && (
                <>
                  <Alert className="border-green-200 bg-green-50">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 ml-2">
                      Claim settlement ratio improved to 87.6%. Average settlement time reduced to 12 days.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-blue-200 bg-blue-50">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 ml-2">
                      Health claims represent 50% of total claims. Consider expanding health insurance offerings.
                    </AlertDescription>
                  </Alert>
                </>
              )}
              {reportType === "customers" && (
                <>
                  <Alert className="border-green-200 bg-green-50">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 ml-2">
                      Customer retention at 85%. Focus on converting low-value to medium-value customers.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-blue-200 bg-blue-50">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 ml-2">
                      New customer acquisition up 22%. Maintain momentum with targeted campaigns.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
