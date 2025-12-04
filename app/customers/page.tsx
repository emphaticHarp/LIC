"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart } from "@/components/ui/pie-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import LoansBankingSection from "./loans-banking";
import { CustomerManagementComponent } from "@/components/features/customer-management";
import { PaginatedTable } from "@/components/features/paginated-table";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";

function CustomersPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("existing");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Customer Added", message: "Rahul Verma added as new customer", read: false, time: "2 hours ago" },
    { id: 2, title: "Policy Renewal Due", message: "Priya Sharma's policy renewal due in 15 days", read: false, time: "1 day ago" },
    { id: 3, title: "Customer Birthday", message: "Amit Patel's birthday tomorrow - send wishes", read: true, time: "3 days ago" }
  ]);

  // Set email from localStorage on component mount for security
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setEmail(userData.email || "");
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Customer states
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerFilterStatus, setCustomerFilterStatus] = useState("all");
  const [customerFilterKYC, setCustomerFilterKYC] = useState("all");
  const [customerFilterDateRange, setCustomerFilterDateRange] = useState("all");
  const [customerFilterType, setCustomerFilterType] = useState("all");
  const [customerFilterPremium, setCustomerFilterPremium] = useState("all");
  const [customerFilterOfficer, setCustomerFilterOfficer] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCustomersLoading, setIsCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState<string | null>(null);
  
  // Dialog states
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isViewCustomerDialogOpen, setIsViewCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isSubmittingCustomer, setIsSubmittingCustomer] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  // Customer form data
  const [customerFormData, setCustomerFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    address: "",
    dateOfBirth: "",
    aadhaar: "",
    pan: "",
    policyType: "",
    policyNumber: "",
    sumAssured: "",
    premiumAmount: "",
    premiumFrequency: "Yearly",
    policyStartDate: "",
    maturityDate: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineeContact: ""
  });

  // Load customers from MongoDB (via API)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsCustomersLoading(true);
        setCustomersError(null);
        const res = await fetch("/api/customers?limit=100");
        const data = await res.json();

        if (!res.ok || !data.success) {
          setCustomers([]);
          setCustomersError(data.error || "Failed to load customers");
          return;
        }

        const mapped = (data.data || []).map((c: any) => ({
          id: c.customerId || c._id,
          name: c.name,
          avatar: null, // could be extended to use a stored avatar URL
          phone: c.phone,
          email: c.email,
          address: c.address || "",
          dateOfBirth: c.dateOfBirth,
          aadhaar: c.aadhaarNumber || "",
          pan: c.panNumber || "",
          policyIds: [],
          policyType: "", // not directly available from customer doc
          status:
            c.status === "active"
              ? "Active"
              : c.status === "inactive"
              ? "Inactive"
              : c.status === "suspended"
              ? "Suspended"
              : "Active",
          premiumAmount: "₹0",
          nextDueDate: "-",
          lastPayment: "-",
          agentName: c.agentId ? "Assigned Agent" : "—",
          policies: [],
          paymentHistory: [],
          claims: [],
          kycStatus: c.kycStatus,
          createdAt: c.createdAt,
        }));

        setCustomers(mapped);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setCustomers([]);
        setCustomersError("Network error while loading customers");
      } finally {
        setIsCustomersLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Calculate pie chart data
  const customerStatusData = [
    { label: "Active", value: customers.filter(c => c.status === "Active").length, color: "#10b981" },
    { label: "Inactive", value: customers.filter(c => c.status === "Inactive").length, color: "#6b7280" },
    { label: "Suspended", value: customers.filter(c => c.status === "Suspended").length, color: "#ef4444" }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                         customer.phone.includes(customerSearchTerm) ||
                         customer.email.toLowerCase().includes(customerSearchTerm) ||
                         (customer.policyIds && Array.isArray(customer.policyIds) && customer.policyIds.some((id: string) => String(id).toLowerCase().includes(customerSearchTerm.toLowerCase())));
    
    const matchesStatus = customerFilterStatus === "all" || customer.status === customerFilterStatus;
    const matchesKYC = customerFilterKYC === "all" || customer.kycStatus === customerFilterKYC;
    
    // Date range filter
    let matchesDateRange = true;
    if (customerFilterDateRange !== "all") {
      const customerDate = new Date(customer.createdAt);
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      
      if (customerFilterDateRange === "30days") matchesDateRange = customerDate >= thirtyDaysAgo;
      else if (customerFilterDateRange === "90days") matchesDateRange = customerDate >= ninetyDaysAgo;
    }
    
    return matchesSearch && matchesStatus && matchesKYC && matchesDateRange;
  });

  // Customer handler functions
  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsViewCustomerDialogOpen(true);
  };

  const handleAddCustomer = () => {
    setIsAddCustomerDialogOpen(true);
  };

  const handleCustomerInputChange = (field: string, value: string) => {
    setCustomerFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCustomer(true);
    
    try {
      const payload = {
        name: customerFormData.fullName,
        email: customerFormData.email,
        phone: customerFormData.mobileNumber,
        address: customerFormData.address,
        // Optional fields mapped to model
        panNumber: customerFormData.pan,
        aadhaarNumber: customerFormData.aadhaar,
        // Basic location placeholders (could be extended with dedicated inputs)
        city: "",
        state: "",
        pincode: "",
        agentId: null,
      };

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to add customer");
        return;
      }

      const c = data.data;
      const newCustomer = {
        id: c.customerId || c._id,
        name: c.name,
        avatar: null,
        phone: c.phone,
        email: c.email,
        address: c.address || "",
        dateOfBirth: c.dateOfBirth,
        aadhaar: c.aadhaarNumber || "",
        pan: c.panNumber || "",
        policyIds: [],
        policyType: "",
        status:
          c.status === "active"
            ? "Active"
            : c.status === "inactive"
            ? "Inactive"
            : c.status === "suspended"
            ? "Suspended"
            : "Active",
        premiumAmount: "₹0",
        nextDueDate: "-",
        lastPayment: "-",
        agentName: c.agentId ? "Assigned Agent" : "—",
        policies: [],
        paymentHistory: [],
        claims: [],
        kycStatus: c.kycStatus,
        createdAt: c.createdAt,
      };

      setCustomers(prev => [newCustomer, ...prev]);

      // Reset form
      setCustomerFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        address: "",
        dateOfBirth: "",
        aadhaar: "",
        pan: "",
        policyType: "",
        policyNumber: "",
        sumAssured: "",
        premiumAmount: "",
        premiumFrequency: "Yearly",
        policyStartDate: "",
        maturityDate: "",
        nomineeName: "",
        nomineeRelation: "",
        nomineeContact: ""
      });
      
      setIsAddCustomerDialogOpen(false);
      alert("Customer added successfully!");
    } catch (error) {
      alert("Failed to add customer. Please try again.");
    } finally {
      setIsSubmittingCustomer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="customers"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Customers Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
              <p className="text-gray-600">Manage and track all insurance customers</p>
            </div>

            {/* Customer Dashboard Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold">{customers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Customers</p>
                      <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'Active').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Lapsed Policies</p>
                      <p className="text-2xl font-bold text-red-600">{customers.filter(c => c.status === 'Lapsed').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Customers Having Claims</p>
                      <p className="text-2xl font-bold text-orange-600">{customers.filter(c => c.claims && c.claims.length > 0).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, policy ID, phone number, email..."
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={customerFilterStatus} onValueChange={setCustomerFilterStatus}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={customerFilterType} onValueChange={setCustomerFilterType}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                      <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                      <SelectItem value="Vehicle Insurance">Vehicle Insurance</SelectItem>
                      <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={customerFilterPremium} onValueChange={setCustomerFilterPremium}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Premium range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Premiums</SelectItem>
                      <SelectItem value="0-10000">₹0 - ₹10,000</SelectItem>
                      <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                      <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="50000+">₹50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={customerFilterOfficer} onValueChange={setCustomerFilterOfficer}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Officers</SelectItem>
                      <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                      <SelectItem value="Sneha Reddy">Sneha Reddy</SelectItem>
                      <SelectItem value="Amit Singh">Amit Singh</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={customerFilterKYC} onValueChange={setCustomerFilterKYC}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by KYC" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All KYC Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={customerFilterDateRange} onValueChange={setCustomerFilterDateRange}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCustomerSearchTerm("");
                      setCustomerFilterStatus("all");
                      setCustomerFilterType("all");
                      setCustomerFilterPremium("all");
                      setCustomerFilterOfficer("all");
                      setCustomerFilterKYC("all");
                      setCustomerFilterDateRange("all");
                      setCurrentPage(1);
                    }}
                    className="whitespace-nowrap"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleAddCustomer}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Customer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new customer and their policy information.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCustomerSubmit}>
                        <div className="grid gap-6 py-4">
                          {/* Basic Details */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Basic Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                  id="fullName"
                                  value={customerFormData.fullName}
                                  onChange={(e) => handleCustomerInputChange("fullName", e.target.value)}
                                  placeholder="Enter full name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="mobileNumber">Mobile Number</Label>
                                <Input
                                  id="mobileNumber"
                                  value={customerFormData.mobileNumber}
                                  onChange={(e) => handleCustomerInputChange("mobileNumber", e.target.value)}
                                  placeholder="Enter mobile number"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email ID</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={customerFormData.email}
                                  onChange={(e) => handleCustomerInputChange("email", e.target.value)}
                                  placeholder="Enter email address"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                  id="dateOfBirth"
                                  type="date"
                                  value={customerFormData.dateOfBirth}
                                  onChange={(e) => handleCustomerInputChange("dateOfBirth", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2 col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                  id="address"
                                  value={customerFormData.address}
                                  onChange={(e) => handleCustomerInputChange("address", e.target.value)}
                                  placeholder="Enter complete address"
                                  rows={2}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                                <Input
                                  id="aadhaar"
                                  value={customerFormData.aadhaar}
                                  onChange={(e) => handleCustomerInputChange("aadhaar", e.target.value)}
                                  placeholder="XXXX-XXXX-XXXX"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="pan">PAN Number</Label>
                                <Input
                                  id="pan"
                                  value={customerFormData.pan}
                                  onChange={(e) => handleCustomerInputChange("pan", e.target.value)}
                                  placeholder="XXXXX0000X"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Policy Details */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Policy Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="policyType">Policy Type</Label>
                                <Select value={customerFormData.policyType} onValueChange={(value) => handleCustomerInputChange("policyType", value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select policy type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                                    <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                                    <SelectItem value="Vehicle Insurance">Vehicle Insurance</SelectItem>
                                    <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="policyNumber">Policy Number</Label>
                                <Input
                                  id="policyNumber"
                                  value={customerFormData.policyNumber}
                                  onChange={(e) => handleCustomerInputChange("policyNumber", e.target.value)}
                                  placeholder="Enter policy number"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="sumAssured">Sum Assured</Label>
                                <Input
                                  id="sumAssured"
                                  value={customerFormData.sumAssured}
                                  onChange={(e) => handleCustomerInputChange("sumAssured", e.target.value)}
                                  placeholder="Enter sum assured amount"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="premiumAmount">Premium Amount</Label>
                                <Input
                                  id="premiumAmount"
                                  value={customerFormData.premiumAmount}
                                  onChange={(e) => handleCustomerInputChange("premiumAmount", e.target.value)}
                                  placeholder="Enter premium amount"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="premiumFrequency">Premium Frequency</Label>
                                <Select value={customerFormData.premiumFrequency} onValueChange={(value) => handleCustomerInputChange("premiumFrequency", value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="policyStartDate">Policy Start Date</Label>
                                <Input
                                  id="policyStartDate"
                                  type="date"
                                  value={customerFormData.policyStartDate}
                                  onChange={(e) => handleCustomerInputChange("policyStartDate", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="maturityDate">Maturity Date</Label>
                                <Input
                                  id="maturityDate"
                                  type="date"
                                  value={customerFormData.maturityDate}
                                  onChange={(e) => handleCustomerInputChange("maturityDate", e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Nominee Details */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Nominee Details</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="nomineeName">Nominee Name</Label>
                                <Input
                                  id="nomineeName"
                                  value={customerFormData.nomineeName}
                                  onChange={(e) => handleCustomerInputChange("nomineeName", e.target.value)}
                                  placeholder="Enter nominee name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="nomineeRelation">Relation</Label>
                                <Input
                                  id="nomineeRelation"
                                  value={customerFormData.nomineeRelation}
                                  onChange={(e) => handleCustomerInputChange("nomineeRelation", e.target.value)}
                                  placeholder="Enter relation"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="nomineeContact">Contact</Label>
                                <Input
                                  id="nomineeContact"
                                  value={customerFormData.nomineeContact}
                                  onChange={(e) => handleCustomerInputChange("nomineeContact", e.target.value)}
                                  placeholder="Enter contact number"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Document Upload */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="aadhaarDoc">Aadhaar Card</Label>
                                <Input
                                  id="aadhaarDoc"
                                  type="file"
                                  accept="image/*,.pdf"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="panDoc">PAN Card</Label>
                                <Input
                                  id="panDoc"
                                  type="file"
                                  accept="image/*,.pdf"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="photoDoc">Photograph</Label>
                                <Input
                                  id="photoDoc"
                                  type="file"
                                  accept="image/*"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="proposalDoc">Signed Proposal Form</Label>
                                <Input
                                  id="proposalDoc"
                                  type="file"
                                  accept="image/*,.pdf"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmittingCustomer}>
                            {isSubmittingCustomer ? "Adding Customer..." : "Add Customer"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Customer Table with Pagination */}
            <PaginatedTable
              title="All Customers"
              description={`Showing ${filteredCustomers.length} of ${customers.length} customers`}
              data={filteredCustomers}
              itemsPerPage={10}
              isLoading={isCustomersLoading}
              columns={[
                {
                  key: "name",
                  label: "Name",
                  render: (value) => <span className="font-medium">{value}</span>,
                },
                {
                  key: "email",
                  label: "Email",
                },
                {
                  key: "phone",
                  label: "Phone",
                },
                {
                  key: "status",
                  label: "Status",
                  render: (value) => (
                    <Badge
                      variant="outline"
                      className={
                        value === "Active"
                          ? "border-green-500 text-green-700 bg-green-50"
                          : value === "Inactive"
                          ? "border-gray-500 text-gray-700 bg-gray-50"
                          : "border-red-500 text-red-700 bg-red-50"
                      }
                    >
                      {value}
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
                      {value}
                    </Badge>
                  ),
                },
              ]}
            />

            {/* Old Table - Commented Out */}
            {false && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>
                  Showing {filteredCustomers.length} of {customers.length} customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Customer</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Policy ID(s)</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Phone</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Email</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Aadhaar/PAN</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Policy Type</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Premium</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Next Due</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Last Payment</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Agent/Officer</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleViewCustomer(customer)}>
                          <td className="p-2">
                            <div className="flex items-center">
                              <img
                                src={customer.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(customer.name || "CU")}
                                alt={customer.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              <span className="font-medium">{customer.name}</span>
                            </div>
                          </td>
                          <td className="p-2 text-sm">{customer.policyIds.join(", ")}</td>
                          <td className="p-2 text-sm">{customer.phone}</td>
                          <td className="p-2 text-sm">{customer.email}</td>
                          <td className="p-2 text-sm">
                            <div>
                              <div>{customer.aadhaar}</div>
                              <div className="text-gray-500">{customer.pan}</div>
                            </div>
                          </td>
                          <td className="p-2 text-sm">{customer.policyType}</td>
                          <td className="p-2">
                            <Badge className={
                              customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                              customer.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {customer.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm font-medium">{customer.premiumAmount}</td>
                          <td className="p-2 text-sm">{customer.nextDueDate}</td>
                          <td className="p-2 text-sm">{customer.lastPayment}</td>
                          <td className="p-2 text-sm">{customer.agentName}</td>
                          <td className="p-2">
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button variant="outline" size="sm" onClick={() => handleViewCustomer(customer)}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Button>
                              <Button variant="outline" size="sm">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Loans & Banking Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>💰 Loans & Banking Services</CardTitle>
                <CardDescription>Manage customer loans and banking products</CardDescription>
              </CardHeader>
              <CardContent>
                <LoansBankingSection />
              </CardContent>
            </Card>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChart data={customerStatusData} title="Customer Status" />
              <Card className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Customer Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Send Premium Reminders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Bulk Policy Renewal
                  </Button>
                </div>
              </Card>
            </div>
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

      {/* View Customer Dialog */}
      <Dialog open={isViewCustomerDialogOpen} onOpenChange={setIsViewCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              Complete customer information and policy details
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Overview */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={selectedCustomer.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedCustomer.name || "CU")}
                    alt={selectedCustomer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.address}</p>
                </div>
                <div className="text-right">
                  <Badge className={
                    selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-800' :
                    selectedCustomer.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {selectedCustomer.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">Customer ID: {selectedCustomer.id}</p>
                </div>
              </div>

              {/* Policies Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Policies ({selectedCustomer.policies?.length || 0})</h3>
                <div className="space-y-3">
                  {selectedCustomer.policies?.map((policy: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">Policy Number</Label>
                            <p className="font-medium">{policy.policyNumber}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Type</Label>
                            <p className="font-medium">{policy.policyType}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Sum Assured</Label>
                            <p className="font-medium">{policy.sumAssured}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Premium</Label>
                            <p className="font-medium">{policy.premiumAmount} ({policy.premiumFrequency})</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Start Date</Label>
                            <p className="font-medium">{policy.startDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Maturity Date</Label>
                            <p className="font-medium">{policy.maturityDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Status</Label>
                            <Badge className={
                              policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                              policy.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {policy.status}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Nominee</Label>
                            <p className="font-medium">{policy.nominee} ({policy.nomineeRelation})</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 text-sm font-medium text-gray-700">Date</th>
                            <th className="text-left p-2 text-sm font-medium text-gray-700">Amount</th>
                            <th className="text-left p-2 text-sm font-medium text-gray-700">Mode</th>
                            <th className="text-left p-2 text-sm font-medium text-gray-700">Policy</th>
                            <th className="text-left p-2 text-sm font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCustomer.paymentHistory?.map((payment: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 text-sm">{payment.date}</td>
                              <td className="p-2 text-sm font-medium">{payment.amount}</td>
                              <td className="p-2 text-sm">{payment.mode}</td>
                              <td className="p-2 text-sm">{payment.policyNumber}</td>
                              <td className="p-2 text-sm">
                                <Badge className="bg-green-100 text-green-800">{payment.status}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Claims Section */}
              {selectedCustomer.claims && selectedCustomer.claims.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Claims ({selectedCustomer.claims.length})</h3>
                  <div className="space-y-3">
                    {selectedCustomer.claims.map((claim: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{claim.claimId}</p>
                              <p className="text-sm text-gray-600">{claim.claimType} - {claim.amount}</p>
                              <p className="text-sm text-gray-500">Filed: {claim.dateFiled}</p>
                            </div>
                            <Badge className={
                              claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {claim.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Report
                </Button>
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Policy
                </Button>
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add Payment
                </Button>
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Add Claim
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewCustomerDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    }>
      <CustomersPageContent />
    </Suspense>
  );
}
