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
import { TrendingUp, Phone, Mail, Calendar } from "lucide-react";

export function LeadManagement() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91-9876543210",
      source: "Website",
      status: "hot",
      score: 85,
      lastContact: "2024-12-05",
      nextFollowUp: "2024-12-10",
      notes: "Interested in term life insurance",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91-9876543211",
      source: "Referral",
      status: "warm",
      score: 65,
      lastContact: "2024-12-03",
      nextFollowUp: "2024-12-12",
      notes: "Looking for health insurance",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit@example.com",
      phone: "+91-9876543212",
      source: "Cold Call",
      status: "cold",
      score: 35,
      lastContact: "2024-12-01",
      nextFollowUp: "2024-12-15",
      notes: "Initial inquiry about policies",
    },
    {
      id: 4,
      name: "Sunita Reddy",
      email: "sunita@example.com",
      phone: "+91-9876543213",
      source: "Email Campaign",
      status: "converted",
      score: 100,
      lastContact: "2024-12-04",
      nextFollowUp: "2024-12-20",
      notes: "Purchased endowment plan",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "bg-red-50 text-red-700 border-red-200";
      case "warm":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "cold":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "converted":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = filterStatus === "all" || lead.status === filterStatus;
    const sourceMatch = filterSource === "all" || lead.source === filterSource;
    const searchMatch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && sourceMatch && searchMatch;
  });

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.status === "hot").length,
    warm: leads.filter((l) => l.status === "warm").length,
    cold: leads.filter((l) => l.status === "cold").length,
    converted: leads.filter((l) => l.status === "converted").length,
    avgScore: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length),
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Lead Management System
          </CardTitle>
          <CardDescription>Track and manage sales leads through the conversion funnel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Hot Leads</p>
              <p className="text-3xl font-bold text-red-600">{stats.hot}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Warm Leads</p>
              <p className="text-3xl font-bold text-orange-600">{stats.warm}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Cold Leads</p>
              <p className="text-3xl font-bold text-blue-600">{stats.cold}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-3xl font-bold text-green-600">{stats.converted}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-3xl font-bold text-purple-600">{stats.avgScore}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <Input
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={filterSource} onValueChange={setFilterSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Leads ({filteredLeads.length})</h3>
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{lead.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status.toUpperCase()}
                      </Badge>
                      <p className="text-sm font-bold mt-2">Score: {lead.score}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Source</p>
                      <p className="font-semibold">{lead.source}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Contact</p>
                      <p className="font-semibold">{lead.lastContact}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Next Follow-up</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {lead.nextFollowUp}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Notes</p>
                      <p className="font-semibold">{lead.notes}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      Email
                    </Button>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 ml-2">
              {stats.hot} hot leads ready for immediate follow-up. Focus on converting these for maximum ROI.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
