"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { jsPDF } from 'jspdf';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { CollectionsTrackingComponent } from "@/components/features/collections-tracking";
import { PaginatedTable } from "@/components/features/paginated-table";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";

function CollectionsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("due");
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDays, setFilterDays] = useState("30");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterAmountRange, setFilterAmountRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollectionsLoading, setIsCollectionsLoading] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Payment Received", message: "₹25,000 received from Rajesh Kumar", read: false, time: "2 hours ago" },
    { id: 2, title: "Premium Due Reminder", message: "5 premiums due this week", read: false, time: "1 day ago" },
    { id: 3, title: "Collection Target", message: "Monthly collection target 80% achieved", read: true, time: "3 days ago" }
  ]);

  // Due Premiums Data
  const [duePremiums, setDuePremiums] = useState([
    {
      id: "LIC-123456789",
      policyId: "LIC-123456789",
      customerName: "Rajesh Kumar",
      policyType: "Term Life",
      premiumAmount: 25000,
      dueDate: "15 Dec 2024",
      daysOverdue: 0,
      status: "due",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      lastPayment: "15 Nov 2024",
      paymentFrequency: "Yearly",
      branch: "Mumbai Main"
    },
    {
      id: "LIC-234567890",
      policyId: "LIC-234567890",
      customerName: "Priya Sharma",
      policyType: "Endowment",
      premiumAmount: 45000,
      dueDate: "10 Dec 2024",
      daysOverdue: 5,
      status: "overdue",
      phone: "+91 98765 43211",
      email: "priya.sharma@email.com",
      lastPayment: "10 Dec 2023",
      paymentFrequency: "Yearly",
      branch: "Delhi Central"
    },
    {
      id: "LIC-345678901",
      policyId: "LIC-345678901",
      customerName: "Amit Patel",
      policyType: "Health Insurance",
      premiumAmount: 18000,
      dueDate: "20 Dec 2024",
      daysOverdue: 0,
      status: "due",
      phone: "+91 98765 43212",
      email: "amit.patel@email.com",
      lastPayment: "20 Nov 2024",
      paymentFrequency: "Yearly",
      branch: "Ahmedabad"
    },
    {
      id: "LIC-456789012",
      policyId: "LIC-456789012",
      customerName: "Sunita Reddy",
      policyType: "Whole Life",
      premiumAmount: 35000,
      dueDate: "05 Dec 2024",
      daysOverdue: 10,
      status: "overdue",
      phone: "+91 98765 43213",
      email: "sunita.reddy@email.com",
      lastPayment: "05 Dec 2023",
      paymentFrequency: "Yearly",
      branch: "Bangalore"
    },
    {
      id: "LIC-567890123",
      policyId: "LIC-567890123",
      customerName: "Vikram Singh",
      policyType: "Money Back",
      premiumAmount: 28000,
      dueDate: "25 Dec 2024",
      daysOverdue: 0,
      status: "due",
      phone: "+91 98765 43214",
      email: "vikram.singh@email.com",
      lastPayment: "25 Nov 2024",
      paymentFrequency: "Yearly",
      branch: "Pune"
    }
  ]);

  // Payment Records
  const [paymentRecords, setPaymentRecords] = useState([
    {
      id: "PAY-001",
      policyId: "LIC-123456789",
      customerName: "Rajesh Kumar",
      amount: 25000,
      paymentDate: "15 Nov 2024",
      paymentMethod: "Online",
      transactionId: "TXN123456789",
      status: "Success",
      receiptGenerated: true
    },
    {
      id: "PAY-002",
      policyId: "LIC-234567890",
      customerName: "Priya Sharma",
      amount: 45000,
      paymentDate: "10 Dec 2023",
      paymentMethod: "Cheque",
      transactionId: "CHQ987654321",
      status: "Success",
      receiptGenerated: true
    },
    {
      id: "PAY-003",
      policyId: "LIC-345678901",
      customerName: "Amit Patel",
      amount: 18000,
      paymentDate: "20 Nov 2024",
      paymentMethod: "Cash",
      transactionId: "CASH456789123",
      status: "Success",
      receiptGenerated: true
    }
  ]);

  // Payment Form Data
  const [paymentFormData, setPaymentFormData] = useState({
    policyId: "",
    customerName: "",
    amount: "",
    paymentMethod: "Online",
    transactionId: "",
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ""
  });

  // Collection Statistics
  const [collectionStats, setCollectionStats] = useState({
    totalDue: 151000,
    totalOverdue: 80000,
    collectedThisMonth: 450000,
    monthlyTarget: 500000,
    targetAchievement: 90,
    policiesDue: 5,
    policiesOverdue: 2
  });

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
          <p className="text-gray-600">Loading collections data...</p>
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

  const handleRecordPayment = async () => {
    setIsRecordingPayment(true);
    
    // Simulate payment recording
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPayment = {
      id: `PAY-${Date.now()}`,
      policyId: paymentFormData.policyId,
      customerName: paymentFormData.customerName,
      amount: parseFloat(paymentFormData.amount),
      paymentDate: paymentFormData.paymentDate,
      paymentMethod: paymentFormData.paymentMethod,
      transactionId: paymentFormData.transactionId,
      status: "Success",
      receiptGenerated: true
    };

    setPaymentRecords([newPayment, ...paymentRecords]);
    
    // Remove from due premiums
    setDuePremiums(duePremiums.filter(premium => premium.id !== paymentFormData.policyId));
    
    // Reset form
    setPaymentFormData({
      policyId: "",
      customerName: "",
      amount: "",
      paymentMethod: "Online",
      transactionId: "",
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ""
    });

    setIsRecordingPayment(false);
    alert("Payment recorded successfully!");
  };

  const handleSendReminder = (customer: any) => {
    alert(`Reminder sent to ${customer.customerName} via SMS and Email`);
  };

  const handleGenerateReceipt = (payment: any) => {
    generateReceiptPDF(payment);
  };

  const generateReceiptPDF = (payment: any) => {
    const doc = new jsPDF();
    
    // Add LIC Logo placeholder (you can replace with actual logo)
    doc.setFontSize(24);
    doc.setTextColor(0, 51, 102); // Dark blue color
    doc.text("LIFE INSURANCE CORPORATION", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("OF INDIA", 105, 30, { align: "center" });
    
    // Add horizontal line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Receipt Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("PAYMENT RECEIPT", 105, 50, { align: "center" });
    
    // Receipt Details
    doc.setFontSize(12);
    doc.text(`Receipt No: ${payment.id}`, 20, 70);
    doc.text(`Date: ${payment.paymentDate}`, 20, 80);
    doc.text(`Transaction ID: ${payment.transactionId}`, 20, 90);
    
    // Customer Information
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text("Customer Information", 20, 110);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${payment.customerName}`, 20, 125);
    doc.text(`Policy ID: ${payment.policyId}`, 20, 135);
    
    // Payment Details Box
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, 150, 170, 60);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text("Payment Details", 30, 170);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Amount Paid: ₹${payment.amount.toLocaleString()}`, 30, 185);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 30, 195);
    doc.text(`Status: ${payment.status}`, 30, 205);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer-generated receipt and does not require signature", 105, 230, { align: "center" });
    doc.text("For any queries, please contact your nearest LIC branch", 105, 240, { align: "center" });
    
    // Add watermark
    doc.setFontSize(48);
    doc.setTextColor(240, 240, 240);
    doc.text("PAID", 105, 150, { align: "center", angle: 45 });
    
    // Save the PDF
    doc.save(`receipt_${payment.id}_${payment.customerName.replace(/\s+/g, '_')}.pdf`);
    
    // Show success message
    alert(`Receipt generated successfully for payment ${payment.id}`);
  };

  const handleGenerateBulkReceipts = () => {
    if (paymentRecords.length === 0) {
      alert("No payments available to generate receipts");
      return;
    }
    
    // Generate receipts for all payments
    paymentRecords.forEach((payment, index) => {
      setTimeout(() => {
        generateReceiptPDF(payment);
      }, index * 1000); // 1 second delay between each PDF
    });
    
    alert(`Generating ${paymentRecords.length} receipts...`);
  };

  const filteredDuePremiums = duePremiums.filter((premium: any) => {
    const matchesSearch = premium.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         premium.policyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || premium.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="collections"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Collections</h1>
              <p className="text-gray-600">Manage premium payments and track collections</p>
            </div>

            {/* Collection Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">₹{collectionStats.totalDue.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">{collectionStats.policiesDue} policies</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Overdue Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">₹{collectionStats.totalOverdue.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">{collectionStats.policiesOverdue} policies</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Collected This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{collectionStats.collectedThisMonth.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Target: ₹{collectionStats.monthlyTarget.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Target Achievement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{collectionStats.targetAchievement}%</div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${collectionStats.targetAchievement}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collections Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="due">Due Premiums</TabsTrigger>
                <TabsTrigger value="record">Record Payment</TabsTrigger>
                <TabsTrigger value="history">Payment History</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="due" className="space-y-6">
                {/* Search and Filters */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Input
                        placeholder="Search by customer name or policy ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="due">Due</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Dates</SelectItem>
                          <SelectItem value="7days">Next 7 Days</SelectItem>
                          <SelectItem value="30days">Next 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterAmountRange} onValueChange={setFilterAmountRange}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Filter by amount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Amounts</SelectItem>
                          <SelectItem value="low">Low (&lt;₹20K)</SelectItem>
                          <SelectItem value="medium">Medium (₹20K-₹50K)</SelectItem>
                          <SelectItem value="high">High (&gt;₹50K)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                          setFilterDateRange("all");
                          setFilterAmountRange("all");
                          setCurrentPage(1);
                        }}
                        className="whitespace-nowrap"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Due Premiums Table with Pagination */}
                <PaginatedTable
                  title="Due Premiums"
                  description="Policies with premium payments due"
                  data={filteredDuePremiums.filter(premium => {
                    const matchesSearch = premium.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        premium.policyId.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = filterStatus === "all" || premium.status === filterStatus;
                    let matchesAmount = true;
                    if (filterAmountRange !== "all") {
                      if (filterAmountRange === "low") matchesAmount = premium.premiumAmount < 20000;
                      else if (filterAmountRange === "medium") matchesAmount = premium.premiumAmount >= 20000 && premium.premiumAmount < 50000;
                      else if (filterAmountRange === "high") matchesAmount = premium.premiumAmount >= 50000;
                    }
                    return matchesSearch && matchesStatus && matchesAmount;
                  })}
                  itemsPerPage={10}
                  isLoading={isCollectionsLoading}
                  columns={[
                    {
                      key: "policyId",
                      label: "Policy ID",
                      render: (value) => <span className="font-medium">{value}</span>,
                    },
                    {
                      key: "customerName",
                      label: "Customer",
                    },
                    {
                      key: "policyType",
                      label: "Type",
                      render: (value) => <Badge variant="outline">{value}</Badge>,
                    },
                    {
                      key: "premiumAmount",
                      label: "Amount",
                      render: (value) => <span className="font-semibold">₹{value.toLocaleString()}</span>,
                    },
                    {
                      key: "dueDate",
                      label: "Due Date",
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (value, row) => (
                        <Badge
                          variant="outline"
                          className={
                            value === "overdue"
                              ? "border-red-500 text-red-700 bg-red-50"
                              : "border-yellow-500 text-yellow-700 bg-yellow-50"
                          }
                        >
                          {value === "overdue" ? `${row.daysOverdue} days overdue` : "Due Soon"}
                        </Badge>
                      ),
                    },
                  ]}
                />

                {/* Old Display - Commented Out */}
                {false && (
                <Card>
                  <CardHeader>
                    <CardTitle>Due Premiums</CardTitle>
                    <CardDescription>Policies with premium payments due</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {filteredDuePremiums.map((premium) => (
                          <div key={premium.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium">{premium.customerName}</p>
                                <p className="text-sm text-gray-500">{premium.policyId}</p>
                                <p className="text-xs text-gray-400">{premium.policyType} • {premium.branch}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{premium.premiumAmount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">Due: {premium.dueDate}</p>
                              <Badge variant={premium.status === "overdue" ? "destructive" : "secondary"}>
                                {premium.status === "overdue" ? `${premium.daysOverdue} days overdue` : "Due Soon"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleSendReminder(premium)}>
                                Send Reminder
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm">Record Payment</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Record Payment</DialogTitle>
                                    <DialogDescription>
                                      Record payment for {premium.customerName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="policyId">Policy ID</Label>
                                      <Input
                                        id="policyId"
                                        value={premium.id}
                                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, policyId: e.target.value }))}
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="customerName">Customer Name</Label>
                                      <Input
                                        id="customerName"
                                        value={premium.customerName}
                                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, customerName: e.target.value }))}
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="amount">Amount</Label>
                                      <Input
                                        id="amount"
                                        type="number"
                                        value={premium.premiumAmount}
                                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, amount: e.target.value }))}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="paymentMethod">Payment Method</Label>
                                      <Select value={paymentFormData.paymentMethod} onValueChange={(value) => setPaymentFormData(prev => ({ ...prev, paymentMethod: value }))}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Online">Online</SelectItem>
                                          <SelectItem value="Cash">Cash</SelectItem>
                                          <SelectItem value="Cheque">Cheque</SelectItem>
                                          <SelectItem value="DD">Demand Draft</SelectItem>
                                          <SelectItem value="UPI">UPI</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="transactionId">Transaction ID</Label>
                                      <Input
                                        id="transactionId"
                                        value={paymentFormData.transactionId}
                                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                                        placeholder="Enter transaction ID"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button onClick={handleRecordPayment} disabled={isRecordingPayment}>
                                      {isRecordingPayment ? "Recording..." : "Record Payment"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                )}
              </TabsContent>

              <TabsContent value="record" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Record New Payment</CardTitle>
                    <CardDescription>Record a premium payment received from customer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policyId">Policy ID *</Label>
                        <Input
                          id="policyId"
                          value={paymentFormData.policyId}
                          onChange={(e) => setPaymentFormData(prev => ({ ...prev, policyId: e.target.value }))}
                          placeholder="Enter policy ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name *</Label>
                        <Input
                          id="customerName"
                          value={paymentFormData.customerName}
                          onChange={(e) => setPaymentFormData(prev => ({ ...prev, customerName: e.target.value }))}
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={paymentFormData.amount}
                          onChange={(e) => setPaymentFormData(prev => ({ ...prev, amount: e.target.value }))}
                          placeholder="Enter amount"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method *</Label>
                        <Select value={paymentFormData.paymentMethod} onValueChange={(value) => setPaymentFormData(prev => ({ ...prev, paymentMethod: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Cheque">Cheque</SelectItem>
                            <SelectItem value="DD">Demand Draft</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transactionId">Transaction ID</Label>
                        <Input
                          id="transactionId"
                          value={paymentFormData.transactionId}
                          onChange={(e) => setPaymentFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                          placeholder="Enter transaction ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentDate">Payment Date *</Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          value={paymentFormData.paymentDate}
                          onChange={(e) => setPaymentFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={paymentFormData.notes}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add any additional notes about the payment"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleRecordPayment} disabled={isRecordingPayment}>
                        {isRecordingPayment ? "Recording Payment..." : "Record Payment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>Recent premium payment records</CardDescription>
                      </div>
                      <Button onClick={handleGenerateBulkReceipts} variant="outline">
                        Generate All Receipts
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {paymentRecords.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="font-medium">{payment.customerName}</p>
                                <p className="text-sm text-gray-500">{payment.policyId}</p>
                                <p className="text-xs text-gray-400">{payment.paymentDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{payment.paymentMethod}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="default">Success</Badge>
                                <Button variant="outline" size="sm" onClick={() => handleGenerateReceipt(payment)}>
                                  Generate Receipt
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Collection Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Collection Trend</CardTitle>
                      <CardDescription>Monthly collection performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { month: "July", collected: 420000, target: 500000 },
                          { month: "August", collected: 480000, target: 500000 },
                          { month: "September", collected: 510000, target: 500000 },
                          { month: "October", collected: 450000, target: 500000 },
                          { month: "November", collected: 450000, target: 500000 },
                          { month: "December", collected: 0, target: 500000 }
                        ].map((month, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              <span className="text-sm font-medium">{month.month}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">₹{month.collected.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Target: ₹{month.target.toLocaleString()}</p>
                              </div>
                              <Badge variant={month.collected >= month.target ? "default" : "secondary"}>
                                {Math.round((month.collected / month.target) * 100)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Distribution of payment methods</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { method: "Online", count: 45, percentage: 45 },
                          { method: "Cash", count: 25, percentage: 25 },
                          { method: "Cheque", count: 20, percentage: 20 },
                          { method: "UPI", count: 8, percentage: 8 },
                          { method: "DD", count: 2, percentage: 2 }
                        ].map((method, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{method.method}</span>
                              <span className="text-sm">{method.count} payments ({method.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${method.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
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

export default function CollectionsPage() {
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
          <p className="text-gray-600">Loading collections...</p>
        </div>
      </div>
    }>
      <CollectionsPageContent />
    </Suspense>
  );
}
