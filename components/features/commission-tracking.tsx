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
import { Plus } from "lucide-react";

interface Commission {
  _id?: string;
  commissionId: string;
  agentId: string;
  policyId: string;
  commissionAmount: number;
  commissionRate: number;
  status: string;
  createdAt: string;
}

export function CommissionTrackingComponent() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCommission, setTotalCommission] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    agentId: "",
    policyId: "",
    policyPremium: "",
    commissionRate: "",
  });

  const fetchCommissions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/commission?${params}`);
      const data = await response.json();

      if (data.success) {
        setCommissions(data.data);
        setTotalPages(data.pagination.pages);
        setTotalCommission(data.totalCommission);
      }
    } catch (error) {
      console.error("Error fetching commissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [page, statusFilter]);

  const handleCreateCommission = async () => {
    try {
      const response = await fetch("/api/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          policyPremium: parseFloat(formData.policyPremium),
          commissionRate: parseFloat(formData.commissionRate),
          userId: "admin_001",
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchCommissions();
        setIsDialogOpen(false);
        setFormData({
          agentId: "",
          policyId: "",
          policyPremium: "",
          commissionRate: "",
        });
      }
    } catch (error) {
      console.error("Error creating commission:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      calculated: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      paid: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Commission Tracking</h2>
          <p className="text-gray-500">Monitor and manage agent commissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Commission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Commission Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Agent ID</Label>
                <Input
                  value={formData.agentId}
                  onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
                  placeholder="agent_001"
                />
              </div>
              <div>
                <Label>Policy ID</Label>
                <Input
                  value={formData.policyId}
                  onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                  placeholder="POL123456"
                />
              </div>
              <div>
                <Label>Policy Premium</Label>
                <Input
                  type="number"
                  value={formData.policyPremium}
                  onChange={(e) => setFormData({ ...formData, policyPremium: e.target.value })}
                  placeholder="100000"
                />
              </div>
              <div>
                <Label>Commission Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCommission}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCommission.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{commissions.length > 0 ? Math.round(totalCommission / commissions.length).toLocaleString() : 0}
            </div>
          </CardContent>
        </Card>
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="calculated">Calculated</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Records</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Commission ID</th>
                  <th className="text-left py-2 px-4">Agent</th>
                  <th className="text-left py-2 px-4">Amount</th>
                  <th className="text-left py-2 px-4">Rate</th>
                  <th className="text-left py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{commission.commissionId}</td>
                    <td className="py-3 px-4">{commission.agentId}</td>
                    <td className="py-3 px-4">₹{commission.commissionAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">{commission.commissionRate}%</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(commission.status)}>
                        {commission.status}
                      </Badge>
                    </td>
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
