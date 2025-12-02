"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Eye, Trash2 } from "lucide-react";

interface Claim {
  _id?: string;
  claimId: string;
  policyId: string;
  customerId: string;
  claimAmount: number;
  claimType: string;
  status: string;
  description: string;
  submittedDate: string;
}

export function ClaimsManagementComponent() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    policyId: "",
    customerId: "",
    claimAmount: "",
    claimType: "death_claim",
    description: "",
  });

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/claims?${params}`);
      const data = await response.json();

      if (data.success) {
        setClaims(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [page, statusFilter]);

  const handleSubmitClaim = async () => {
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          claimAmount: parseFloat(formData.claimAmount),
          userId: "agent_001",
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchClaims();
        setIsDialogOpen(false);
        setFormData({
          policyId: "",
          customerId: "",
          claimAmount: "",
          claimType: "death_claim",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: "bg-blue-100 text-blue-800",
      under_review: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      paid: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Claims Management</h2>
          <p className="text-gray-500">Register and track insurance claims</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Register Claim
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Claim</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Policy ID</Label>
                <Input
                  value={formData.policyId}
                  onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                  placeholder="POL123456"
                />
              </div>
              <div>
                <Label>Customer ID</Label>
                <Input
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  placeholder="CUST001"
                />
              </div>
              <div>
                <Label>Claim Amount</Label>
                <Input
                  type="number"
                  value={formData.claimAmount}
                  onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}
                  placeholder="100000"
                />
              </div>
              <div>
                <Label>Claim Type</Label>
                <Select value={formData.claimType} onValueChange={(value) => setFormData({ ...formData, claimType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="death_claim">Death Claim</SelectItem>
                    <SelectItem value="maturity_claim">Maturity Claim</SelectItem>
                    <SelectItem value="disability_claim">Disability Claim</SelectItem>
                    <SelectItem value="medical_claim">Medical Claim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Claim details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitClaim}>Submit Claim</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Label>Filter by Status</Label>
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
          <CardDescription>Total: {claims.length} claims</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Claim ID</th>
                  <th className="text-left py-2 px-4">Amount</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{claim.claimId}</td>
                    <td className="py-3 px-4">₹{claim.claimAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">{claim.claimType}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{new Date(claim.submittedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
