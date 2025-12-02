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
import { Plus } from "lucide-react";

interface Collection {
  _id?: string;
  collectionId: string;
  agentId: string;
  customerId: string;
  policyId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  collectionDate: string;
}

export function CollectionsTrackingComponent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCollected, setTotalCollected] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    agentId: "",
    customerId: "",
    policyId: "",
    amount: "",
    paymentMethod: "cash",
    remarks: "",
  });

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/collections?${params}`);
      const data = await response.json();

      if (data.success) {
        setCollections(data.data);
        setTotalPages(data.pagination.pages);
        setTotalCollected(data.totalCollected);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [page, statusFilter]);

  const handleRecordCollection = async () => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          userId: "agent_001",
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchCollections();
        setIsDialogOpen(false);
        setFormData({
          agentId: "",
          customerId: "",
          policyId: "",
          amount: "",
          paymentMethod: "cash",
          remarks: "",
        });
      }
    } catch (error) {
      console.error("Error recording collection:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Collections Tracking</h2>
          <p className="text-gray-500">Track premium collections by agents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Record Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Collection</DialogTitle>
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
                <Label>Customer ID</Label>
                <Input
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  placeholder="CUST001"
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
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="5000"
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Remarks</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Collection remarks..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRecordCollection}>Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCollected.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{collections.length > 0 ? Math.round(totalCollected / collections.length).toLocaleString() : 0}
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
            <SelectItem value="collected">Collected</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Records</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Collection ID</th>
                  <th className="text-left py-2 px-4">Agent</th>
                  <th className="text-left py-2 px-4">Amount</th>
                  <th className="text-left py-2 px-4">Method</th>
                  <th className="text-left py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection) => (
                  <tr key={collection._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{collection.collectionId}</td>
                    <td className="py-3 px-4">{collection.agentId}</td>
                    <td className="py-3 px-4">₹{collection.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{collection.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <Badge variant={collection.status === "collected" ? "default" : "secondary"}>
                        {collection.status}
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
