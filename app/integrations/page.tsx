"use client"

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";

function IntegrationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Integration Connected", message: "Banking API successfully connected", read: false, time: "1 hour ago" },
    { id: 2, title: "Webhook Updated", message: "Payment gateway webhook configured", read: false, time: "3 hours ago" },
    { id: 3, title: "API Key Generated", message: "New API key for third-party integration", read: true, time: "1 day ago" },
    { id: 4, title: "Sync Completed", message: "Customer data synchronization completed", read: true, time: "2 days ago" }
  ]);

  // Integration states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Integration configurations
  const [bankingConfig, setBankingConfig] = useState({
    apiKey: "",
    secretKey: "",
    environment: "sandbox",
    webhookUrl: "",
    autoSync: false,
    syncFrequency: "daily"
  });

  const [paymentConfig, setPaymentConfig] = useState({
    merchantId: "",
    apiKey: "",
    secretKey: "",
    webhookUrl: "",
    autoSettlement: false,
    settlementFrequency: "daily"
  });

  const [smsConfig, setSmsConfig] = useState({
    provider: "twilio",
    apiKey: "",
    secretKey: "",
    senderId: "",
    templateEnabled: true
  });

  const [emailConfig, setEmailConfig] = useState({
    provider: "sendgrid",
    apiKey: "",
    fromEmail: "",
    fromName: "",
    templateEnabled: true
  });

  const [aadhaarConfig, setAadhaarConfig] = useState({
    apiKey: "",
    secretKey: "",
    environment: "sandbox",
    otpEnabled: true
  });

  const [panConfig, setPanConfig] = useState({
    apiKey: "",
    secretKey: "",
    environment: "sandbox",
    verificationMode: "auto"
  });

  // Available integrations
  const integrations = [
    {
      id: "banking",
      name: "Banking API",
      category: "financial",
      description: "Connect with banking services for automated payments and account verification",
      icon: "🏦",
      status: "connected",
      features: ["Account Verification", "Fund Transfer", "Balance Check", "Transaction History"],
      lastSync: "2 hours ago"
    },
    {
      id: "payment",
      name: "Payment Gateway",
      category: "financial",
      description: "Process online payments through multiple payment methods",
      icon: "💳",
      status: "connected",
      features: ["Credit/Debit Cards", "Net Banking", "UPI", "Wallets"],
      lastSync: "5 minutes ago"
    },
    {
      id: "sms",
      name: "SMS Gateway",
      category: "communication",
      description: "Send SMS notifications and alerts to customers",
      icon: "📱",
      status: "connected",
      features: ["OTP Verification", "Payment Reminders", "Policy Alerts", "Marketing"],
      lastSync: "1 hour ago"
    },
    {
      id: "email",
      name: "Email Service",
      category: "communication",
      description: "Send transactional emails and newsletters",
      icon: "📧",
      status: "connected",
      features: ["Transactional Emails", "Newsletters", "Policy Documents", "Statements"],
      lastSync: "30 minutes ago"
    },
    {
      id: "aadhaar",
      name: "Aadhaar Verification",
      category: "verification",
      description: "Verify customer Aadhaar details digitally",
      icon: "🆔",
      status: "disconnected",
      features: ["Aadhaar Verification", "Biometric Auth", "OTP Verification", "e-KYC"],
      lastSync: "Never"
    },
    {
      id: "pan",
      name: "PAN Verification",
      category: "verification",
      description: "Verify PAN card details for customer onboarding",
      icon: "📄",
      status: "disconnected",
      features: ["PAN Verification", "Name Match", "DOB Verification", "Status Check"],
      lastSync: "Never"
    },
    {
      id: "digital-signature",
      name: "Digital Signature",
      category: "document",
      description: "Sign documents digitally with legal validity",
      icon: "✍️",
      status: "connected",
      features: ["Document Signing", "Certificate Generation", "Audit Trail", "Legal Validity"],
      lastSync: "4 hours ago"
    },
    {
      id: "analytics",
      name: "Analytics Platform",
      category: "analytics",
      description: "Advanced analytics and business intelligence",
      icon: "📊",
      status: "connected",
      features: ["Custom Reports", "Real-time Analytics", "Data Visualization", "ML Insights"],
      lastSync: "15 minutes ago"
    }
  ];

  const integrationCategories = [
    { id: "all", name: "All Integrations", count: 8 },
    { id: "financial", name: "Financial Services", count: 2 },
    { id: "communication", name: "Communication", count: 2 },
    { id: "verification", name: "Verification", count: 2 },
    { id: "document", name: "Document Management", count: 1 },
    { id: "analytics", name: "Analytics", count: 1 }
  ];

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Clear user from localStorage
      localStorage.removeItem('user');
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
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

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTestConnection = async (integrationId: string) => {
    setIsTesting(true);
    
    try {
      // Simulate testing connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${integrationId} connection test successful!`);
    } catch (error) {
      alert(`${integrationId} connection test failed. Please check your configuration.`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfiguration = async (integrationId: string) => {
    setIsConfiguring(true);
    
    try {
      // Simulate saving configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`${integrationId} configuration saved successfully!`);
      setActiveDialog(null);
    } catch (error) {
      alert("Failed to save configuration. Please try again.");
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (confirm(`Are you sure you want to disconnect ${integrationId}?`)) {
      alert(`${integrationId} disconnected successfully!`);
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || integration.status === statusFilter;
    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIntegrations = filteredIntegrations.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800";
      case "disconnected": return "bg-gray-100 text-gray-800";
      case "error": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderConfigurationDialog = (integrationId: string) => {
    switch (integrationId) {
      case "banking":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankingApiKey">API Key</Label>
                <Input
                  id="bankingApiKey"
                  value={bankingConfig.apiKey}
                  onChange={(e) => setBankingConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankingSecretKey">Secret Key</Label>
                <Input
                  id="bankingSecretKey"
                  type="password"
                  value={bankingConfig.secretKey}
                  onChange={(e) => setBankingConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="Enter secret key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankingEnvironment">Environment</Label>
                <Select value={bankingConfig.environment} onValueChange={(value) => setBankingConfig(prev => ({ ...prev, environment: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankingWebhookUrl">Webhook URL</Label>
                <Input
                  id="bankingWebhookUrl"
                  value={bankingConfig.webhookUrl}
                  onChange={(e) => setBankingConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://your-domain.com/webhook/banking"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="bankingAutoSync"
                  checked={bankingConfig.autoSync}
                  onCheckedChange={(checked) => setBankingConfig(prev => ({ ...prev, autoSync: checked }))}
                />
                <Label htmlFor="bankingAutoSync">Enable Auto Sync</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankingSyncFrequency">Sync Frequency</Label>
                <Select value={bankingConfig.syncFrequency} onValueChange={(value) => setBankingConfig(prev => ({ ...prev, syncFrequency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case "payment":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMerchantId">Merchant ID</Label>
                <Input
                  id="paymentMerchantId"
                  value={paymentConfig.merchantId}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, merchantId: e.target.value }))}
                  placeholder="Enter merchant ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentApiKey">API Key</Label>
                <Input
                  id="paymentApiKey"
                  value={paymentConfig.apiKey}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentSecretKey">Secret Key</Label>
                <Input
                  id="paymentSecretKey"
                  type="password"
                  value={paymentConfig.secretKey}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="Enter secret key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentWebhookUrl">Webhook URL</Label>
                <Input
                  id="paymentWebhookUrl"
                  value={paymentConfig.webhookUrl}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://your-domain.com/webhook/payment"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="paymentAutoSettlement"
                  checked={paymentConfig.autoSettlement}
                  onCheckedChange={(checked) => setPaymentConfig(prev => ({ ...prev, autoSettlement: checked }))}
                />
                <Label htmlFor="paymentAutoSettlement">Enable Auto Settlement</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentSettlementFrequency">Settlement Frequency</Label>
                <Select value={paymentConfig.settlementFrequency} onValueChange={(value) => setPaymentConfig(prev => ({ ...prev, settlementFrequency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Configuration options for {integrationId}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="integrations"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Integrations Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
              <p className="text-gray-600">Connect and manage third-party services for enhanced functionality</p>
            </div>

            {/* Integration Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {integrationCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-1"
                  />
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="disconnected">Disconnected</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {paginatedIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{integration.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription className="text-sm">{integration.category}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last sync: {integration.lastSync}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Dialog open={activeDialog === integration.id} onOpenChange={(open) => setActiveDialog(open ? integration.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                              Configure
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Configure {integration.name}</DialogTitle>
                              <DialogDescription>
                                Set up the integration parameters and connection settings.
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[400px]">
                              {renderConfigurationDialog(integration.id)}
                            </ScrollArea>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setActiveDialog(null)}>
                                Cancel
                              </Button>
                              <Button onClick={() => handleSaveConfiguration(integration.id)} disabled={isConfiguring}>
                                {isConfiguring ? "Saving..." : "Save Configuration"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleTestConnection(integration.name)}
                          disabled={integration.status === "disconnected" || isTesting}
                        >
                          {isTesting ? "Testing..." : "Test"}
                        </Button>
                        
                        {integration.status === "connected" && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDisconnect(integration.name)}
                          >
                            Disconnect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredIntegrations.length)} of {filteredIntegrations.length} integrations
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Keys Management */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>API Keys Management</CardTitle>
                <CardDescription>Manage API keys for external integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Production API Key</h4>
                      <p className="text-sm text-gray-600">Used for production environment</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Active</Badge>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Sandbox API Key</h4>
                      <p className="text-sm text-gray-600">Used for testing and development</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Active</Badge>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Generate New API Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>Configure webhooks for real-time data synchronization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://your-domain.com/webhook"
                      defaultValue="https://lic-portal.com/webhook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">Webhook Secret</Label>
                    <Input
                      id="webhookSecret"
                      type="password"
                      placeholder="Enter webhook secret"
                      defaultValue="webhook_secret_123456"
                    />
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium text-sm">Payment Events</h4>
                      <p className="text-xs text-gray-600">Receive payment success/failure events</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium text-sm">Customer Updates</h4>
                      <p className="text-xs text-gray-600">Get notified about customer changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium text-sm">Policy Events</h4>
                      <p className="text-xs text-gray-600">Policy creation and renewal events</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Button className="mt-4">Save Webhook Configuration</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Sidebar */}
        {showProfileSidebar && (
          <div className="w-80 bg-white shadow-lg h-full">
            <ProfileSidebar
              email={email}
              show={showProfileSidebar}
              onClose={() => setShowProfileSidebar(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading integrations...</p>
        </div>
      </div>
    }>
      <IntegrationsPageContent />
    </Suspense>
  );
}
