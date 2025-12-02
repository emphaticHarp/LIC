"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function LoansBankingSection() {
  const [activeTab, setActiveTab] = useState("loans");
  const [loanType, setLoanType] = useState("personal");
  const [loanAmount, setLoanAmount] = useState("100000");
  const [loanTenure, setLoanTenure] = useState("12");
  const [interestRate, setInterestRate] = useState("10");
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [showBankingServices, setShowBankingServices] = useState(false);
  const [selectedBank, setSelectedBank] = useState("sbi");

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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="loans">💰 Loans</TabsTrigger>
          <TabsTrigger value="banking">🏦 Banking</TabsTrigger>
          <TabsTrigger value="applications">📋 Applications</TabsTrigger>
        </TabsList>

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

              <div className="space-y-4">
                {/* Personal Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Personal Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Full Name *</Label>
                      <Input placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-1">
                      <Label>Email *</Label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-1">
                      <Label>Phone *</Label>
                      <Input placeholder="10-digit mobile number" />
                    </div>
                    <div className="space-y-1">
                      <Label>Date of Birth *</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Loan Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Loan Amount *</Label>
                      <Input type="number" value={loanAmount} readOnly />
                    </div>
                    <div className="space-y-1">
                      <Label>Tenure (Months) *</Label>
                      <Input type="number" value={loanTenure} readOnly />
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Financial Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Annual Income *</Label>
                      <Input type="number" placeholder="Enter annual income" />
                    </div>
                    <div className="space-y-1">
                      <Label>Employment Type *</Label>
                      <Select>
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
                      <Label>Existing Loans *</Label>
                      <Input type="number" placeholder="Total existing loan amount" />
                    </div>
                    <div className="space-y-1">
                      <Label>Credit Score (Optional)</Label>
                      <Input type="number" placeholder="Your CIBIL score" min="300" max="900" />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Required Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">📄 PAN Card</span>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">📄 Aadhar Card</span>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">📄 Last 3 Months Bank Statements</span>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input type="checkbox" className="mr-3" defaultChecked />
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
                  <Textarea placeholder="Any additional details you'd like to share..." rows={3} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowLoanApplication(false)}>
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Submit Application
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
    </div>
  );
}
