"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";

function CommissionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [activeTab, setActiveTab] = useState("overview");

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Commission Credited", message: "₹25,000 commission credited for November 2024", read: false, time: "2 hours ago" },
    { id: 2, title: "Target Achieved", message: "You've achieved 120% of your monthly target!", read: false, time: "1 day ago" },
    { id: 3, title: "Bonus Eligible", message: "You're eligible for performance bonus this quarter", read: true, time: "3 days ago" }
  ]);

  // Commission Data
  const [commissionData, setCommissionData] = useState({
    monthlyCommission: 45000,
    quarterlyCommission: 135000,
    yearlyCommission: 540000,
    targetAchievement: 120,
    rank: "Gold Agent",
    policiesSold: 15,
    totalPremium: 2250000
  });

  const [monthlyBreakdown, setMonthlyBreakdown] = useState([
    { month: "January", commission: 42000, policies: 12, premium: 2100000, target: 35000 },
    { month: "February", commission: 48000, policies: 14, premium: 2450000, target: 35000 },
    { month: "March", commission: 51000, policies: 16, premium: 2800000, target: 35000 },
    { month: "April", commission: 38000, policies: 11, premium: 1925000, target: 35000 },
    { month: "May", commission: 45000, policies: 13, premium: 2275000, target: 35000 },
    { month: "June", commission: 52000, policies: 17, premium: 2975000, target: 35000 },
    { month: "July", commission: 41000, policies: 12, premium: 2100000, target: 35000 },
    { month: "August", commission: 46000, policies: 14, premium: 2450000, target: 35000 },
    { month: "September", commission: 49000, policies: 15, premium: 2625000, target: 35000 },
    { month: "October", commission: 43000, policies: 13, premium: 2275000, target: 35000 },
    { month: "November", commission: 45000, policies: 15, premium: 2250000, target: 35000 },
    { month: "December", commission: 0, policies: 0, premium: 0, target: 35000 }
  ]);

  const [policyCommissions, setPolicyCommissions] = useState([
    { id: "LIC-123456789", customerName: "Rajesh Kumar", policyType: "Term Life", premium: 25000, commission: 2500, date: "15 Nov 2024", status: "Paid" },
    { id: "LIC-234567890", customerName: "Priya Sharma", policyType: "Endowment", premium: 45000, commission: 4500, date: "18 Nov 2024", status: "Paid" },
    { id: "LIC-345678901", customerName: "Amit Patel", policyType: "Health Insurance", premium: 18000, commission: 1800, date: "20 Nov 2024", status: "Paid" },
    { id: "LIC-456789012", customerName: "Sunita Reddy", policyType: "Whole Life", premium: 35000, commission: 3500, date: "22 Nov 2024", status: "Paid" },
    { id: "LIC-567890123", customerName: "Vikram Singh", policyType: "Money Back", premium: 28000, commission: 2800, date: "25 Nov 2024", status: "Paid" },
    { id: "LIC-678901234", customerName: "Anjali Gupta", policyType: "ULIP", premium: 50000, commission: 5000, date: "28 Nov 2024", status: "Pending" },
    { id: "LIC-789012345", customerName: "Rahul Verma", policyType: "Term Life", premium: 22000, commission: 2200, date: "30 Nov 2024", status: "Pending" }
  ]);

  const [incentives, setIncentives] = useState([
    { id: 1, name: "Monthly Target Bonus", amount: 5000, achieved: true, date: "30 Nov 2024" },
    { id: 2, name: "Quarterly Performance Bonus", amount: 15000, achieved: true, date: "30 Sep 2024" },
    { id: 3, name: "Product Champion Bonus", amount: 3000, achieved: true, date: "15 Nov 2024" },
    { id: 4, name: "Customer Satisfaction Bonus", amount: 2000, achieved: false, date: "30 Nov 2024" },
    { id: 5, name: "Team Leader Bonus", amount: 4000, achieved: true, date: "30 Nov 2024" }
  ]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      setEmail("user@example.com");
    }
    setIsLoading(false);
  }, [searchParams]);

  // Show loading state while email is being set
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/468d72b6-4073-4ce2-b957-f33f46e8eb67/uVKp5LGC97.lottie"
              loop
              autoplay
            />
          </div>
          <p className="text-gray-600">Loading commission data...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const getMonthName = (monthIndex: string) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[parseInt(monthIndex)] || "December";
  };

  const getCurrentMonthData = () => {
    const monthIndex = parseInt(selectedMonth);
    return monthlyBreakdown[monthIndex] || { commission: 0, policies: 0, premium: 0, target: 35000 };
  };

  const currentMonthData = getCurrentMonthData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="commission"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Commission Tracking</h1>
              <p className="text-gray-600">Monitor your earnings, targets, and performance</p>
            </div>

            {/* Period Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Label htmlFor="month">Month:</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">January</SelectItem>
                    <SelectItem value="1">February</SelectItem>
                    <SelectItem value="2">March</SelectItem>
                    <SelectItem value="3">April</SelectItem>
                    <SelectItem value="4">May</SelectItem>
                    <SelectItem value="5">June</SelectItem>
                    <SelectItem value="6">July</SelectItem>
                    <SelectItem value="7">August</SelectItem>
                    <SelectItem value="8">September</SelectItem>
                    <SelectItem value="9">October</SelectItem>
                    <SelectItem value="10">November</SelectItem>
                    <SelectItem value="11">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="year">Year:</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Commission Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Monthly Commission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{currentMonthData.commission.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Target: ₹{currentMonthData.target.toLocaleString()}</p>
                  <div className="mt-2">
                    <Badge variant={currentMonthData.commission >= currentMonthData.target ? "default" : "secondary"}>
                      {currentMonthData.commission >= currentMonthData.target ? "Target Achieved" : "Below Target"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Policies Sold</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{currentMonthData.policies}</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((currentMonthData.policies / 20) * 100, 100)}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{Math.round((currentMonthData.policies / 20) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">₹{currentMonthData.premium.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Collected this month</p>
                  <div className="mt-2">
                    <Badge variant="outline">Premium Volume</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Agent Rank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{commissionData.rank}</div>
                  <p className="text-xs text-gray-500 mt-1">Top 10% performers</p>
                  <div className="mt-2">
                    <Badge variant="outline">Achievement</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Commission Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="policies">Policy Commissions</TabsTrigger>
                <TabsTrigger value="incentives">Incentives</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Commission Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Commission Trend</CardTitle>
                      <CardDescription>Your monthly commission performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {monthlyBreakdown.slice(-6).map((month, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-sm font-medium">{month.month}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">₹{month.commission.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{month.policies} policies</p>
                              </div>
                              <Badge variant={month.commission >= month.target ? "default" : "secondary"}>
                                {Math.round((month.commission / month.target) * 100)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Target Achievement</span>
                          <span className="text-lg font-bold text-green-600">{commissionData.targetAchievement}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Average Commission per Policy</span>
                          <span className="text-lg font-bold text-blue-600">₹{Math.round(currentMonthData.commission / (currentMonthData.policies || 1)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Year-to-Date Commission</span>
                          <span className="text-lg font-bold text-purple-600">₹{commissionData.yearlyCommission.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Quarterly Average</span>
                          <span className="text-lg font-bold text-orange-600">₹{Math.round(commissionData.yearlyCommission / 4).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Policy Commission Details</CardTitle>
                    <CardDescription>Commission earned from individual policies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {policyCommissions.map((policy) => (
                          <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium">{policy.customerName}</p>
                                <p className="text-sm text-gray-500">{policy.policyType}</p>
                                <p className="text-xs text-gray-400">{policy.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{policy.commission.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">Premium: ₹{policy.premium.toLocaleString()}</p>
                              <Badge variant={policy.status === "Paid" ? "default" : "secondary"}>
                                {policy.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="incentives" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Incentives & Bonuses</CardTitle>
                    <CardDescription>Performance-based incentives and bonuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incentives.map((incentive) => (
                        <div key={incentive.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium">{incentive.name}</p>
                              <p className="text-sm text-gray-500">{incentive.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{incentive.amount.toLocaleString()}</p>
                            <Badge variant={incentive.achieved ? "default" : "secondary"}>
                              {incentive.achieved ? "Achieved" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Mix */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Mix Analysis</CardTitle>
                      <CardDescription>Commission by product type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { type: "Term Life", commission: 12500, percentage: 28 },
                          { type: "Endowment", commission: 13500, percentage: 30 },
                          { type: "Health Insurance", commission: 9000, percentage: 20 },
                          { type: "Whole Life", commission: 7000, percentage: 16 },
                          { type: "ULIP", commission: 2500, percentage: 6 }
                        ].map((product, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{product.type}</span>
                              <span className="text-sm">₹{product.commission.toLocaleString()} ({product.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${product.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Commission Forecast */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Commission Forecast</CardTitle>
                      <CardDescription>Projected earnings for next quarter</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Next Month Projection</p>
                          <p className="text-2xl font-bold text-blue-600">₹48,000</p>
                          <p className="text-xs text-blue-600">Based on current pipeline</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-900">Quarterly Projection</p>
                          <p className="text-2xl font-bold text-green-600">₹144,000</p>
                          <p className="text-xs text-green-600">Expected quarterly total</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm font-medium text-purple-900">Yearly Projection</p>
                          <p className="text-2xl font-bold text-purple-600">₹576,000</p>
                          <p className="text-xs text-purple-600">Projected annual total</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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

export default function CommissionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/468d72b6-4073-4ce2-b957-f33f46e8eb67/uVKp5LGC97.lottie"
              loop
              autoplay
            />
          </div>
          <p className="text-gray-600">Loading commission data...</p>
        </div>
      </div>
    }>
      <CommissionPageContent />
    </Suspense>
  );
}
