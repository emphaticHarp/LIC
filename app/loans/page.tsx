"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Eye, Edit2, Trash2, Send, FileText, DollarSign, Clock, User } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { BreadcrumbNav } from "@/components/features/breadcrumb-nav";
import { LAPApplicationForm } from "@/components/features/lap-application-form";
import { LAPEligibilityCalculator } from "@/components/features/lap-eligibility-calculator";
import { LAPManagement } from "@/components/features/lap-management";

interface Loan {
  _id: string;
  loanId: string;
  fullName: string;
  email: string;
  phone: string;
  loanType: string;
  loanAmount: number;
  tenure: number;
  emi: number;
  status: string;
  createdAt: string;
  annualIncome: number;
  employmentType: string;
  kycStatus?: string;
  paymentStatus?: string;
  paidAmount?: number;
  remainingAmount?: number;
}

export default function LoansPage() {
  const [email, setEmail] = useState("");
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterKYC, setFilterKYC] = useState("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showKYCDialog, setShowKYCDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [kycData, setKycData] = useState({
    status: "pending",
    verifiedBy: "",
    verificationDate: "",
    notes: "",
  });

  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
    transactionId: "",
    notes: "",
  });

  const [reminderData, setReminderData] = useState({
    reminderType: "email",
    message: "",
    dueDate: "",
  });

  const notifications = [
    { id: 1, title: "New Loan Application", message: "Rahul Verma applied for Personal Loan", read: false, time: "2 hours ago" },
    { id: 2, title: "Payment Due", message: "Priya Sharma's EMI due in 5 days", read: false, time: "1 day ago" },
  ];

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
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/loans");
      const data = await res.json();

      if (data.success) {
        setLoans(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || loan.status === filterStatus;
    const matchesKYC = filterKYC === "all" || (loan.kycStatus || "pending") === filterKYC;
    return matchesSearch && matchesStatus && matchesKYC;
  });

  const handleViewLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowViewDialog(true);
  };

  const handleKYCSubmit = async () => {
    if (!selectedLoan) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/loans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanId: selectedLoan.loanId,
          action: "updateKYC",
          data: kycData,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        setErrorMessage(result.error || "Failed to update KYC status");
        return;
      }

      setSuccessMessage("KYC status updated successfully!");
      setTimeout(() => {
        setShowKYCDialog(false);
        setSuccessMessage("");
        fetchLoans();
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to update KYC status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!selectedLoan || !paymentData.amount) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/loans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanId: selectedLoan.loanId,
          action: "recordPayment",
          data: {
            amount: parseFloat(paymentData.amount),
            paymentMethod: paymentData.paymentMethod,
            transactionId: paymentData.transactionId,
            notes: paymentData.notes,
          },
        }),
      });

      const result = await response.json();
      if (!result.success) {
        setErrorMessage(result.error || "Failed to record payment");
        return;
      }

      setSuccessMessage("Payment recorded successfully!");
      setTimeout(() => {
        setShowPaymentDialog(false);
        setSuccessMessage("");
        setPaymentData({ amount: "", paymentMethod: "bank_transfer", transactionId: "", notes: "" });
        fetchLoans();
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReminder = async () => {
    if (!selectedLoan) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/loans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanId: selectedLoan.loanId,
          action: "sendReminder",
          data: reminderData,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        setErrorMessage(result.error || "Failed to send reminder");
        return;
      }

      setSuccessMessage("Reminder sent successfully!");
      setTimeout(() => {
        setShowReminderDialog(false);
        setSuccessMessage("");
        setReminderData({ reminderType: "email", message: "", dueDate: "" });
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to send reminder");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "disbursed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getKYCColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar
        email={email}
        currentPage="loans"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={() => {}}
        isClearingNotifications={false}
        setIsClearingNotifications={() => {}}
      />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Breadcrumbs */}
            <BreadcrumbNav />
            
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Management</h1>
              <p className="text-gray-600">Manage all loan applications, KYC, and payments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Loans</p>
                      <p className="text-2xl font-bold">{loans.length}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending KYC</p>
                      <p className="text-2xl font-bold text-yellow-600">{loans.filter(l => (l.kycStatus || "pending") === "pending").length}</p>
                    </div>
                    <User className="w-8 h-8 text-yellow-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Disbursed</p>
                      <p className="text-2xl font-bold text-green-600">₹{(loans.filter(l => l.status === "disbursed").reduce((sum, l) => sum + l.loanAmount, 0) / 100000).toFixed(1)}L</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Payments</p>
                      <p className="text-2xl font-bold text-red-600">{loans.filter(l => (l.paymentStatus || "pending") === "pending").length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-red-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Input
                    placeholder="Search by name, loan ID, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="disbursed">Disbursed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterKYC} onValueChange={setFilterKYC}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by KYC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All KYC Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LAP Features Tabs */}
            <Tabs defaultValue="loans-list" className="mb-6">
              <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                <TabsTrigger value="loans-list" className="text-xs sm:text-sm py-2 px-2">All Loans</TabsTrigger>
                <TabsTrigger value="lap-application" className="text-xs sm:text-sm py-2 px-2">LAP Application</TabsTrigger>
                <TabsTrigger value="lap-eligibility" className="text-xs sm:text-sm py-2 px-2">LAP Eligibility</TabsTrigger>
                <TabsTrigger value="lap-management" className="text-xs sm:text-sm py-2 px-2">LAP Management</TabsTrigger>
              </TabsList>

              <TabsContent value="loans-list" className="space-y-4">
                {/* Loans Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Loans</CardTitle>
                    <CardDescription>Showing {filteredLoans.length} of {loans.length} loans</CardDescription>
                  </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Loan ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold">Type</th>
                        <th className="text-left py-3 px-4 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">KYC</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.map((loan) => (
                        <tr key={loan._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold">{loan.loanId}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{loan.fullName}</p>
                              <p className="text-xs text-gray-500">{loan.phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize">{loan.loanType}</td>
                          <td className="py-3 px-4 font-semibold">₹{(loan.loanAmount / 100000).toFixed(1)}L</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(loan.status)}>
                              {loan.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getKYCColor(loan.kycStatus || "pending")}>
                              {loan.kycStatus || "pending"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewLoan(loan)}
                              >
                                <Eye className="w-4 h-4" />
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
              </TabsContent>

              <TabsContent value="lap-application" className="space-y-4">
                <LAPApplicationForm />
              </TabsContent>

              <TabsContent value="lap-eligibility" className="space-y-4">
                <LAPEligibilityCalculator />
              </TabsContent>

              <TabsContent value="lap-management" className="space-y-4">
                <LAPManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {showProfileSidebar && (
          <ProfileSidebar 
            email={email}
            show={showProfileSidebar}
            onClose={() => setShowProfileSidebar(false)}
          />
        )}
      </div>

      {/* View Loan Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loan Details - {selectedLoan?.loanId}</DialogTitle>
          </DialogHeader>

          {selectedLoan && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="kyc">KYC</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="reminder">Reminder</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Full Name</Label>
                    <p className="font-semibold">{selectedLoan.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Email</Label>
                    <p className="font-semibold">{selectedLoan.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Phone</Label>
                    <p className="font-semibold">{selectedLoan.phone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Loan Type</Label>
                    <p className="font-semibold capitalize">{selectedLoan.loanType}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Loan Amount</Label>
                    <p className="font-semibold">₹{selectedLoan.loanAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Monthly EMI</Label>
                    <p className="font-semibold">₹{selectedLoan.emi.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Tenure</Label>
                    <p className="font-semibold">{selectedLoan.tenure} months</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Status</Label>
                    <Badge className={getStatusColor(selectedLoan.status)}>
                      {selectedLoan.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-600">Annual Income</Label>
                    <p className="font-semibold">₹{selectedLoan.annualIncome.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Employment Type</Label>
                    <p className="font-semibold capitalize">{selectedLoan.employmentType}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Applied Date</Label>
                    <p className="font-semibold">{new Date(selectedLoan.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </TabsContent>

              {/* KYC Tab */}
              <TabsContent value="kyc" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>KYC Status</Label>
                    <Select value={kycData.status} onValueChange={(value) => setKycData({...kycData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Verified By</Label>
                    <Input
                      placeholder="Officer name"
                      value={kycData.verifiedBy}
                      onChange={(e) => setKycData({...kycData, verifiedBy: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Verification Date</Label>
                    <Input
                      type="date"
                      value={kycData.verificationDate}
                      onChange={(e) => setKycData({...kycData, verificationDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input
                      placeholder="Add notes..."
                      value={kycData.notes}
                      onChange={(e) => setKycData({...kycData, notes: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleKYCSubmit} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Updating..." : "Update KYC Status"}
                </Button>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>Payment Amount</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={paymentData.paymentMethod} onValueChange={(value) => setPaymentData({...paymentData, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <Input
                      placeholder="Enter transaction ID"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input
                      placeholder="Add notes..."
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handlePaymentSubmit} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                  {isSubmitting ? "Recording..." : "Record Payment"}
                </Button>
              </TabsContent>

              {/* Reminder Tab */}
              <TabsContent value="reminder" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>Reminder Type</Label>
                    <Select value={reminderData.reminderType} onValueChange={(value) => setReminderData({...reminderData, reminderType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={reminderData.dueDate}
                      onChange={(e) => setReminderData({...reminderData, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Input
                      placeholder="Enter reminder message"
                      value={reminderData.message}
                      onChange={(e) => setReminderData({...reminderData, message: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleSendReminder} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Sending..." : "Send Reminder"}
                </Button>
              </TabsContent>
            </Tabs>
          )}

          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">{errorMessage}</AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
