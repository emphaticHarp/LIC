"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, MapPin, Calendar, Plus, Search, Filter, Edit, Trash2, Eye, TrendingUp, AlertTriangle, Brain, Users } from "lucide-react";
import { EnhancedDataTable, DataCards, BulkActions } from "./enhanced-ui-components";
import { DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Customer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  status?: string;
  kycStatus?: string;
  createdAt?: string;
}

export function CustomerManagementComponent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  });

  // Fetch customers
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/customers?${params}`);
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm, statusFilter]);

  // Create/Update customer
  const handleSaveCustomer = async () => {
    try {
      const method = editingCustomer ? "PUT" : "POST";
      const url = editingCustomer ? `/api/customers/${editingCustomer._id}` : "/api/customers";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        fetchCustomers();
        setIsDialogOpen(false);
        setFormData({ name: "", email: "", phone: "", city: "", state: "" });
        setEditingCustomer(null);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsDialogOpen(true);
  };

  const handleNewCustomer = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", city: "", state: "" });
    setIsDialogOpen(true);
  };

  // Add AI customer insights
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch AI insights for customers
    const fetchAIInsights = async () => {
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'churn', data: { sampleCustomers: customers.length } })
        });
        const data = await response.json();
        if (data.success) {
          setAiInsights([data.prediction]);
        }
      } catch (error) {
        console.error('Error fetching AI insights:', error);
      }
    };
    
    if (customers.length > 0) {
      fetchAIInsights();
    }
  }, [customers]);

  // Customer data cards
  const customerCards = [
    {
      id: 'total-customers',
      title: 'Total Customers',
      subtitle: 'All registered customers',
      value: customers.length.toString(),
      change: 8.5,
      trend: 'up' as const,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      id: 'active-customers',
      title: 'Active Customers',
      subtitle: 'Currently active policies',
      value: customers.filter(c => c.status === 'active').length.toString(),
      change: 12.3,
      trend: 'up' as const,
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      id: 'at-risk',
      title: 'At Risk',
      subtitle: 'High churn risk customers',
      value: aiInsights.length > 0 ? Math.round(customers.length * (aiInsights[0]?.riskScore || 0)).toString() : '0',
      change: -5.2,
      trend: 'down' as const,
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      id: 'ai-score',
      title: 'AI Health Score',
      subtitle: 'Overall customer health',
      value: aiInsights.length > 0 ? Math.round((1 - (aiInsights[0]?.riskScore || 0)) * 100).toString() : '85',
      change: 3.1,
      trend: 'up' as const,
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-500">Manage and track all customers with AI insights</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewCustomer} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Edit" : "Add"} Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomer}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer Data Cards */}
      <DataCards cards={customerCards} />

      {/* Enhanced Customer Table */}
      <EnhancedDataTable
        data={customers}
        columns={[
          { key: 'name', label: 'Name', filterable: true },
          { key: 'email', label: 'Email', filterable: true },
          { key: 'phone', label: 'Phone' },
          { key: 'city', label: 'City', filterable: true },
          { key: 'state', label: 'State' },
          { key: 'status', label: 'Status', filterable: true, render: (status: string) => (
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status || 'Unknown'}
            </Badge>
          )},
          { key: 'createdAt', label: 'Created', render: (date: string) => (
            date ? new Date(date).toLocaleDateString('en-IN') : 'N/A'
          )}
        ]}
        title="Customer Directory"
        description="Complete list of all customers with AI-powered insights"
        searchable={true}
        filterable={true}
        sortable={true}
        exportable={true}
        selectable={true}
      />

      {/* AI Insights Section */}
      {aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Customer Insights
            </CardTitle>
            <CardDescription>
              Machine learning predictions for customer behavior and churn risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Churn Risk Analysis</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Overall churn risk: {Math.round((aiInsights[0]?.riskScore || 0) * 100)}%
                </p>
                <p className="text-xs text-gray-500">
                  {aiInsights[0]?.recommendation}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Customer Segments</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Loyal Customers:</span>
                    <span>45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>At Risk:</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New:</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Focus on at-risk customers</li>
                  <li>• Launch retention campaign</li>
                  <li>• Improve customer service</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Total: {customers.length} customers</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Phone</th>
                  <th className="text-left py-2 px-4">City</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{customer.phone}</td>
                    <td className="py-3 px-4">{customer.city || "-"}</td>
                    <td className="py-3 px-4">
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                        {customer.status || "active"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer._id!)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>

          {/* Pagination */}
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
