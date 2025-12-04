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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Eye, DollarSign, Clock, User } from "lucide-react";
import { generateLoanPDF } from "@/lib/pdf-generator";

// Loan Types
const LOAN_TYPES = [
  { id: "personal", name: "Personal Loan", icon: "👤", maxAmount: 500000, minRate: 8, maxRate: 15 },
  { id: "bike", name: "Bike Loan", icon: "🏍️", maxAmount: 300000, minRate: 7, maxRate: 12 },
  { id: "car", name: "Car Loan", icon: "🚗", maxAmount: 2000000, minRate: 6, maxRate: 10 },
  { id: "home", name: "Home Loan", icon: "🏠", maxAmount: 5000000, minRate: 5, maxRate: 9 },
  { id: "education", name: "Education Loan", icon: "🎓", maxAmount: 1000000, minRate: 6, maxRate: 11 },
  { id: "business", name: "Business Loan", icon: "💼", maxAmount: 3000000, minRate: 7, maxRate: 13 },
];

// Banks
const BANKS = [
  { id: "sbi", name: "State Bank of India", logo: "🏦", color: "bg-blue-100" },
  { id: "hdfc", name: "HDFC Bank", logo: "🏦", color: "bg-red-100" },
  { id: "icici", name: "ICICI Bank", logo: "🏦", color: "bg-orange-100" },
  { id: "axis", name: "Axis Bank", logo: "🏦", color: "bg-purple-100" },
  { id: "kotak", name: "Kotak Mahindra", logo: "🏦", color: "bg-green-100" },
  { id: "yes", name: "YES Bank", logo: "🏦", color: "bg-pink-100" },
];

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

export default function LoansBankingSection() {
  const [activeTab, setActiveTab] = useState("applications");
  const [loanType, setLoanType] = useState("personal");
  const [loanAmount, setLoanAmount] = useState("100000");
  const [loanTenure, setLoanTenure] = useState("12");
  const [interestRate, setInterestRate] = useState("10");
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedLoanId, setSubmittedLoanId] = useState("");

  // Loans management state
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterKYC, setFilterKYC] = useState("all");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showKYCDialog, setShowKYCDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
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

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    annualIncome: "",
    employmentType: "salaried",
    existingLoans: "",
    creditScore: "",
    additionalInfo: "",
  });

  // Fetch loans on mount
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setIsLoadingLoans(true);
      const res = await fetch("/api/loans");
      const data = await res.json();
      if (data.success) {
        setLoans(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setIsLoadingLoans(false);
    }
  };

  // Loan Calculator
  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const months = parseFloat(loanTenure);
    
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return {
      emi: emi.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
  };

  const loanCalc = calculateLoan();
  const selectedLoanType = LOAN_TYPES.find(t => t.id === loanType);

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

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitLoanApplication = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone || !formData.dateOfBirth || !formData.annualIncome) {
        setSubmitError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const loanData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        loanType,
        loanAmount: parseFloat(loanAmount),
        tenure: parseFloat(loanTenure),
        interestRate: parseFloat(interestRate),
        emi: parseFloat(loanCalc.emi),
        totalAmount: parseFloat(loanCalc.totalAmount),
        totalInterest: parseFloat(loanCalc.totalInterest),
        annualIncome: parseFloat(formData.annualIncome),
        employmentType: formData.employmentType,
        existingLoans: parseFloat(formData.existingLoans) || 0,
        creditScore: formData.creditScore ? parseFloat(formData.creditScore) : undefined,
        additionalInfo: formData.additionalInfo,
      };

      // Submit to API
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loanData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSubmitError(result.error || "Failed to submit application");
        setIsSubmitting(false);
        return;
      }

      // Generate and download PDF
      const pdfData = {
        ...loanData,
        loanId: result.loanId,
        createdAt: new Date().toISOString(),
      };

      const pdf = generateLoanPDF(pdfData);
      pdf.save(`LIC_Loan_Application_${result.loanId}.pdf`);

      setSubmittedLoanId(result.loanId);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        annualIncome: "",
        employmentType: "salaried",
        existingLoans: "",
        creditScore: "",
        additionalInfo: "",
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowLoanApplication(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error: any) {
      setSubmitError(error.message || "An error occurred while submitting the application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">📋 Loan Applications</TabsTrigger>
          <TabsTrigger value="loans">💰 Loans Products</TabsTrigger>
          <TabsTrigger value="banking">🏦 Banking</TabsTrigger>
        </TabsList>

        {/* APPLICATIONS TAB - Show Loans from Database */}
        <TabsContent value="applications" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <Card>
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

          {/* Loans Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Loans</CardTitle>
              <CardDescription>Showing {filteredLoans.length} of {loans.length} loans</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLoans ? (
                <div className="text-center py-8">Loading loans...</div>
              ) : filteredLoans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No loans found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Loan ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold">Type</th>
                        <th className="text-left py-3 px-4 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold">EMI</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">KYC</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.map((loan) => (
                        <tr key={loan._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-xs">{loan.loanId}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-sm">{loan.fullName}</p>
                              <p className="text-xs text-gray-500">{loan.phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize text-sm">{loan.loanType}</td>
                          <td className="py-3 px-4 font-semibold text-sm">₹{(loan.loanAmount / 100000).toFixed(1)}L</td>
                          <td className="py-3 px-4 text-sm">₹{loan.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewLoan(loan)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOANS TAB */}
        <TabsContent value="loans" className="space-y-6">
          {/* Loan Types Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Loan Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LOAN_TYPES.map((loan) => (
                <Card key={loan.id} className="hover:shadow-lg transition cursor-pointer" onClick={() => setLoanType(loan.id)}>
                  <CardHeader>
                    <div className="text-4xl mb-2">{loan.icon}</div>
                    <CardTitle className="text-lg">{loan.name}</CardTitle>
                    <CardDescription>
                      Up to ₹{(loan.maxAmount / 100000).toFixed(1)}L
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">{loan.minRate}% - {loan.maxRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Amount:</span>
                        <span className="font-semibold">₹{loan.maxAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        size="sm"
                        onClick={() => {
                          setLoanType(loan.id);
                          setShowLoanCalculator(true);
                        }}
                      >
                        Calculate EMI
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Loan Calculator Modal */}
          <Dialog open={showLoanCalculator} onOpenChange={setShowLoanCalculator}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Loan Calculator - {selectedLoanType?.name}</DialogTitle>
                <DialogDescription>Calculate your EMI and total loan amount</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Calculator Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Loan Amount (₹)</Label>
                    <Input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      max={selectedLoanType?.maxAmount}
                      placeholder="Enter amount"
                    />
                    <p className="text-xs text-gray-500">Max: ₹{selectedLoanType?.maxAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Tenure (Months)</Label>
                    <Input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(e.target.value)}
                      placeholder="12, 24, 36..."
                      min="1"
                      max="360"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="10"
                      step="0.1"
                      min={selectedLoanType?.minRate}
                      max={selectedLoanType?.maxRate}
                    />
                  </div>
                </div>

                {/* Calculation Results */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Monthly EMI</p>
                    <p className="text-2xl font-bold text-blue-600">₹{loanCalc.emi}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="text-2xl font-bold text-orange-600">₹{loanCalc.totalInterest}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{loanCalc.totalAmount}</p>
                  </div>
                </div>

                {/* Amortization Schedule */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Loan Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Principal Amount:</span>
                      <span className="font-semibold">₹{parseFloat(loanAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Total Interest Payable:</span>
                      <span className="font-semibold">₹{loanCalc.totalInterest}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded font-semibold">
                      <span>Total Amount Payable:</span>
                      <span>₹{loanCalc.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowLoanCalculator(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowLoanCalculator(false);
                  setShowLoanApplication(true);
                }}>
                  Apply for Loan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Loan Application Modal */}
          <Dialog open={showLoanApplication} onOpenChange={setShowLoanApplication}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Loan Application - {selectedLoanType?.name}</DialogTitle>
                <DialogDescription>Fill in your details to apply for the loan</DialogDescription>
              </DialogHeader>

              {submitSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 ml-2">
                    Application submitted successfully! Loan ID: {submittedLoanId}. PDF has been downloaded.
                  </AlertDescription>
                </Alert>
              )}

              {submitError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 ml-2">
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {/* Personal Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Personal Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Full Name *</Label>
                      <Input 
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleFormChange("fullName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Email *</Label>
                      <Input 
                        type="email" 
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Phone *</Label>
                      <Input 
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => handleFormChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Date of Birth *</Label>
                      <Input 
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleFormChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Loan Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Loan Amount *</Label>
                      <Input type="number" value={loanAmount} readOnly className="bg-gray-100" />
                    </div>
                    <div className="space-y-1">
                      <Label>Tenure (Months) *</Label>
                      <Input type="number" value={loanTenure} readOnly className="bg-gray-100" />
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Financial Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Annual Income *</Label>
                      <Input 
                        type="number" 
                        placeholder="Enter annual income"
                        value={formData.annualIncome}
                        onChange={(e) => handleFormChange("annualIncome", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Employment Type *</Label>
                      <Select value={formData.employmentType} onValueChange={(value) => handleFormChange("employmentType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="business">Business Owner</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Existing Loans</Label>
                      <Input 
                        type="number" 
                        placeholder="Total existing loan amount"
                        value={formData.existingLoans}
                        onChange={(e) => handleFormChange("existingLoans", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Credit Score (Optional)</Label>
                      <Input 
                        type="number" 
                        placeholder="Your CIBIL score" 
                        min="300" 
                        max="900"
                        value={formData.creditScore}
                        onChange={(e) => handleFormChange("creditScore", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Required Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked disabled />
                      <span className="text-sm">📄 PAN Card</span>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked disabled />
                      <span className="text-sm">📄 Aadhar Card</span>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked disabled />
                      <span className="text-sm">📄 Last 3 Months Bank Statements</span>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked disabled />
                      <span className="text-sm">📄 Salary Slip / Income Proof</span>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm">📄 Property Documents (if applicable)</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2">
                  <Label>Additional Information</Label>
                  <Textarea 
                    placeholder="Any additional details you'd like to share..." 
                    rows={3}
                    value={formData.additionalInfo}
                    onChange={(e) => handleFormChange("additionalInfo", e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoanApplication(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleSubmitLoanApplication}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* BANKING TAB */}
        <TabsContent value="banking" className="space-y-6">
          {/* Banking Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Credit Card */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">💳 Credit Card</CardTitle>
                <CardDescription>Earn rewards on every transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p><strong>Credit Limit:</strong> Up to ₹5,00,000</p>
                  <p><strong>Interest Rate:</strong> 1.5% - 3.5% per month</p>
                  <p><strong>Annual Fee:</strong> ₹500 - ₹2,000</p>
                  <p><strong>Rewards:</strong> 1-5% cashback</p>
                </div>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>

            {/* Debit Card */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🏧 Debit Card</CardTitle>
                <CardDescription>Access your account anytime, anywhere</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p><strong>Card Types:</strong> Classic, Gold, Platinum</p>
                  <p><strong>ATM Withdrawals:</strong> Unlimited</p>
                  <p><strong>Annual Fee:</strong> Free</p>
                  <p><strong>Cashback:</strong> 0.5% - 1%</p>
                </div>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>

            {/* Savings Account */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">💰 Savings Account</CardTitle>
                <CardDescription>Secure your future with high returns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p><strong>Interest Rate:</strong> 4% - 7% p.a.</p>
                  <p><strong>Min Balance:</strong> ₹1,000</p>
                  <p><strong>Monthly Charges:</strong> None</p>
                  <p><strong>Overdraft:</strong> Available</p>
                </div>
                <Button className="w-full">Open Account</Button>
              </CardContent>
            </Card>

            {/* Current Account */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">📊 Current Account</CardTitle>
                <CardDescription>For business and frequent transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p><strong>Unlimited Transactions:</strong> Yes</p>
                  <p><strong>Cheque Book:</strong> Free</p>
                  <p><strong>Min Balance:</strong> ₹10,000</p>
                  <p><strong>Overdraft:</strong> Up to 3x balance</p>
                </div>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>

            {/* Fixed Deposit */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">📈 Fixed Deposit</CardTitle>
                <CardDescription>Guaranteed returns on your investment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p><strong>Interest Rate:</strong> 5.5% - 7.5% p.a.</p>
                  <p><strong>Tenure:</strong> 7 days - 10 years</p>
                  <p><strong>Min Amount:</strong> ₹1,000</p>
                  <p><strong>Premature Withdrawal:</strong> Allowed</p>
                </div>
                <Button className="w-full">Invest Now</Button>
              </CardContent>
            </Card>

            {/* Recurring Deposit */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🔄 Recurring Deposit</CardTitle>
                <CardDescription>Save regularly and earn interest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p><strong>Interest Rate:</strong> 5% - 7% p.a.</p>
                  <p><strong>Tenure:</strong> 6 months - 10 years</p>
                  <p><strong>Monthly Deposit:</strong> Flexible</p>
                  <p><strong>Maturity Benefit:</strong> Principal + Interest</p>
                </div>
                <Button className="w-full">Start Saving</Button>
              </CardContent>
            </Card>
          </div>

          {/* Banks Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Partner Banks</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {BANKS.map((bank) => (
                <Card key={bank.id} className={`${bank.color} cursor-pointer hover:shadow-lg transition`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{bank.logo}</div>
                    <p className="text-sm font-semibold">{bank.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* APPLICATIONS TAB */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan & Banking Applications</CardTitle>
              <CardDescription>Track your loan and banking service applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {/* Sample Applications */}
                  {[
                    { id: 1, type: "Personal Loan", amount: "₹2,00,000", status: "Approved", date: "2024-12-01" },
                    { id: 2, type: "Credit Card", amount: "₹3,00,000", status: "Processing", date: "2024-12-02" },
                    { id: 3, type: "Car Loan", amount: "₹10,00,000", status: "Pending", date: "2024-12-03" },
                    { id: 4, type: "Savings Account", amount: "N/A", status: "Active", date: "2024-11-15" },
                  ].map((app) => (
                    <div key={app.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{app.type}</p>
                          <p className="text-sm text-gray-600">Amount: {app.amount}</p>
                          <p className="text-xs text-gray-500">Applied: {app.date}</p>
                        </div>
                        <Badge variant={
                          app.status === "Approved" ? "default" :
                          app.status === "Processing" ? "secondary" :
                          app.status === "Active" ? "default" : "outline"
                        }>
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                  <div>
                    <Label className="text-gray-600">Paid Amount</Label>
                    <p className="font-semibold text-green-600">₹{(selectedLoan.paidAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Remaining Amount</Label>
                    <p className="font-semibold text-red-600">₹{(selectedLoan.remainingAmount || selectedLoan.loanAmount).toLocaleString('en-IN')}</p>
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
