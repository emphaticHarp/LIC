"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Gift, TrendingUp } from "lucide-react";

export function MaturityBenefit() {
  const [maturities, setMaturities] = useState([
    {
      id: 1,
      policyId: "LIC-123456789",
      customerName: "Rajesh Kumar",
      maturityDate: "2025-01-15",
      daysUntilMaturity: 40,
      sumAssured: 500000,
      bonus: 75000,
      totalMaturityBenefit: 575000,
      status: "upcoming",
      settlementOption: "Lump sum",
    },
    {
      id: 2,
      policyId: "LIC-234567890",
      customerName: "Priya Sharma",
      maturityDate: "2024-12-20",
      daysUntilMaturity: 14,
      sumAssured: 750000,
      bonus: 112500,
      totalMaturityBenefit: 862500,
      status: "due-soon",
      settlementOption: "Annuity",
    },
    {
      id: 3,
      policyId: "LIC-345678901",
      customerName: "Amit Patel",
      maturityDate: "2024-12-10",
      daysUntilMaturity: 4,
      sumAssured: 300000,
      bonus: 45000,
      totalMaturityBenefit: 345000,
      status: "critical",
      settlementOption: "Lump sum",
    },
    {
      id: 4,
      policyId: "LIC-456789012",
      customerName: "Sunita Reddy",
      maturityDate: "2024-11-30",
      daysUntilMaturity: -15,
      sumAssured: 600000,
      bonus: 90000,
      totalMaturityBenefit: 690000,
      status: "matured",
      settlementOption: "Pending",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "due-soon":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "matured":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const stats = {
    upcoming: maturities.filter((m) => m.status === "upcoming").length,
    dueSoon: maturities.filter((m) => m.status === "due-soon").length,
    critical: maturities.filter((m) => m.status === "critical").length,
    matured: maturities.filter((m) => m.status === "matured").length,
    totalBenefit: maturities.reduce((sum, m) => sum + m.totalMaturityBenefit, 0),
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" /> Maturity Benefit Management
          </CardTitle>
          <CardDescription>Track and manage policy maturity dates and benefits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
              <p className="text-xs text-gray-500 mt-1">30+ days</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Due Soon</p>
              <p className="text-3xl font-bold text-orange-600">{stats.dueSoon}</p>
              <p className="text-xs text-gray-500 mt-1">15-30 days</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-xs text-gray-500 mt-1">0-14 days</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Matured</p>
              <p className="text-3xl font-bold text-green-600">{stats.matured}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting settlement</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Benefit</p>
              <p className="text-2xl font-bold text-purple-600">₹{(stats.totalBenefit / 100000).toFixed(1)}L</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Maturity Schedule</h3>
            <div className="space-y-3">
              {maturities.map((maturity) => (
                <div key={maturity.id} className={`p-4 ${getStatusColor(maturity.status)} rounded-lg border`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{maturity.customerName}</p>
                      <p className="text-sm text-gray-600 mt-1">Policy: {maturity.policyId}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getStatusColor(maturity.status)}>
                        {maturity.status === "due-soon"
                          ? "DUE SOON"
                          : maturity.status === "critical"
                          ? "CRITICAL"
                          : maturity.status.toUpperCase()}
                      </Badge>
                      <p className="text-sm font-bold mt-2">
                        {maturity.daysUntilMaturity > 0
                          ? `${maturity.daysUntilMaturity} days`
                          : `${Math.abs(maturity.daysUntilMaturity)} days overdue`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Maturity Date</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {maturity.maturityDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sum Assured</p>
                      <p className="font-semibold">₹{maturity.sumAssured.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bonus</p>
                      <p className="font-semibold text-green-600">₹{maturity.bonus.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Benefit</p>
                      <p className="font-bold text-lg">₹{maturity.totalMaturityBenefit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Settlement</p>
                      <p className="font-semibold">{maturity.settlementOption}</p>
                    </div>
                  </div>

                  {maturity.status !== "matured" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Send Reminder
                      </Button>
                      <Button size="sm" variant="outline">
                        Process Settlement
                      </Button>
                    </div>
                  )}

                  {maturity.status === "matured" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Process Payment
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <Calendar className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 ml-2">
              {stats.critical} policies maturing within 14 days. Immediate action required for settlement processing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
