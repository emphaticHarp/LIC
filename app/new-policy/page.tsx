"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { jsPDF } from 'jspdf';
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { BreadcrumbNav } from "@/components/features/breadcrumb-nav";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { FormSkeleton } from "@/components/ui/skeleton";

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertErrors, setAlertErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [policyNumber, setPolicyNumber] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [states, setStates] = useState<Array<{id: string; name: string}>>([]);
  const [cities, setCities] = useState<Array<{id: string; name: string}>>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  const [formData, setFormData] = useState({
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
    policyType: "",
    policyTerm: "",
    sumAssured: "",
    premiumFrequency: "Yearly",
    premiumMode: "Online",
    paymentMethod: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
    nomineeEmail: "",
    nomineeDOB: "",
    nomineeAddress: "",
    height: "",
    weight: "",
    bloodGroup: "",
    medicalHistory: "",
    existingIllnesses: "",
    medications: "",
    surgeries: "",
    familyMedicalHistory: "",
    existingPolicies: "0",
    smokingHabits: "No",
    alcoholConsumption: "No",
    dangerousHobbies: "No",
    agentCode: "",
    branchCode: "",
    appointmentDate: "",
    idProof: "",
    addressProof: "",
    incomeProof: "",
    medicalCertificate: "",
    photographs: "",
    documents: [],
    termsAccepted: false
  });

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
    
    // Load form data from localStorage
    const savedFormData = localStorage.getItem("policyFormData");
    if (savedFormData) {
      try {
        setFormData(JSON.parse(savedFormData));
      } catch (e) {
        console.error("Failed to load saved form data");
      }
    }
    
    setIsLoading(false);
  }, [searchParams]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("policyFormData", JSON.stringify(formData));
  }, [formData]);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await fetch('/api/locations?type=states');
        const data = await response.json();
        if (data.success) {
          setStates(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.applicantState) {
      const fetchCities = async () => {
        setLoadingCities(true);
        try {
          const response = await fetch(`/api/locations?type=cities&stateId=${formData.applicantState}`);
          const data = await response.json();
          if (data.success) {
            setCities(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch cities:', error);
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [formData.applicantState]);

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
    
    // Validate field and show error if needed
    if (typeof value === "string" && value.trim()) {
      const error = validateField(field, value);
      setFieldErrors(prev => ({
        ...prev,
        [field]: error || ""
      }));
    }
  };

  const validateField = (field: string, value: string): string | null => {
    if (!value?.trim()) return null;
    
    switch (field) {
      case "applicantEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format (e.g., user@example.com)";
        break;
      case "applicantPhone":
      case "nomineePhone":
        if (!/^[6-9]\d{9}$/.test(value.replace(/\D/g, ""))) return "Phone must be 10 digits starting with 6-9";
        break;
      case "applicantAadhaar":
        if (!/^\d{12}$/.test(value.replace(/\D/g, ""))) return "Aadhaar must be 12 digits";
        break;
      case "applicantPAN":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) return "PAN format: AAAAA9999A";
        break;
      case "applicantPincode":
        if (!/^\d{6}$/.test(value.replace(/\D/g, ""))) return "Pincode must be 6 digits";
        break;
      case "applicantDOB":
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18 || age > 65) return "Age must be between 18 and 65 years";
        break;
      case "applicantAnnualIncome":
        if (Number(value) < 100000) return "Annual income must be at least ₹1,00,000";
        break;
      case "height":
        if (Number(value) < 100 || Number(value) > 250) return "Height must be between 100-250 cm";
        break;
      case "weight":
        if (Number(value) < 30 || Number(value) > 200) return "Weight must be between 30-200 kg";
        break;
    }
    return null;
  };

  const validateTab = (tab: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (tab === "applicant") {
      if (!formData.applicantName?.trim()) errors.push("Full name is required");
      if (!formData.applicantEmail?.trim()) errors.push("Email is required");
      else {
        const emailError = validateField("applicantEmail", formData.applicantEmail);
        if (emailError) errors.push(emailError);
      }
      if (!formData.applicantPhone?.trim()) errors.push("Phone number is required");
      else {
        const phoneError = validateField("applicantPhone", formData.applicantPhone);
        if (phoneError) errors.push(phoneError);
      }
      if (!formData.applicantAadhaar?.trim()) errors.push("Aadhaar number is required");
      else {
        const aadhaarError = validateField("applicantAadhaar", formData.applicantAadhaar);
        if (aadhaarError) errors.push(aadhaarError);
      }
      if (!formData.applicantPAN?.trim()) errors.push("PAN number is required");
      else {
        const panError = validateField("applicantPAN", formData.applicantPAN);
        if (panError) errors.push(panError);
      }
      if (!formData.applicantDOB?.trim()) errors.push("Date of birth is required");
      else {
        const ageError = validateField("applicantDOB", formData.applicantDOB);
        if (ageError) errors.push(ageError);
      }
      if (!formData.applicantGender?.trim()) errors.push("Gender is required");
      if (!formData.applicantMaritalStatus?.trim()) errors.push("Marital status is required");
      if (!formData.applicantOccupation?.trim()) errors.push("Occupation is required");
      if (!formData.applicantAnnualIncome?.trim()) errors.push("Annual income is required");
      else {
        const incomeError = validateField("applicantAnnualIncome", formData.applicantAnnualIncome);
        if (incomeError) errors.push(incomeError);
      }
      if (!formData.applicantAddress?.trim()) errors.push("Address is required");
      if (!formData.applicantCity?.trim()) errors.push("City is required");
      if (!formData.applicantState?.trim()) errors.push("State is required");
      if (!formData.applicantPincode?.trim()) errors.push("Pincode is required");
      else {
        const pincodeError = validateField("applicantPincode", formData.applicantPincode);
        if (pincodeError) errors.push(pincodeError);
      }
    }
    
    if (tab === "policy") {
      if (!formData.policyType?.trim()) errors.push("Policy type is required");
      if (!formData.policyTerm?.trim()) errors.push("Policy term is required");
      if (!formData.sumAssured?.trim()) errors.push("Sum assured is required");
      if (premiumCalculation.yearlyPremium <= 0) errors.push("Please calculate premium first");
    }
    
    if (tab === "nominee") {
      if (!formData.nomineeName?.trim()) errors.push("Nominee name is required");
      if (!formData.nomineeRelation?.trim()) errors.push("Nominee relationship is required");
      if (!formData.nomineePhone?.trim()) errors.push("Nominee phone is required");
      else {
        const phoneError = validateField("nomineePhone", formData.nomineePhone);
        if (phoneError) errors.push(phoneError);
      }
      if (!formData.height?.trim()) errors.push("Height is required");
      else {
        const heightError = validateField("height", formData.height);
        if (heightError) errors.push(heightError);
      }
      if (!formData.weight?.trim()) errors.push("Weight is required");
      else {
        const weightError = validateField("weight", formData.weight);
        if (weightError) errors.push(weightError);
      }
      if (!formData.bloodGroup?.trim()) errors.push("Blood group is required");
    }
    
    if (tab === "review") {
      if (!formData.termsAccepted) errors.push("Please accept the terms and conditions");
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const showValidationAlert = (errors: string[]) => {
    setAlertType("destructive");
    setAlertTitle("Validation Error");
    setAlertMessage("Please fill in all required fields:");
    setAlertErrors(errors);
    setShowAlert(true);
  };

  const handleTabChange = (newTab: string) => {
    const tabOrder = ["applicant", "policy", "nominee", "review"];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    
    if (newIndex > currentIndex) {
      const validation = validateTab(activeTab);
      if (!validation.isValid) {
        showValidationAlert(validation.errors);
        return;
      }
    }
    
    setActiveTab(newTab);
    setShowAlert(false);
  };

  const calculatePremium = async () => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sumAssured = parseFloat(formData.sumAssured) || 0;
    const policyTerm = parseInt(formData.policyTerm) || 10;
    
    let basePremium = (sumAssured * 0.001) * (policyTerm / 20);
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

  const handleSubmit = async () => {
    const validation = validateTab("review");
    
    if (!validation.isValid) {
      showValidationAlert(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const newPolicyNumber = "LIC-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setPolicyNumber(newPolicyNumber);
      setShowSuccessModal(true);
      
      // Clear localStorage after successful submission
      localStorage.removeItem("policyFormData");
      
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push('/policies');
      }, 5000);
    } catch (error) {
      showValidationAlert(["Submission failed. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2Icon className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Policy Created Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Your Policy Number</p>
                <p className="text-2xl font-bold text-blue-600">{policyNumber}</p>
              </div>
              <p className="text-sm text-gray-600 text-center">
                A confirmation email has been sent to {formData.applicantEmail}
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/policies')}>
                  View Policies
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  setShowSuccessModal(false);
                  setFormData({
                    applicantName: "", applicantEmail: "", applicantPhone: "", applicantAadhaar: "",
                    applicantPAN: "", applicantDOB: "", applicantGender: "", applicantMaritalStatus: "",
                    applicantOccupation: "", applicantAnnualIncome: "", applicantAddress: "",
                    applicantCity: "", applicantState: "", applicantPincode: "", policyType: "",
                    policyTerm: "", sumAssured: "", premiumFrequency: "Yearly", premiumMode: "Online",
                    paymentMethod: "", nomineeName: "", nomineeRelation: "", nomineePhone: "",
                    nomineeEmail: "", nomineeDOB: "", nomineeAddress: "", height: "", weight: "",
                    bloodGroup: "", medicalHistory: "", existingIllnesses: "", medications: "",
                    surgeries: "", familyMedicalHistory: "", existingPolicies: "0", smokingHabits: "No",
                    alcoholConsumption: "No", dangerousHobbies: "No", agentCode: "", branchCode: "",
                    appointmentDate: "", idProof: "", addressProof: "", incomeProof: "",
                    medicalCertificate: "", photographs: "", documents: [], termsAccepted: false
                  });
                  setActiveTab("applicant");
                }}>
                  Create Another Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {showAlert && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md">
          <Alert variant={alertType === "destructive" ? "destructive" : "default"}>
            {alertType === "success" ? <CheckCircle2Icon className="h-4 w-4" /> : <AlertCircleIcon className="h-4 w-4" />}
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>
              {alertMessage}
              {alertErrors.length > 0 && (
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  {alertErrors.map((error, idx) => (
                    <li key={idx} className="text-sm">{error}</li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
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

      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Breadcrumbs */}
            <BreadcrumbNav />
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">New Policy Application</h1>
              <p className="text-gray-600">Create a new insurance policy for your customer</p>
            </div>

            {isLoading ? (
              <FormSkeleton />
            ) : (
              <div className="space-y-6">
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
                      <span className="text-sm font-medium">Review</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="applicant">Applicant</TabsTrigger>
                  <TabsTrigger value="policy">Policy</TabsTrigger>
                  <TabsTrigger value="nominee">Nominee</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>

                <TabsContent value="applicant" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Applicant Information</CardTitle>
                      <CardDescription>Enter the applicant personal and contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="applicantName">Full Name * <span className="text-xs text-gray-500">(Min 3 characters)</span></Label>
                          <Input
                            id="applicantName"
                            aria-label="Applicant full name"
                            value={formData.applicantName}
                            onChange={(e) => handleInputChange("applicantName", e.target.value)}
                            placeholder="Enter full name"
                            className={fieldErrors.applicantName ? "border-red-500" : ""}
                          />
                          {fieldErrors.applicantName && <p className="text-xs text-red-500">{fieldErrors.applicantName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applicantEmail">Email Address * <span className="text-xs text-gray-500">(e.g., user@example.com)</span></Label>
                          <Input
                            id="applicantEmail"
                            type="email"
                            aria-label="Applicant email address"
                            value={formData.applicantEmail}
                            onChange={(e) => handleInputChange("applicantEmail", e.target.value)}
                            placeholder="Enter email address"
                            className={fieldErrors.applicantEmail ? "border-red-500" : ""}
                          />
                          {fieldErrors.applicantEmail && <p className="text-xs text-red-500">{fieldErrors.applicantEmail}</p>}
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
                          <Label htmlFor="applicantAadhaar">Aadhaar Number *</Label>
                          <Input
                            id="applicantAadhaar"
                            value={formData.applicantAadhaar}
                            onChange={(e) => handleInputChange("applicantAadhaar", e.target.value)}
                            placeholder="Enter 12-digit Aadhaar number"
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
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Divorced">Divorced</SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <Label htmlFor="applicantAnnualIncome">Annual Income *</Label>
                          <Input
                            id="applicantAnnualIncome"
                            type="number"
                            value={formData.applicantAnnualIncome}
                            onChange={(e) => handleInputChange("applicantAnnualIncome", e.target.value)}
                            placeholder="Enter annual income"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="applicantAddress">Address *</Label>
                        <Textarea
                          id="applicantAddress"
                          value={formData.applicantAddress}
                          onChange={(e) => handleInputChange("applicantAddress", e.target.value)}
                          placeholder="Enter complete address"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="applicantState">State *</Label>
                          <Select value={formData.applicantState} onValueChange={(value) => {
                            handleInputChange("applicantState", value);
                            handleInputChange("applicantCity", "");
                            handleInputChange("applicantPincode", "");
                          }}>
                            <SelectTrigger aria-label="Select state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applicantCity">City * {!formData.applicantState && <span className="text-xs text-gray-500">(Select state first)</span>}</Label>
                          <Select value={formData.applicantCity} onValueChange={(value) => {
                            handleInputChange("applicantCity", value);
                            handleInputChange("applicantPincode", "");
                          }} disabled={!formData.applicantState}>
                            <SelectTrigger aria-label="Select city" className={!formData.applicantState ? "opacity-50" : ""}>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applicantPincode">Pincode *</Label>
                          <Input
                            id="applicantPincode"
                            type="text"
                            placeholder="Enter 6-digit pincode"
                            value={formData.applicantPincode}
                            onChange={(e) => handleInputChange("applicantPincode", e.target.value)}
                            maxLength={6}
                            className={fieldErrors.applicantPincode ? "border-red-500" : ""}
                            aria-label="Enter pincode"
                          />
                          {fieldErrors.applicantPincode && <p className="text-red-500 text-sm">{fieldErrors.applicantPincode}</p>}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => handleTabChange('policy')} className="bg-blue-600 hover:bg-blue-700">
                          Next: Policy Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="policy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Policy Details</CardTitle>
                      <CardDescription>Select policy type and configure coverage</CardDescription>
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
                              <SelectItem value="Health">Health Insurance</SelectItem>
                              <SelectItem value="Whole Life">Whole Life Insurance</SelectItem>
                              <SelectItem value="Money Back">Money Back Plan</SelectItem>
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
                            placeholder="Enter policy term"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sumAssured">Sum Assured *</Label>
                          <Input
                            id="sumAssured"
                            type="number"
                            value={formData.sumAssured}
                            onChange={(e) => handleInputChange("sumAssured", e.target.value)}
                            placeholder="Enter sum assured"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="premiumFrequency">Premium Frequency *</Label>
                          <Select value={formData.premiumFrequency} onValueChange={(value) => handleInputChange("premiumFrequency", value)}>
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
                      </div>
                      <Button onClick={calculatePremium} disabled={isCalculating}>
                        {isCalculating ? "Calculating..." : "Calculate Premium"}
                      </Button>
                      {premiumCalculation.yearlyPremium > 0 && (
                        <Card className="bg-blue-50">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              <div>
                                <p className="text-sm text-gray-600">Monthly</p>
                                <p className="text-lg font-bold">₹{premiumCalculation.monthlyPremium.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Quarterly</p>
                                <p className="text-lg font-bold">₹{premiumCalculation.quarterlyPremium.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Half-Yearly</p>
                                <p className="text-lg font-bold">₹{(premiumCalculation.yearlyPremium / 2).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Yearly</p>
                                <p className="text-lg font-bold">₹{premiumCalculation.yearlyPremium.toLocaleString()}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => handleTabChange('applicant')}>
                          Previous
                        </Button>
                        <Button onClick={() => handleTabChange('nominee')} className="bg-blue-600 hover:bg-blue-700">
                          Next: Nominee
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="nominee" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nominee & Medical Information</CardTitle>
                      <CardDescription>Enter nominee and health details</CardDescription>
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
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nomineePhone">Nominee Phone *</Label>
                          <Input
                            id="nomineePhone"
                            value={formData.nomineePhone}
                            onChange={(e) => handleInputChange("nomineePhone", e.target.value)}
                            placeholder="Enter nominee phone"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nomineeEmail">Nominee Email</Label>
                          <Input
                            id="nomineeEmail"
                            type="email"
                            value={formData.nomineeEmail}
                            onChange={(e) => handleInputChange("nomineeEmail", e.target.value)}
                            placeholder="Enter nominee email"
                          />
                        </div>
                      </div>
                      <Separator />
                      <h3 className="text-lg font-semibold">Medical Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm) *</Label>
                          <Input
                            id="height"
                            type="number"
                            value={formData.height}
                            onChange={(e) => handleInputChange("height", e.target.value)}
                            placeholder="Enter height in cm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg) *</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={formData.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                            placeholder="Enter weight in kg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup">Blood Group *</Label>
                          <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smokingHabits">Smoking Habits</Label>
                          <Select value={formData.smokingHabits} onValueChange={(value) => handleInputChange("smokingHabits", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select smoking status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="No">Non-Smoker</SelectItem>
                              <SelectItem value="Yes">Smoker</SelectItem>
                              <SelectItem value="Occasional">Occasional</SelectItem>
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
                          placeholder="Enter any medical conditions or illnesses"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => handleTabChange('policy')}>
                          Previous
                        </Button>
                        <Button onClick={() => handleTabChange('review')} className="bg-blue-600 hover:bg-blue-700">
                          Next: Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="review" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Application</CardTitle>
                      <CardDescription>Review all details before submitting</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-blue-600">Applicant Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                            <p><strong>Name:</strong> {formData.applicantName || "—"}</p>
                            <p><strong>Email:</strong> {formData.applicantEmail || "—"}</p>
                            <p><strong>Phone:</strong> {formData.applicantPhone || "—"}</p>
                            <p><strong>Aadhaar:</strong> {formData.applicantAadhaar || "—"}</p>
                            <p><strong>PAN:</strong> {formData.applicantPAN || "—"}</p>
                            <p><strong>DOB:</strong> {formData.applicantDOB || "—"}</p>
                            <p><strong>Gender:</strong> {formData.applicantGender || "—"}</p>
                            <p><strong>Marital Status:</strong> {formData.applicantMaritalStatus || "—"}</p>
                            <p><strong>Occupation:</strong> {formData.applicantOccupation || "—"}</p>
                            <p><strong>Annual Income:</strong> ₹{Number(formData.applicantAnnualIncome).toLocaleString() || "—"}</p>
                            <p className="md:col-span-2"><strong>Address:</strong> {formData.applicantAddress || "—"}</p>
                            <p><strong>City:</strong> {formData.applicantCity || "—"}</p>
                            <p><strong>State:</strong> {formData.applicantState || "—"}</p>
                            <p><strong>Pincode:</strong> {formData.applicantPincode || "—"}</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-blue-600">Policy Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                            <p><strong>Policy Type:</strong> {formData.policyType || "—"}</p>
                            <p><strong>Policy Term:</strong> {formData.policyTerm || "—"} years</p>
                            <p><strong>Sum Assured:</strong> ₹{Number(formData.sumAssured).toLocaleString() || "—"}</p>
                            <p><strong>Premium Frequency:</strong> {formData.premiumFrequency || "—"}</p>
                            <p><strong>Annual Premium:</strong> ₹{premiumCalculation.yearlyPremium.toLocaleString() || "—"}</p>
                            <p><strong>Monthly Premium:</strong> ₹{premiumCalculation.monthlyPremium.toLocaleString() || "—"}</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-blue-600">Nominee & Medical Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                            <p><strong>Nominee Name:</strong> {formData.nomineeName || "—"}</p>
                            <p><strong>Relationship:</strong> {formData.nomineeRelation || "—"}</p>
                            <p><strong>Nominee Phone:</strong> {formData.nomineePhone || "—"}</p>
                            <p><strong>Height:</strong> {formData.height || "—"} cm</p>
                            <p><strong>Weight:</strong> {formData.weight || "—"} kg</p>
                            <p><strong>Blood Group:</strong> {formData.bloodGroup || "—"}</p>
                            <p><strong>Smoking Habits:</strong> {formData.smokingHabits || "—"}</p>
                            <p className="md:col-span-2"><strong>Medical History:</strong> {formData.medicalHistory || "None"}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center space-x-4">
                        <Switch 
                          id="terms" 
                          aria-label="Accept terms and conditions"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                        />
                        <Label htmlFor="terms">I confirm all information is accurate and complete</Label>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => handleTabChange('nominee')}>
                          Previous
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
                                Are you sure you want to submit this policy application?
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
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            )}
          </div>
        </div>

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
