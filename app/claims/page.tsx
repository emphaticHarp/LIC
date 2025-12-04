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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { PieChart } from "@/components/ui/pie-chart";
import { ClaimsManagementComponent } from "@/components/features/claims-management";
import { PaginatedTable } from "@/components/features/paginated-table";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";

function ClaimsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterAmountRange, setFilterAmountRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isClaimsLoading, setIsClaimsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [selectedClaimForDocuments, setSelectedClaimForDocuments] = useState<any>(null);
  const [claimDocuments, setClaimDocuments] = useState<{[key: string]: any[]}>({});
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("claims");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerFilterStatus, setCustomerFilterStatus] = useState("all");
  const [customerFilterType, setCustomerFilterType] = useState("all");
  const [customerFilterPremium, setCustomerFilterPremium] = useState("all");
  const [customerFilterOfficer, setCustomerFilterOfficer] = useState("all");
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isViewCustomerDialogOpen, setIsViewCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isSubmittingCustomer, setIsSubmittingCustomer] = useState(false);
  const [formData, setFormData] = useState({
    claimId: "",
    policyId: "",
    claimantName: "",
    claimType: "",
    amount: "",
    description: "",
    dateOfIncident: "",
    status: "pending",
    priority: "medium",
    documents: [] as string[]
  });
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Claim Approved", message: "Your claim #CLM-123456 has been approved", read: false, time: "2 hours ago" },
    { id: 2, title: "Document Required", message: "Additional documents needed for claim #CLM-789012", read: false, time: "1 day ago" },
    { id: 3, title: "Claim Processed", message: "Claim #CLM-345678 has been processed successfully", read: true, time: "3 days ago" },
    { id: 4, title: "Payment Released", message: "Payment for claim #CLM-901234 has been released", read: true, time: "1 week ago" }
  ]);

  const [claims, setClaims] = useState([
    {
      id: "CLM-123456",
      policyId: "LIC-123456789",
      claimantName: "Rajesh Kumar",
      claimType: "Life Insurance",
      amount: "₹50,00,000",
      status: "approved",
      priority: "high",
      dateOfIncident: "15 Nov 2024",
      dateFiled: "16 Nov 2024",
      description: "Claim for life insurance policy following natural death",
      documents: ["death_certificate.pdf", "policy_document.pdf", "id_proof.pdf"],
      approvedAmount: "₹50,00,000",
      approvedDate: "25 Nov 2024",
      claimantImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: "CLM-789012",
      policyId: "LIC-234567890",
      claimantName: "Priya Sharma",
      claimType: "Health Insurance",
      amount: "₹3,50,000",
      status: "pending",
      priority: "medium",
      dateOfIncident: "20 Nov 2024",
      dateFiled: "22 Nov 2024",
      description: "Hospitalization claim for surgical procedure",
      documents: ["medical_report.pdf", "hospital_bills.pdf"],
      claimantImage: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: "CLM-345678",
      policyId: "LIC-345678901",
      claimantName: "Amit Patel",
      claimType: "Vehicle Insurance",
      amount: "₹2,00,000",
      status: "rejected",
      priority: "low",
      dateOfIncident: "10 Nov 2024",
      dateFiled: "12 Nov 2024",
      description: "Vehicle damage claim following accident",
      documents: ["accident_report.pdf", "repair_estimate.pdf"],
      rejectionReason: "Policy coverage expired at time of incident",
      claimantImage: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
      id: "CLM-901234",
      policyId: "LIC-456789012",
      claimantName: "Sunita Reddy",
      claimType: "Home Insurance",
      amount: "₹8,00,000",
      status: "processing",
      priority: "high",
      dateOfIncident: "18 Nov 2024",
      dateFiled: "19 Nov 2024",
      description: "Home damage claim following natural disaster",
      documents: ["damage_assessment.pdf", "photos.zip", "police_report.pdf"],
      claimantImage: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      id: "CLM-567890",
      policyId: "LIC-567890123",
      claimantName: "Vikram Singh",
      claimType: "Life Insurance",
      amount: "₹75,00,000",
      status: "pending",
      priority: "high",
      dateOfIncident: "25 Nov 2024",
      dateFiled: "26 Nov 2024",
      description: "Critical illness claim under life insurance policy",
      documents: ["medical_certificate.pdf", "doctor_report.pdf"],
      claimantImage: "https://randomuser.me/api/portraits/men/29.jpg"
    }
  ]);

  const [customers] = useState([
    {
      id: "CUST-001",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya.sharma@email.com",
      address: "123, MG Road, Bangalore, Karnataka - 560001",
      dateOfBirth: "15 Mar 1985",
      aadhaar: "2345-6789-0123",
      pan: "ABCPN1234E",
      policyIds: ["LIC-123456789", "LIC-123456790"],
      policyType: "Life Insurance",
      status: "Active",
      premiumAmount: "₹25,000",
      nextDueDate: "15 Dec 2024",
      lastPayment: "15 Nov 2024",
      agentName: "Rajesh Kumar",
      agentId: "AGT-001",
      branch: "Bangalore Main",
      dateOfJoining: "15 Jan 2023",
      totalPolicies: 2,
      activePolicies: 2,
      lapsedPolicies: 0,
      totalPremium: "₹50,000",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      policies: [
        {
          policyNumber: "LIC-123456789",
          policyType: "Endowment",
          sumAssured: "₹10,00,000",
          premiumAmount: "₹25,000",
          premiumFrequency: "Yearly",
          startDate: "15 Jan 2023",
          maturityDate: "15 Jan 2043",
          status: "Active",
          nominee: "Rahul Sharma",
          nomineeRelation: "Husband",
          nomineeContact: "+91 98765 43211"
        },
        {
          policyNumber: "LIC-123456790",
          policyType: "Term",
          sumAssured: "₹50,00,000",
          premiumAmount: "₹15,000",
          premiumFrequency: "Yearly",
          startDate: "01 Mar 2023",
          maturityDate: "01 Mar 2043",
          status: "Active",
          nominee: "Rahul Sharma",
          nomineeRelation: "Husband",
          nomineeContact: "+91 98765 43211"
        }
      ],
      paymentHistory: [
        {
          date: "15 Nov 2024",
          amount: "₹25,000",
          mode: "Net Banking",
          policyNumber: "LIC-123456789",
          status: "Paid"
        },
        {
          date: "01 Oct 2024",
          amount: "₹15,000",
          mode: "UPI",
          policyNumber: "LIC-123456790",
          status: "Paid"
        }
      ],
      claims: [
        {
          claimId: "CLM-123456",
          policyNumber: "LIC-123456789",
          claimType: "Life Insurance",
          amount: "₹10,00,000",
          status: "Pending",
          dateFiled: "20 Nov 2024",
          documents: ["claim_form.pdf", "medical_report.pdf"]
        }
      ]
    },
    {
      id: "CUST-002",
      name: "Rajesh Kumar",
      phone: "+91 87654 32109",
      email: "rajesh.kumar@email.com",
      address: "456, Brigade Road, Bangalore, Karnataka - 560025",
      dateOfBirth: "22 Jun 1978",
      aadhaar: "3456-7890-1234",
      pan: "DEFRJ5678E",
      policyIds: ["LIC-234567890"],
      policyType: "Health Insurance",
      status: "Active",
      premiumAmount: "₹18,000",
      nextDueDate: "01 Jan 2025",
      lastPayment: "01 Dec 2024",
      agentName: "Anjali Mehta",
      agentId: "AGT-002",
      branch: "Bangalore Koramangala",
      dateOfJoining: "20 Feb 2023",
      totalPolicies: 1,
      activePolicies: 1,
      lapsedPolicies: 0,
      totalPremium: "₹18,000",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      policies: [
        {
          policyNumber: "LIC-234567890",
          policyType: "Health",
          sumAssured: "₹5,00,000",
          premiumAmount: "₹18,000",
          premiumFrequency: "Yearly",
          startDate: "20 Feb 2023",
          maturityDate: "20 Feb 2033",
          status: "Active",
          nominee: "Priya Kumar",
          nomineeRelation: "Wife",
          nomineeContact: "+91 87654 32110"
        }
      ],
      paymentHistory: [
        {
          date: "01 Dec 2024",
          amount: "₹18,000",
          mode: "Card",
          policyNumber: "LIC-234567890",
          status: "Paid"
        }
      ],
      claims: []
    },
    {
      id: "CUST-003",
      name: "Anjali Mehta",
      phone: "+91 76543 21098",
      email: "anjali.mehta@email.com",
      address: "789, Indiranagar, Bangalore, Karnataka - 560038",
      dateOfBirth: "10 Sep 1982",
      aadhaar: "4567-8901-2345",
      pan: "GHIAM9012E",
      policyIds: ["LIC-345678901"],
      policyType: "Vehicle Insurance",
      status: "Lapsed",
      premiumAmount: "₹12,000",
      nextDueDate: "15 Dec 2024",
      lastPayment: "15 Jun 2024",
      agentName: "Vikram Singh",
      agentId: "AGT-003",
      branch: "Bangalore Whitefield",
      dateOfJoining: "10 Mar 2023",
      totalPolicies: 1,
      activePolicies: 0,
      lapsedPolicies: 1,
      totalPremium: "₹12,000",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      policies: [
        {
          policyNumber: "LIC-345678901",
          policyType: "Vehicle",
          sumAssured: "₹8,00,000",
          premiumAmount: "₹12,000",
          premiumFrequency: "Yearly",
          startDate: "10 Mar 2023",
          maturityDate: "10 Mar 2033",
          status: "Lapsed",
          nominee: "Rohit Mehta",
          nomineeRelation: "Husband",
          nomineeContact: "+91 76543 21099"
        }
      ],
      paymentHistory: [
        {
          date: "15 Jun 2024",
          amount: "₹12,000",
          mode: "Cash",
          policyNumber: "LIC-345678901",
          status: "Paid"
        }
      ],
      claims: [
        {
          claimId: "CLM-789012",
          policyNumber: "LIC-345678901",
          claimType: "Vehicle Insurance",
          amount: "₹3,00,000",
          status: "Approved",
          dateFiled: "18 Nov 2024",
          documents: ["accident_report.pdf", "photos.zip"]
        }
      ]
    },
    {
      id: "CUST-004",
      name: "Amit Patel",
      phone: "+91 65432 10987",
      email: "amit.patel@email.com",
      address: "321, Jayanagar, Bangalore, Karnataka - 560041",
      dateOfBirth: "05 Dec 1975",
      aadhaar: "5678-9012-3456",
      pan: "JKLAP3456E",
      policyIds: ["LIC-456789012"],
      policyType: "Home Insurance",
      status: "Active",
      premiumAmount: "₹22,000",
      nextDueDate: "20 Dec 2024",
      lastPayment: "20 Nov 2024",
      agentName: "Sneha Reddy",
      agentId: "AGT-004",
      branch: "Bangalore Jayanagar",
      dateOfJoining: "05 Apr 2023",
      totalPolicies: 1,
      activePolicies: 1,
      lapsedPolicies: 0,
      totalPremium: "₹22,000",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      policies: [
        {
          policyNumber: "LIC-456789012",
          policyType: "Home",
          sumAssured: "₹15,00,000",
          premiumAmount: "₹22,000",
          premiumFrequency: "Yearly",
          startDate: "05 Apr 2023",
          maturityDate: "05 Apr 2033",
          status: "Active",
          nominee: "Kavita Patel",
          nomineeRelation: "Wife",
          nomineeContact: "+91 65432 10988"
        }
      ],
      paymentHistory: [
        {
          date: "20 Nov 2024",
          amount: "₹22,000",
          mode: "Net Banking",
          policyNumber: "LIC-456789012",
          status: "Paid"
        }
      ],
      claims: []
    },
    {
      id: "CUST-005",
      name: "Sneha Reddy",
      phone: "+91 54321 09876",
      email: "sneha.reddy@email.com",
      address: "654, Koramangala, Bangalore, Karnataka - 560034",
      dateOfBirth: "12 May 1988",
      aadhaar: "6789-0123-4567",
      pan: "MNOSR7890E",
      policyIds: ["LIC-567890123"],
      policyType: "Life Insurance",
      status: "Matured",
      premiumAmount: "₹30,000",
      nextDueDate: "N/A",
      lastPayment: "15 Nov 2023",
      agentName: "Amit Patel",
      agentId: "AGT-005",
      branch: "Bangalore Electronic City",
      dateOfJoining: "12 May 2013",
      totalPolicies: 1,
      activePolicies: 0,
      lapsedPolicies: 0,
      totalPremium: "₹3,60,000",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      policies: [
        {
          policyNumber: "LIC-567890123",
          policyType: "Money Back",
          sumAssured: "₹20,00,000",
          premiumAmount: "₹30,000",
          premiumFrequency: "Yearly",
          startDate: "12 May 2013",
          maturityDate: "12 May 2023",
          status: "Matured",
          nominee: "Ravi Reddy",
          nomineeRelation: "Brother",
          nomineeContact: "+91 54321 09875"
        }
      ],
      paymentHistory: [
        {
          date: "15 Nov 2023",
          amount: "₹30,000",
          mode: "UPI",
          policyNumber: "LIC-567890123",
          status: "Paid"
        }
      ],
      claims: [
        {
          claimId: "CLM-345678",
          policyNumber: "LIC-567890123",
          claimType: "Life Insurance",
          amount: "₹20,00,000",
          status: "Approved",
          dateFiled: "25 Nov 2023",
          documents: ["maturity_claim.pdf", "id_proof.pdf"]
        }
      ]
    }
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.claimId || !formData.policyId || !formData.claimantName || !formData.claimType || !formData.amount || !formData.description || !formData.dateOfIncident) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newClaim = {
      id: formData.claimId,
      policyId: formData.policyId,
      claimantName: formData.claimantName,
      claimType: formData.claimType,
      amount: formData.amount,
      status: formData.status,
      priority: formData.priority,
      dateOfIncident: formData.dateOfIncident,
      dateFiled: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: formData.description,
      documents: formData.documents,
      claimantImage: "https://randomuser.me/api/portraits/lego/0.jpg"
    };

    setClaims(prev => [newClaim, ...prev]);
    
    // Reset form
    setFormData({
      claimId: "",
      policyId: "",
      claimantName: "",
      claimType: "",
      amount: "",
      description: "",
      dateOfIncident: "",
      status: "pending",
      priority: "medium",
      documents: []
    });
    
    setIsAddDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({
      claimId: "",
      policyId: "",
      claimantName: "",
      claimType: "",
      amount: "",
      description: "",
      dateOfIncident: "",
      status: "pending",
      priority: "medium",
      documents: []
    });
    setIsAddDialogOpen(false);
  };

  const handleViewDetails = (claim: any) => {
    setSelectedClaim(claim);
    setIsViewDialogOpen(true);
  };

  const handleViewDocuments = (claim: any) => {
    setSelectedClaimForDocuments(claim);
    
    // Get existing documents for this claim or initialize with default documents
    const existingDocs = claimDocuments[claim.id] || [
      {
        id: 1,
        name: "claim_form.pdf",
        type: "application/pdf",
        size: "245 KB",
        uploadDate: "2024-01-15",
        url: "#"
      },
      {
        id: 2,
        name: "id_proof.jpg",
        type: "image/jpeg",
        size: "1.2 MB",
        uploadDate: "2024-01-15",
        url: "#"
      },
      ...(claim.documents || []).map((doc: string, index: number) => ({
        id: index + 3,
        name: doc,
        type: "application/pdf",
        size: "500 KB",
        uploadDate: claim.dateFiled,
        url: "#"
      }))
    ];
    
    // Update the claim documents state if not already set
    if (!claimDocuments[claim.id]) {
      setClaimDocuments(prev => ({
        ...prev,
        [claim.id]: existingDocs
      }));
    }
    
    setIsDocumentDialogOpen(true);
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingDocument(true);

    try {
      const currentDocs = claimDocuments[selectedClaimForDocuments.id] || [];
      const maxId = Math.max(0, ...currentDocs.map(doc => doc.id));
      
      const newDocuments = Array.from(files).map((file, index) => ({
        id: maxId + index + 1,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file)
      }));

      // Update the persistent storage for this claim
      setClaimDocuments(prev => ({
        ...prev,
        [selectedClaimForDocuments.id]: [...currentDocs, ...newDocuments]
      }));
      
      // Update the claim's documents array
      if (selectedClaimForDocuments) {
        const claimIndex = claims.findIndex(c => c.id === selectedClaimForDocuments.id);
        if (claimIndex !== -1) {
          const updatedClaim = {
            ...claims[claimIndex],
            documents: [...(claims[claimIndex].documents || []), ...newDocuments.map(d => d.name)]
          };
          claims[claimIndex] = updatedClaim;
        }
      }

      // Clear the file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const handleDownloadDocument = (document: any) => {
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewOnline = (document: any) => {
    window.open(document.url, '_blank');
  };

  const handleDeleteDocument = (documentId: number) => {
    const claimId = selectedClaimForDocuments.id;
    const currentDocs = claimDocuments[claimId] || [];
    
    // Update the persistent storage
    setClaimDocuments(prev => ({
      ...prev,
      [claimId]: currentDocs.filter(doc => doc.id !== documentId)
    }));
    
    // Update the claim's documents array
    const updatedDocs = currentDocs.filter(doc => doc.id !== documentId);
    const claimIndex = claims.findIndex(c => c.id === claimId);
    if (claimIndex !== -1) {
      const updatedClaim = {
        ...claims[claimIndex],
        documents: updatedDocs.map(d => d.name)
      };
      claims[claimIndex] = updatedClaim;
    }
  };

  // Calculate pie chart data
  const pieChartData = [
    { label: "Approved", value: claims.filter(c => c.status === "approved").length, color: "#10b981" },
    { label: "Pending", value: claims.filter(c => c.status === "pending").length, color: "#f59e0b" },
    { label: "Processing", value: claims.filter(c => c.status === "processing").length, color: "#3b82f6" },
    { label: "Rejected", value: claims.filter(c => c.status === "rejected").length, color: "#ef4444" }
  ];

  const customerStatusData = [
    { label: "Active", value: customers.filter(c => c.status === "Active").length, color: "#10b981" },
    { label: "Lapsed", value: customers.filter(c => c.status === "Lapsed").length, color: "#ef4444" },
    { label: "Matured", value: customers.filter(c => c.status === "Matured").length, color: "#f59e0b" }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                         customer.phone.includes(customerSearchTerm) ||
                         customer.email.toLowerCase().includes(customerSearchTerm) ||
                         customer.policyIds.some(id => id.toLowerCase().includes(customerSearchTerm.toLowerCase()));
    
    const matchesStatus = customerFilterStatus === "all" || customer.status === customerFilterStatus;
    const matchesType = customerFilterType === "all" || customer.policyType === customerFilterType;
    
    let matchesPremium = true;
    if (customerFilterPremium !== "all") {
      const premium = parseInt(customer.premiumAmount.replace(/[₹,]/g, ''));
      switch (customerFilterPremium) {
        case "0-10000":
          matchesPremium = premium <= 10000;
          break;
        case "10000-25000":
          matchesPremium = premium > 10000 && premium <= 25000;
          break;
        case "25000-50000":
          matchesPremium = premium > 25000 && premium <= 50000;
          break;
        case "50000+":
          matchesPremium = premium > 50000;
          break;
      }
    }
    
    const matchesOfficer = customerFilterOfficer === "all" || customer.agentName === customerFilterOfficer;
    
    return matchesSearch && matchesStatus && matchesType && matchesPremium && matchesOfficer;
  });

  const handleEdit = (claim: any) => {
    setSelectedClaim(claim);
    setFormData({
      claimId: claim.id,
      policyId: claim.policyId,
      claimantName: claim.claimantName,
      claimType: claim.claimType,
      amount: claim.amount,
      description: claim.description,
      dateOfIncident: claim.dateOfIncident,
      status: claim.status,
      priority: claim.priority,
      documents: claim.documents || []
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.claimId || !formData.policyId || !formData.claimantName || !formData.claimType || !formData.amount || !formData.description || !formData.dateOfIncident) {
      alert("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedClaim = {
      id: formData.claimId,
      policyId: formData.policyId,
      claimantName: formData.claimantName,
      claimType: formData.claimType,
      amount: formData.amount,
      status: formData.status,
      priority: formData.priority,
      dateOfIncident: formData.dateOfIncident,
      dateFiled: selectedClaim?.dateFiled || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: formData.description,
      documents: formData.documents,
      claimantImage: selectedClaim?.claimantImage || "https://randomuser.me/api/portraits/lego/0.jpg"
    };

    setClaims(prev => prev.map(claim => 
      claim.id === selectedClaim?.id ? updatedClaim : claim
    ));
    
    // Reset form
    setFormData({
      claimId: "",
      policyId: "",
      claimantName: "",
      claimType: "",
      amount: "",
      description: "",
      dateOfIncident: "",
      status: "pending",
      priority: "medium",
      documents: []
    });
    
    setIsEditDialogOpen(false);
    setSelectedClaim(null);
    setIsSubmitting(false);
  };

  const handleEditCancel = () => {
    setFormData({
      claimId: "",
      policyId: "",
      claimantName: "",
      claimType: "",
      amount: "",
      description: "",
      dateOfIncident: "",
      status: "pending",
      priority: "medium",
      documents: []
    });
    setIsEditDialogOpen(false);
    setSelectedClaim(null);
  };

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || claim.status === filterStatus;
    const matchesType = filterType === "all" || claim.claimType.toLowerCase().replace(/\s+/g, '-') === filterType;
    
    // Date range filter
    let matchesDateRange = true;
    if (filterDateRange !== "all") {
      const claimDate = new Date(claim.dateFiled);
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      if (filterDateRange === "7days") matchesDateRange = claimDate >= sevenDaysAgo;
      else if (filterDateRange === "30days") matchesDateRange = claimDate >= thirtyDaysAgo;
    }
    
    // Amount range filter
    let matchesAmount = true;
    if (filterAmountRange !== "all") {
      const amountNum = parseInt(claim.amount.replace(/[^\d]/g, "")) || 0;
      if (filterAmountRange === "low") matchesAmount = amountNum < 100000;
      else if (filterAmountRange === "medium") matchesAmount = amountNum >= 100000 && amountNum < 500000;
      else if (filterAmountRange === "high") matchesAmount = amountNum >= 500000;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange && matchesAmount;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase().replace(/\s+/g, '-')) {
      case "life-insurance": return "bg-blue-100 text-blue-800";
      case "health-insurance": return "bg-green-100 text-green-800";
      case "vehicle-insurance": return "bg-orange-100 text-orange-800";
      case "home-insurance": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="claims"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Claims Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Claims</h1>
              <p className="text-gray-600">Manage and track all insurance claims</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Claims</p>
                      <p className="text-2xl font-bold">{claims.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{claims.filter(c => c.status === 'pending').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-green-600">{claims.filter(c => c.status === 'approved').length}</p>
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
                      <p className="text-sm text-gray-600">Processing</p>
                      <p className="text-2xl font-bold text-blue-600">{claims.filter(c => c.status === 'processing').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by claim ID, policy ID, claimant name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="life-insurance">Life Insurance</SelectItem>
                      <SelectItem value="health-insurance">Health Insurance</SelectItem>
                      <SelectItem value="vehicle-insurance">Vehicle Insurance</SelectItem>
                      <SelectItem value="home-insurance">Home Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterAmountRange} onValueChange={setFilterAmountRange}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Amounts</SelectItem>
                      <SelectItem value="low">Low (&lt;₹1L)</SelectItem>
                      <SelectItem value="medium">Medium (₹1L-₹5L)</SelectItem>
                      <SelectItem value="high">High (&gt;₹5L)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setFilterType("all");
                      setFilterDateRange("all");
                      setFilterAmountRange("all");
                      setCurrentPage(1);
                    }}
                    className="whitespace-nowrap"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Claim
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>File New Claim</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new insurance claim. All fields are required.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="claimId">Claim ID</Label>
                              <Input
                                id="claimId"
                                value={formData.claimId}
                                onChange={(e) => handleInputChange("claimId", e.target.value)}
                                placeholder="CLM-XXXXXX"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="policyId">Policy ID</Label>
                              <Input
                                id="policyId"
                                value={formData.policyId}
                                onChange={(e) => handleInputChange("policyId", e.target.value)}
                                placeholder="LIC-XXXXXXXXX"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="claimantName">Claimant Name</Label>
                              <Input
                                id="claimantName"
                                value={formData.claimantName}
                                onChange={(e) => handleInputChange("claimantName", e.target.value)}
                                placeholder="Enter claimant name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="claimType">Claim Type</Label>
                              <Select value={formData.claimType} onValueChange={(value) => handleInputChange("claimType", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select claim type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                                  <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                                  <SelectItem value="Vehicle Insurance">Vehicle Insurance</SelectItem>
                                  <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="amount">Claim Amount</Label>
                              <Input
                                id="amount"
                                value={formData.amount}
                                onChange={(e) => handleInputChange("amount", e.target.value)}
                                placeholder="₹0"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="dateOfIncident">Date of Incident</Label>
                              <Input
                                id="dateOfIncident"
                                type="date"
                                value={formData.dateOfIncident}
                                onChange={(e) => handleInputChange("dateOfIncident", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="priority">Priority</Label>
                              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              placeholder="Enter claim description"
                              rows={3}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Claim"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Claims Content with Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value);
            }} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="claims" className="space-y-4">
                {/* Claims Table */}
                <Card>
                  <PaginatedTable
                    title="All Claims"
                    description={`Showing ${filteredClaims.length} of ${claims.length} claims`}
                    data={filteredClaims}
                    itemsPerPage={10}
                    isLoading={isClaimsLoading}
                    columns={[
                      {
                        key: "id",
                        label: "Claim ID",
                        render: (value) => <span className="font-medium">{value}</span>,
                      },
                      {
                        key: "claimantName",
                        label: "Claimant",
                      },
                      {
                        key: "policyId",
                        label: "Policy ID",
                      },
                      {
                        key: "claimType",
                        label: "Type",
                        render: (value) => <Badge variant="outline">{value}</Badge>,
                      },
                      {
                        key: "amount",
                        label: "Amount",
                        render: (value) => <span className="font-semibold text-green-600">{value}</span>,
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
                            {value}
                          </Badge>
                        ),
                      },
                      {
                        key: "priority",
                        label: "Priority",
                        render: (value) => (
                          <Badge
                            variant="outline"
                            className={
                              value === "high"
                                ? "border-red-500 text-red-700 bg-red-50"
                                : value === "medium"
                                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                : "border-green-500 text-green-700 bg-green-50"
                            }
                          >
                            {value}
                          </Badge>
                        ),
                      },
                    ]}
                  />
                </Card>

                  {/* Old Table Display - Commented Out */}
                  {false && (
                  <Card>
                  <CardHeader>
                    <CardTitle>All Claims</CardTitle>
                    <CardDescription>
                      Showing {filteredClaims.length} of {claims.length} claims
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium text-gray-700">Claim ID</th>
                            <th className="text-left p-3 font-medium text-gray-700">Claimant</th>
                            <th className="text-left p-3 font-medium text-gray-700">Policy ID</th>
                            <th className="text-left p-3 font-medium text-gray-700">Type</th>
                            <th className="text-left p-3 font-medium text-gray-700">Amount</th>
                            <th className="text-left p-3 font-medium text-gray-700">Status</th>
                            <th className="text-left p-3 font-medium text-gray-700">Priority</th>
                            <th className="text-left p-3 font-medium text-gray-700">Date Filed</th>
                            <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClaims.map((claim) => (
                            <tr key={claim.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <img
                                      src={claim.claimantImage}
                                      alt={claim.claimantName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="font-medium">{claim.id}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div>
                                  <p className="font-medium">{claim.claimantName}</p>
                                  <p className="text-sm text-gray-500">{claim.dateOfIncident}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-gray-600">{claim.policyId}</span>
                              </td>
                              <td className="p-3">
                                <Badge className={getTypeColor(claim.claimType)}>
                                  {claim.claimType}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <span className="font-semibold">{claim.amount}</span>
                              </td>
                              <td className="p-3">
                                <Badge className={getStatusColor(claim.status)}>
                                  {claim.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge className={getPriorityColor(claim.priority)}>
                                  {claim.priority}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-gray-600">{claim.dateFiled}</span>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetails(claim)}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(claim)}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDocuments(claim)}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
              </TabsContent>
              
              <TabsContent value="customers" className="space-y-4">
                {/* Customer Dashboard Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
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
                  
                  <Card>
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
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Customers With Claims</p>
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

                {/* Customer Search and Filters */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Search Bar */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search by name, policy ID, phone number, email..."
                            value={customerSearchTerm}
                            onChange={(e) => setCustomerSearchTerm(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <Button onClick={handleAddCustomer}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Customer
                        </Button>
                      </div>
                      
                      {/* Filters */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Select value={customerFilterStatus} onValueChange={setCustomerFilterStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Policy Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Lapsed">Lapsed</SelectItem>
                            <SelectItem value="Matured">Matured</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={customerFilterType} onValueChange={setCustomerFilterType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Policy Type" />
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
                          <SelectTrigger>
                            <SelectValue placeholder="Premium Range" />
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
                          <SelectTrigger>
                            <SelectValue placeholder="Officer/Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Officers</SelectItem>
                            <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                            <SelectItem value="Anjali Mehta">Anjali Mehta</SelectItem>
                            <SelectItem value="Vikram Singh">Vikram Singh</SelectItem>
                            <SelectItem value="Sneha Reddy">Sneha Reddy</SelectItem>
                            <SelectItem value="Amit Patel">Amit Patel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
                        <CardDescription>
                          Manage customer information and policies
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3 font-medium text-gray-700">Customer Name</th>
                                <th className="text-left p-3 font-medium text-gray-700">Policy ID(s)</th>
                                <th className="text-left p-3 font-medium text-gray-700">Phone</th>
                                <th className="text-left p-3 font-medium text-gray-700">Email</th>
                                <th className="text-left p-3 font-medium text-gray-700">Aadhaar/PAN</th>
                                <th className="text-left p-3 font-medium text-gray-700">Policy Type</th>
                                <th className="text-left p-3 font-medium text-gray-700">Status</th>
                                <th className="text-left p-3 font-medium text-gray-700">Premium</th>
                                <th className="text-left p-3 font-medium text-gray-700">Next Due</th>
                                <th className="text-left p-3 font-medium text-gray-700">Last Payment</th>
                                <th className="text-left p-3 font-medium text-gray-700">Agent</th>
                                <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                  <td className="p-3">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <img
                                          src={customer.avatar}
                                          alt={customer.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <span className="font-medium">{customer.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="text-sm">
                                      {customer.policyIds.map((id, index) => (
                                        <div key={index} className="text-xs text-gray-600">{id}</div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3 text-sm">{customer.phone}</td>
                                  <td className="p-3 text-sm">{customer.email}</td>
                                  <td className="p-3 text-xs">
                                    <div>{customer.aadhaar}</div>
                                    <div>{customer.pan}</div>
                                  </td>
                                  <td className="p-3 text-sm">{customer.policyType}</td>
                                  <td className="p-3">
                                    <Badge className={
                                      customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                                      customer.status === 'Lapsed' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }>
                                      {customer.status}
                                    </Badge>
                                  </td>
                                  <td className="p-3 text-sm font-medium">{customer.premiumAmount}</td>
                                  <td className="p-3 text-sm">{customer.nextDueDate}</td>
                                  <td className="p-3 text-sm">{customer.lastPayment}</td>
                                  <td className="p-3 text-sm">{customer.agentName}</td>
                                  <td className="p-3">
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewCustomer(customer)}
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                      >
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
                  </div>
                  
                  {/* Pie Charts */}
                  <div className="space-y-6">
                    <PieChart data={pieChartData} title="Claims Status" />
                    <PieChart data={customerStatusData} title="Customer Status" />
                  </div>
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

      {/* View Claim Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
            <DialogDescription>
              Complete information about the insurance claim
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Claim ID</Label>
                  <p className="font-semibold">{selectedClaim.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Policy ID</Label>
                  <p className="font-semibold">{selectedClaim.policyId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Claimant Name</Label>
                  <p className="font-semibold">{selectedClaim.claimantName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Claim Type</Label>
                  <Badge className={getTypeColor(selectedClaim.claimType)}>
                    {selectedClaim.claimType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Claim Amount</Label>
                  <p className="font-semibold text-lg">{selectedClaim.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedClaim.status)}>
                    {selectedClaim.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Priority</Label>
                  <Badge className={getPriorityColor(selectedClaim.priority)}>
                    {selectedClaim.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date of Incident</Label>
                  <p className="font-semibold">{selectedClaim.dateOfIncident}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date Filed</Label>
                  <p className="font-semibold">{selectedClaim.dateFiled}</p>
                </div>
                {selectedClaim.approvedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Approved Date</Label>
                    <p className="font-semibold">{selectedClaim.approvedDate}</p>
                  </div>
                )}
                {selectedClaim.approvedAmount && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Approved Amount</Label>
                    <p className="font-semibold text-lg text-green-600">{selectedClaim.approvedAmount}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="mt-1 text-gray-700">{selectedClaim.description}</p>
              </div>

              {selectedClaim.documents && selectedClaim.documents.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Documents</Label>
                  <div className="mt-2 space-y-2">
                    {selectedClaim.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedClaim.rejectionReason && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Rejection Reason</Label>
                  <p className="mt-1 text-red-600">{selectedClaim.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Claim Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Claim</DialogTitle>
            <DialogDescription>
              Update the claim information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editClaimId">Claim ID</Label>
                  <Input
                    id="editClaimId"
                    value={formData.claimId}
                    onChange={(e) => handleInputChange("claimId", e.target.value)}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPolicyId">Policy ID</Label>
                  <Input
                    id="editPolicyId"
                    value={formData.policyId}
                    onChange={(e) => handleInputChange("policyId", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editClaimantName">Claimant Name</Label>
                  <Input
                    id="editClaimantName"
                    value={formData.claimantName}
                    onChange={(e) => handleInputChange("claimantName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editClaimType">Claim Type</Label>
                  <Select value={formData.claimType} onValueChange={(value) => handleInputChange("claimType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                      <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                      <SelectItem value="Vehicle Insurance">Vehicle Insurance</SelectItem>
                      <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editAmount">Claim Amount</Label>
                  <Input
                    id="editAmount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDateOfIncident">Date of Incident</Label>
                  <Input
                    id="editDateOfIncident"
                    type="date"
                    value={formData.dateOfIncident}
                    onChange={(e) => handleInputChange("dateOfIncident", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPriority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleEditCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Claim"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Management Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Documents</DialogTitle>
            <DialogDescription>
              Manage documents for claim {selectedClaimForDocuments?.id} - {selectedClaimForDocuments?.claimantName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <Label htmlFor="document-upload" className="cursor-pointer">
                  <div className="text-sm font-medium text-gray-900">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG, DOC files up to 10MB each
                  </div>
                </Label>
                <Input
                  id="document-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  disabled={isUploadingDocument}
                />
                
                {isUploadingDocument && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Documents List */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents ({claimDocuments[selectedClaimForDocuments?.id]?.length || 0})</h3>
              
              {(!claimDocuments[selectedClaimForDocuments?.id] || claimDocuments[selectedClaimForDocuments?.id].length === 0) ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {claimDocuments[selectedClaimForDocuments?.id]?.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        {/* File Icon */}
                        <div className="flex-shrink-0">
                          {doc.type.includes('pdf') ? (
                            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0,4,4V20A2,2 0 0,0,6,22H18A2,2 0 0,0,20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z" />
                            </svg>
                          ) : doc.type.includes('image') ? (
                            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0,3,5V19A2,2 0 0,0,5,21H19A2,2 0 0,0,21,19Z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,2H6A2,2 0 0,0,4,4V20A2,2 0 0,0,6,22H18A2,2 0 0,0,20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L8,15H9.5V12H14.5V15H16L13,18.5L10,19Z" />
                            </svg>
                          )}
                        </div>
                        
                        {/* File Info */}
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">
                            {doc.size} • {doc.uploadDate}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOnline(doc)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDocumentDialogOpen(false);
                setSelectedClaimForDocuments(null);
                // Don't reset claimDocuments - keep them persistent
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
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
                    src={selectedCustomer.avatar}
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

export default function ClaimsPage() {
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
          <p className="text-gray-600">Loading claims...</p>
        </div>
      </div>
    }>
      <ClaimsPageContent />
    </Suspense>
  );
}
