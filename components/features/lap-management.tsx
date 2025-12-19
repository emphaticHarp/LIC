"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, TrendingDown } from "lucide-react";

interface LAPLoan {
  id: string;
  lapId: string;
  policyId: string;
  customerName: string;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyEMI: number;
  disbursementDate: string;
  status: "active" | "completed" | "defaulted";
  amountDisbursed: number;
  amountRepaid: number;
  remainingAmount: number;
  nextEMIDate: string;
}

export function LAPManagement() {
  const [loans, setLoans] = useState<LAPLoan[]>([
    {
      id: "1",
      lapId: "LAP-001",
      policyId: "LIC-123456789",
      customerName: "Rajesh Kumar",
      loanAmount: 400000,
      interestRate: 8.5,
      loanTerm: 12,
      monthlyEMI: 34500,
      disbursementDate: "2024-11-01",
      status: "active",
      amountDisbursed: 400000,
      amountRepaid: 69000,
      remainingAmount: 331000,
      nextEMIDate: "2024-12-10",
    },
    {
      id: "2",
      lapId: "LAP-002",
      policyId: "LIC-234567890",
      customerName: "Priya Sharma",
      loanAmount: 300000,
      interestRate: 8.5,
      loanTerm: 24,
      monthlyEMI: 13500,
      disbursementDate: "2024-10-15",
      status: "active",
      amountDisbursed: 300000,
      amountRepaid: 27000,
      remainingAmount: 273000,
      nextEMIDate: "2024-12-15",
    },
    {
      id: "3",
      lapId: "LAP-003",
      policyId: "LIC-345678901",
      customerName: "Amit Patel",
      loanAmount: 250000,
      interestRate: 9.0,
      loanTerm: 12,
      monthlyEMI: 21500,
      disbursementDate: "2024-09-01",
      status: "completed",
      amountDisbursed: 250000,
      amountRepaid: 250000,
      remainingAmount: 0,
      nextEMIDate: "2024-09-01",
    },
  ]);

  const calculateEMISchedule = (loan: LAPLoan) => {
    const schedule = [];
    let remainingAmount = loan.loanAmount;
    const monthlyRate = loan.interestRate / 12 / 100;

    for (let i = 1; i <= loan.loanTerm; i++) {
      const interestAmount = remainingAmount * monthlyRate;
      const principalAmount = loan.monthlyEMI - interestAmount;
      remainingAmount -= principalAmount;

      schedule.push({
        month: i,
        emi: loan.monthlyEMI,
        principal: principalAmount,
        interest: interestAmount,
        balance: Math.max(0, remainingAmount),
      });
    }

    return schedule;
  };

  const generateEMISchedule = (loan: LAPLoan) => {
    const schedule = calculateEMISchedule(loan);
    const csv = [
      ["Month", "EMI", "Principal", "Interest", "Balance"],
      ...schedule.map(row => [
        row.month,
        row.emi.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.balance.toFixed(2),
      ]),
    ]
      .map(row => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `emi-schedule-${loan.lapId}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalLoansActive = loans.filter(l => l.status === "active").length;
  const totalDisbursed = loans.reduce((sum, l) => sum + l.amountDisbursed, 0);
  const totalRepaid = loans.reduce((sum, l) => sum + l.amountRepaid, 0);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" /> LAP Management Dashboard
          </CardTitle>
          <CardDescription>Track disbursements, EMI payments, and loan status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-3xl font-bold text-blue-600">{totalLoansActive}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Disbursed</p>
              <p className="text-2xl font-bold text-green-600">₹{(totalDisbursed / 100000).toFixed(1)}L</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Repaid</p>
              <p className="text-2xl font-bold text-purple-600">₹{(totalRepaid / 100000).toFixed(1)}L</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600">₹{((totalDisbursed - totalRepaid) / 100000).toFixed(1)}L</p>
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Loans</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Loans</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-3">
              {loans.filter(l => l.status === "active").map(loan => (
                <LoanCard key={loan.id} loan={loan} onDownloadSchedule={() => generateEMISchedule(loan)} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3">
              {loans.filter(l => l.status === "completed").map(loan => (
                <LoanCard key={loan.id} loan={loan} onDownloadSchedule={() => generateEMISchedule(loan)} />
              ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-3">
              {loans.map(loan => (
                <LoanCard key={loan.id} loan={loan} onDownloadSchedule={() => generateEMISchedule(loan)} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function LoanCard({ loan, onDownloadSchedule }: { loan: LAPLoan; onDownloadSchedule: () => void }) {
  const repaymentPercentage = (loan.amountRepaid / loan.loanAmount) * 100;

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={
              loan.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
              loan.status === "completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
              "bg-red-50 text-red-700 border-red-200"
            }>
              {loan.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {loan.lapId}
            </Badge>
          </div>
          <p className="font-semibold text-gray-800">{loan.customerName}</p>
          <p className="text-sm text-gray-600">Policy: {loan.policyId}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">₹{loan.loanAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-gray-500">Loan Amount</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 text-sm">
        <div>
          <p className="text-gray-600">Monthly EMI</p>
          <p className="font-semibold">₹{loan.monthlyEMI.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
        </div>
        <div>
          <p className="text-gray-600">Interest Rate</p>
          <p className="font-semibold">{loan.interestRate}% p.a.</p>
        </div>
        <div>
          <p className="text-gray-600">Repaid</p>
          <p className="font-semibold">₹{loan.amountRepaid.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
        </div>
        <div>
          <p className="text-gray-600">Outstanding</p>
          <p className="font-semibold">₹{loan.remainingAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Repayment Progress</span>
          <span>{repaymentPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all" 
            style={{ width: `${repaymentPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">
          View Details
        </Button>
        <Button size="sm" variant="outline" onClick={onDownloadSchedule}>
          <Download className="w-4 h-4 mr-1" />
          EMI Schedule
        </Button>
      </div>
    </div>
  );
}
