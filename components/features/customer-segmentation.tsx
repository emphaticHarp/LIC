"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Users, Target } from "lucide-react";

export function CustomerSegmentation() {
  const [segments, setSegments] = useState([
    {
      id: 1,
      name: "High Value",
      color: "bg-green-50",
      textColor: "text-green-700",
      count: 45,
      revenue: "₹2.5M",
      avgPremium: "₹55,555",
      retention: "95%",
      actions: ["Personalized service", "Exclusive offers", "Priority support"],
    },
    {
      id: 2,
      name: "Medium Value",
      color: "bg-blue-50",
      textColor: "text-blue-700",
      count: 120,
      revenue: "₹4.2M",
      avgPremium: "₹35,000",
      retention: "85%",
      actions: ["Regular engagement", "Cross-sell offers", "Renewal reminders"],
    },
    {
      id: 3,
      name: "Low Value",
      color: "bg-yellow-50",
      textColor: "text-yellow-700",
      count: 180,
      revenue: "₹1.8M",
      avgPremium: "₹10,000",
      retention: "70%",
      actions: ["Activation campaigns", "Product education", "Incentive offers"],
    },
    {
      id: 4,
      name: "At Risk",
      color: "bg-red-50",
      textColor: "text-red-700",
      count: 35,
      revenue: "₹0.8M",
      avgPremium: "₹22,857",
      retention: "40%",
      actions: ["Win-back campaigns", "Special discounts", "Direct outreach"],
    },
  ]);

  const [rfmData, setRfmData] = useState({
    recency: "Last 30 days",
    frequency: "5+ purchases",
    monetary: "₹50,000+",
  });

  const [selectedSegment, setSelectedSegment] = useState<any>(null);

  const totalCustomers = segments.reduce((sum, s) => sum + s.count, 0);
  const totalRevenue = segments.reduce((sum, s) => {
    const revenue = parseInt(s.revenue.replace(/[^\d]/g, ""));
    return sum + revenue;
  }, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Customer Segmentation & RFM Analysis
          </CardTitle>
          <CardDescription>Analyze customer behavior and segment for targeted campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Retention</p>
              <p className="text-3xl font-bold text-purple-600">72.5%</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Churn Risk</p>
              <p className="text-3xl font-bold text-orange-600">8.2%</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">RFM Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-600">Recency</p>
                <p className="text-lg font-bold mt-2">{rfmData.recency}</p>
                <p className="text-xs text-gray-500 mt-1">Last purchase within</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-600">Frequency</p>
                <p className="text-lg font-bold mt-2">{rfmData.frequency}</p>
                <p className="text-xs text-gray-500 mt-1">Purchase frequency</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-600">Monetary</p>
                <p className="text-lg font-bold mt-2">{rfmData.monetary}</p>
                <p className="text-xs text-gray-500 mt-1">Annual spending</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Customer Segments</h3>
            <div className="space-y-3">
              {segments.map((segment) => (
                <div key={segment.id} className={`p-4 ${segment.color} rounded-lg border`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`font-semibold ${segment.textColor}`}>{segment.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{segment.count} customers • {segment.revenue} revenue</p>
                    </div>
                    <Badge variant="outline">{segment.retention} retention</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Avg Premium</p>
                      <p className="font-semibold">{segment.avgPremium}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Churn Risk</p>
                      <p className="font-semibold">{100 - parseInt(segment.retention)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">LTV</p>
                      <p className="font-semibold">₹{(parseInt(segment.avgPremium.replace(/[^\d]/g, "")) * 10).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {segment.actions.map((action, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 ml-2">
              High-value customers show 95% retention rate. Focus on converting medium-value to high-value through targeted campaigns.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
