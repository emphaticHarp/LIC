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
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export function GrievanceManagement() {
  const [grievances, setGrievances] = useState([
    {
      id: "GRV-001",
      customerName: "Rajesh Kumar",
      email: "rajesh@example.com",
      category: "Claim Denial",
      subject: "Claim rejected without proper explanation",
      description: "My claim was rejected but no clear reason was provided",
      status: "open",
      priority: "high",
      dateRegistered: "2024-12-05",
      daysOpen: 1,
      assignedTo: "Priya Sharma",
      resolution: "",
    },
    {
      id: "GRV-002",
      customerName: "Priya Sharma",
      email: "priya@example.com",
      category: "Premium Billing",
      subject: "Incorrect premium amount charged",
      description: "I was charged ₹5000 instead of ₹3000",
      status: "in-progress",
      priority: "medium",
      dateRegistered: "2024-12-03",
      daysOpen: 3,
      assignedTo: "Amit Patel",
      resolution: "Refund being processed",
    },
    {
      id: "GRV-003",
      customerName: "Amit Patel",
      email: "amit@example.com",
      category: "Service Quality",
      subject: "Poor customer service experience",
      description: "Agent was rude and unprofessional during policy discussion",
      status: "resolved",
      priority: "low",
      dateRegistered: "2024-11-28",
      daysOpen: 7,
      assignedTo: "Sunita Reddy",
      resolution: "Agent training completed, customer satisfied",
    },
    {
      id: "GRV-004",
      customerName: "Sunita Reddy",
      email: "sunita@example.com",
      category: "Document Processing",
      subject: "Documents not received after submission",
      description: "Submitted documents 2 weeks ago but no confirmation",
      status: "open",
      priority: "high",
      dateRegistered: "2024-12-01",
      daysOpen: 5,
      assignedTo: "Rajesh Kumar",
      resolution: "",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-50 text-red-700 border-red-200";
      case "in-progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: grievances.length,
    open: grievances.filter((g) => g.status === "open").length,
    inProgress: grievances.filter((g) => g.status === "in-progress").length,
    resolved: grievances.filter((g) => g.status === "resolved").length,
    avgResolutionTime: Math.round(
      grievances.reduce((sum, g) => sum + g.daysOpen, 0) / grievances.length
    ),
  };

  const filteredGrievances = grievances.filter((grievance) => {
    const statusMatch = filterStatus === "all" || grievance.status === filterStatus;
    const priorityMatch = filterPriority === "all" || grievance.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Grievance Management System
          </CardTitle>
          <CardDescription>Track and resolve customer grievances and complaints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Grievances</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-3xl font-bold text-red-600">{stats.open}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Resolution</p>
              <p className="text-3xl font-bold text-purple-600">{stats.avgResolutionTime} days</p>
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Grievances ({filteredGrievances.length})</h3>
            <div className="space-y-3">
              {filteredGrievances.map((grievance) => (
                <div key={grievance.id} className={`p-4 ${getStatusColor(grievance.status)} rounded-lg border`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{grievance.subject}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {grievance.customerName} • {grievance.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getStatusColor(grievance.status)}>
                        {grievance.status.toUpperCase()}
                      </Badge>
                      <Badge className={`${getPriorityColor(grievance.priority)} ml-2`}>
                        {grievance.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{grievance.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">ID</p>
                      <p className="font-semibold">{grievance.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold">{grievance.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Registered</p>
                      <p className="font-semibold">{grievance.dateRegistered}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Days Open</p>
                      <p className="font-semibold">{grievance.daysOpen}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assigned To</p>
                      <p className="font-semibold">{grievance.assignedTo}</p>
                    </div>
                  </div>

                  {grievance.resolution && (
                    <div className="p-3 bg-white rounded mb-3 border">
                      <p className="text-sm font-semibold text-gray-700">Resolution:</p>
                      <p className="text-sm text-gray-600 mt-1">{grievance.resolution}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {grievance.status === "open" && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Assign
                        </Button>
                        <Button size="sm" variant="outline">
                          Escalate
                        </Button>
                      </>
                    )}
                    {grievance.status === "in-progress" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Mark Resolved
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </>
                    )}
                    {grievance.status === "resolved" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 ml-2">
              {stats.open} open grievances require immediate attention. Average resolution time: {stats.avgResolutionTime} days.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
