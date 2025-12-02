"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw } from "lucide-react";

export function ReportsAnalyticsComponent() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: reportType,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/reports?${params}`);
      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportType}-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <p className="text-gray-500">Generate comprehensive business reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="claims">Claims Report</SelectItem>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="agent_performance">Agent Performance</SelectItem>
                  <SelectItem value="customer_analytics">Customer Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={isLoading} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={downloadReport}
              disabled={!reportData}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>{reportData.type} Report</CardTitle>
            <CardDescription>Generated on {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.summary && (
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(reportData.summary).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">{key}</p>
                        <p className="text-lg font-semibold">
                          {typeof value === "number" ? value.toLocaleString() : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportData.details && (
                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96 text-xs">
                    {JSON.stringify(reportData.details, null, 2)}
                  </pre>
                </div>
              )}

              {reportData.byStatus && (
                <div>
                  <h3 className="font-semibold mb-2">By Status</h3>
                  <div className="space-y-2">
                    {reportData.byStatus.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{item._id || "Unknown"}</span>
                        <span className="font-semibold">{item.count || item.totalAmount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reportData.topAgents && (
                <div>
                  <h3 className="font-semibold mb-2">Top Agents</h3>
                  <div className="space-y-2">
                    {reportData.topAgents.map((agent: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">Agent {idx + 1}</span>
                          <Badge>₹{agent.totalPremium?.toLocaleString()}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Policies: {agent.policiesSold} | Avg: ₹{agent.avgPremium?.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
