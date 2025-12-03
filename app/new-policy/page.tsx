"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { jsPDF } from 'jspdf';
import { AlertCircleIcon, CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";

function NewPolicyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("applicant");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Alert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertDetails, setAlertDetails] = useState<string[]>([]);
  
  // Form Data
  const [formData, setFormData] = useState({
    // Applicant Information
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    applicantAadhaar: "",
    applicantPAN: "",
    applicantDOB: "",
    applicantGender: "",
    applicantMaritalStatus: "",
    applicantOccupation: "",
    applicantAnnualIncome: "",
    applicantAddress: "",
    applicantCity: "",
    applicantState: "",
    applicantPincode: "",
    
    // Policy Details
    policyType: "",
    policyTerm: "",
    sumAssured: "",
    premiumFrequency: "Yearly",
    premiumMode: "Online",
    paymentMethod: "",
    
    // Nominee Information
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    nomineeEmail: "",
    nomineeDOB: "",
    nomineeAddress: "",
    
    // Medical Information
    height: "",
    weight: "",
    bloodGroup: "",
    medicalHistory: "",
    existingIllnesses: "",
    medications: "",
    surgeries: "",
    familyMedicalHistory: "",
    
    // Additional Information
    existingPolicies: "0",
    smokingHabits: "No",
    alcoholConsumption: "No",
    dangerousHobbies: "No",
    
    // Agent Information
    agentCode: "",
    branchCode: "",
    appointmentDate: "",
    
    // Documents
    idProof: "",
    addressProof: "",
    incomeProof: "",
    medicalCertificate: "",
    photographs: "",
    documents: [] as string[],
    
    // Terms
    termsAccepted: false
  });

  // Premium Calculation Result
  const [premiumCalculation, setPremiumCalculation] = useState({
    basePremium: 0,
    gstAmount: 0,
    totalPremium: 0,
    monthlyPremium: 0,
    quarterlyPremium: 0,
    yearlyPremium: 0
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Policy Created", message: "Policy #LIC-2024-0001 created successfully", read: false, time: "2 hours ago" },
    { id: 2, title: "Document Required", message: "Medical documents needed for policy approval", read: false, time: "1 day ago" },
    { id: 3, title: "Premium Calculated", message: "Premium calculation completed for new application", read: true, time: "3 days ago" }
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
          <p className="text-gray-600">Loading policy creation...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showAlertMessage = (
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string,
    details: string[] = []
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertDetails(details);
    setShowAlert(true);
    
    // Auto-hide success alerts after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  const validateTab = (tabName: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (tabName === 'applicant') {
      // Applicant Information Validation
      if (!formData.applicantName?.trim()) {
        errors.push("Applicant name is required");
      } else if (formData.applicantName.trim().length < 3) {
        errors.push("Applicant name must be at least 3 characters");
      }
      
      if (!formData.applicantEmail?.trim()) {
        errors.push("Applicant email is required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicantEmail)) {
        errors.push("Please enter a valid email address");
      }
      
      if (!formData.applicantPhone?.trim()) {
        errors.push("Applicant phone number is required");
      } else if (!/^[6-9]\d{9}$/.test(formData.applicantPhone.replace(/\D/g, ''))) {
        errors.push("Please enter a valid 10-digit phone number");
      }
      
      if (!formData.applicantAadhaar?.trim()) {
        errors.push("Aadhaar number is required");
      } else if (!/^\d{12}$/.test(formData.applicantAadhaar.replace(/\D/g, ''))) {
        errors.push("Please enter a valid 12-digit Aadhaar number");
      }
      
      if (!formData.applicantPAN?.trim()) {
        errors.push("PAN number is required");
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.applicantPAN.toUpperCase())) {
        errors.push("Please enter a valid PAN number");
      }
      
      if (!formData.applicantDOB?.trim()) {
        errors.push("Date of birth is required");
      } else {
        const dob = new Date(formData.applicantDOB);
        const today = new Date();
        const age = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 18 || age > 65) {
          errors.push("Applicant age must be between 18 and 65 years");
        }
      }
      
      if (!formData.applicantGender?.trim()) {
        errors.push("Please select gender");
      }
      
      if (!formData.applicantMaritalStatus?.trim()) {
        errors.push("Please select marital status");
      }
      
      if (!formData.applicantOccupation?.trim()) {
        errors.push("Occupation is required");
      }
      
      if (!formData.applicantAnnualIncome?.trim()) {
        errors.push("Annual income is required");
      } else if (isNaN(Number(formData.applicantAnnualIncome)) || Number(formData.applicantAnnualIncome) < 100000) {
        errors.push("Annual income must be at least ₹1,00,000");
      }
      
      if (!formData.applicantAddress?.trim()) {
        errors.push("Address is required");
      }
      
      if (!formData.applicantCity?.trim()) {
        errors.push("City is required");
      }
      
      if (!formData.applicantState?.trim()) {
        errors.push("State is required");
      }
      
      if (!formData.applicantPincode?.trim()) {
        errors.push("Pincode is required");
      } else if (!/^\d{6}$/.test(formData.applicantPincode.replace(/\D/g, ''))) {
        errors.push("Please enter a valid 6-digit pincode");
      }
    }
    
    if (tabName === 'policy') {
      // Policy Information Validation
      if (!formData.policyType?.trim()) {
        errors.push("Please select a policy type");
      }
      
      if (!formData.sumAssured?.trim()) {
        errors.push("Sum assured is required");
      } else if (isNaN(Number(formData.sumAssured)) || Number(formData.sumAssured) < 100000) {
        errors.push("Sum assured must be at least ₹1,00,000");
      }
      
      if (!formData.policyTerm?.trim()) {
        errors.push("Policy term is required");
      } else if (isNaN(Number(formData.policyTerm)) || Number(formData.policyTerm) < 5 || Number(formData.policyTerm) > 30) {
        errors.push("Policy term must be between 5 and 30 years");
      }
      
      if (!formData.premiumFrequency?.trim()) {
        errors.push("Please select premium frequency");
      }
      
      // Check if premium is calculated
      if (premiumCalculation.yearlyPremium <= 0) {
        errors.push("Please calculate premium before proceeding");
      }
    }
    
    if (tabName === 'nominee') {
      // Nominee Information Validation
      if (!formData.nomineeName?.trim()) {
        errors.push("Nominee name is required");
      } else if (formData.nomineeName.trim().length < 3) {
        errors.push("Nominee name must be at least 3 characters");
      }
      
      if (!formData.nomineeRelation?.trim()) {
        errors.push("Nominee relationship is required");
      }
      
      if (!formData.nomineePhone?.trim()) {
        errors.push("Nominee phone number is required");
      } else if (!/^[6-9]\d{9}$/.test(formData.nomineePhone.replace(/\D/g, ''))) {
        errors.push("Please enter a valid 10-digit nominee phone number");
      }
      
      // Medical Information Validation
      if (!formData.height?.trim()) {
        errors.push("Height is required");
      } else if (isNaN(Number(formData.height)) || Number(formData.height) < 100 || Number(formData.height) > 250) {
        errors.push("Height must be between 100 and 250 cm");
      }
      
      if (!formData.weight?.trim()) {
        errors.push("Weight is required");
      } else if (isNaN(Number(formData.weight)) || Number(formData.weight) < 30 || Number(formData.weight) > 200) {
        errors.push("Weight must be between 30 and 200 kg");
      }
      
      if (!formData.bloodGroup?.trim()) {
        errors.push("Blood group is required");
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleTabChange = (newTab: string) => {
    // Define tab order
    const tabOrder = ['applicant', 'policy', 'nominee', 'review'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    
    // Only allow moving forward if current tab is valid
    if (newIndex > currentIndex) {
      const validation = validateTab(activeTab);
      
      if (!validation.isValid) {
        showAlertMessage(
          'error',
          'Please Complete This Tab',
          `Please fill in all required fields in the ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab before proceeding:`,
          validation.errors
        );
        return;
      }
    }
    
    // Allow tab change if moving backward or current tab is valid
    setActiveTab(newTab);
  };

  const calculatePremium = async () => {
    setIsCalculating(true);
    
    // Simulate premium calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sumAssured = parseFloat(formData.sumAssured) || 0;
    const age = calculateAge(formData.applicantDOB);
    const policyTerm = parseInt(formData.policyTerm) || 10;
    
    // Basic premium calculation formula (simplified)
    let basePremium = (sumAssured * 0.001) * (1 + (age / 100)) * (policyTerm / 20);
    
    // Add policy type multiplier
    const policyMultipliers = {
      "Term Life": 0.8,
      "Endowment": 1.2,
      "Whole Life": 1.5,
      "Money Back": 1.3,
      "ULIP": 1.8,
      "Health Insurance": 2.0
    };
    
    basePremium *= policyMultipliers[formData.policyType as keyof typeof policyMultipliers] || 1;
    
    const gstAmount = basePremium * 0.18;
    const totalPremium = basePremium + gstAmount;
    
    setPremiumCalculation({
      basePremium: Math.round(basePremium),
      gstAmount: Math.round(gstAmount),
      totalPremium: Math.round(totalPremium),
      monthlyPremium: Math.round(totalPremium / 12),
      quarterlyPremium: Math.round(totalPremium / 4),
      yearlyPremium: Math.round(totalPremium)
    });
    
    setIsCalculating(false);
  };

  const calculateAge = (dob: string): number => {
    if (!dob) return 30; // Default age
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Applicant Information Validation
    if (!formData.applicantName?.trim()) {
      errors.push("Applicant name is required");
    } else if (formData.applicantName.trim().length < 3) {
      errors.push("Applicant name must be at least 3 characters");
    }
    
    if (!formData.applicantEmail?.trim()) {
      errors.push("Applicant email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicantEmail)) {
      errors.push("Please enter a valid email address");
    }
    
    if (!formData.applicantPhone?.trim()) {
      errors.push("Applicant phone number is required");
    } else if (!/^[6-9]\d{9}$/.test(formData.applicantPhone.replace(/\D/g, ''))) {
      errors.push("Please enter a valid 10-digit phone number");
    }
    
    if (!formData.applicantAadhaar?.trim()) {
      errors.push("Aadhaar number is required");
    } else if (!/^\d{12}$/.test(formData.applicantAadhaar.replace(/\D/g, ''))) {
      errors.push("Please enter a valid 12-digit Aadhaar number");
    }
    
    if (!formData.applicantPAN?.trim()) {
      errors.push("PAN number is required");
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.applicantPAN.toUpperCase())) {
      errors.push("Please enter a valid PAN number");
    }
    
    if (!formData.applicantDOB?.trim()) {
      errors.push("Date of birth is required");
    } else {
      const dob = new Date(formData.applicantDOB);
      const today = new Date();
      const age = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18 || age > 65) {
        errors.push("Applicant age must be between 18 and 65 years");
      }
    }
    
    if (!formData.applicantGender?.trim()) {
      errors.push("Please select gender");
    }
    
    if (!formData.applicantMaritalStatus?.trim()) {
      errors.push("Please select marital status");
    }
    
    if (!formData.applicantOccupation?.trim()) {
      errors.push("Occupation is required");
    }
    
    if (!formData.applicantAnnualIncome?.trim()) {
      errors.push("Annual income is required");
    } else if (isNaN(Number(formData.applicantAnnualIncome)) || Number(formData.applicantAnnualIncome) < 100000) {
      errors.push("Annual income must be at least ₹1,00,000");
    }
    
    if (!formData.applicantAddress?.trim()) {
      errors.push("Address is required");
    }
    
    if (!formData.applicantCity?.trim()) {
      errors.push("City is required");
    }
    
    if (!formData.applicantState?.trim()) {
      errors.push("State is required");
    }
    
    if (!formData.applicantPincode?.trim()) {
      errors.push("Pincode is required");
    } else if (!/^\d{6}$/.test(formData.applicantPincode.replace(/\D/g, ''))) {
      errors.push("Please enter a valid 6-digit pincode");
    }
    
    // Policy Information Validation
    if (!formData.policyType?.trim()) {
      errors.push("Please select a policy type");
    }
    
    if (!formData.sumAssured?.trim()) {
      errors.push("Sum assured is required");
    } else if (isNaN(Number(formData.sumAssured)) || Number(formData.sumAssured) < 100000) {
      errors.push("Sum assured must be at least ₹1,00,000");
    }
    
    if (!formData.policyTerm?.trim()) {
      errors.push("Policy term is required");
    } else if (isNaN(Number(formData.policyTerm)) || Number(formData.policyTerm) < 5 || Number(formData.policyTerm) > 30) {
      errors.push("Policy term must be between 5 and 30 years");
    }
    
    if (!formData.premiumFrequency?.trim()) {
      errors.push("Please select premium frequency");
    }
    
    // Nominee Information Validation
    if (!formData.nomineeName?.trim()) {
      errors.push("Nominee name is required");
    } else if (formData.nomineeName.trim().length < 3) {
      errors.push("Nominee name must be at least 3 characters");
    }
    
    if (!formData.nomineeRelation?.trim()) {
      errors.push("Nominee relationship is required");
    }
    
    if (!formData.nomineePhone?.trim()) {
      errors.push("Nominee phone number is required");
    } else if (!/^[6-9]\d{9}$/.test(formData.nomineePhone.replace(/\D/g, ''))) {
      errors.push("Please enter a valid 10-digit nominee phone number");
    }
    
    // Medical Information Validation
    if (!formData.height?.trim()) {
      errors.push("Height is required");
    } else if (isNaN(Number(formData.height)) || Number(formData.height) < 100 || Number(formData.height) > 250) {
      errors.push("Height must be between 100 and 250 cm");
    }
    
    if (!formData.weight?.trim()) {
      errors.push("Weight is required");
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) < 30 || Number(formData.weight) > 200) {
      errors.push("Weight must be between 30 and 200 kg");
    }
    
    if (!formData.bloodGroup?.trim()) {
      errors.push("Blood group is required");
    }
    
    // Documents Validation
    if (!formData.idProof?.trim()) {
      errors.push("ID proof document is required");
    }
    
    if (!formData.addressProof?.trim()) {
      errors.push("Address proof document is required");
    }
    
    if (!formData.incomeProof?.trim()) {
      errors.push("Income proof document is required");
    }
    
    // Terms and Conditions Validation
    if (!formData.termsAccepted) {
      errors.push("Please accept the terms and conditions");
    }
    
    // Premium Calculation Validation
    if (premiumCalculation.yearlyPremium <= 0) {
      errors.push("Please calculate premium before submitting");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Show validation errors using shadcn Alert
      showAlertMessage(
        'error',
        'Validation Failed',
        'Please fix the following errors before submitting the application:',
        validation.errors
      );
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate policy creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate policy number and application ID
      const policyNumber = `LIC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const applicationId = `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      // Generate comprehensive policy PDF
      generatePolicyPDF(policyNumber, applicationId);
      
      // Show success message using shadcn Alert
      showAlertMessage(
        'success',
        'Policy Created Successfully!',
        `Your policy application has been submitted and approved.`,
        [
          `Policy Number: ${policyNumber}`,
          `Application ID: ${applicationId}`,
          `Annual Premium: ₹${premiumCalculation.yearlyPremium.toLocaleString()}`,
          'Policy document has been generated and downloaded!'
        ]
      );
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/policies');
      }, 3000);
      
    } catch (error) {
      showAlertMessage(
        'error',
        'Submission Failed',
        'There was an error submitting your policy application. Please try again.',
        []
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePolicyPDF = (policyNumber: string, applicationId: string) => {
    const doc = new jsPDF();
    
    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - 2 * margin;
    
    // Helper function to add new page if needed
    const checkPageBreak = (yPos: number, requiredHeight: number = 20) => {
      if (yPos + requiredHeight > pageHeight - 40) {
        doc.addPage();
        return margin + 30; // Reset to top with margin
      }
      return yPos;
    };
    
    let currentY = margin;
    
    // ========== PAGE 1: HEADER & APPLICANT INFO ==========
    
    // LIC Header with Gradient Effect
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text("LIFE INSURANCE CORPORATION", pageWidth / 2, 25, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text("OF INDIA", pageWidth / 2, 40, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("भारतीय जीवन बीमा निगम", pageWidth / 2, 50, { align: "center" });
    
    // Decorative line
    doc.setDrawColor(255, 215, 0); // Gold color
    doc.setLineWidth(2);
    doc.line(margin, 65, pageWidth - margin, 65);
    
    // Document Title Box
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(margin, 75, contentWidth, 35, 'F');
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(1);
    doc.rect(margin, 75, contentWidth, 35);
    
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("POLICY APPLICATION DOCUMENT", pageWidth / 2, 95, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text("बीमा आवेदन पत्र", pageWidth / 2, 105, { align: "center" });
    
    // Application Details Box
    currentY = 120;
    doc.setFillColor(255, 250, 240); // Light cream background
    doc.roundedRect(margin, currentY, contentWidth, 40, 3, 3, 'F');
    doc.setDrawColor(0, 51, 102);
    doc.roundedRect(margin, currentY, contentWidth, 40, 3, 3);
    
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Application Details", margin + 10, currentY + 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Application ID: ${applicationId}`, margin + 10, currentY + 28);
    doc.text(`Policy Number: ${policyNumber}`, margin + 150, currentY + 28);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, margin + 10, currentY + 35);
    doc.text(`Branch: Mumbai Main Branch`, margin + 150, currentY + 35);
    
    // ========== APPLICANT INFORMATION SECTION ==========
    currentY = 175;
    currentY = checkPageBreak(currentY, 80);
    
    // Section Header
    doc.setFillColor(0, 51, 102);
    doc.rect(margin, currentY, contentWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("APPLICANT INFORMATION", margin + 10, currentY + 17);
    
    // Applicant Details Box
    currentY += 30;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, currentY, contentWidth, 120, 3, 3, 'F');
    doc.setDrawColor(0, 51, 102);
    doc.roundedRect(margin, currentY, contentWidth, 120, 3, 3);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    let yPos = currentY + 15;
    
    // Two-column layout for applicant details
    const leftCol = margin + 15;
    const rightCol = margin + contentWidth / 2 + 10;
    
    // Left Column
    doc.setFont('helvetica', 'bold');
    doc.text("Personal Details:", leftCol, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${formData.applicantName || "Not provided"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Email: ${formData.applicantEmail || "Not provided"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Phone: ${formData.applicantPhone || "Not provided"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Date of Birth: ${formData.applicantDOB || "Not provided"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Gender: ${formData.applicantGender || "Not provided"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Marital Status: ${formData.applicantMaritalStatus || "Not provided"}`, leftCol, yPos);
    
    // Right Column
    yPos = currentY + 15;
    doc.setFont('helvetica', 'bold');
    doc.text("Official Details:", rightCol, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Aadhaar: ${formData.applicantAadhaar || "Not provided"}`, rightCol, yPos);
    yPos += 6;
    doc.text(`PAN: ${formData.applicantPAN || "Not provided"}`, rightCol, yPos);
    yPos += 6;
    doc.text(`Occupation: ${formData.applicantOccupation || "Not provided"}`, rightCol, yPos);
    yPos += 6;
    doc.text(`Annual Income: ₹${formData.applicantAnnualIncome || "0"}`, rightCol, yPos);
    
    // Address
    yPos = currentY + 65;
    doc.setFont('helvetica', 'bold');
    doc.text("Address:", leftCol, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const address = `${formData.applicantAddress || "Not provided"}, ${formData.applicantCity || ""}, ${formData.applicantState || ""} - ${formData.applicantPincode || ""}`;
    // Wrap long address
    const lines = doc.splitTextToSize(address, contentWidth - 30);
    lines.forEach((line: string) => {
      doc.text(line, leftCol, yPos);
      yPos += 5;
    });
    
    currentY += 130;
    
    // Check if we need a new page for policy details
    currentY = checkPageBreak(currentY, 100);
    
    // ========== POLICY DETAILS SECTION ==========
    
    // Section Header
    doc.setFillColor(0, 51, 102);
    doc.rect(margin, currentY, contentWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("POLICY DETAILS", margin + 10, currentY + 17);
    
    // Policy Details Box
    currentY += 30;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, currentY, contentWidth, 100, 3, 3, 'F');
    doc.setDrawColor(0, 51, 102);
    doc.roundedRect(margin, currentY, contentWidth, 100, 3, 3);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    yPos = currentY + 15;
    
    // Two-column layout for policy details
    doc.setFont('helvetica', 'bold');
    doc.text("Policy Information:", leftCol, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Policy Type: ${formData.policyType || "Not selected"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Sum Assured: ₹${formData.sumAssured || "0"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Policy Term: ${formData.policyTerm || "0"} years`, leftCol, yPos);
    yPos += 6;
    doc.text(`Premium Frequency: ${formData.premiumFrequency || "Not selected"}`, leftCol, yPos);
    
    // Premium Details
    yPos = currentY + 15;
    doc.setFont('helvetica', 'bold');
    doc.text("Premium Details:", rightCol, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Base Premium: ₹${premiumCalculation.basePremium.toLocaleString()}`, rightCol, yPos);
    yPos += 6;
    doc.text(`GST (18%): ₹${premiumCalculation.gstAmount.toLocaleString()}`, rightCol, yPos);
    yPos += 6;
    doc.text(`Annual Premium: ₹${premiumCalculation.yearlyPremium.toLocaleString()}`, rightCol, yPos);
    yPos += 6;
    doc.text(`Monthly Premium: ₹${premiumCalculation.monthlyPremium.toLocaleString()}`, rightCol, yPos);
    
    // Highlight Box for Total Premium
    currentY += 105;
    doc.setFillColor(255, 215, 0, 0.1); // Light gold background
    doc.roundedRect(margin, currentY, contentWidth, 25, 3, 3, 'F');
    doc.setDrawColor(255, 215, 0);
    doc.roundedRect(margin, currentY, contentWidth, 25, 3, 3);
    
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Annual Premium: ₹${premiumCalculation.yearlyPremium.toLocaleString()}`, margin + 10, currentY + 17);
    
    currentY += 35;
    
    // ========== NOMINEE INFORMATION SECTION ==========
    currentY = checkPageBreak(currentY, 60);
    
    // Section Header
    doc.setFillColor(0, 51, 102);
    doc.rect(margin, currentY, contentWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("NOMINEE INFORMATION", margin + 10, currentY + 17);
    
    // Nominee Details Box
    currentY += 30;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, currentY, contentWidth, 50, 3, 3, 'F');
    doc.setDrawColor(0, 51, 102);
    doc.roundedRect(margin, currentY, contentWidth, 50, 3, 3);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    yPos = currentY + 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text("Nominee Details:", leftCol, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${formData.nomineeName || "Not provided"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Relationship: ${formData.nomineeRelation || "Not provided"}`, leftCol, yPos);
    yPos += 6;
    doc.text(`Phone: ${formData.nomineePhone || "Not provided"}`, leftCol, yPos);
    
    currentY += 60;
    
    // ========== PAGE 2: MEDICAL INFO & SIGNATURES ==========
    doc.addPage();
    currentY = margin;
    
    // Header on new page
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("MEDICAL & DECLARATION", pageWidth / 2, 25, { align: "center" });
    
    currentY = 55;
    
    // ========== MEDICAL INFORMATION SECTION ==========
    // Section Header
    doc.setFillColor(0, 51, 102);
    doc.rect(margin, currentY, contentWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("MEDICAL INFORMATION", margin + 10, currentY + 17);
    
    // Medical Details Box
    currentY += 30;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, currentY, contentWidth, 60, 3, 3, 'F');
    doc.setDrawColor(0, 51, 102);
    doc.roundedRect(margin, currentY, contentWidth, 60, 3, 3);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    yPos = currentY + 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text("Health Details:", leftCol, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Height: ${formData.height || "Not provided"} cm`, leftCol, yPos);
    yPos += 6;
    doc.text(`Weight: ${formData.weight || "Not provided"} kg`, leftCol, yPos);
    yPos += 6;
    doc.text(`Blood Group: ${formData.bloodGroup || "Not provided"}`, leftCol, yPos);
    
    yPos = currentY + 15;
    doc.setFont('helvetica', 'bold');
    doc.text("Medical History:", rightCol, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    const medicalHistory = formData.medicalHistory || "None";
    const medicalLines = doc.splitTextToSize(medicalHistory, contentWidth / 2 - 20);
    medicalLines.forEach((line: string) => {
      doc.text(line, rightCol, yPos);
      yPos += 5;
    });
    
    currentY += 70;
    
    // ========== DECLARATION SECTION ==========
    // Section Header
    doc.setFillColor(0, 51, 102);
    doc.rect(margin, currentY, contentWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("DECLARATION & TERMS", margin + 10, currentY + 17);
    
    // Declaration Box
    currentY += 30;
    doc.setFillColor(248, 248, 248);
    doc.roundedRect(margin, currentY, contentWidth, 80, 3, 3, 'F');
    doc.setDrawColor(0, 51, 102);
    doc.roundedRect(margin, currentY, contentWidth, 80, 3, 3);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    yPos = currentY + 10;
    
    const declarations = [
      "1. I hereby declare that all information provided is true and correct to the best of my knowledge.",
      "2. I understand that this policy is subject to underwriting and medical examination if required.",
      "3. I agree to pay all premiums on time to keep the policy active.",
      "4. I authorize LIC to contact me for policy-related communications.",
      "5. I have read and understood all terms and conditions of this policy."
    ];
    
    declarations.forEach((declaration) => {
      const lines = doc.splitTextToSize(declaration, contentWidth - 20);
      lines.forEach((line: string) => {
        doc.text(line, margin + 10, yPos);
        yPos += 5;
      });
      yPos += 2;
    });
    
    currentY += 90;
    
    // ========== SIGNATURE SECTION ==========
    // Section Header
    doc.setFillColor(0, 51, 102);
    doc.rect(margin, currentY, contentWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("AUTHORIZED SIGNATURES", margin + 10, currentY + 17);
    
    // Signature Boxes
    currentY += 30;
    
    // Applicant Signature
    doc.setDrawColor(0, 51, 102);
    doc.rect(margin, currentY, contentWidth / 2 - 10, 60);
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Applicant Signature", margin + 5, currentY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.applicantName || "Applicant Name"}`, margin + 5, currentY + 20);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, margin + 5, currentY + 30);
    
    // Officer Signature
    doc.rect(margin + contentWidth / 2 + 10, currentY, contentWidth / 2 - 10, 60);
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Officer Signature", margin + contentWidth / 2 + 15, currentY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text("Rajesh Kumar", margin + contentWidth / 2 + 15, currentY + 20);
    doc.text("Branch Manager", margin + contentWidth / 2 + 15, currentY + 25);
    doc.text("LIC Mumbai Main", margin + contentWidth / 2 + 15, currentY + 30);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, margin + contentWidth / 2 + 15, currentY + 40);
    
    // Digital Signature Stamp
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(2);
    doc.rect(margin + contentWidth / 2 + 15, currentY + 45, 40, 10);
    doc.setTextColor(255, 215, 0);
    doc.setFontSize(8);
    doc.text("DIGITAL", margin + contentWidth / 2 + 20, currentY + 50);
    doc.text("VERIFIED", margin + contentWidth / 2 + 18, currentY + 54);
    
    currentY += 70;
    
    // ========== BRANCH SEAL & FOOTER ==========
    // Branch Seal
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(2);
    doc.circle(pageWidth - 50, currentY + 20, 25);
    doc.setTextColor(200, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("OFFICIAL", pageWidth - 65, currentY + 20);
    doc.text("SEAL", pageWidth - 58, currentY + 28);
    
    // Footer
    doc.setFillColor(0, 51, 102);
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("This is a computer-generated document and does not require a physical signature", pageWidth / 2, pageHeight - 20, { align: "center" });
    doc.setFontSize(9);
    doc.text("LIC Customer Care: 1800-425-0001 | www.licindia.com | support@licindia.com", pageWidth / 2, pageHeight - 10, { align: "center" });
    
    // Watermark on both pages
    const totalPages = doc.internal.pages.length - 1; // pages array includes a dummy page at index 0
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(60);
      doc.setTextColor(230, 230, 230);
      doc.text("LIC", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
    }
    
    // Save the PDF
    doc.save(`LIC_Policy_Application_${applicationId}_${formData.applicantName?.replace(/\s+/g, '_') || 'Unknown'}.pdf`);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Simulate logout
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Alert Component */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
          <Alert variant={alertType === 'error' ? 'destructive' : 'default'} className="relative">
            {alertType === 'success' && <CheckCircle2Icon className="h-4 w-4" />}
            {alertType === 'error' && <AlertCircleIcon className="h-4 w-4" />}
            {alertType === 'warning' && <AlertTriangleIcon className="h-4 w-4" />}
            <AlertTitle className="text-sm">{alertTitle}</AlertTitle>
            <AlertDescription className="text-xs mt-1">
              {alertMessage}
              {alertDetails.length > 0 && (
                <ul className="mt-1 list-inside list-disc text-xs">
                  {alertDetails.slice(0, 3).map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                  {alertDetails.length > 3 && (
                    <li className="text-gray-500">...and {alertDetails.length - 3} more</li>
                  )}
                </ul>
              )}
            </AlertDescription>
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-2 right-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </Alert>
        </div>
      )}
      
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="new-policy"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">New Policy Application</h1>
              <p className="text-gray-600">Create a new insurance policy for your customer</p>
            </div>

            {/* Policy Creation Form */}
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-6">
                {/* Progress Indicator */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                        <span className="text-sm font-medium">Applicant Details</span>
                      </div>
                      <div className="w-16 h-1 bg-blue-600"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                        <span className="text-sm font-medium">Policy Details</span>
                      </div>
                      <div className="w-16 h-1 bg-gray-300"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                        <span className="text-sm font-medium">Nominee Details</span>
                      </div>
                      <div className="w-16 h-1 bg-gray-300"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
                        <span className="text-sm font-medium">Review & Submit</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="applicant">Applicant</TabsTrigger>
                    <TabsTrigger value="policy">Policy</TabsTrigger>
                    <TabsTrigger value="nominee">Nominee</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                  </TabsList>

                  {/* Applicant Details Tab */}
                  <TabsContent value="applicant" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Applicant Information</CardTitle>
                        <CardDescription>Enter the applicant's personal and contact details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="applicantName">Full Name *</Label>
                            <Input
                              id="applicantName"
                              value={formData.applicantName}
                              onChange={(e) => handleInputChange("applicantName", e.target.value)}
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantEmail">Email Address *</Label>
                            <Input
                              id="applicantEmail"
                              type="email"
                              value={formData.applicantEmail}
                              onChange={(e) => handleInputChange("applicantEmail", e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantPhone">Phone Number *</Label>
                            <Input
                              id="applicantPhone"
                              value={formData.applicantPhone}
                              onChange={(e) => handleInputChange("applicantPhone", e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantDOB">Date of Birth *</Label>
                            <Input
                              id="applicantDOB"
                              type="date"
                              value={formData.applicantDOB}
                              onChange={(e) => handleInputChange("applicantDOB", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantGender">Gender *</Label>
                            <Select value={formData.applicantGender} onValueChange={(value) => handleInputChange("applicantGender", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantMaritalStatus">Marital Status *</Label>
                            <Select value={formData.applicantMaritalStatus} onValueChange={(value) => handleInputChange("applicantMaritalStatus", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select marital status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="applicantAadhaar">Aadhaar Number *</Label>
                            <Input
                              id="applicantAadhaar"
                              value={formData.applicantAadhaar}
                              onChange={(e) => handleInputChange("applicantAadhaar", e.target.value)}
                              placeholder="Enter Aadhaar number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantPAN">PAN Number *</Label>
                            <Input
                              id="applicantPAN"
                              value={formData.applicantPAN}
                              onChange={(e) => handleInputChange("applicantPAN", e.target.value)}
                              placeholder="Enter PAN number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantOccupation">Occupation *</Label>
                            <Input
                              id="applicantOccupation"
                              value={formData.applicantOccupation}
                              onChange={(e) => handleInputChange("applicantOccupation", e.target.value)}
                              placeholder="Enter occupation"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantAnnualIncome">Annual Income (₹) *</Label>
                            <Input
                              id="applicantAnnualIncome"
                              type="number"
                              value={formData.applicantAnnualIncome}
                              onChange={(e) => handleInputChange("applicantAnnualIncome", e.target.value)}
                              placeholder="Enter annual income"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="applicantAddress">Residential Address *</Label>
                          <Textarea
                            id="applicantAddress"
                            value={formData.applicantAddress}
                            onChange={(e) => handleInputChange("applicantAddress", e.target.value)}
                            placeholder="Enter complete residential address"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="applicantCity">City *</Label>
                            <Input
                              id="applicantCity"
                              value={formData.applicantCity}
                              onChange={(e) => handleInputChange("applicantCity", e.target.value)}
                              placeholder="Enter city"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantState">State *</Label>
                            <Input
                              id="applicantState"
                              value={formData.applicantState}
                              onChange={(e) => handleInputChange("applicantState", e.target.value)}
                              placeholder="Enter state"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="applicantPincode">Pincode *</Label>
                            <Input
                              id="applicantPincode"
                              value={formData.applicantPincode}
                              onChange={(e) => handleInputChange("applicantPincode", e.target.value)}
                              placeholder="Enter pincode"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleTabChange('policy')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Policy Details →
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Policy Details Tab */}
                  <TabsContent value="policy" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Policy Details</CardTitle>
                        <CardDescription>Select policy type and configure coverage details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="policyType">Policy Type *</Label>
                            <Select value={formData.policyType} onValueChange={(value) => handleInputChange("policyType", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select policy type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Term Life">Term Life Insurance</SelectItem>
                                <SelectItem value="Endowment">Endowment Plan</SelectItem>
                                <SelectItem value="Whole Life">Whole Life Insurance</SelectItem>
                                <SelectItem value="Money Back">Money Back Plan</SelectItem>
                                <SelectItem value="ULIP">ULIP Plan</SelectItem>
                                <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="policyTerm">Policy Term (Years) *</Label>
                            <Input
                              id="policyTerm"
                              type="number"
                              value={formData.policyTerm}
                              onChange={(e) => handleInputChange("policyTerm", e.target.value)}
                              placeholder="Enter policy term in years"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sumAssured">Sum Assured (₹) *</Label>
                            <Input
                              id="sumAssured"
                              type="number"
                              value={formData.sumAssured}
                              onChange={(e) => handleInputChange("sumAssured", e.target.value)}
                              placeholder="Enter sum assured amount"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="premiumFrequency">Premium Frequency *</Label>
                            <Select value={formData.premiumFrequency} onValueChange={(value) => handleInputChange("premiumFrequency", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select premium frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                                <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                                <SelectItem value="Yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Button onClick={calculatePremium} disabled={isCalculating || !formData.sumAssured || !formData.policyType}>
                            {isCalculating ? "Calculating..." : "Calculate Premium"}
                          </Button>
                          
                          {premiumCalculation.totalPremium > 0 && (
                            <div className="flex-1">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div>
                                      <p className="text-sm text-gray-600">Monthly</p>
                                      <p className="text-lg font-bold text-blue-600">₹{premiumCalculation.monthlyPremium.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Quarterly</p>
                                      <p className="text-lg font-bold text-blue-600">₹{premiumCalculation.quarterlyPremium.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Yearly</p>
                                      <p className="text-lg font-bold text-blue-600">₹{premiumCalculation.yearlyPremium.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">GST</p>
                                      <p className="text-lg font-bold text-green-600">₹{premiumCalculation.gstAmount.toLocaleString()}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Health & Lifestyle Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="smokingHabits">Smoking Habits *</Label>
                              <Select value={formData.smokingHabits} onValueChange={(value) => handleInputChange("smokingHabits", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select smoking status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="No">Non-Smoker</SelectItem>
                                  <SelectItem value="Yes">Smoker</SelectItem>
                                  <SelectItem value="Occasional">Occasional Smoker</SelectItem>
                                  <SelectItem value="Quit">Quit Smoking</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="alcoholConsumption">Alcohol Consumption *</Label>
                              <Select value={formData.alcoholConsumption} onValueChange={(value) => handleInputChange("alcoholConsumption", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select alcohol consumption" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="No">Non-Drinker</SelectItem>
                                  <SelectItem value="Yes">Regular Drinker</SelectItem>
                                  <SelectItem value="Occasional">Occasional Drinker</SelectItem>
                                  <SelectItem value="Social">Social Drinker</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="medicalHistory">Medical History</Label>
                            <Textarea
                              id="medicalHistory"
                              value={formData.medicalHistory}
                              onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                              placeholder="Describe any medical conditions or illnesses"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="existingPolicies">Existing Insurance Policies</Label>
                            <Input
                              id="existingPolicies"
                              type="number"
                              value={formData.existingPolicies}
                              onChange={(e) => handleInputChange("existingPolicies", e.target.value)}
                              placeholder="Number of existing policies"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => handleTabChange('applicant')}
                      >
                        ← Previous: Applicant Details
                      </Button>
                      <Button 
                        onClick={() => handleTabChange('nominee')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Nominee Details →
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Nominee Details Tab */}
                  <TabsContent value="nominee" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Nominee Information</CardTitle>
                        <CardDescription>Enter nominee details for the policy</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nomineeName">Nominee Name *</Label>
                            <Input
                              id="nomineeName"
                              value={formData.nomineeName}
                              onChange={(e) => handleInputChange("nomineeName", e.target.value)}
                              placeholder="Enter nominee name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nomineeRelation">Relationship *</Label>
                            <Select value={formData.nomineeRelation} onValueChange={(value) => handleInputChange("nomineeRelation", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Spouse">Spouse</SelectItem>
                                <SelectItem value="Son">Son</SelectItem>
                                <SelectItem value="Daughter">Daughter</SelectItem>
                                <SelectItem value="Father">Father</SelectItem>
                                <SelectItem value="Mother">Mother</SelectItem>
                                <SelectItem value="Brother">Brother</SelectItem>
                                <SelectItem value="Sister">Sister</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nomineePhone">Phone Number</Label>
                            <Input
                              id="nomineePhone"
                              value={formData.nomineePhone}
                              onChange={(e) => handleInputChange("nomineePhone", e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nomineeEmail">Email Address</Label>
                            <Input
                              id="nomineeEmail"
                              type="email"
                              value={formData.nomineeEmail}
                              onChange={(e) => handleInputChange("nomineeEmail", e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="nomineeAddress">Nominee Address</Label>
                          <Textarea
                            id="nomineeAddress"
                            value={formData.nomineeAddress}
                            onChange={(e) => handleInputChange("nomineeAddress", e.target.value)}
                            placeholder="Enter nominee address (if different from applicant)"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => handleTabChange('policy')}
                      >
                        ← Previous: Policy Details
                      </Button>
                      <Button 
                        onClick={() => handleTabChange('review')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next: Review & Submit →
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Review Tab */}
                  <TabsContent value="review" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Review Application</CardTitle>
                        <CardDescription>Review all details before submitting the application</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">Applicant Details</h3>
                            <div className="space-y-2">
                              <p><strong>Name:</strong> {formData.applicantName || "Not provided"}</p>
                              <p><strong>Email:</strong> {formData.applicantEmail || "Not provided"}</p>
                              <p><strong>Phone:</strong> {formData.applicantPhone || "Not provided"}</p>
                              <p><strong>DOB:</strong> {formData.applicantDOB || "Not provided"}</p>
                              <p><strong>Occupation:</strong> {formData.applicantOccupation || "Not provided"}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium mb-4">Policy Details</h3>
                            <div className="space-y-2">
                              <p><strong>Policy Type:</strong> {formData.policyType || "Not selected"}</p>
                              <p><strong>Sum Assured:</strong> ₹{formData.sumAssured || "0"}</p>
                              <p><strong>Policy Term:</strong> {formData.policyTerm || "0"} years</p>
                              <p><strong>Premium Frequency:</strong> {formData.premiumFrequency || "Not selected"}</p>
                              <p><strong>Annual Premium:</strong> ₹{premiumCalculation.yearlyPremium.toLocaleString() || "0"}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-4">Nominee Details</h3>
                          <div className="space-y-2">
                            <p><strong>Name:</strong> {formData.nomineeName || "Not provided"}</p>
                            <p><strong>Relationship:</strong> {formData.nomineeRelation || "Not provided"}</p>
                            <p><strong>Phone:</strong> {formData.nomineePhone || "Not provided"}</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-4">
                          <Switch 
                            id="terms" 
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                          />
                          <Label htmlFor="terms">I confirm that all information provided is accurate and I agree to the terms and conditions</Label>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <Button 
                            variant="outline"
                            onClick={() => handleTabChange('nominee')}
                          >
                            ← Previous: Nominee Details
                          </Button>
                          <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => setShowPreview(true)}>
                              Preview Policy
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button disabled={isSubmitting}>
                                  {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Policy Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to submit this policy application? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleSubmit}>
                                    Submit Application
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
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

export default function NewPolicyPage() {
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
          <p className="text-gray-600">Loading policy form...</p>
        </div>
      </div>
    }>
      <NewPolicyPageContent />
    </Suspense>
  );
}
