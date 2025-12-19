"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { CalendarHolidays } from "@/components/features/calendar-holidays";
import { IndianStockMarket } from "@/components/features/indian-stock-market";
import { NewsVideos } from "@/components/features/news-videos";
import { WeatherWidget } from "@/components/features/weather-widget";
import { AIInsights } from "@/components/features/ai-insights";
import { AdvancedAnalytics } from "@/components/features/advanced-analytics";
import { InfrastructureMonitoring } from "@/components/features/infrastructure-monitoring";
import { PaginatedTable } from "@/components/features/paginated-table";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { MiniMusicPlayer } from "@/components/features/mini-music-player";

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [policiesPage, setPoliciesPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);
  const [claimsPage, setClaimsPage] = useState(1);
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [tabLoadingStates, setTabLoadingStates] = useState({
    overview: true,
    policies: false,
    claims: false,
    customers: false,
    collections: false,
    news: false,
    aiInsights: false,
    analytics: false,
    monitoring: false,
  });

  useEffect(() => {
    // Get email from localStorage and fetch MongoDB data
    const user = localStorage.getItem('user');
    let userEmail = "user@example.com";

    if (user) {
      try {
        const userData = JSON.parse(user);
        userEmail = userData.email || "user@example.com";
      } catch (error) {
        // keep default fallback email
      }
    }

    setEmail(userEmail);

    // Fetch data from MongoDB APIs and News API
    const fetchDashboardData = async () => {
      try {
        // Fetch customers
        const customersRes = await fetch('/api/customers?limit=50');
        const customersData = await customersRes.json();

        // Fetch claims
        const claimsRes = await fetch('/api/claims?limit=5');
        const claimsData = await claimsRes.json();

        // Fetch payments
        const paymentsRes = await fetch('/api/payments?limit=5');
        const paymentsData = await paymentsRes.json();

        // Fetch all policies from MongoDB
        const policiesRes = await fetch(`/api/policies`);
        const policiesJson = await policiesRes.json();
        const policiesData = Array.isArray(policiesJson.policies) ? policiesJson.policies : [];

        // Compute policy metrics
        const totalPolicies = policiesData.length;
        const activePolicies = policiesData.filter((p: any) => p.status === "active").length;
        const pendingPolicies = policiesData.filter((p: any) => p.status === "pending").length;
        const expiredPolicies = policiesData.filter((p: any) => p.status === "expired").length;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const policiesThisMonth = policiesData.filter((p: any) => {
          const created = p.createdAt ? new Date(p.createdAt) : null;
          return created && created.getMonth() === currentMonth && created.getFullYear() === currentYear;
        }).length;

        const renewalsDue = policiesData.filter((p: any) => {
          if (!p.nextPremium) return false;
          const next = new Date(p.nextPremium);
          if (Number.isNaN(next.getTime())) return false;
          const diffDays = (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 30 && p.status === "active";
        }).length;

        const totalPremiumAmount = policiesData.reduce((sum: number, p: any) => {
          if (!p.premium) return sum;
          const numeric = parseInt(String(p.premium).replace(/[^\d]/g, ""), 10);
          return sum + (Number.isNaN(numeric) ? 0 : numeric);
        }, 0);

        const recentPolicies = policiesData.slice(0, 5);

        // Compute customer metrics
        const customersList = customersData.data || [];
        const totalCustomers = customersList.length;
        const activeCustomers = customersList.filter((c: any) => c.status === "active").length;

        const customersThisMonth = customersList.filter((c: any) => {
          const created = c.createdAt ? new Date(c.createdAt) : null;
          return created && created.getMonth() === currentMonth && created.getFullYear() === currentYear;
        }).length;

        const atRiskCustomers = customersList.filter((c: any) => c.kycStatus === "pending" || c.status === "suspended").length;

        const recentCustomers = customersList.slice(0, 5);

        setDashboardData({
          customers: {
            list: recentCustomers,
            counts: {
              total: totalCustomers,
              active: activeCustomers,
              thisMonth: customersThisMonth,
              atRisk: atRiskCustomers,
            },
          },
          claims: claimsData.data || [],
          payments: paymentsData.data || [],
          policies: {
            list: recentPolicies,
            counts: {
              total: totalPolicies,
              active: activePolicies,
              pending: pendingPolicies,
              expired: expiredPolicies,
              thisMonth: policiesThisMonth,
              renewalsDue,
              totalPremiumAmount,
            },
          },
        });

        // Fetch news (LIC / Indian economy)
        try {
          const newsRes = await fetch('/api/news');
          const newsJson = await newsRes.json();
          if (newsRes.ok && newsJson.success) {
            setNews(newsJson.articles || []);
            setNewsError(null);
          } else {
            setNews([]);
            setNewsError(newsJson.error || 'Failed to load news');
          }
        } catch (err) {
          console.error('Error fetching news:', err);
          setNews([]);
          setNewsError('Network error while loading news');
        } finally {
          setIsNewsLoading(false);
        }

        // Fetch notifications from API
        try {
          const notifsRes = await fetch(`/api/notifications?email=${encodeURIComponent(userEmail)}&limit=10`);
          const notifsData = await notifsRes.json();
          if (notifsRes.ok && notifsData.success && Array.isArray(notifsData.notifications)) {
            const formattedNotifs = notifsData.notifications.map((n: any, idx: number) => ({
              id: n._id || idx + 1,
              title: n.title,
              message: n.message,
              read: n.read || false,
              time: n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Just now',
              type: n.type || 'info',
            }));
            setNotifications(formattedNotifs);
          } else {
            // Fallback to generated notifications
            const notifs = [];
            if (customersData.data?.length > 0) {
              notifs.push({
                id: 1,
                title: "New Customers",
                message: `${customersData.data.length} new customers in MongoDB`,
                read: false,
                time: "Just now"
              });
            }
            if (claimsData.data?.length > 0) {
              notifs.push({
                id: 2,
                title: "Claims Pending",
                message: `${claimsData.data.length} claims awaiting processing`,
                read: false,
                time: "Just now"
              });
            }
            if (paymentsData.data?.length > 0) {
              notifs.push({
                id: 3,
                title: "Recent Payments",
                message: `${paymentsData.data.length} payments recorded in MongoDB`,
                read: false,
                time: "Just now"
              });
            }
            setNotifications(notifs);
          }
        } catch (notifError) {
          console.error('Error fetching notifications:', notifError);
          setNotifications([
            { id: 1, title: "Dashboard", message: "Connected to MongoDB", read: false, time: "Now" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to default notifications
        setNotifications([
          { id: 1, title: "Dashboard", message: "Connected to MongoDB", read: false, time: "Now" }
        ]);
      } finally {
        setIsLoading(false);
        if (isNewsLoading) {
          setIsNewsLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading state while email is being set
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navbar
          email="Loading..."
          currentPage="dashboard"
          showProfileSidebar={false}
          setShowProfileSidebar={() => {}}
          notifications={[]}
          setNotifications={() => {}}
          isClearingNotifications={false}
          setIsClearingNotifications={() => {}}
        />
        <div className="p-4 sm:p-6">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Clear user from localStorage
      localStorage.removeItem('user');
      
      // Redirect to login page directly
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
    
    // Simulate API call with loader
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

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    // Simulate loading for tab content
    setTabLoadingStates(prev => ({
      ...prev,
      [tabValue]: true
    }));
    setTimeout(() => {
      setTabLoadingStates(prev => ({
        ...prev,
        [tabValue]: false
      }));
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="dashboard"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Dashboard Content with Sidebar */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'md:mr-80' : ''}`}>
          <div className="p-4 sm:p-6">
            {/* Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 h-auto p-1">
                <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-2">Overview</TabsTrigger>
                <TabsTrigger value="policies" className="text-xs sm:text-sm py-2 px-2">Policies</TabsTrigger>
                <TabsTrigger value="claims" className="text-xs sm:text-sm py-2 px-2">Claims</TabsTrigger>
                <TabsTrigger value="customers" className="text-xs sm:text-sm py-2 px-2 hidden sm:flex">Customers</TabsTrigger>
                <TabsTrigger value="collections" className="text-xs sm:text-sm py-2 px-2 hidden lg:flex">Collections</TabsTrigger>
                <TabsTrigger value="news" className="text-xs sm:text-sm py-2 px-2 hidden lg:flex">News</TabsTrigger>
                <TabsTrigger value="ai-insights" className="text-xs sm:text-sm py-2 px-2 hidden lg:flex">AI Insights</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm py-2 px-2 hidden lg:flex">Analytics</TabsTrigger>
                <TabsTrigger value="monitoring" className="text-xs sm:text-sm py-2 px-2 hidden lg:flex">Monitoring</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Calendar, Weather and Holidays Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <WeatherWidget />
                    <CalendarHolidays />
                  </div>
                  <div className="lg:col-span-2">
                    {/* Indian Stock Market Section */}
                    <IndianStockMarket />
                    
                    {/* Money Collected Section */}
                    <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-green-600">Money Collected</CardTitle>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Today</p>
                        <p className="text-lg sm:text-2xl font-bold text-green-600">₹45,250</p>
                        <p className="text-xs text-gray-500 mt-1">+12% from yesterday</p>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">This Week</p>
                        <p className="text-lg sm:text-2xl font-bold text-blue-600">₹2,85,000</p>
                        <p className="text-xs text-gray-500 mt-1">+8% from last week</p>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">This Month</p>
                        <p className="text-lg sm:text-2xl font-bold text-purple-600">₹12,50,000</p>
                        <p className="text-xs text-gray-500 mt-1">+15% from last month</p>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">This Year</p>
                        <p className="text-lg sm:text-2xl font-bold text-orange-600">₹1,45,00,000</p>
                        <p className="text-xs text-gray-500 mt-1">+20% from last year</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  </div>
                </div>

                {/* Music Player Section */}
                <div className="mt-6">
                  <MiniMusicPlayer />
                </div>

                {/* Business Health Snapshot */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg sm:text-xl">Business Health</CardTitle>
                        <CardDescription className="text-sm">
                          Overall performance snapshot across key LIC metrics
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                          Healthy Portfolio
                        </Badge>
                        <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
                          Growing Pipeline
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Portfolio Mix Chart */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Portfolio Mix</p>
                          <span className="text-xs text-gray-500">Life / Health / Other</span>
                        </div>
                        <div className="h-44 sm:h-52 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                          {/* Placeholder for shadcn pie chart component */}
                          <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
                            Connect the `pie-chart` component here to visualize premium distribution by product type.
                          </p>
                        </div>
                      </div>

                      {/* Risk & Lapse Indicators */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Risk & Lapse Indicators</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600">Policies at Risk</p>
                              <p className="text-xs text-gray-500">Premium overdue & high-claim ratio</p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                              6.2%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600">Expected Lapse Rate</p>
                              <p className="text-xs text-gray-500">Next 30 days projection</p>
                            </div>
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                              3.1%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600">Renewal Conversion</p>
                              <p className="text-xs text-gray-500">Recovered at-risk policies</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              91.4%
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Agent Leaderboard Snapshot */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Top Performing Agents</p>
                        <div className="space-y-2">
                          {[
                            { name: "Rajesh Kumar", branch: "Mumbai Main", amount: "₹2.3L", tag: "Champion" },
                            { name: "Priya Sharma", branch: "Delhi Central", amount: "₹1.9L", tag: "Rising Star" },
                            { name: "Amit Singh", branch: "Bengaluru South", amount: "₹1.6L", tag: "Consistent" },
                          ].map((agent) => (
                            <div
                              key={agent.name}
                              className="flex items-center justify-between p-2.5 rounded-lg border bg-white/60"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                                  {agent.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-gray-800">
                                    {agent.name}
                                  </p>
                                  <p className="text-[11px] text-gray-500">{agent.branch}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs sm:text-sm font-semibold text-green-600">
                                  {agent.amount}
                                </p>
                                <p className="text-[11px] text-gray-500">{agent.tag}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">Active Policies</p>
                          <p className="text-lg sm:text-2xl font-bold">
                            {dashboardData?.policies?.counts?.active ?? 0}
                          </p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">Claims Processed</p>
                          <p className="text-lg sm:text-2xl font-bold">89</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">New Customers</p>
                          <p className="text-lg sm:text-2xl font-bold">
                            {dashboardData?.policies?.counts?.thisMonth ?? 0}
                          </p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-600">Commission</p>
                          <p className="text-lg sm:text-2xl font-bold">₹4.52L</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Recent Activities</CardTitle>
                    <CardDescription className="text-sm">Latest updates and notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">New policy sold</p>
                          <p className="text-xs text-gray-500">Term Life - ₹25,000 - Rajesh Kumar - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Premium collected</p>
                          <p className="text-xs text-gray-500">₹25,000 from 5 customers - 3 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-4 p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Claim approved</p>
                          <p className="text-xs text-gray-500">Health insurance claim for Priya Sharma - 5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Policy Management</CardTitle>
                    <CardDescription>Overview of all insurance policies in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Total Policies</h3>
                          <p className="text-2xl font-bold text-blue-600">
                            {dashboardData?.policies?.counts?.total ?? 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Stored in MongoDB</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <h3 className="font-medium">New This Month</h3>
                          <p className="text-2xl font-bold text-green-600">
                            {dashboardData?.policies?.counts?.thisMonth ?? 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Created this month</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Renewals Due</h3>
                          <p className="text-2xl font-bold text-orange-600">
                            {dashboardData?.policies?.counts?.renewalsDue ?? 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Next 30 days</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Total Premium</h3>
                          <p className="text-2xl font-bold text-purple-600">
                            ₹
                            {dashboardData?.policies?.counts?.totalPremiumAmount
                              ? dashboardData.policies.counts.totalPremiumAmount.toLocaleString("en-IN")
                              : "0"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Sum of policy premiums</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Policies Table with Pagination */}
                <PaginatedTable
                  title="All Policies"
                  description="Complete list of insurance policies with pagination"
                  data={dashboardData?.policies?.list || []}
                  itemsPerPage={10}
                  isLoading={isLoading}
                  columns={[
                    {
                      key: "policyId",
                      label: "Policy ID",
                      render: (value) => <span className="font-medium">{value}</span>,
                    },
                    {
                      key: "type",
                      label: "Type",
                      render: (value) => <Badge variant="outline">{value}</Badge>,
                    },
                    {
                      key: "customerName",
                      label: "Customer",
                    },
                    {
                      key: "premium",
                      label: "Premium",
                      render: (value) => <span className="font-semibold text-green-600">{value}</span>,
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (value) => (
                        <Badge
                          variant="outline"
                          className={
                            value === "active"
                              ? "border-green-500 text-green-700 bg-green-50"
                              : value === "pending"
                              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                              : "border-red-500 text-red-700 bg-red-50"
                          }
                        >
                          {value}
                        </Badge>
                      ),
                    },
                    {
                      key: "createdAt",
                      label: "Created",
                      render: (value) =>
                        value
                          ? new Date(value).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-",
                    },
                  ]}
                />
              </TabsContent>

              <TabsContent value="claims" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Claims Management</CardTitle>
                    <CardDescription>Process and track insurance claims</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Pending Claims</h3>
                          <p className="text-2xl font-bold text-blue-600">23</p>
                          <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Approved</h3>
                          <p className="text-2xl font-bold text-green-600">156</p>
                          <p className="text-sm text-gray-600 mt-1">This month</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Processing</h3>
                          <p className="text-2xl font-bold text-orange-600">45</p>
                          <p className="text-sm text-gray-600 mt-1">In progress</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Total Paid</h3>
                          <p className="text-2xl font-bold text-purple-600">₹28.5L</p>
                          <p className="text-sm text-gray-600 mt-1">This month</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Claims Table with Pagination */}
                <PaginatedTable
                  title="All Claims"
                  description="Complete list of insurance claims with pagination"
                  data={dashboardData?.claims || []}
                  itemsPerPage={10}
                  isLoading={tabLoadingStates.claims}
                  columns={[
                    {
                      key: "claimId",
                      label: "Claim ID",
                      render: (value) => <span className="font-medium">{value || "CLM-2024-0000"}</span>,
                    },
                    {
                      key: "customerName",
                      label: "Customer",
                    },
                    {
                      key: "claimType",
                      label: "Type",
                      render: (value) => <Badge variant="outline">{value || "General"}</Badge>,
                    },
                    {
                      key: "claimAmount",
                      label: "Amount",
                      render: (value) => <span className="font-semibold text-green-600">₹{value?.toLocaleString("en-IN") || "0"}</span>,
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (value) => (
                        <Badge
                          variant="outline"
                          className={
                            value === "approved"
                              ? "border-green-500 text-green-700 bg-green-50"
                              : value === "pending"
                              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                              : value === "processing"
                              ? "border-blue-500 text-blue-700 bg-blue-50"
                              : "border-red-500 text-red-700 bg-red-50"
                          }
                        >
                          {value || "Pending"}
                        </Badge>
                      ),
                    },
                    {
                      key: "createdAt",
                      label: "Date",
                      render: (value) =>
                        value
                          ? new Date(value).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-",
                    },
                  ]}
                />
              </TabsContent>

              <TabsContent value="customers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>Manage customer relationships</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Total Customers</h3>
                          <p className="text-2xl font-bold text-blue-600">
                            {dashboardData?.customers?.counts?.total ?? 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">In MongoDB</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Active Customers</h3>
                          <p className="text-2xl font-bold text-green-600">
                            {dashboardData?.customers?.counts?.active ?? 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Status: active</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">New This Month</h3>
                          <p className="text-2xl font-bold text-purple-600">
                            {dashboardData?.customers?.counts?.thisMonth ?? 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Joined this month</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">At Risk</h3>
                          <p className="text-2xl font-bold text-orange-600">
                            {dashboardData?.customers?.counts?.atRisk ?? 0}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">KYC pending / suspended</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Customers Table with Pagination */}
                <PaginatedTable
                  title="All Customers"
                  description="Complete list of customers with pagination"
                  data={dashboardData?.customers?.list || []}
                  itemsPerPage={10}
                  isLoading={isLoading}
                  columns={[
                    {
                      key: "name",
                      label: "Name",
                      render: (value, row) => {
                        const initials = (value || row.customerName || "?")
                          .split(" ")
                          .filter(Boolean)
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        return (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-xs">{initials}</span>
                            </div>
                            <span className="font-medium">{value || row.customerName}</span>
                          </div>
                        );
                      },
                    },
                    {
                      key: "email",
                      label: "Email",
                      render: (value) => <span className="text-sm">{value}</span>,
                    },
                    {
                      key: "phone",
                      label: "Phone",
                      render: (value) => <span className="text-sm">{value || "-"}</span>,
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (value) => (
                        <Badge
                          variant="outline"
                          className={
                            value === "active"
                              ? "border-green-500 text-green-700 bg-green-50"
                              : value === "inactive"
                              ? "border-gray-500 text-gray-700 bg-gray-50"
                              : "border-red-500 text-red-700 bg-red-50"
                          }
                        >
                          {value || "Active"}
                        </Badge>
                      ),
                    },
                    {
                      key: "kycStatus",
                      label: "KYC",
                      render: (value) => (
                        <Badge
                          variant="outline"
                          className={
                            value === "verified"
                              ? "border-green-500 text-green-700 bg-green-50"
                              : value === "pending"
                              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                              : "border-red-500 text-red-700 bg-red-50"
                          }
                        >
                          {value || "Pending"}
                        </Badge>
                      ),
                    },
                  ]}
                />
              </TabsContent>

              <TabsContent value="collections" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Premium Collections</CardTitle>
                    <CardDescription>Track premium payments and collections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Collected Today</h3>
                          <p className="text-2xl font-bold text-green-600">₹45,250</p>
                          <p className="text-sm text-gray-600 mt-1">From 23 payments</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Pending</h3>
                          <p className="text-2xl font-bold text-blue-600">₹2,85,000</p>
                          <p className="text-sm text-gray-600 mt-1">45 payments</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Overdue</h3>
                          <p className="text-2xl font-bold text-purple-600">₹1,25,000</p>
                          <p className="text-sm text-gray-600 mt-1">12 payments</p>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <h3 className="font-medium">Collection Rate</h3>
                          <p className="text-2xl font-bold text-orange-600">94.5%</p>
                          <p className="text-sm text-gray-600 mt-1">+2.3% improvement</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Collections Table with Pagination */}
                <PaginatedTable
                  title="All Collections"
                  description="Complete list of premium collections with pagination"
                  data={dashboardData?.payments || []}
                  itemsPerPage={10}
                  isLoading={tabLoadingStates.collections}
                  columns={[
                    {
                      key: "collectionId",
                      label: "Collection ID",
                      render: (value) => <span className="font-medium">{value || "COL-2024-0000"}</span>,
                    },
                    {
                      key: "customerName",
                      label: "Customer",
                    },
                    {
                      key: "policyId",
                      label: "Policy ID",
                    },
                    {
                      key: "amount",
                      label: "Amount",
                      render: (value) => <span className="font-semibold text-green-600">₹{value?.toLocaleString("en-IN") || "0"}</span>,
                    },
                    {
                      key: "paymentMethod",
                      label: "Method",
                      render: (value) => <Badge variant="outline">{value || "Online"}</Badge>,
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (value) => (
                        <Badge
                          variant="outline"
                          className={
                            value === "collected"
                              ? "border-green-500 text-green-700 bg-green-50"
                              : value === "pending"
                              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                              : "border-red-500 text-red-700 bg-red-50"
                          }
                        >
                          {value || "Pending"}
                        </Badge>
                      ),
                    },
                  ]}
                />
              </TabsContent>

              <TabsContent value="news" className="space-y-6">
                {tabLoadingStates.news ? (
                  <DashboardSkeleton />
                ) : (
                  <NewsVideos />
                )}
              </TabsContent>

              <TabsContent value="ai-insights" className="space-y-6">
                {tabLoadingStates.aiInsights ? (
                  <DashboardSkeleton />
                ) : (
                  <AIInsights />
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {tabLoadingStates.analytics ? (
                  <DashboardSkeleton />
                ) : (
                  <AdvancedAnalytics />
                )}
              </TabsContent>

              <TabsContent value="monitoring" className="space-y-6">
                {tabLoadingStates.monitoring ? (
                  <DashboardSkeleton />
                ) : (
                  <InfrastructureMonitoring />
                )}
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

export default function DashboardPage() {
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
