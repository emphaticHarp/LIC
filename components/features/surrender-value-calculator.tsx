"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingDown } from "lucide-react";

export function SurrenderValueCalculator() {
  const [sumAssured, setSumAssured] = useState("");
  const [premiumPaid, setPremiumPaid] = useState("");
  const [policyTerm, setPolicyTerm] = useState("20");
  const [yearsCompleted, setYearsCompleted] = useState("");
  const [policyType, setPolicyType] = useState("endowment");
  const [results, setResults] = useState<any>(null);

  const calculateSurrenderValue = () => {
    if (!sumAssured || !premiumPaid || !yearsCompleted) {
      alert("Please fill all fields");
      return;
    }

    const sum = parseFloat(sumAssured);
    const premium = parseFloat(premiumPaid);
    const years = parseInt(yearsCompleted);
    const term = parseInt(policyTerm);

    // Surrender value calculation based on IRDA guidelines
    let surrenderPercentage = 0;

    if (years < 1) {
      surrenderPercentage = 0; // No surrender value in first year
    } else if (years < 3) {
      surrenderPercentage = 30; // 30% of premium paid
    } else if (years < 5) {
      surrenderPercentage = 50; // 50% of premium paid
    } else if (years < 10) {
      surrenderPercentage = 75; // 75% of premium paid
    } else {
      surrenderPercentage = 90; // 90% of premium paid
    }

    const totalPremiumPaid = premium * years;
    const surrenderValue = (totalPremiumPaid * surrenderPercentage) / 100;

    // Bonus calculation (if applicable)
    let bonusValue = 0;
    if (policyType === "with-profit") {
      const bonusPerYear = sum * 0.04; // 4% annual bonus
      bonusValue = bonusPerYear * years;
    }

    const totalSurrenderValue = surrenderValue + bonusValue;
    const premiumLoss = totalPremiumPaid - totalSurrenderValue;
    const lossPercentage = (premiumLoss / totalPremiumPaid) * 100;

    setResults({
      sumAssured: sum,
      totalPremiumPaid,
      yearsCompleted: years,
      surrenderPercentage,
      surrenderValue,
      bonusValue,
      totalSurrenderValue,
      premiumLoss,
      lossPercentage,
      policyType,
      term,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5" /> Surrender Value Calculator
        </CardTitle>
        <CardDescription>Calculate policy surrender value as per IRDA guidelines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sumAssured">Sum Assured (₹)</Label>
            <Input
              id="sumAssured"
              type="number"
              placeholder="Enter sum assured"
              value={sumAssured}
              onChange={(e) => setSumAssured(e.target.value)}
              className="text-lg"
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
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyTerm">Policy Term (Years)</Label>
            <Select value={policyTerm} onValueChange={setPolicyTerm}>
              <SelectTrigger id="policyTerm">
                <SelectValue />
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
              max={policyTerm}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="policyType">Policy Type</Label>
            <Select value={policyType} onValueChange={setPolicyType}>
              <SelectTrigger id="policyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="term">Term Insurance</SelectItem>
                <SelectItem value="endowment">Endowment</SelectItem>
                <SelectItem value="with-profit">With Profit</SelectItem>
                <SelectItem value="ulip">ULIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateSurrenderValue} className="w-full bg-blue-600 hover:bg-blue-700">
          Calculate Surrender Value
        </Button>

        {results && (
          <div className="space-y-4 mt-6 border-t pt-6">
            {results.yearsCompleted < 1 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 ml-2">
                  No surrender value available in the first year of the policy
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Premium Paid</p>
                <p className="text-2xl font-bold text-blue-600">₹{results.totalPremiumPaid.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Surrender Value</p>
                <p className="text-2xl font-bold text-green-600">₹{results.surrenderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500 mt-1">{results.surrenderPercentage}% of premium paid</p>
              </div>

              {results.bonusValue > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Bonus Value</p>
                  <p className="text-2xl font-bold text-purple-600">₹{results.bonusValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                </div>
              )}

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Surrender Value</p>
                <p className="text-2xl font-bold text-orange-600">₹{results.totalSurrenderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Premium Loss</p>
                <p className="text-2xl font-bold text-red-600">₹{results.premiumLoss.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <p className="text-xs text-gray-500 mt-1">{results.lossPercentage.toFixed(2)}% loss</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold text-gray-600">{(100 - results.lossPercentage).toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">of premium retained</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-semibold">Surrender Value Breakdown</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Sum Assured:</span>
                  <span className="font-semibold">₹{results.sumAssured.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Years Completed:</span>
                  <span className="font-semibold">{results.yearsCompleted} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Surrender Percentage:</span>
                  <span className="font-semibold">{results.surrenderPercentage}%</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                  <span>Net Surrender Value:</span>
                  <span className="text-green-600">₹{results.totalSurrenderValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 ml-2 text-sm">
                Note: Surrender value is calculated as per IRDA guidelines. Actual surrender value may vary based on policy terms and conditions.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
