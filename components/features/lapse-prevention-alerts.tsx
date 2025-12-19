"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Bell, Send, CheckCircle2 } from "lucide-react";

interface LapseAlert {
  id: string;
  policyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  premiumDueDate: string;
  daysUntilLapse: number;
  premiumAmount: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  lastPaymentDate: string;
  communicationSent: boolean;
  communicationMethod: string[];
}

export function LapsePreventionAlerts() {
  const [alerts, setAlerts] = useState<LapseAlert[]>([
    {
      id: "1",
      policyId: "LIC-123456789",
      customerName: "Rajesh Kumar",
      customerEmail: "rajesh@example.com",
      customerPhone: "+91-9876543210",
      premiumDueDate: "2024-12-10",
      daysUntilLapse: 4,
      premiumAmount: "₹25,000",
      riskLevel: "critical",
      lastPaymentDate: "2024-11-10",
      communicationSent: false,
      communicationMethod: [],
    },
    {
      id: "2",
      policyId: "LIC-234567890",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      customerPhone: "+91-9876543211",
      premiumDueDate: "2024-12-15",
      daysUntilLapse: 9,
      premiumAmount: "₹18,000",
      riskLevel: "high",
      lastPaymentDate: "2024-11-15",
      communicationSent: true,
      communicationMethod: ["email", "sms"],
    },
    {
      id: "3",
      policyId: "LIC-345678901",
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      customerPhone: "+91-9876543212",
      premiumDueDate: "2024-12-20",
      daysUntilLapse: 14,
      premiumAmount: "₹12,000",
      riskLevel: "medium",
      lastPaymentDate: "2024-11-20",
      communicationSent: true,
      communicationMethod: ["email"],
    },
    {
      id: "4",
      policyId: "LIC-456789012",
      customerName: "Sunita Reddy",
      customerEmail: "sunita@example.com",
      customerPhone: "+91-9876543213",
      premiumDueDate: "2024-12-25",
      daysUntilLapse: 19,
      premiumAmount: "₹30,000",
      riskLevel: "low",
      lastPaymentDate: "2024-11-25",
      communicationSent: false,
      communicationMethod: [],
    },
  ]);

  const sendReminder = (id: string, method: "email" | "sms" | "whatsapp") => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        const methods = alert.communicationMethod.includes(method)
          ? alert.communicationMethod
          : [...alert.communicationMethod, method];
        return {
          ...alert,
          communicationSent: true,
          communicationMethod: methods,
        };
      }
      return alert;
    }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const criticalCount = alerts.filter(a => a.riskLevel === "critical").length;
  const highCount = alerts.filter(a => a.riskLevel === "high").length;
  const totalAtRisk = alerts.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" /> Policy Lapse Prevention Alerts
        </CardTitle>
        <CardDescription>Monitor and prevent policy lapses with automated alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {criticalCount > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 ml-2">
              <strong>{criticalCount} critical lapse alert(s)</strong> - Immediate action required to prevent policy lapse
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Critical</p>
            <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-gray-500 mt-1">0-7 days</p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">High Risk</p>
            <p className="text-3xl font-bold text-orange-600">{highCount}</p>
            <p className="text-xs text-gray-500 mt-1">8-15 days</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Medium Risk</p>
            <p className="text-3xl font-bold text-yellow-600">{alerts.filter(a => a.riskLevel === "medium").length}</p>
            <p className="text-xs text-gray-500 mt-1">16-30 days</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Policies</p>
            <p className="text-3xl font-bold text-green-600">{totalAtRisk}</p>
            <p className="text-xs text-gray-500 mt-1">at risk</p>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getRiskColor(alert.riskLevel)}>
                      {alert.riskLevel.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {alert.daysUntilLapse} days
                    </Badge>
                    {alert.communicationSent && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Contacted
                      </Badge>
                    )}
                  </div>
                  <p className="font-semibold text-gray-800">{alert.customerName}</p>
                  <p className="text-sm text-gray-600">Policy: {alert.policyId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{alert.premiumAmount}</p>
                  <p className="text-xs text-gray-500">Due: {new Date(alert.premiumDueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-gray-600">Email: <span className="font-medium">{alert.customerEmail}</span></p>
                  <p className="text-gray-600">Phone: <span className="font-medium">{alert.customerPhone}</span></p>
                </div>
                <div>
                  <p className="text-gray-600">Last Payment: <span className="font-medium">{new Date(alert.lastPaymentDate).toLocaleDateString()}</span></p>
                  <p className="text-gray-600">Days Overdue: <span className="font-medium">{Math.max(0, Math.floor((new Date().getTime() - new Date(alert.premiumDueDate).getTime()) / (1000 * 60 * 60 * 24)))}</span></p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendReminder(alert.id, "email")}
                  className={alert.communicationMethod.includes("email") ? "bg-blue-50" : ""}
                >
                  📧 Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendReminder(alert.id, "sms")}
                  className={alert.communicationMethod.includes("sms") ? "bg-green-50" : ""}
                >
                  📱 SMS
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => sendReminder(alert.id, "whatsapp")}
                  className={alert.communicationMethod.includes("whatsapp") ? "bg-green-50" : ""}
                >
                  💬 WhatsApp
                </Button>
                <Button size="sm" variant="outline" className="ml-auto">
                  <Send className="w-4 h-4 mr-1" />
                  Call Customer
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-1">Lapse Prevention Tips</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Send reminders 15 days before premium due date</li>
            <li>Use multiple communication channels (Email, SMS, WhatsApp)</li>
            <li>Offer flexible payment options and installment plans</li>
            <li>Provide grace period information to customers</li>
            <li>Track communication history for compliance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
