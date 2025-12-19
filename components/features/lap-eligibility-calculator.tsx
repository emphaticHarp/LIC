"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

export function LAPEligibilityCalculator() {
  const [policyTerm, setPolicyTerm] = useState("");
  const [yearsCompleted, setYearsCompleted] = useState("");
  const [sumAssured, setSumAssured] = useState("");
  const [premiumPaid, setPremiumPaid] = useState("");
  const [policyStatus, setPolicyStatus] = useState("active");
  const [results, setResults] = useState<any>(null);

  const calculateEligibility = () => {
    if (!policyTerm || !yearsCompleted || !sumAssured || !premiumPaid) {
      alert("Please fill all fields");
      return;
    }

    const term = parseInt(policyTerm);
    const years = parseInt(yearsCompleted);
    const sum = parseFloat(sumAssured);
    const premium = parseFloat(premiumPaid);

    let isEligible = true;
    const reasons: string[] = [];

    // Check eligibility criteria
    if (years < 3) {
      isEligible = false;
      reasons.push("Policy must be active for at least 3 years");
    }

    if (policyStatus !== "active") {
      isEligible = false;
      reasons.push("Policy must be in active status");
    }

    if (premium <= 0) {
      isEligible = false;
      reasons.push("Premium must be greater than zero");
    }

    // Calculate surrender value
    let surrenderPercentage = 0;
    if (years >= 10) {
      surrenderPercentage = 90;
    } else if (years >= 5) {
      surrenderPercentage = 75;
    } else if (years >= 3) {
      surrenderPercentage = 50;
    }

    const totalPremiumPaid = premium * years;
    const surrenderValue = (totalPremiumPaid * surrenderPercentage) / 100;

    // LAP eligibility amount (80% of surrender value)
    const maxLoanAmount = surrenderValue * 0.8;

    // Interest rate based on policy type and tenure
    const baseRate = 8.5;
    const interestRate = baseRate + (years < 5 ? 0.5 : 0);

    setResults({
      isEligible,
      reasons,
      totalPremiumPaid,
      surrenderValue,
      surrenderPercentage,
      maxLoanAmount,
      interestRate,
      yearsCompleted: years,
      policyTerm: term,
      sumAssured: sum,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> LAP Eligibility Calculator
        </CardTitle>
        <CardDescription>Check your eligibility for Loan Against Policy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="policyTerm">Policy Term (Years)</Label>
            <Select value={policyTerm} onValueChange={setPolicyTerm}>
              <SelectTrigger id="policyTerm">
                <SelectValue placeholder="Select policy term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Years</SelectItem>
                <SelectItem value="15">15 Years</SelectItem>
                <SelectItem value="20">20 Years</SelectItem>
                <SelectItem value="25">25 Years</SelectItem>
                <SelectItem value="30">30 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsCompleted">Years Completed</Label>
            <Input
              id="yearsCompleted"
              type="number"
              placeholder="Enter years completed"
              value={yearsCompleted}
              onChange={(e) => setYearsCompleted(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sumAssured">Sum Assured (₹)</Label>
            <Input
              id="sumAssured"
              type="number"
              placeholder="Enter sum assured"
              value={sumAssured}
              onChange={(e) => setSumAssured(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="premiumPaid">Annual Premium (₹)</Label>
            <Input
              id="premiumPaid"
              type="number"
              placeholder="Enter annual premium"
              value={premiumPaid}
              onChange={(e) => setPremiumPaid(e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="policyStatus">Policy Status</Label>
            <Select value={policyStatus} onValueChange={setPolicyStatus}>
              <SelectTrigger id="policyStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="lapsed">Lapsed</SelectItem>
                <SelectItem value="surrendered">Surrendered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateEligibility} className="w-full bg-blue-600 hover:bg-blue-700">
          Check Eligibility
        </Button>

        {results && (
          <div className="space-y-4 mt-6 border-t pt-6">
            {results.isEligible ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 ml-2">
                  <strong>Congratulations!</strong> You are eligible for LAP. Maximum loan amount: ₹{results.maxLoanAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 ml-2">
                  <strong>Not Eligible</strong> for LAP at this time.
                </AlertDescription>
              </Alert>
            )}

            {results.reasons.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="font-semibold text-yellow-800 mb-2">Eligibility Criteria:</p>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {results.reasons.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Premium Paid</p>
                <p className="text-2xl font-bold text-blue-600">₹{results.totalPremiumPaid.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Surrender Value</p>
                <p className="text-2xl font-bold text-green-600">₹{results.surrenderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500 mt-1">{results.surrenderPercentage}% of premium</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Max Loan Amount</p>
                <p className="text-2xl font-bold text-purple-600">₹{results.maxLoanAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500 mt-1">80% of surrender value</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="text-2xl font-bold text-orange-600">{results.interestRate}% p.a.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-semibold">LAP Eligibility Summary</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Policy Term:</span>
                  <span className="font-semibold">{results.policyTerm} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Years Completed:</span>
                  <span className="font-semibold">{results.yearsCompleted} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Sum Assured:</span>
                  <span className="font-semibold">₹{results.sumAssured.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                  <span>Eligible for LAP:</span>
                  <span className={results.isEligible ? "text-green-600" : "text-red-600"}>
                    {results.isEligible ? "YES" : "NO"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
