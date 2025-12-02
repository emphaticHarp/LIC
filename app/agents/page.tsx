"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAgents, createAgent, updateAgent, deleteAgent, calculateSalary, sendMessage, assignTask, setGoal, setSelectedAgent } from '@/store/slices/agentSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";

function AgentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { agents, selectedAgent, isLoading, error, analytics } = useSelector((state: RootState) => state.agents);
  
  const [email, setEmail] = useState("");
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Agent Joined", message: "3 new agents joined this month", read: false, time: "2 hours ago" },
    { id: 2, title: "Salary Processed", message: "Monthly salary processed for all agents", read: false, time: "1 day ago" },
    { id: 3, title: "Target Achievement", message: "12 agents achieved monthly target", read: true, time: "3 days ago" }
  ]);

  // Form states
  const [agentFormData, setAgentFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    aadhaar: "",
    pan: "",
    role: "Agent" as const,
    branch: "",
    department: "",
    basic: "25000",
    hra: "7500",
    da: "5000",
  });

  const [messageFormData, setMessageFormData] = useState({
    message: "",
    attachments: [] as Array<{ name: string; type: 'image' | 'video' | 'document' | 'link'; url: string }>
  });

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    priority: "Medium" as const,
    dueDate: "",
  });

  const [goalFormData, setGoalFormData] = useState({
    title: "",
    description: "",
    target: "",
    unit: "policies",
    deadline: "",
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      setEmail("user@example.com");
    }
    
    // Fetch agents data
    dispatch(fetchAgents({}));
  }, [dispatch, searchParams]);

  // Show loading state while email is being set
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/468d72b6-4073-4ce2-b957-f33f46e8eb67/uVKp5LGC97.lottie"
              loop
              autoplay
            />
          </div>
          <p className="text-gray-600">Loading agent data...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    router.push("/");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleClearAll = async () => {
    setIsClearingNotifications(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setNotifications([]);
    setIsClearingNotifications(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCreateAgent = async () => {
    setIsCreatingAgent(true);
    try {
      // First, save agent credentials to MongoDB via API
      const mongoResponse = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: agentFormData.email,
          password: agentFormData.password,
          name: agentFormData.name,
          role: agentFormData.role.toLowerCase(),
          isActive: true,
        }),
      });

      if (!mongoResponse.ok) {
        const error = await mongoResponse.json();
        alert(error.error || "Failed to save agent credentials");
        setIsCreatingAgent(false);
        return;
      }

      const agentData = {
        ...agentFormData,
        joiningDate: new Date().toISOString(),
        status: 'Active' as const,
        performance: {
          policiesSold: 0,
          totalPremium: 0,
          commissionEarned: 0,
          targetAchievement: 0,
          rank: 'New Agent',
        },
        salary: {
          basic: parseFloat(agentFormData.basic),
          hra: parseFloat(agentFormData.hra),
          da: parseFloat(agentFormData.da),
          incentives: 0,
          deductions: {
            tds: 0,
            pf: 0,
            professionalTax: 0,
            other: 0,
          },
          netSalary: parseFloat(agentFormData.basic) + parseFloat(agentFormData.hra) + parseFloat(agentFormData.da),
        },
        attendance: {
          present: 0,
          absent: 0,
          leave: 0,
          late: 0,
        },
        tasks: [],
        goals: [],
        communication: [],
      };
      
      await dispatch(createAgent(agentData)).unwrap();
      alert("Agent created successfully with credentials saved!");
      setShowCreateDialog(false);
      setAgentFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        aadhaar: "",
        pan: "",
        role: "Agent",
        branch: "",
        department: "",
        basic: "25000",
        hra: "7500",
        da: "5000",
      });
    } catch (error) {
      console.error("Failed to create agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedAgent) return;
    
    setIsSendingMessage(true);
    try {
      await dispatch(sendMessage({
        agentId: selectedAgent.id,
        message: messageFormData.message,
        attachments: messageFormData.attachments,
      })).unwrap();
      
      setShowMessageDialog(false);
      setMessageFormData({ message: "", attachments: [] });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleAssignTask = async () => {
    if (!selectedAgent) return;
    
    setIsAssigningTask(true);
    try {
      await dispatch(assignTask({
        agentId: selectedAgent.id,
        task: {
          ...taskFormData,
          assignedBy: "Admin",
          status: "Pending" as const,
        },
      })).unwrap();
      
      setShowTaskDialog(false);
      setTaskFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });
    } catch (error) {
      console.error("Failed to assign task:", error);
    } finally {
      setIsAssigningTask(false);
    }
  };

  const handleSetGoal = async () => {
    if (!selectedAgent) return;
    
    setIsSettingGoal(true);
    try {
      await dispatch(setGoal({
        agentId: selectedAgent.id,
        goal: {
          ...goalFormData,
          target: parseFloat(goalFormData.target),
          current: 0,
          status: "On Track" as const,
        },
      })).unwrap();
      
      setShowGoalDialog(false);
      setGoalFormData({
        title: "",
        description: "",
        target: "",
        unit: "policies",
        deadline: "",
      });
    } catch (error) {
      console.error("Failed to set goal:", error);
    } finally {
      setIsSettingGoal(false);
    }
  };

  const handleCalculateSalary = async (agentId: string) => {
    try {
      await dispatch(calculateSalary({
        id: agentId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })).unwrap();
      alert("Salary calculated successfully!");
    } catch (error) {
      console.error("Failed to calculate salary:", error);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await dispatch(deleteAgent(agentId)).unwrap();
      alert("Agent removed successfully!");
    } catch (error) {
      console.error("Failed to delete agent:", error);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="agents"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Management</h1>
              <p className="text-gray-600">Manage agents, tasks, goals, and communication</p>
            </div>

            {/* Agent Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalAgents}</div>
                  <p className="text-xs text-gray-500 mt-1">{analytics.activeAgents} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{analytics.totalSalary.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Monthly payroll</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{analytics.averagePerformance}%</div>
                  <p className="text-xs text-gray-500 mt-1">Target achievement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{Math.round(analytics.activeAgents * 0.8)}</div>
                  <p className="text-xs text-gray-500 mt-1">Present today</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center justify-between mb-6">
              <Input
                placeholder="Search agents by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <div className="flex space-x-2">
                <Button onClick={() => setShowCreateDialog(true)}>
                  Hire New Agent
                </Button>
              </div>
            </div>

            {/* Agent Management Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="salary">Salary</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Directory</CardTitle>
                    <CardDescription>Manage all agents and their performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {filteredAgents.map((agent) => (
                          <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => dispatch(setSelectedAgent(agent))}>
                            <div className="flex items-center space-x-4">
                              <img
                                src={agent.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                                alt={agent.name}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <p className="font-medium">{agent.name}</p>
                                <p className="text-sm text-gray-500">{agent.email}</p>
                                <p className="text-xs text-gray-400">{agent.role} • {agent.branch}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{agent.performance.rank}</p>
                              <p className="text-sm text-gray-500">{agent.performance.policiesSold} policies</p>
                              <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>
                                {agent.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Task Management</CardTitle>
                        <CardDescription>Assign and track agent tasks</CardDescription>
                      </div>
                      <Button onClick={() => setShowTaskDialog(true)} disabled={!selectedAgent}>
                        Assign Task
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedAgent ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="font-medium">{selectedAgent.name}'s Tasks</p>
                          <p className="text-sm text-gray-600">{selectedAgent.tasks.length} active tasks</p>
                        </div>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-3">
                            {selectedAgent.tasks.map((task) => (
                              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  <p className="text-sm text-gray-500">{task.description}</p>
                                  <p className="text-xs text-gray-400">Due: {task.dueDate}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant={
                                    task.priority === 'Urgent' ? 'destructive' :
                                    task.priority === 'High' ? 'default' : 'secondary'
                                  }>
                                    {task.priority}
                                  </Badge>
                                  <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'} className="ml-2">
                                    {task.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Select an agent to view tasks</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Goal Setting</CardTitle>
                        <CardDescription>Set and track agent goals</CardDescription>
                      </div>
                      <Button onClick={() => setShowGoalDialog(true)} disabled={!selectedAgent}>
                        Set Goal
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedAgent ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="font-medium">{selectedAgent.name}'s Goals</p>
                          <p className="text-sm text-gray-600">{selectedAgent.goals.length} active goals</p>
                        </div>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-3">
                            {selectedAgent.goals.map((goal) => (
                              <div key={goal.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-medium">{goal.title}</p>
                                  <Badge variant={
                                    goal.status === 'Achieved' ? 'default' :
                                    goal.status === 'On Track' ? 'secondary' : 'destructive'
                                  }>
                                    {goal.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {goal.current}/{goal.target} {goal.unit}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Deadline: {goal.deadline}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Select an agent to view goals</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="salary" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Salary Management</CardTitle>
                        <CardDescription>Calculate and manage agent salaries</CardDescription>
                      </div>
                      <Button onClick={() => selectedAgent && handleCalculateSalary(selectedAgent.id)} disabled={!selectedAgent}>
                        Calculate Salary
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedAgent ? (
                      <div className="space-y-6">
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="font-medium">{selectedAgent.name}'s Salary Details</p>
                          <p className="text-sm text-gray-600">Net Salary: ₹{selectedAgent.salary.netSalary.toLocaleString()}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Earnings</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Basic Salary</span>
                                <span>₹{selectedAgent.salary.basic.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>HRA</span>
                                <span>₹{selectedAgent.salary.hra.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>DA</span>
                                <span>₹{selectedAgent.salary.da.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Incentives</span>
                                <span>₹{selectedAgent.salary.incentives.toLocaleString()}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-medium">
                                <span>Gross Salary</span>
                                <span>₹{(selectedAgent.salary.basic + selectedAgent.salary.hra + selectedAgent.salary.da + selectedAgent.salary.incentives).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Deductions</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>TDS</span>
                                <span>₹{selectedAgent.salary.deductions.tds.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>PF</span>
                                <span>₹{selectedAgent.salary.deductions.pf.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Professional Tax</span>
                                <span>₹{selectedAgent.salary.deductions.professionalTax.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Other</span>
                                <span>₹{selectedAgent.salary.deductions.other.toLocaleString()}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-medium">
                                <span>Total Deductions</span>
                                <span>₹{Object.values(selectedAgent.salary.deductions).reduce((a, b) => a + b, 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Net Salary</span>
                            <span className="text-xl font-bold text-green-600">₹{selectedAgent.salary.netSalary.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Select an agent to view salary details</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communication" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Agent Communication</CardTitle>
                        <CardDescription>Chat and share files with agents</CardDescription>
                      </div>
                      <Button onClick={() => setShowMessageDialog(true)} disabled={!selectedAgent}>
                        Send Message
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedAgent ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="font-medium">Chat with {selectedAgent.name}</p>
                          <p className="text-sm text-gray-600">{selectedAgent.communication.length} messages</p>
                        </div>
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-3">
                            {selectedAgent.communication.map((msg) => (
                              <div key={msg.id} className={`flex ${msg.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs p-3 rounded-lg ${
                                  msg.sender === 'Admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}>
                                  <p className="text-sm font-medium">{msg.subject}</p>
                                  <p className="text-sm">{msg.content}</p>
                                  {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {msg.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                          {attachment.type === 'image' && <span>📷</span>}
                                          {attachment.type === 'video' && <span>🎥</span>}
                                          {attachment.type === 'document' && <span>📄</span>}
                                          {attachment.type === 'link' && <span>🔗</span>}
                                          <a href={attachment.url} className="text-xs underline">{attachment.name}</a>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <p className="text-xs mt-1 opacity-70">
                                    {new Date(msg.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">Select an agent to start chatting</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Agent Details Sidebar */}
        {selectedAgent && (
          <div className="w-80 bg-white shadow-lg h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedAgent.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt={selectedAgent.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedAgent.name}</h3>
                  <p className="text-sm text-gray-500">{selectedAgent.role}</p>
                  <Badge variant={selectedAgent.status === 'Active' ? 'default' : 'secondary'}>
                    {selectedAgent.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-500">Contact</Label>
                  <p className="text-sm">{selectedAgent.email}</p>
                  <p className="text-sm">{selectedAgent.phone}</p>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Branch</Label>
                  <p className="text-sm">{selectedAgent.branch}</p>
                </div>
                
                <div>
                  <Label className="text-sm text-gray-500">Performance</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold">{selectedAgent.performance.policiesSold}</p>
                      <p className="text-xs text-gray-500">Policies</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold">{selectedAgent.performance.targetAchievement}%</p>
                      <p className="text-xs text-gray-500">Target</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => setShowMessageDialog(true)}>
                    Send Message
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setShowTaskDialog(true)}>
                    Assign Task
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setShowGoalDialog(true)}>
                    Set Goal
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => handleCalculateSalary(selectedAgent.id)}>
                    Calculate Salary
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" variant="destructive">
                        Fire Agent
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently remove {selectedAgent.name} from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteAgent(selectedAgent.id)}>
                          Fire Agent
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shared Profile Sidebar */}
      <ProfileSidebar
        email={email}
        show={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
      />

      {/* Create Agent Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hire New Agent</DialogTitle>
            <DialogDescription>
              Add a new agent to the team
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={agentFormData.name}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={agentFormData.email}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={agentFormData.password}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={agentFormData.phone}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={agentFormData.dateOfBirth}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                <Input
                  id="aadhaar"
                  value={agentFormData.aadhaar}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, aadhaar: e.target.value }))}
                  placeholder="Enter Aadhaar number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number *</Label>
                <Input
                  id="pan"
                  value={agentFormData.pan}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, pan: e.target.value }))}
                  placeholder="Enter PAN number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={agentFormData.role} onValueChange={(value: any) => setAgentFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Branch Head">Branch Head</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select value={agentFormData.branch} onValueChange={(value) => setAgentFormData(prev => ({ ...prev, branch: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bangalore Main">Bangalore Main</SelectItem>
                    <SelectItem value="Delhi Central">Delhi Central</SelectItem>
                    <SelectItem value="Mumbai Main">Mumbai Main</SelectItem>
                    <SelectItem value="Kolkata Central">Kolkata Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={agentFormData.department} onValueChange={(value) => setAgentFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="basic">Basic Salary *</Label>
                <Input
                  id="basic"
                  type="number"
                  value={agentFormData.basic}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, basic: e.target.value }))}
                  placeholder="Enter basic salary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hra">HRA *</Label>
                <Input
                  id="hra"
                  type="number"
                  value={agentFormData.hra}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, hra: e.target.value }))}
                  placeholder="Enter HRA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="da">DA *</Label>
                <Input
                  id="da"
                  type="number"
                  value={agentFormData.da}
                  onChange={(e) => setAgentFormData(prev => ({ ...prev, da: e.target.value }))}
                  placeholder="Enter DA"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={agentFormData.address}
                onChange={(e) => setAgentFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent} disabled={isCreatingAgent}>
              {isCreatingAgent ? "Hiring..." : "Hire Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={messageFormData.message}
                onChange={(e) => setMessageFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your message here..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  📷 Image
                </Button>
                <Button variant="outline" size="sm">
                  🎥 Video
                </Button>
                <Button variant="outline" size="sm">
                  📄 Document
                </Button>
                <Button variant="outline" size="sm">
                  🔗 Link
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={isSendingMessage}>
              {isSendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>
              Assign a new task to {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title *</Label>
              <Input
                id="taskTitle"
                value={taskFormData.title}
                onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Description *</Label>
              <Textarea
                id="taskDescription"
                value={taskFormData.description}
                onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={taskFormData.priority} onValueChange={(value: any) => setTaskFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) => setTaskFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTask} disabled={isAssigningTask}>
              {isAssigningTask ? "Assigning..." : "Assign Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Goal Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Goal</DialogTitle>
            <DialogDescription>
              Set a new goal for {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalTitle">Goal Title *</Label>
              <Input
                id="goalTitle"
                value={goalFormData.title}
                onChange={(e) => setGoalFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter goal title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goalDescription">Description *</Label>
              <Textarea
                id="goalDescription"
                value={goalFormData.description}
                onChange={(e) => setGoalFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter goal description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target *</Label>
                <Input
                  id="target"
                  type="number"
                  value={goalFormData.target}
                  onChange={(e) => setGoalFormData(prev => ({ ...prev, target: e.target.value }))}
                  placeholder="Enter target"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select value={goalFormData.unit} onValueChange={(value) => setGoalFormData(prev => ({ ...prev, unit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="policies">Policies</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="calls">Calls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={goalFormData.deadline}
                  onChange={(e) => setGoalFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetGoal} disabled={isSettingGoal}>
              {isSettingGoal ? "Setting..." : "Set Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-4">
            <DotLottieReact
              src="https://lottie.host/468d72b6-4073-4ce2-b957-f33f46e8eb67/uVKp5LGC97.lottie"
              loop
              autoplay
            />
          </div>
          <p className="text-gray-600">Loading agents...</p>
        </div>
      </div>
    }>
      <AgentsPageContent />
    </Suspense>
  );
}
