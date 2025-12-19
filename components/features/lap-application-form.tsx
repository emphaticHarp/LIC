"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface LAPFormData {
  policyId: string;
  policyType: string;
  sumAssured: string;
  loanAmount: string;
  loanPurpose: string;
  loanTerm: string;
  interestRate: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  remarks: string;
}

export function LAPApplicationForm() {
  const [formData, setFormData] = useState<LAPFormData>({
    policyId: "",
    policyType: "endowment",
    sumAssured: "",
    loanAmount: "",
    loanPurpose: "personal",
    loanTerm: "12",
    interestRate: "8.5",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lapDetails, setLapDetails] = useState<any>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.policyId.trim()) newErrors.policyId = "Policy ID is required";
    if (!formData.sumAssured) newErrors.sumAssured = "Sum assured is required";
    if (!formData.loanAmount) newErrors.loanAmount = "Loan amount is required";
    if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
    if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account number is required";
    if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";

    const sumAssured = parseFloat(formData.sumAssured);
    const loanAmount = parseFloat(formData.loanAmount);

    if (loanAmount > sumAssured * 0.8) {
      newErrors.loanAmount = `Loan amount cannot exceed 80% of sum assured (₹${(sumAssured * 0.8).toLocaleString("en-IN", { maximumFractionDigits: 0 })})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const sumAssured = parseFloat(formData.sumAssured);
    const loanAmount = parseFloat(formData.loanAmount);
    const interestRate = parseFloat(formData.interestRate);
    const loanTerm = parseInt(formData.loanTerm);

    const monthlyInterestRate = interestRate / 12 / 100;
    const monthlyEMI = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / 
                       (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    const totalInterest = (monthlyEMI * loanTerm) - loanAmount;

    setLapDetails({
      lapId: `LAP-${Date.now()}`,
      applicationDate: new Date().toLocaleDateString(),
      policyId: formData.policyId,
      loanAmount,
      loanTerm,
      interestRate,
      monthlyEMI: monthlyEMI.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalRepayment: (loanAmount + totalInterest).toFixed(2),
      status: "approved",
    });

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof LAPFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (submitted && lapDetails) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" /> LAP Application Submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              Your LAP application has been successfully submitted and approved!
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">LAP ID</p>
              <p className="text-xl font-bold text-blue-600">{lapDetails.lapId}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Loan Amount</p>
              <p className="text-xl font-bold text-green-600">₹{parseFloat(lapDetails.loanAmount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-xl font-bold text-purple-600">₹{parseFloat(lapDetails.monthlyEMI).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Loan Term</p>
              <p className="text-xl font-bold text-orange-600">{lapDetails.loanTerm} months</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <p className="font-semibold">Loan Summary</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Loan Amount:</span>
                <span className="font-semibold">₹{parseFloat(lapDetails.loanAmount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Interest Rate:</span>
                <span className="font-semibold">{lapDetails.interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Term:</span>
                <span className="font-semibold">{lapDetails.loanTerm} months</span>
              </div>
              <div className="flex justify-between">
                <span>Total Interest:</span>
                <span className="font-semibold">₹{parseFloat(lapDetails.totalInterest).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                <span>Total Repayment:</span>
                <span className="text-green-600">₹{parseFloat(lapDetails.totalRepayment).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <Button onClick={() => setSubmitted(false)} className="w-full">
            Apply for Another LAP
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>LAP Application Form</CardTitle>
        <CardDescription>Apply for Loan Against Policy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policyId">Policy ID *</Label>
              <Input
                id="policyId"
                placeholder="Enter policy ID"
                value={formData.policyId}
                onChange={(e) => handleInputChange("policyId", e.target.value)}
                className={errors.policyId ? "border-red-500" : ""}
              />
              {errors.policyId && <p className="text-red-600 text-sm">{errors.policyId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyType">Policy Type</Label>
              <Select value={formData.policyType} onValueChange={(value) => handleInputChange("policyType", value)}>
                <SelectTrigger id="policyType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endowment">Endowment</SelectItem>
                  <SelectItem value="with-profit">With Profit</SelectItem>
                  <SelectItem value="ulip">ULIP</SelectItem>
                  <SelectItem value="term">Term Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sumAssured">Sum Assured (₹) *</Label>
              <Input
                id="sumAssured"
                type="number"
                placeholder="Enter sum assured"
                value={formData.sumAssured}
                onChange={(e) => handleInputChange("sumAssured", e.target.value)}
                className={errors.sumAssured ? "border-red-500" : ""}
              />
              {errors.sumAssured && <p className="text-red-600 text-sm">{errors.sumAssured}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="Enter loan amount"
                value={formData.loanAmount}
                onChange={(e) => handleInputChange("loanAmount", e.target.value)}
                className={errors.loanAmount ? "border-red-500" : ""}
              />
              {errors.loanAmount && <p className="text-red-600 text-sm">{errors.loanAmount}</p>}
              {formData.sumAssured && (
                <p className="text-xs text-gray-500">Max: ₹{(parseFloat(formData.sumAssured) * 0.8).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanPurpose">Loan Purpose</Label>
              <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange("loanPurpose", value)}>
                <SelectTrigger id="loanPurpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term (Months)</Label>
              <Select value={formData.loanTerm} onValueChange={(value) => handleInputChange("loanTerm", value)}>
                <SelectTrigger id="loanTerm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                  <SelectItem value="48">48 Months</SelectItem>
                  <SelectItem value="60">60 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="Enter interest rate"
                value={formData.interestRate}
                onChange={(e) => handleInputChange("interestRate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className={errors.bankName ? "border-red-500" : ""}
              />
              {errors.bankName && <p className="text-red-600 text-sm">{errors.bankName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                className={errors.accountNumber ? "border-red-500" : ""}
              />
              {errors.accountNumber && <p className="text-red-600 text-sm">{errors.accountNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code *</Label>
              <Input
                id="ifscCode"
                placeholder="Enter IFSC code"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                className={errors.ifscCode ? "border-red-500" : ""}
              />
              {errors.ifscCode && <p className="text-red-600 text-sm">{errors.ifscCode}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Enter any additional remarks"
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Submitting..." : "Submit LAP Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
