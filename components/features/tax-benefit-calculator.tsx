"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function TaxBenefitCalculator() {
  const [premiumAmount, setPremiumAmount] = useState("");
  const [policyType, setPolicyType] = useState("life");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [taxBracket, setTaxBracket] = useState("20");
  const [results, setResults] = useState<any>(null);

  const calculateTaxBenefits = () => {
    if (!premiumAmount || !age || !income) {
      alert("Please fill all fields");
      return;
    }

    const premium = parseFloat(premiumAmount);
    const annualIncome = parseFloat(income);
    const ageNum = parseInt(age);
    const taxRate = parseFloat(taxBracket) / 100;

    // Section 80C limit: ₹1,50,000
    const section80CLimit = 150000;
    const section80CDeduction = Math.min(premium, section80CLimit);

    // Section 80D (Health Insurance) - Additional benefit
    let section80DDeduction = 0;
    if (policyType === "health") {
      if (ageNum >= 60) {
        section80DDeduction = Math.min(premium, 50000);
      } else {
        section80DDeduction = Math.min(premium, 25000);
      }
    }

    // Section 80CCC (Pension) - If applicable
    const section80CCDeduction = policyType === "pension" ? Math.min(premium, 150000) : 0;

    const totalDeduction = section80CDeduction + section80DDeduction + section80CCDeduction;
    const taxSavings = totalDeduction * taxRate;
    const effectivePremium = premium - taxSavings;

    setResults({
      premium,
      section80CDeduction,
      section80DDeduction,
      section80CCDeduction,
      totalDeduction,
      taxSavings,
      effectivePremium,
      taxRate: parseFloat(taxBracket),
      annualIncome,
      age: ageNum,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">💰</span> Tax Benefit Calculator
        </CardTitle>
        <CardDescription>Calculate tax savings under Section 80C, 80D, and 80CCC</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="premium">Annual Premium Amount (₹)</Label>
            <Input
              id="premium"
              type="number"
              placeholder="Enter premium amount"
              value={premiumAmount}
              onChange={(e) => setPremiumAmount(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyType">Policy Type</Label>
            <Select value={policyType} onValueChange={setPolicyType}>
              <SelectTrigger id="policyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="life">Life Insurance (80C)</SelectItem>
                <SelectItem value="health">Health Insurance (80D)</SelectItem>
                <SelectItem value="pension">Pension Plan (80CCC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Annual Income (₹)</Label>
            <Input
              id="income"
              type="number"
              placeholder="Enter annual income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxBracket">Income Tax Bracket (%)</Label>
            <Select value={taxBracket} onValueChange={setTaxBracket}>
              <SelectTrigger id="taxBracket">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (No Tax)</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="15">15%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateTaxBenefits} className="w-full bg-blue-600 hover:bg-blue-700">
          Calculate Tax Benefits
        </Button>

        {results && (
          <div className="space-y-4 mt-6 border-t pt-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                <strong>Total Tax Savings: ₹{results.taxSavings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Section 80C Deduction</p>
                <p className="text-2xl font-bold text-blue-600">₹{results.section80CDeduction.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500 mt-1">Max Limit: ₹1,50,000</p>
              </div>

              {results.section80DDeduction > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Section 80D Deduction</p>
                  <p className="text-2xl font-bold text-purple-600">₹{results.section80DDeduction.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Max Limit: ₹{results.age >= 60 ? "50,000" : "25,000"}</p>
                </div>
              )}

              {results.section80CCDeduction > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Section 80CCC Deduction</p>
                  <p className="text-2xl font-bold text-orange-600">₹{results.section80CCDeduction.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-gray-500 mt-1">Pension Plans</p>
                </div>
              )}

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Effective Premium Cost</p>
                <p className="text-2xl font-bold text-green-600">₹{results.effectivePremium.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500 mt-1">After Tax Savings</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-semibold">Summary</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Annual Premium:</span>
                  <span className="font-semibold">₹{results.premium.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax Deduction:</span>
                  <span className="font-semibold">₹{results.totalDeduction.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Rate:</span>
                  <span className="font-semibold">{results.taxRate}%</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                  <span>Tax Savings:</span>
                  <span className="text-green-600">₹{results.taxSavings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
