"use client"

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { BreadcrumbNav } from "@/components/features/breadcrumb-nav";
import { PieChart } from "@/components/ui/pie-chart";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { FormSkeleton } from "@/components/ui/skeleton";

function AnalysisPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Analysis Complete", message: "Customer behavior analysis completed", read: false, time: "1 hour ago" },
    { id: 2, title: "New Insights", message: "Policy performance insights available", read: false, time: "3 hours ago" },
    { id: 3, title: "Report Generated", message: "Risk assessment report is ready", read: true, time: "1 day ago" },
    { id: 4, title: "Alert", message: "Unusual activity detected in claims", read: true, time: "2 days ago" }
  ]);

  // Analysis states
  const [selectedAnalysis, setSelectedAnalysis] = useState("customer");
  const [timeRange, setTimeRange] = useState("30");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  // Pagination states
  const [policyPerformancePage, setPolicyPerformancePage] = useState(1);
  const [predictiveInsightsPage, setPredictiveInsightsPage] = useState(1);
  const itemsPerPage = 4;

  // Sample data for analysis
  const [customerSegments] = useState([
    { label: "High Value", value: 15, color: "#10b981", revenue: "₹2.5M" },
    { label: "Medium Value", value: 45, color: "#3b82f6", revenue: "₹4.2M" },
    { label: "Low Value", value: 30, color: "#f59e0b", revenue: "₹1.8M" },
    { label: "At Risk", value: 10, color: "#ef4444", revenue: "₹0.8M" }
  ]);

  const [policyPerformance] = useState([
    { type: "Life Insurance", policies: 450, avgPremium: 25000, growth: 12.5, claims: 45 },
    { type: "Health Insurance", policies: 320, avgPremium: 18000, growth: 18.3, claims: 89 },
    { type: "Vehicle Insurance", policies: 280, avgPremium: 12000, growth: 8.7, claims: 156 },
    { type: "Home Insurance", policies: 195, avgPremium: 15000, growth: 15.2, claims: 23 }
  ]);

  const [riskMetrics] = useState([
    { title: "Overall Risk Score", value: 72, status: "Moderate", change: "+5%" },
    { title: "High Risk Policies", value: 124, status: "Alert", change: "+12" },
    { title: "Fraud Detection", value: 3, status: "Low", change: "-2" },
    { title: "Compliance Score", value: 94, status: "Good", change: "+2%" }
  ]);

  const [predictiveInsights] = useState([
    { title: "Churn Prediction", accuracy: 87, atRisk: 45, timeframe: "Next 30 days", predicted: 45 },
    { title: "Cross-sell Opportunities", accuracy: 82, opportunities: 128, timeframe: "Next quarter", predicted: 128 },
    { title: "Claims Prediction", accuracy: 79, predicted: 23, timeframe: "Next month", atRisk: 23 },
    { title: "Revenue Forecast", accuracy: 91, forecast: "₹12.5M", timeframe: "Q1 2025", predicted: "₹12.5M" }
  ]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Clear user from localStorage
      localStorage.removeItem('user');
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleClearAll = async () => {
    setIsClearingNotifications(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setNotifications([]);
    setIsClearingNotifications(false);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock results
      setAnalysisResults({
        timestamp: new Date().toISOString(),
        summary: {
          totalRecords: 1245,
          anomalies: 23,
          insights: 45,
          recommendations: 12
        },
        keyFindings: [
          "Customer retention rate improved by 5.2% compared to last quarter",
          "Health insurance claims increased by 12% in the last 30 days",
          "High-value customers show 23% higher renewal rates",
          "Fraud detection system identified 3 suspicious claims"
        ],
        recommendations: [
          "Focus on retention strategies for medium-value segment",
          "Review health insurance underwriting guidelines",
          "Implement targeted cross-sell campaigns",
          "Enhance fraud detection algorithms"
        ]
      });
      
      alert("Analysis completed successfully!");
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportAnalysis = () => {
    if (!analysisResults) {
      alert("Please run analysis first before exporting.");
      return;
    }

    // Export as CSV
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analysis_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("Analysis report exported as CSV successfully!");
  };

  const generateCSVReport = () => {
    let csv = "LIC Analysis Report\n";
    csv += `Generated: ${new Date().toLocaleString()}\n`;
    csv += `Analysis Type: ${selectedAnalysis}\n`;
    csv += `Time Range: ${timeRange} days\n\n`;

    // Summary
    csv += "SUMMARY\n";
    csv += `Total Records,${analysisResults.summary.totalRecords}\n`;
    csv += `Anomalies,${analysisResults.summary.anomalies}\n`;
    csv += `Insights,${analysisResults.summary.insights}\n`;
    csv += `Recommendations,${analysisResults.summary.recommendations}\n\n`;

    // Policy Performance
    csv += "POLICY PERFORMANCE\n";
    csv += "Policy Type,Active Policies,Avg Premium,Growth Rate,Claims Count,Claims Ratio\n";
    policyPerformance.forEach(policy => {
      csv += `${policy.type},${policy.policies},${policy.avgPremium},${policy.growth}%,${policy.claims},${((policy.claims / policy.policies) * 100).toFixed(1)}%\n`;
    });
    csv += "\n";

    // Key Findings
    csv += "KEY FINDINGS\n";
    analysisResults.keyFindings.forEach((finding: string) => {
      csv += `"${finding}"\n`;
    });
    csv += "\n";

    // Recommendations
    csv += "RECOMMENDATIONS\n";
    analysisResults.recommendations.forEach((rec: string) => {
      csv += `"${rec}"\n`;
    });

    return csv;
  };

  // Pagination calculations for Policy Performance
  const policyTotalPages = Math.ceil(policyPerformance.length / itemsPerPage);
  const policyStartIndex = (policyPerformancePage - 1) * itemsPerPage;
  const policyEndIndex = policyStartIndex + itemsPerPage;
  const paginatedPolicies = policyPerformance.slice(policyStartIndex, policyEndIndex);

  // Pagination calculations for Predictive Insights
  const insightsTotalPages = Math.ceil(predictiveInsights.length / itemsPerPage);
  const insightsStartIndex = (predictiveInsightsPage - 1) * itemsPerPage;
  const insightsEndIndex = insightsStartIndex + itemsPerPage;
  const paginatedInsights = predictiveInsights.slice(insightsStartIndex, insightsEndIndex);

  const getRiskColor = (status: string) => {
    switch (status) {
      case "Low": return "text-green-600 bg-green-100";
      case "Moderate": return "text-yellow-600 bg-yellow-100";
      case "High": return "text-red-600 bg-red-100";
      case "Alert": return "text-red-600 bg-red-100";
      case "Good": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const analysisTypes = [
    { id: "customer", name: "Customer Analysis", description: "Analyze customer behavior and segments" },
    { id: "policy", name: "Policy Performance", description: "Evaluate policy performance metrics" },
    { id: "risk", name: "Risk Assessment", description: "Assess risks and compliance" },
    { id: "predictive", name: "Predictive Analytics", description: "Forecast trends and outcomes" },
    { id: "fraud", name: "Fraud Detection", description: "Identify suspicious activities" },
    { id: "market", name: "Market Analysis", description: "Analyze market trends" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="analysis"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Analysis Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {isLoading ? (
              <FormSkeleton />
            ) : (
              <>
                {/* Breadcrumbs */}
                <BreadcrumbNav />
                
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analysis</h1>
                  <p className="text-gray-600">Deep insights and predictive analytics for LIC operations</p>
                </div>

                {/* Analysis Controls */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Analysis Configuration</CardTitle>
                    <CardDescription>Configure and run advanced analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="analysisType">Analysis Type</Label>
                        <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select analysis type" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeRange">Time Range</Label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="365">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataScope">Data Scope</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select data scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="policies">Policies Only</SelectItem>
                        <SelectItem value="claims">Claims Only</SelectItem>
                        <SelectItem value="customers">Customers Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleRunAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Run Analysis
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleExportAnalysis}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Results
                  </Button>
                </div>

                {analysisResults && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Latest Analysis Results</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Records:</span>
                        <span className="ml-2 font-medium">{analysisResults.summary.totalRecords.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Anomalies:</span>
                        <span className="ml-2 font-medium">{analysisResults.summary.anomalies}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Insights:</span>
                        <span className="ml-2 font-medium">{analysisResults.summary.insights}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Recommendations:</span>
                        <span className="ml-2 font-medium">{analysisResults.summary.recommendations}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Customer Segments */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>Distribution of customers by value</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart data={customerSegments} title="Customer Segments" />
                  <div className="mt-4 space-y-2">
                    {customerSegments.map((segment, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: segment.color }}></div>
                          <span>{segment.label}</span>
                        </div>
                        <span className="font-medium">{segment.revenue}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Current risk metrics and indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{metric.title}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getRiskColor(metric.status)}>
                            {metric.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Policy Performance */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Policy Performance Analysis</CardTitle>
                <CardDescription>Performance metrics by policy type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Policy Type</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Active Policies</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Avg Premium</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Growth Rate</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Claims Count</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Claims Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPolicies.map((policy, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{policy.type}</td>
                          <td className="p-2">{policy.policies}</td>
                          <td className="p-2">₹{policy.avgPremium.toLocaleString()}</td>
                          <td className="p-2">
                            <span className={policy.growth > 10 ? "text-green-600" : "text-gray-600"}>
                              {policy.growth > 0 ? "+" : ""}{policy.growth}%
                            </span>
                          </td>
                          <td className="p-2">{policy.claims}</td>
                          <td className="p-2">
                            {((policy.claims / policy.policies) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Policy Performance Pagination */}
                {policyTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {policyStartIndex + 1} to {Math.min(policyEndIndex, policyPerformance.length)} of {policyPerformance.length} policies
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPolicyPerformancePage(Math.max(1, policyPerformancePage - 1))}
                        disabled={policyPerformancePage === 1}
                      >
                        ← Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: policyTotalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={policyPerformancePage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPolicyPerformancePage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPolicyPerformancePage(Math.min(policyTotalPages, policyPerformancePage + 1))}
                        disabled={policyPerformancePage === policyTotalPages}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>AI-powered predictions and forecasts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paginatedInsights.map((insight, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          <Badge variant="outline">{insight.accuracy}% accuracy</Badge>
                        </div>
                        <p className="text-2xl font-bold mb-1">
                          {typeof insight.predicted === 'string' ? insight.predicted : insight.predicted}
                        </p>
                        <p className="text-xs text-gray-500">{insight.timeframe}</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${insight.accuracy}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Predictive Insights Pagination */}
                {insightsTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {insightsStartIndex + 1} to {Math.min(insightsEndIndex, predictiveInsights.length)} of {predictiveInsights.length} insights
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPredictiveInsightsPage(Math.max(1, predictiveInsightsPage - 1))}
                        disabled={predictiveInsightsPage === 1}
                      >
                        ← Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: insightsTotalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={predictiveInsightsPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPredictiveInsightsPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPredictiveInsightsPage(Math.min(insightsTotalPages, predictiveInsightsPage + 1))}
                        disabled={predictiveInsightsPage === insightsTotalPages}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Findings & Recommendations */}
            {analysisResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>Key findings and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Key Findings</h4>
                      <ul className="space-y-2">
                        {analysisResults.keyFindings.map((finding: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="text-sm">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {analysisResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
              </>
            )}
          </div>
        </div>

        {/* Profile Sidebar */}
        {showProfileSidebar && (
          <div className="w-80 bg-white shadow-lg h-full">
            <ProfileSidebar
              email={email}
              show={showProfileSidebar}
              onClose={() => setShowProfileSidebar(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    }>
      <AnalysisPageContent />
    </Suspense>
  );
}
