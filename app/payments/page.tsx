"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import CertificateGenerator from "@/components/certificate/certificate-generator";
import { PaymentsManagementComponent } from "@/components/features/payments-management";
import jsPDF from 'jspdf';
// @ts-ignore - QRCode types not available
import QRCode from 'qrcode';

function PaymentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Payment Received", message: "Cash payment of ₹25,000 received from Rajesh Kumar", read: false, time: "2 hours ago" },
    { id: 2, title: "UPI Payment", message: "GPay payment of ₹18,000 completed for Priya Sharma", read: false, time: "1 day ago" },
    { id: 3, title: "Certificate Generated", message: "Payment certificate generated for Amit Patel", read: true, time: "3 days ago" },
    { id: 4, title: "Refund Processed", message: "Net banking refund processed for policy #LIC-456789012", read: true, time: "1 week ago" }
  ]);

  const [payments, setPayments] = useState([
    {
      id: "PAY-001",
      customerId: "CUST-001",
      customerName: "Rajesh Kumar",
      policyId: "LIC-123456789",
      amount: "₹25,000",
      paymentMethod: "cash",
      status: "completed",
      date: "15 Dec 2024",
      time: "10:30 AM",
      transactionId: "CASH-2024-001",
      notes: "Cash payment received at office",
      certificateGenerated: true
    },
    {
      id: "PAY-002",
      customerId: "CUST-002",
      customerName: "Priya Sharma",
      policyId: "LIC-234567890",
      amount: "₹18,000",
      paymentMethod: "upi",
      upiMethod: "gpay",
      status: "completed",
      date: "14 Dec 2024",
      time: "2:15 PM",
      transactionId: "GPAY-9876543210",
      notes: "GPay payment completed successfully",
      certificateGenerated: true
    },
    {
      id: "PAY-003",
      customerId: "CUST-003",
      customerName: "Amit Patel",
      policyId: "LIC-345678901",
      amount: "₹12,000",
      paymentMethod: "card",
      cardType: "credit",
      status: "pending",
      date: "13 Dec 2024",
      time: "4:45 PM",
      transactionId: "CARD-1234567890",
      notes: "Credit card payment processing",
      certificateGenerated: false
    },
    {
      id: "PAY-004",
      customerId: "CUST-004",
      customerName: "Sunita Reddy",
      policyId: "LIC-456789012",
      amount: "₹15,000",
      paymentMethod: "netbanking",
      bankName: "HDFC Bank",
      status: "completed",
      date: "12 Dec 2024",
      time: "11:20 AM",
      transactionId: "NB-HDFC-55556666",
      notes: "Net banking transfer completed",
      certificateGenerated: true
    },
    {
      id: "PAY-005",
      customerId: "CUST-005",
      customerName: "Vikram Singh",
      policyId: "LIC-567890123",
      amount: "₹30,000",
      paymentMethod: "upi",
      upiMethod: "phonepe",
      status: "failed",
      date: "11 Dec 2024",
      time: "3:30 PM",
      transactionId: "PHONEPE-1122334455",
      notes: "PhonePe payment failed - insufficient balance",
      certificateGenerated: false
    }
  ]);

  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedPaymentForCertificate, setSelectedPaymentForCertificate] = useState<any>(null);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    policyId: "",
    amount: "",
    paymentMethod: "",
    upiMethod: "",
    cardType: "",
    bankName: "",
    transactionId: "",
    notes: ""
  });

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

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.policyId || !formData.amount || !formData.paymentMethod) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.paymentMethod === "upi" && !formData.upiMethod) {
      alert("Please select UPI method");
      return;
    }

    if (formData.paymentMethod === "card" && !formData.cardType) {
      alert("Please select card type");
      return;
    }

    if (formData.paymentMethod === "netbanking" && !formData.bankName) {
      alert("Please enter bank name");
      return;
    }

    setIsPaymentProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newPayment: any = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      customerId: `CUST-${String(payments.length + 1).padStart(3, '0')}`,
      customerName: formData.customerName,
      policyId: formData.policyId,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      status: Math.random() > 0.2 ? "completed" : "pending",
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
      transactionId: generateTransactionId(formData.paymentMethod, formData.upiMethod, formData.cardType, formData.bankName),
      notes: formData.notes,
      certificateGenerated: false
    };

    // Add conditional properties
    if (formData.paymentMethod === "upi" && formData.upiMethod) {
      newPayment.upiMethod = formData.upiMethod;
    }
    if (formData.paymentMethod === "card" && formData.cardType) {
      newPayment.cardType = formData.cardType;
    }
    if (formData.paymentMethod === "netbanking" && formData.bankName) {
      newPayment.bankName = formData.bankName;
    }

    setPayments(prev => [newPayment, ...prev]);
    
    // Reset form
    setFormData({
      customerId: "",
      customerName: "",
      policyId: "",
      amount: "",
      paymentMethod: "",
      upiMethod: "",
      cardType: "",
      bankName: "",
      transactionId: "",
      notes: ""
    });
    
    setIsAddPaymentDialogOpen(false);
    setIsPaymentProcessing(false);

    // Show success message
    if (newPayment.status === "completed") {
      alert(`Payment of ${formData.amount} received successfully! Transaction ID: ${newPayment.transactionId}`);
    } else {
      alert(`Payment of ${formData.amount} is being processed. Transaction ID: ${newPayment.transactionId}`);
    }
  };

  const generateTransactionId = (method: string, upiMethod?: string, cardType?: string, bankName?: string) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    
    switch (method) {
      case "cash":
        return `CASH-${timestamp}-${random}`;
      case "upi":
        return `${upiMethod?.toUpperCase()}-${timestamp}`;
      case "card":
        return `CARD-${cardType?.toUpperCase()}-${timestamp}`;
      case "netbanking":
        return `NB-${bankName?.replace(/\s+/g, '').toUpperCase()}-${random}`;
      default:
        return `PAY-${timestamp}-${random}`;
    }
  };

  const handleExcelExport = () => {
    // Filter payments based on current search and filter
    const filteredPayments = payments.filter(payment => {
      const matchesSearch = searchTerm === "" || 
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });

    if (filteredPayments.length === 0) {
      alert("No payments found to export!");
      return;
    }

    // Create CSV content
    const headers = [
      "Customer Name",
      "Policy ID", 
      "Amount",
      "Payment Method",
      "UPI Method",
      "Card Type",
      "Bank Name",
      "Transaction ID",
      "Status",
      "Date",
      "Time",
      "Notes"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredPayments.map(payment => [
        `"${payment.customerName}"`,
        `"${payment.policyId}"`,
        `"${payment.amount}"`,
        `"${payment.paymentMethod}"`,
        `"${payment.upiMethod || ""}"`,
        `"${payment.cardType || ""}"`,
        `"${payment.bankName || ""}"`,
        `"${payment.transactionId}"`,
        `"${payment.status}"`,
        `"${payment.date}"`,
        `"${payment.time}"`,
        `"${payment.notes || ""}"`
      ].join(","))
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Successfully exported ${filteredPayments.length} payments to Excel!`);
  };

  const handleGenerateCertificate = (payment: any) => {
    setSelectedPaymentForCertificate(payment);
    setIsCertificateDialogOpen(true);
  };

  const handleDownloadCertificate = async (payment: any) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Generate QR code for verification
    const verificationData = JSON.stringify({
      certificateId: payment.id,
      customerName: payment.customerName,
      policyId: payment.policyId,
      amount: payment.amount,
      transactionId: payment.transactionId,
      date: payment.date,
      signatureId: `SIG-${payment.id}-${Date.now().toString(36).toUpperCase()}`,
      verified: true
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(verificationData, {
      width: 80,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Set font sizes and colors
    const titleFontSize = 20;
    const headerFontSize = 14;
    const normalFontSize = 12;
    const smallFontSize = 10;
    
    // Add LIC Logo (placeholder - in real app, you'd add actual logo)
    doc.setFillColor(0, 100, 0); // Green color for LIC
    doc.rect(20, 20, 170, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(titleFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('LIFE INSURANCE CORPORATION', 105, 35, { align: 'center' });
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Certificate', 105, 50, { align: 'center' });
    
    // Reset text color to black
    doc.setTextColor(0, 0, 0);
    
    // Add certificate border
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(2);
    doc.rect(15, 15, 180, 260);
    
    // Add certificate content
    let yPosition = 80;
    
    // Certificate title
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT RECEIPT CERTIFICATE', 105, yPosition, { align: 'center' });
    
    yPosition += 20;
    
    // Add horizontal line
    doc.setLineWidth(1);
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 15;
    
    // Payment details
    doc.setFontSize(normalFontSize);
    doc.setFont('helvetica', 'normal');
    
    const details = [
      ['Certificate ID:', payment.id],
      ['Customer Name:', payment.customerName],
      ['Policy ID:', payment.policyId],
      ['Amount Paid:', payment.amount],
      ['Payment Method:', getPaymentMethodDisplay(payment)],
      ['Transaction ID:', payment.transactionId],
      ['Payment Date:', payment.date],
      ['Payment Time:', payment.time],
      ['Status:', payment.status.toUpperCase()]
    ];
    
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 30, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, yPosition);
      yPosition += 12;
    });
    
    // Add verification text
    yPosition += 10;
    doc.setLineWidth(1);
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 15;
    doc.setFontSize(smallFontSize);
    doc.setFont('helvetica', 'italic');
    const verificationText = 'This certificate confirms that the above payment has been received and processed by Life Insurance Corporation of India. This document is valid for official purposes.';
    const splitText = doc.splitTextToSize(verificationText, 160);
    splitText.forEach((line: string) => {
      doc.text(line, 105, yPosition, { align: 'center' });
      yPosition += 8;
    });
    
    // Add generation date
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 105, yPosition, { align: 'center' });
    
    // Add signature area
    yPosition += 30;
    
    // Digital signature section header
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('Digital Signature & Verification', 105, yPosition, { align: 'center' });
    
    yPosition += 15;
    
    // Add horizontal line
    doc.setLineWidth(1);
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 15;
    
    // Digital signature box
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(2);
    doc.rect(25, yPosition, 70, 40);
    
    // Add signature verification code inside the box
    doc.setFontSize(smallFontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 0);
    const signatureCode = `SIG-${payment.id}-${Date.now().toString(36).toUpperCase()}`;
    
    // Split signature code if too long
    const splitSignature = doc.splitTextToSize(signatureCode, 60);
    splitSignature.forEach((line: string, index: number) => {
      doc.text(line, 60, yPosition + 15 + (index * 8), { align: 'center' });
    });
    
    // Add "Digital Signature" text
    doc.setFontSize(8);
    doc.text('DIGITAL SIGNATURE', 60, yPosition + 35, { align: 'center' });
    
    // Add verification QR code
    try {
      doc.addImage(qrCodeDataURL, 'PNG', 110, yPosition, 35, 35);
      // Add QR code label
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text('Scan to Verify', 127.5, yPosition + 40, { align: 'center' });
    } catch (error) {
      // Fallback to placeholder if QR code fails
      doc.setDrawColor(0, 0, 0);
      doc.rect(110, yPosition, 35, 35);
      doc.setFontSize(8);
      doc.text('QR CODE', 127.5, yPosition + 18, { align: 'center' });
      doc.text('VERIFY', 127.5, yPosition + 25, { align: 'center' });
    }
    
    // Manual signature line
    doc.line(155, yPosition + 20, 190, yPosition + 20);
    doc.setFontSize(smallFontSize);
    doc.setTextColor(0, 0, 0);
    doc.text('Authorized Signatory', 172.5, yPosition + 25, { align: 'center' });
    
    yPosition += 55;
    
    // Add digital signature metadata
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(1);
    doc.line(30, yPosition, 180, yPosition);
    
    yPosition += 10;
    
    doc.setFontSize(smallFontSize);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Digitally signed on: ${new Date().toLocaleString('en-IN')}`, 105, yPosition, { align: 'center' });
    yPosition += 6;
    doc.text(`Signature ID: ${signatureCode}`, 105, yPosition, { align: 'center' });
    yPosition += 6;
    doc.text('This certificate is digitally signed and tamper-proof', 105, yPosition, { align: 'center' });
    
    // Add footer
    doc.setFontSize(smallFontSize);
    doc.text('Life Insurance Corporation of India', 105, 260, { align: 'center' });
    doc.text('Corporate Office: Yogakshema, Jeevan Bima Marg, P.O. Box No. 19953, Mumbai - 400021', 105, 265, { align: 'center' });
    
    // Save the PDF
    doc.save(`LIC_Payment_Certificate_${payment.id}.pdf`);
    
    // Update payment status
    setPayments(prev => prev.map(p => 
      p.id === payment.id ? { ...p, certificateGenerated: true } : p
    ));

    setIsCertificateDialogOpen(false);
    alert(`Certificate downloaded successfully for ${payment.customerName}`);
  };

  // Helper function to get payment method display
  const getPaymentMethodDisplay = (payment: any) => {
    switch (payment.paymentMethod) {
      case "upi":
        return payment.upiMethod ? payment.upiMethod.charAt(0).toUpperCase() + payment.upiMethod.slice(1) : "UPI";
      case "card":
        return payment.cardType ? payment.cardType.charAt(0).toUpperCase() + payment.cardType.slice(1) + " Card" : "Card";
      case "netbanking":
        return payment.bankName || "Net Banking";
      case "cash":
        return "Cash";
      default:
        return payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string, subMethod?: string) => {
    switch (method) {
      case "cash":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case "upi":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "card":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case "netbanking":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="payments"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Payments Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
              <p className="text-gray-600">Process and track all customer payments with multiple payment methods</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Payments</p>
                      <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'completed').length}</p>
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
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'pending').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Certificates</p>
                      <p className="text-2xl font-bold text-purple-600">{payments.filter(p => p.certificateGenerated).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                      placeholder="Search by customer name, policy ID, or transaction ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExcelExport}
                    className="whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Excel
                  </Button>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>Add New Payment</DialogTitle>
                        <DialogDescription>
                          Process a new customer payment with multiple payment methods available.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePaymentSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
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
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                id="amount"
                                placeholder="e.g., ₹25,000"
                                value={formData.amount}
                                onChange={(e) => handleInputChange("amount", e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="paymentMethod">Payment Method</Label>
                              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="upi">UPI</SelectItem>
                                  <SelectItem value="card">Card</SelectItem>
                                  <SelectItem value="netbanking">Net Banking</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Conditional Fields Based on Payment Method */}
                          {formData.paymentMethod === "upi" && (
                            <div className="space-y-2">
                              <Label htmlFor="upiMethod">UPI Method</Label>
                              <Select value={formData.upiMethod} onValueChange={(value) => handleInputChange("upiMethod", value)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select UPI app" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="gpay">Google Pay (GPay)</SelectItem>
                                  <SelectItem value="phonepe">PhonePe</SelectItem>
                                  <SelectItem value="paytm">Paytm</SelectItem>
                                  <SelectItem value="paytmupi">Paytm UPI</SelectItem>
                                  <SelectItem value="razorpay">Razorpay</SelectItem>
                                  <SelectItem value="bhim">BHIM UPI</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {formData.paymentMethod === "card" && (
                            <div className="space-y-2">
                              <Label htmlFor="cardType">Card Type</Label>
                              <Select value={formData.cardType} onValueChange={(value) => handleInputChange("cardType", value)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select card type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="credit">Credit Card</SelectItem>
                                  <SelectItem value="debit">Debit Card</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {formData.paymentMethod === "netbanking" && (
                            <div className="space-y-2">
                              <Label htmlFor="bankName">Bank Name</Label>
                              <Select value={formData.bankName} onValueChange={(value) => handleInputChange("bankName", value)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select bank" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SBI">State Bank of India (SBI)</SelectItem>
                                  <SelectItem value="HDFC">HDFC Bank</SelectItem>
                                  <SelectItem value="ICICI">ICICI Bank</SelectItem>
                                  <SelectItem value="Axis">Axis Bank</SelectItem>
                                  <SelectItem value="Kotak">Kotak Mahindra Bank</SelectItem>
                                  <SelectItem value="PNB">Punjab National Bank</SelectItem>
                                  <SelectItem value="Canara">Canara Bank</SelectItem>
                                  <SelectItem value="Union">Union Bank of India</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Add any additional notes about this payment..."
                              value={formData.notes}
                              onChange={(e) => handleInputChange("notes", e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsAddPaymentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isPaymentProcessing}>
                            {isPaymentProcessing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Process Payment
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Payments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{payment.customerName}</CardTitle>
                        <CardDescription>{payment.policyId}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Amount</span>
                        <span className="font-bold text-green-600">{payment.amount}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="text-sm font-medium">
                            {payment.paymentMethod === "upi" && payment.upiMethod ? 
                              payment.upiMethod.charAt(0).toUpperCase() + payment.upiMethod.slice(1) :
                              payment.paymentMethod === "card" && payment.cardType ?
                              payment.cardType.charAt(0).toUpperCase() + payment.cardType.slice(1) + " Card" :
                              payment.paymentMethod === "netbanking" && payment.bankName ?
                              payment.bankName :
                              payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Transaction ID</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {payment.transactionId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Date & Time</span>
                        <div className="text-right">
                          <p className="text-sm">{payment.date}</p>
                          <p className="text-xs text-gray-500">{payment.time}</p>
                        </div>
                      </div>

                      {payment.notes && (
                        <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <strong>Note:</strong> {payment.notes}
                        </div>
                      )}

                      <Separator />

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleGenerateCertificate(payment)}
                          disabled={payment.status !== "completed"}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Certificate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPayments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
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
      {selectedPaymentForCertificate && (
        <CertificateGenerator
          isOpen={isCertificateDialogOpen}
          onClose={() => {
            setIsCertificateDialogOpen(false);
            setSelectedPaymentForCertificate(null);
          }}
          certificateType="payment"
          paymentData={selectedPaymentForCertificate}
        />
      )}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    }>
      <PaymentsPageContent />
    </Suspense>
  );
}
