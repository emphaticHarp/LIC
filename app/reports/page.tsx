"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsAnalyticsComponent } from "@/components/features/reports-analytics";

function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("existing");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Report Generated", message: "Monthly sales report is ready for download", read: false, time: "1 hour ago" },
    { id: 2, title: "Data Updated", message: "Customer data has been successfully updated", read: false, time: "3 hours ago" },
    { id: 3, title: "Report Scheduled", message: "Weekly performance report scheduled for tomorrow", read: true, time: "1 day ago" },
    { id: 4, title: "Export Completed", message: "Policy data export completed successfully", read: true, time: "2 days ago" }
  ]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
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

  const handleDownloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report...`);
  };

  const reportsData = {
    sales: {
      title: "Sales Reports",
      icon: "📊",
      color: "blue",
      reports: [
        { name: "Monthly Sales Summary", date: "Dec 1, 2024", size: "2.4 MB", status: "Ready" },
        { name: "Quarterly Performance", date: "Nov 30, 2024", size: "5.1 MB", status: "Ready" },
        { name: "Year-to-Date Analysis", date: "Nov 29, 2024", size: "8.7 MB", status: "Processing" }
      ]
    },
    policies: {
      title: "Policy Reports",
      icon: "📋",
      color: "green",
      reports: [
        { name: "Active Policies Overview", date: "Dec 1, 2024", size: "1.8 MB", status: "Ready" },
        { name: "Policy Renewal Status", date: "Nov 30, 2024", size: "3.2 MB", status: "Ready" },
        { name: "Lapsed Policies Report", date: "Nov 28, 2024", size: "2.1 MB", status: "Ready" }
      ]
    },
    claims: {
      title: "Claims Reports",
      icon: "🏥",
      color: "purple",
      reports: [
        { name: "Claims Processing Summary", date: "Dec 1, 2024", size: "1.5 MB", status: "Ready" },
        { name: "Claims Approval Rate", date: "Nov 30, 2024", size: "2.8 MB", status: "Ready" },
        { name: "Outstanding Claims", date: "Nov 29, 2024", size: "1.9 MB", status: "Processing" }
      ]
    },
    financial: {
      title: "Financial Reports",
      icon: "💰",
      color: "orange",
      reports: [
        { name: "Revenue Summary", date: "Dec 1, 2024", size: "3.4 MB", status: "Ready" },
        { name: "Commission Payouts", date: "Nov 30, 2024", size: "2.7 MB", status: "Ready" },
        { name: "Expense Analysis", date: "Nov 29, 2024", size: "4.2 MB", status: "Ready" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="reports"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Reports Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Generate and download comprehensive reports for business insights</p>
            </div>

            {/* Report Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {Object.entries(reportsData).map(([key, category]) => (
                <Card key={key} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center text-2xl`}>
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>{category.reports.length} reports available</CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Generate New
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.reports.map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{report.name}</p>
                            <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                              {report.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReport(report.name)}
                              disabled={report.status !== 'Ready'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Reports Generated</p>
                      <p className="text-2xl font-bold">1,245</p>
                      <p className="text-xs text-green-600 mt-1">+12% this month</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Downloads Today</p>
                      <p className="text-2xl font-bold">89</p>
                      <p className="text-xs text-green-600 mt-1">+8% from yesterday</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Reports</p>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-xs text-purple-600 mt-1">23 active</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Storage Used</p>
                      <p className="text-2xl font-bold">2.3GB</p>
                      <p className="text-xs text-orange-600 mt-1">78% of limit</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Shared Profile Sidebar */}
        <ProfileSidebar
          email={email}
          show={showProfileSidebar}
          onClose={() => setShowProfileSidebar(false)}
        />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    }>
      <ReportsPageContent />
    </Suspense>
  );
}
