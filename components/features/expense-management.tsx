"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, TrendingDown, CheckCircle2 } from "lucide-react";

export function ExpenseManagement() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: "Travel",
      description: "Client meeting - Mumbai",
      amount: 5000,
      date: "2024-12-05",
      status: "approved",
      agent: "Rajesh Kumar",
      receipt: "Yes",
    },
    {
      id: 2,
      category: "Meals",
      description: "Team lunch meeting",
      amount: 2500,
      date: "2024-12-04",
      status: "pending",
      agent: "Priya Sharma",
      receipt: "Yes",
    },
    {
      id: 3,
      category: "Office Supplies",
      description: "Stationery and forms",
      amount: 1200,
      date: "2024-12-03",
      status: "approved",
      agent: "Amit Patel",
      receipt: "Yes",
    },
    {
      id: 4,
      category: "Communication",
      description: "Mobile recharge",
      amount: 500,
      date: "2024-12-02",
      status: "rejected",
      agent: "Sunita Reddy",
      receipt: "No",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    approved: expenses
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + e.amount, 0),
    pending: expenses
      .filter((e) => e.status === "pending")
      .reduce((sum, e) => sum + e.amount, 0),
    rejected: expenses
      .filter((e) => e.status === "rejected")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const statusMatch = filterStatus === "all" || expense.status === filterStatus;
    const categoryMatch = filterCategory === "all" || expense.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Expense Management
          </CardTitle>
          <CardDescription>Track and manage agent expenses and reimbursements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-3xl font-bold text-blue-600">₹{stats.total.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">₹{stats.approved.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">₹{stats.pending.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">₹{stats.rejected.toLocaleString()}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Meals">Meals</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Expenses ({filteredExpenses.length})</h3>
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{expense.description}</p>
                      <p className="text-sm text-gray-600 mt-1">Agent: {expense.agent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{expense.amount.toLocaleString()}</p>
                      <Badge variant="outline" className={getStatusColor(expense.status)}>
                        {expense.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold">{expense.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold">{expense.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Receipt</p>
                      <p className="font-semibold">{expense.receipt}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Budget Used</p>
                      <p className="font-semibold">45%</p>
                    </div>
                  </div>

                  {expense.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <TrendingDown className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 ml-2">
              ₹{stats.pending.toLocaleString()} pending approval. Review and approve expenses to process reimbursements.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
