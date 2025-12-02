"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, TrendingUp } from "lucide-react";

export function AgentToolsComponent() {
  const [agentId, setAgentId] = useState("agent_001");
  const [leads, setLeads] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("lead");
  const [formData, setFormData] = useState<any>({});

  const fetchLeadsAndTasks = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, tasksRes] = await Promise.all([
        fetch(`/api/agent-tools?tool=leads&agentId=${agentId}`),
        fetch(`/api/agent-tools?tool=tasks&agentId=${agentId}`),
      ]);

      const leadsData = await leadsRes.json();
      const tasksData = await tasksRes.json();

      if (leadsData.success) setLeads(leadsData.leads);
      if (tasksData.success) setTasks(tasksData.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsAndTasks();
  }, [agentId]);

  const handleCreateLead = async () => {
    try {
      const response = await fetch("/api/agent-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_lead",
          agentId,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchLeadsAndTasks();
        setIsDialogOpen(false);
        setFormData({});
      }
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await fetch("/api/agent-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_task",
          agentId,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchLeadsAndTasks();
        setIsDialogOpen(false);
        setFormData({});
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const openDialog = (type: string) => {
    setDialogType(type);
    setFormData({});
    setIsDialogOpen(true);
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      prospect: "bg-gray-100 text-gray-800",
      contacted: "bg-blue-100 text-blue-800",
      qualified: "bg-purple-100 text-purple-800",
      proposal: "bg-orange-100 text-orange-800",
      negotiation: "bg-yellow-100 text-yellow-800",
      closed: "bg-green-100 text-green-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Agent Tools & Productivity</h2>
        <p className="text-gray-500">Manage leads, tasks, quotes, and proposals</p>
      </div>

      <div>
        <Label>Select Agent</Label>
        <Input
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="agent_001"
        />
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leads">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="tasks">Task Management</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sales Pipeline (Kanban)</h3>
            <Dialog open={isDialogOpen && dialogType === "lead"} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog("lead")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Customer Name</Label>
                    <Input
                      value={formData.customerName || ""}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                    />
                  </div>
                  <div>
                    <Label>Expected Value</Label>
                    <Input
                      type="number"
                      value={formData.value || ""}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="100000"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLead}>Create Lead</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {["prospect", "contacted", "qualified", "proposal", "negotiation", "closed"].map((stage) => (
              <Card key={stage}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm capitalize">{stage}</CardTitle>
                  <CardDescription>
                    {leads.filter((l) => l.stage === stage).length} leads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leads
                      .filter((l) => l.stage === stage)
                      .map((lead) => (
                        <div key={lead._id} className="p-2 bg-gray-50 rounded text-xs">
                          <p className="font-medium truncate">{lead.customerName}</p>
                          <p className="text-gray-600">₹{lead.value?.toLocaleString()}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total Leads:</span>
                <span className="font-semibold">{leads.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Value:</span>
                <span className="font-semibold">
                  ₹{leads.reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Lead Value:</span>
                <span className="font-semibold">
                  ₹{leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.value || 0), 0) / leads.length).toLocaleString() : 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Task Management</h3>
            <Dialog open={isDialogOpen && dialogType === "task"} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog("task")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Task title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Task description"
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.dueDate || ""}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={formData.priority || "medium"} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">To Do</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "todo").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "in_progress").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "completed").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "completed").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4">Title</th>
                      <th className="text-left py-2 px-4">Priority</th>
                      <th className="text-left py-2 px-4">Due Date</th>
                      <th className="text-left py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{task.title}</td>
                        <td className="py-3 px-4">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{task.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
