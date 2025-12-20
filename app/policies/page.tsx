"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, X } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { BreadcrumbNav } from "@/components/features/breadcrumb-nav";
import CertificateGenerator from "@/components/certificate/certificate-generator";
import { PaginatedTable } from "@/components/features/paginated-table";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";

function PoliciesPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [selectedPolicyForCertificate, setSelectedPolicyForCertificate] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [policies, setPolicies] = useState<any[]>([]);
  const [isPoliciesLoading, setIsPoliciesLoading] = useState(true);
  const [policiesError, setPoliciesError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterPremiumRange, setFilterPremiumRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    policyId: "",
    type: "",
    customerName: "",
    premium: "",
    sumAssured: "",
    status: "active",
    startDate: "",
    endDate: "",
    nextPremium: "",
    category: "",
    customerImage: "",
    // Customer Information
    customerEmail: "",
    customerPhone: "",
    customerAadhaar: "",
    customerPAN: "",
    customerAddress: "",
    customerDOB: "",
    customerOccupation: "",
    // Nominee Information
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    nomineeAge: "",
    // Policy Details
    premiumFrequency: "Yearly",
    policyTerm: "",
    paymentMode: "",
    medicalRequired: "No",
    existingPolicies: "0",
    // Agent/Branch Information
    agentCode: "",
    branchCode: ""
  });
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Premium Due", message: "Your policy premium is due on Dec 15, 2024", read: false, time: "2 hours ago" },
    { id: 2, title: "Policy Renewed", message: "Your policy #LIC-123456789 has been renewed", read: false, time: "1 day ago" },
    { id: 3, title: "Document Uploaded", message: "KYC documents have been successfully uploaded", read: true, time: "3 days ago" },
    { id: 4, title: "Claim Update", message: "Your claim #CLM-987654 has been processed", read: true, time: "1 week ago" }
  ]);

  // Helper to format dates for display
  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    // Get email from localStorage instead of URL params for security
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        const userEmail = userData.email || "";
        setEmail(userEmail);

        // Fetch policies for this user from MongoDB
        const fetchPolicies = async () => {
          try {
            setIsPoliciesLoading(true);
            setPoliciesError(null);
            // Fetch all policies from MongoDB (no email filter)
            const res = await fetch(`/api/policies`);
            const data = await res.json();

            if (!res.ok) {
              setPolicies([]);
              setPoliciesError(data.error || "Failed to load policies");
              return;
            }

            const policiesFromDb = (data.policies || []).map((p: any) => ({
              id: p.policyId,
              type: p.type,
              customerName: p.customerName,
              customerEmail: p.customerEmail,
              premium: p.premium,
              sumAssured: p.sumAssured,
              status: p.status,
              startDate: formatDate(p.startDate),
              endDate: formatDate(p.endDate),
              nextPremium: formatDate(p.nextPremium),
              category: p.category,
              customerImage: p.customerImage || "",
            }));

            setPolicies(policiesFromDb);
          } catch (err) {
            console.error("Error fetching policies:", err);
            setPolicies([]);
            setPoliciesError("Network error while loading policies");
          } finally {
            setIsPoliciesLoading(false);
          }
        };

        fetchPolicies();
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsPoliciesLoading(false);
      }
    } else {
      setIsPoliciesLoading(false);
    }
  }, []);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Simulate API upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock URL (in real app, this would come from server)
      const imageUrl = URL.createObjectURL(file);
      
      // Update form with the new image URL
      setFormData(prev => ({
        ...prev,
        customerImage: imageUrl
      }));

      setUploadProgress(100);
      
      // Clear the input
      e.target.value = '';

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.policyId ||
      !formData.type ||
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.premium ||
      !formData.sumAssured ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.nextPremium ||
      !formData.category
    ) {
      alert("Please fill all required fields, including customer email");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const policyData = {
        policyId: formData.policyId,
        type: formData.type,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        premium: formData.premium,
        sumAssured: formData.sumAssured,
        status: "active",
        startDate: formData.startDate,
        endDate: formData.endDate,
        nextPremium: formData.nextPremium,
        category: formData.category,
        customerImage: formData.customerImage || "https://randomuser.me/api/portraits/lego/0.jpg"
      };

      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policyData),
      });

      const data = await response.json();

      if (response.ok) {
        // Convert date strings to Date objects for local state
        const newPolicy = {
          id: data.policy.policyId,
          type: data.policy.type,
          customerName: data.policy.customerName,
          customerEmail: data.policy.customerEmail,
          premium: data.policy.premium,
          sumAssured: data.policy.sumAssured,
          status: data.policy.status,
          startDate: formatDate(data.policy.startDate),
          endDate: formatDate(data.policy.endDate),
          nextPremium: formatDate(data.policy.nextPremium),
          category: data.policy.category,
          customerImage: data.policy.customerImage,
        };

        setPolicies(prev => [newPolicy, ...prev]);
        setIsAddDialogOpen(false);
        
        // Reset form
        setFormData({
          policyId: "",
          type: "",
          customerName: "",
          premium: "",
          sumAssured: "",
          status: "active",
          startDate: "",
          endDate: "",
          nextPremium: "",
          category: "",
          customerImage: "",
          // Customer Information
          customerEmail: "",
          customerPhone: "",
          customerAadhaar: "",
          customerPAN: "",
          customerAddress: "",
          customerDOB: "",
          customerOccupation: "",
          // Nominee Information
          nomineeName: "",
          nomineeRelation: "",
          nomineePhone: "",
          nomineeAge: "",
          // Policy Details
          premiumFrequency: "Yearly",
          policyTerm: "",
          paymentMode: "",
          medicalRequired: "No",
          existingPolicies: "0",
          // Agent/Branch Information
          agentCode: "",
          branchCode: ""
        });
      } else {
        alert(data.error || 'Failed to create policy');
      }
    } catch (error) {
      console.error('Create policy error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      policyId: "",
      type: "",
      customerName: "",
      premium: "",
      sumAssured: "",
      status: "active",
      startDate: "",
      endDate: "",
      nextPremium: "",
      category: "",
      customerImage: "",
      // Customer Information
      customerEmail: "",
      customerPhone: "",
      customerAadhaar: "",
      customerPAN: "",
      customerAddress: "",
      customerDOB: "",
      customerOccupation: "",
      // Nominee Information
      nomineeName: "",
      nomineeRelation: "",
      nomineePhone: "",
      nomineeAge: "",
      // Policy Details
      premiumFrequency: "Yearly",
      policyTerm: "",
      paymentMode: "",
      medicalRequired: "No",
      existingPolicies: "0",
      // Agent/Branch Information
      agentCode: "",
      branchCode: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (policy: any) => {
    setSelectedPolicy(policy);
    setFormData({
      policyId: policy.id,
      type: policy.type,
      customerName: policy.customerName,
      customerEmail: policy.customerEmail || "",
      premium: policy.premium,
      sumAssured: policy.sumAssured,
      status: policy.status || "active",
      startDate: policy.startDate,
      endDate: policy.endDate,
      nextPremium: policy.nextPremium,
      category: policy.category,
      customerImage: policy.customerImage || "",
      // Customer Information - defaults
      customerPhone: "",
      customerAadhaar: "",
      customerPAN: "",
      customerAddress: "",
      customerDOB: "",
      customerOccupation: "",
      // Nominee Information - defaults
      nomineeName: "",
      nomineeRelation: "",
      nomineePhone: "",
      nomineeAge: "",
      // Policy Details - defaults
      premiumFrequency: "Yearly",
      policyTerm: "",
      paymentMode: "",
      medicalRequired: "No",
      existingPolicies: "0",
      // Agent/Branch Information - defaults
      agentCode: "",
      branchCode: ""
    });
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (policy: any) => {
    setSelectedPolicy(policy);
    setIsViewDialogOpen(true);
  };

  const handleGenerateCertificate = (policy: any) => {
    setSelectedPolicyForCertificate(policy);
    setIsCertificateDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.policyId ||
      !formData.type ||
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.premium ||
      !formData.sumAssured ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.nextPremium ||
      !formData.category
    ) {
      alert("Please fill all required fields, including customer email");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        policyId: formData.policyId,
        type: formData.type,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        premium: formData.premium,
        sumAssured: formData.sumAssured,
        status: selectedPolicy?.status || "active",
        startDate: formData.startDate,
        endDate: formData.endDate,
        nextPremium: formData.nextPremium,
        category: formData.category,
        customerImage: formData.customerImage,
      };

      const res = await fetch("/api/policies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update policy");
        setIsSubmitting(false);
        return;
      }

      const updated = data.policy;

      const updatedPolicy = {
        id: updated.policyId,
        type: updated.type,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        premium: updated.premium,
        sumAssured: updated.sumAssured,
        status: updated.status,
        startDate: formatDate(updated.startDate),
        endDate: formatDate(updated.endDate),
        nextPremium: formatDate(updated.nextPremium),
        category: updated.category,
        customerImage: updated.customerImage,
      };

      setPolicies(prev =>
        prev.map(policy =>
          policy.id === selectedPolicy?.id ? updatedPolicy : policy
        )
      );

      // Reset form
      setFormData({
        policyId: "",
        type: "",
        customerName: "",
        premium: "",
        sumAssured: "",
        status: "active",
        startDate: "",
        endDate: "",
        nextPremium: "",
        category: "",
        customerImage: "",
        // Customer Information
        customerEmail: "",
        customerPhone: "",
        customerAadhaar: "",
        customerPAN: "",
        customerAddress: "",
        customerDOB: "",
        customerOccupation: "",
        // Nominee Information
        nomineeName: "",
        nomineeRelation: "",
        nomineePhone: "",
        nomineeAge: "",
        // Policy Details
        premiumFrequency: "Yearly",
        policyTerm: "",
        paymentMode: "",
        medicalRequired: "No",
        existingPolicies: "0",
        // Agent/Branch Information
        agentCode: "",
        branchCode: "",
      });

      setIsEditDialogOpen(false);
      setSelectedPolicy(null);
    } catch (err) {
      console.error("Update policy error:", err);
      alert("Network error while updating policy");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setFormData({
      policyId: "",
      type: "",
      customerName: "",
      premium: "",
      sumAssured: "",
      status: "active",
      startDate: "",
      endDate: "",
      nextPremium: "",
      category: "",
      customerImage: "",
      // Customer Information
      customerEmail: "",
      customerPhone: "",
      customerAadhaar: "",
      customerPAN: "",
      customerAddress: "",
      customerDOB: "",
      customerOccupation: "",
      // Nominee Information
      nomineeName: "",
      nomineeRelation: "",
      nomineePhone: "",
      nomineeAge: "",
      // Policy Details
      premiumFrequency: "Yearly",
      policyTerm: "",
      paymentMode: "",
      medicalRequired: "No",
      existingPolicies: "0",
      // Agent/Branch Information
      agentCode: "",
      branchCode: ""
    });
    setIsEditDialogOpen(false);
    setSelectedPolicy(null);
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || policy.category === filterType;
    const matchesStatus = filterStatus === "all" || policy.status === filterStatus;
    
    // Date range filter
    let matchesDateRange = true;
    if (filterDateRange !== "all") {
      const policyStart = new Date(policy.startDate);
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      
      if (filterDateRange === "30days") matchesDateRange = policyStart >= thirtyDaysAgo;
      else if (filterDateRange === "90days") matchesDateRange = policyStart >= ninetyDaysAgo;
    }
    
    // Premium range filter
    let matchesPremium = true;
    if (filterPremiumRange !== "all") {
      const premiumNum = parseInt(policy.premium.replace(/[^\d]/g, "")) || 0;
      if (filterPremiumRange === "low") matchesPremium = premiumNum < 50000;
      else if (filterPremiumRange === "medium") matchesPremium = premiumNum >= 50000 && premiumNum < 200000;
      else if (filterPremiumRange === "high") matchesPremium = premiumNum >= 200000;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDateRange && matchesPremium;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "life": return "bg-blue-100 text-blue-800";
      case "health": return "bg-green-100 text-green-800";
      case "vehicle": return "bg-orange-100 text-orange-800";
      case "property": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="policies"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Policies Content */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'md:mr-80' : ''}`}>
          <div className="p-4 sm:p-6">
            {/* Breadcrumbs */}
            <BreadcrumbNav />
            
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Insurance Policies</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage and track all insurance policies</p>
            </div>

            {/* Filters and Search */}
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="w-full">
                    <Input
                      placeholder="Search by policy ID, customer name, or type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="life">Life Insurance</SelectItem>
                        <SelectItem value="health">Health Insurance</SelectItem>
                        <SelectItem value="vehicle">Vehicle Insurance</SelectItem>
                        <SelectItem value="property">Property Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterPremiumRange} onValueChange={setFilterPremiumRange}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by premium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Premiums</SelectItem>
                        <SelectItem value="low">Low (&lt;₹50K)</SelectItem>
                        <SelectItem value="medium">Medium (₹50K-₹2L)</SelectItem>
                        <SelectItem value="high">High (&gt;₹2L)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterType("all");
                        setFilterStatus("all");
                        setFilterDateRange("all");
                        setFilterPremiumRange("all");
                        setCurrentPage(1);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Policy
                        </Button>
                      </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Policy</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new insurance policy. All fields are required.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          {/* Customer Image Section */}
                          <div className="space-y-2">
                            <Label htmlFor="addCustomerImage">Customer Profile Image</Label>
                            <div className="flex items-start space-x-4">
                              <div className="relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                  <img
                                    src={formData.customerImage || "https://randomuser.me/api/portraits/lego/0.jpg"}
                                    alt="Customer Profile"
                                    className="w-full h-full object-cover"
                                  />
                                  {isUploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                  )}
                                </div>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                  <div className="absolute -bottom-2 left-0 right-0">
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                      <div 
                                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="space-y-2">
                                  <div>
                                    <input
                                      id="addCustomerImage"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      disabled={isUploading}
                                      className="hidden"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => document.getElementById('addCustomerImage')?.click()}
                                      disabled={isUploading}
                                      className="w-full"
                                    >
                                      {isUploading ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                          Uploading... {uploadProgress}%
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                          </svg>
                                          Upload Image
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Upload a customer profile image (Max: 5MB, JPG/PNG)
                                  </p>
                                  {formData.customerImage && (
                                    <div className="flex items-center space-x-2">
                                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span className="text-xs text-green-600">Image uploaded successfully</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="policyId">Policy ID</Label>
                              <Input
                                id="policyId"
                                placeholder="e.g., LIC-123456789"
                                value={formData.policyId}
                                onChange={(e) => handleInputChange("policyId", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="customerName">Customer Name</Label>
                              <Input
                                id="customerName"
                                placeholder="e.g., John Doe"
                                value={formData.customerName}
                                onChange={(e) => handleInputChange("customerName", e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="customerEmail">Customer Email</Label>
                            <Input
                              id="customerEmail"
                              type="email"
                              placeholder="e.g., customer@example.com"
                              value={formData.customerEmail}
                              onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="type">Policy Type</Label>
                              <Input
                                id="type"
                                placeholder="e.g., Term Life Insurance"
                                value={formData.type}
                                onChange={(e) => handleInputChange("type", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="category">Category</Label>
                              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="life">Life Insurance</SelectItem>
                                  <SelectItem value="health">Health Insurance</SelectItem>
                                  <SelectItem value="vehicle">Vehicle Insurance</SelectItem>
                                  <SelectItem value="property">Property Insurance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="premium">Annual Premium</Label>
                              <Input
                                id="premium"
                                placeholder="e.g., ₹25,000"
                                value={formData.premium}
                                onChange={(e) => handleInputChange("premium", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sumAssured">Sum Assured</Label>
                              <Input
                                id="sumAssured"
                                placeholder="e.g., ₹50,00,000"
                                value={formData.sumAssured}
                                onChange={(e) => handleInputChange("sumAssured", e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="startDate">Start Date</Label>
                              <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange("startDate", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate">End Date</Label>
                              <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange("endDate", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nextPremium">Next Premium</Label>
                              <Input
                                id="nextPremium"
                                type="date"
                                value={formData.nextPremium}
                                onChange={(e) => handleInputChange("nextPremium", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Adding...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Policy
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Policy Dialog */}
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Edit Policy</DialogTitle>
                        <DialogDescription>
                          Update the policy information. All fields are required.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-4">
                          {/* Customer Image Section */}
                          <div className="space-y-2">
                            <Label htmlFor="editCustomerImage">Customer Profile Image</Label>
                            <div className="flex items-start space-x-4">
                              <div className="relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                  <img
                                    src={formData.customerImage || "https://randomuser.me/api/portraits/lego/0.jpg"}
                                    alt="Customer Profile"
                                    className="w-full h-full object-cover"
                                  />
                                  {isUploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                  )}
                                </div>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                  <div className="absolute -bottom-2 left-0 right-0">
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                      <div 
                                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="space-y-2">
                                  <div>
                                    <input
                                      id="editCustomerImage"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      disabled={isUploading}
                                      className="hidden"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => document.getElementById('editCustomerImage')?.click()}
                                      disabled={isUploading}
                                      className="w-full"
                                    >
                                      {isUploading ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                          Uploading... {uploadProgress}%
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                          </svg>
                                          Upload Image
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Upload a customer profile image (Max: 5MB, JPG/PNG)
                                  </p>
                                  {formData.customerImage && (
                                    <div className="flex items-center space-x-2">
                                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span className="text-xs text-green-600">Image uploaded successfully</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="editPolicyId">Policy ID</Label>
                              <Input
                                id="editPolicyId"
                                placeholder="e.g., LIC-123456789"
                                value={formData.policyId}
                                onChange={(e) => handleInputChange("policyId", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="editCustomerName">Customer Name</Label>
                              <Input
                                id="editCustomerName"
                                placeholder="e.g., John Doe"
                                value={formData.customerName}
                                onChange={(e) => handleInputChange("customerName", e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="editCustomerEmail">Customer Email</Label>
                            <Input
                              id="editCustomerEmail"
                              type="email"
                              placeholder="e.g., customer@example.com"
                              value={formData.customerEmail}
                              onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="editType">Policy Type</Label>
                              <Input
                                id="editType"
                                placeholder="e.g., Term Life Insurance"
                                value={formData.type}
                                onChange={(e) => handleInputChange("type", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="editCategory">Category</Label>
                              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="life">Life Insurance</SelectItem>
                                  <SelectItem value="health">Health Insurance</SelectItem>
                                  <SelectItem value="vehicle">Vehicle Insurance</SelectItem>
                                  <SelectItem value="property">Property Insurance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="editPremium">Annual Premium</Label>
                              <Input
                                id="editPremium"
                                placeholder="e.g., ₹25,000"
                                value={formData.premium}
                                onChange={(e) => handleInputChange("premium", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="editSumAssured">Sum Assured</Label>
                              <Input
                                id="editSumAssured"
                                placeholder="e.g., ₹50,00,000"
                                value={formData.sumAssured}
                                onChange={(e) => handleInputChange("sumAssured", e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="editStartDate">Start Date</Label>
                              <Input
                                id="editStartDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange("startDate", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="editEndDate">End Date</Label>
                              <Input
                                id="editEndDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange("endDate", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="editNextPremium">Next Premium</Label>
                              <Input
                                id="editNextPremium"
                                type="date"
                                value={formData.nextPremium}
                                onChange={(e) => handleInputChange("nextPremium", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={handleEditCancel}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Update Policy
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* View Details Dialog */}
                  <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Policy Details</DialogTitle>
                        <DialogDescription>
                          Complete information about the insurance policy.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedPolicy && (
                        <div className="space-y-4">
                          {/* Customer Profile Image */}
                          <div className="flex flex-col items-center space-y-3 pb-4 border-b">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                              <img
                                src={selectedPolicy.customerImage || "https://randomuser.me/api/portraits/lego/0.jpg"}
                                alt="Customer Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-center">
                              <h3 className="text-lg font-semibold text-gray-900">{selectedPolicy.customerName}</h3>
                              <Badge className={getCategoryColor(selectedPolicy.category)}>
                                {selectedPolicy.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Policy ID</Label>
                              <p className="text-sm font-semibold">{selectedPolicy.id}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Status</Label>
                              <Badge className={getStatusColor(selectedPolicy.status)}>
                                {selectedPolicy.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Customer Name</Label>
                              <p className="text-sm font-semibold">{selectedPolicy.customerName}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Policy Type</Label>
                              <p className="text-sm font-semibold">{selectedPolicy.type}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Annual Premium</Label>
                              <p className="text-sm font-semibold text-green-600">{selectedPolicy.premium}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Sum Assured</Label>
                              <p className="text-sm font-semibold">{selectedPolicy.sumAssured}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                              <p className="text-sm">{selectedPolicy.startDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">End Date</Label>
                              <p className="text-sm">{selectedPolicy.endDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Next Premium</Label>
                              <p className="text-sm font-medium text-blue-600">{selectedPolicy.nextPremium}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-600">Category</Label>
                            <Badge className={getCategoryColor(selectedPolicy.category)}>
                              {selectedPolicy.category}
                            </Badge>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                          Close
                        </Button>
                        <Button onClick={() => {
                          setIsViewDialogOpen(false);
                          handleEdit(selectedPolicy);
                        }}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Policy
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policies Table with Pagination */}
            {isPoliciesLoading ? (
              <DashboardSkeleton />
            ) : policiesError ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-red-600">{policiesError}</p>
                </CardContent>
              </Card>
            ) : (
              <PaginatedTable
                title="All Policies"
                description={`Showing ${filteredPolicies.length} policies`}
                data={filteredPolicies}
                itemsPerPage={10}
                isLoading={isPoliciesLoading}
                columns={[
                  {
                    key: "id",
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
                            : value === "expired"
                            ? "border-red-500 text-red-700 bg-red-50"
                            : "border-yellow-500 text-yellow-700 bg-yellow-50"
                        }
                      >
                        {value}
                      </Badge>
                    ),
                  },
                  {
                    key: "category",
                    label: "Category",
                    render: (value) => <Badge variant="secondary">{value}</Badge>,
                  },
                ]}
              />
            )}

            {/* Old Grid Display - Commented Out */}
            {false && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPolicies.map((policy) => (
                  <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{policy.type}</CardTitle>
                        <CardDescription>{policy.id}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getCategoryColor(policy.category)}>
                          {policy.category}
                        </Badge>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customer</span>
                        <span className="font-medium">{policy.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Premium</span>
                        <span className="font-medium text-green-600">{policy.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sum Assured</span>
                        <span className="font-medium">{policy.sumAssured}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Start Date</span>
                        <span className="text-sm">{policy.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">End Date</span>
                        <span className="text-sm">{policy.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Next Premium</span>
                        <span className="text-sm font-medium text-blue-600">{policy.nextPremium}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewDetails(policy)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEdit(policy)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleGenerateCertificate(policy)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Certificate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}

            {!isPoliciesLoading && !policiesError && filteredPolicies.length === 0 && (
              <Card className="mt-6">
                <CardContent className="p-8 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters, or add a new policy.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Shared Profile Sidebar */}
        <ProfileSidebar
          email={email}
          show={showProfileSidebar}
          onClose={() => setShowProfileSidebar(false)}
        />
      </div>

      {/* Certificate Generator Dialog */}
      {selectedPolicyForCertificate && (
        <CertificateGenerator
          policyData={{
            policyId: selectedPolicyForCertificate.id,
            customerName: selectedPolicyForCertificate.customerName,
            policyType: selectedPolicyForCertificate.type,
            sumAssured: selectedPolicyForCertificate.sumAssured,
            premium: selectedPolicyForCertificate.premium,
            expiryDate: selectedPolicyForCertificate.endDate
          }}
          isOpen={isCertificateDialogOpen}
          onClose={() => {
            setIsCertificateDialogOpen(false);
            setSelectedPolicyForCertificate(null);
          }}
        />
      )}
    </div>
  );
}

export default function PoliciesPage() {
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
          <p className="text-gray-600">Loading policies...</p>
        </div>
      </div>
    }>
      <PoliciesPageContent />
    </Suspense>
  );
}
