"use client"

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { BreadcrumbNav } from "@/components/features/breadcrumb-nav";
import { DashboardSkeleton } from "@/components/features/dashboard-skeleton";
import { FormSkeleton } from "@/components/ui/skeleton";

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Settings Updated", message: "Your preferences have been saved", read: false, time: "1 hour ago" },
    { id: 2, title: "Security Alert", message: "New device signed in to your account", read: false, time: "3 hours ago" },
    { id: 3, title: "Backup Completed", message: "System backup completed successfully", read: true, time: "1 day ago" },
    { id: 4, title: "Maintenance Scheduled", message: "System maintenance scheduled for tonight", read: true, time: "2 days ago" }
  ]);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    language: "english",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    theme: "light",
    autoSave: true,
    sessionTimeout: "30"
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    policyReminders: true,
    paymentAlerts: true,
    claimUpdates: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyStatements: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionManagement: true,
    loginAlerts: true,
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    ipWhitelist: "",
    requireStrongPassword: true
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    backupFrequency: "daily",
    dataRetention: "7",
    logLevel: "info",
    maintenanceMode: false,
    autoUpdates: true,
    debugMode: false,
    apiRateLimit: "1000",
    fileUploadLimit: "10",
    enableAuditLogs: true
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    bankingAPI: false,
    smsGateway: true,
    emailService: true,
    paymentGateway: true,
    aadhaarVerification: true,
    panVerification: true,
    digitalSignature: true
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      // Fallback for when email is not in URL params
      setEmail("user@example.com");
    }
    setIsLoading(false); // Set loading to false after email is set
  }, [searchParams]);

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
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

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

  const handleSaveSettings = async (category: string) => {
    setIsSaving(true);
    
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully!`);
    } catch (error) {
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = (category: string) => {
    if (confirm(`Are you sure you want to reset ${category} settings to default?`)) {
      alert(`${category} settings reset to default!`);
    }
  };

  const handleTestIntegration = (integration: string) => {
    alert(`Testing ${integration} integration...`);
  };

  const settingsTabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "system", label: "System", icon: "🖥️" },
    { id: "integrations", label: "Integrations", icon: "🔗" },
    { id: "performance", label: "Performance", icon: "⚡" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="settings"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Settings Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Breadcrumbs */}
            <BreadcrumbNav />
            
            {isLoading ? (
              <FormSkeleton />
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings & Configuration</h1>
                  <p className="text-gray-600">Manage your system settings and preferences</p>
                </div>

            {/* Settings Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {settingsTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>

            {/* Settings Content */}
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {activeTab === "general" && (
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure basic application preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="hindi">हिन्दी</SelectItem>
                            <SelectItem value="bengali">বাংলা</SelectItem>
                            <SelectItem value="tamil">தமிழ்</SelectItem>
                            <SelectItem value="telugu">తెలుగు</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</SelectItem>
                            <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+4:00)</SelectItem>
                            <SelectItem value="Europe/London">Europe/London (UTC+0:00)</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (UTC-5:00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={generalSettings.dateFormat} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={generalSettings.theme} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, theme: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={generalSettings.sessionTimeout}
                          onChange={(e) => setGeneralSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoSave"
                        checked={generalSettings.autoSave}
                        onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, autoSave: checked }))}
                      />
                      <Label htmlFor="autoSave">Enable auto-save</Label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => handleSaveSettings("general")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => handleResetSettings("general")}>
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Channels</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="emailNotifications"
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                          />
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="pushNotifications"
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                          />
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="smsNotifications"
                            checked={notificationSettings.smsNotifications}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                          />
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Types</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="policyReminders"
                            checked={notificationSettings.policyReminders}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, policyReminders: checked }))}
                          />
                          <Label htmlFor="policyReminders">Policy Renewal Reminders</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="paymentAlerts"
                            checked={notificationSettings.paymentAlerts}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, paymentAlerts: checked }))}
                          />
                          <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="claimUpdates"
                            checked={notificationSettings.claimUpdates}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, claimUpdates: checked }))}
                          />
                          <Label htmlFor="claimUpdates">Claim Updates</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="systemAlerts"
                            checked={notificationSettings.systemAlerts}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                          />
                          <Label htmlFor="systemAlerts">System Alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="marketingEmails"
                            checked={notificationSettings.marketingEmails}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                          />
                          <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="weeklyReports"
                            checked={notificationSettings.weeklyReports}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                          />
                          <Label htmlFor="weeklyReports">Weekly Reports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="monthlyStatements"
                            checked={notificationSettings.monthlyStatements}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, monthlyStatements: checked }))}
                          />
                          <Label htmlFor="monthlyStatements">Monthly Statements</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => handleSaveSettings("notifications")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => handleResetSettings("notifications")}>
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure security and authentication options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Authentication</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="twoFactorAuth"
                            checked={securitySettings.twoFactorAuth}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                          />
                          <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="sessionManagement"
                            checked={securitySettings.sessionManagement}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, sessionManagement: checked }))}
                          />
                          <Label htmlFor="sessionManagement">Session Management</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="loginAlerts"
                            checked={securitySettings.loginAlerts}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))}
                          />
                          <Label htmlFor="loginAlerts">Login Alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="requireStrongPassword"
                            checked={securitySettings.requireStrongPassword}
                            onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireStrongPassword: checked }))}
                          />
                          <Label htmlFor="requireStrongPassword">Require Strong Password</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security Policies</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                          <Select value={securitySettings.passwordExpiry} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select expiry period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                              <SelectItem value="365">365 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                          <Select value={securitySettings.maxLoginAttempts} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select max attempts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 attempts</SelectItem>
                              <SelectItem value="5">5 attempts</SelectItem>
                              <SelectItem value="10">10 attempts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="ipWhitelist">IP Whitelist (comma separated)</Label>
                          <Textarea
                            id="ipWhitelist"
                            value={securitySettings.ipWhitelist}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                            placeholder="192.168.1.1, 10.0.0.1"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => handleSaveSettings("security")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => handleResetSettings("security")}>
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "system" && (
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure system-wide settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, backupFrequency: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataRetention">Data Retention (days)</Label>
                        <Select value={systemSettings.dataRetention} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dataRetention: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select retention period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">365 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logLevel">Log Level</Label>
                        <Select value={systemSettings.logLevel} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, logLevel: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select log level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debug">Debug</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                        <Input
                          id="apiRateLimit"
                          type="number"
                          value={systemSettings.apiRateLimit}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, apiRateLimit: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fileUploadLimit">File Upload Limit (MB)</Label>
                        <Input
                          id="fileUploadLimit"
                          type="number"
                          value={systemSettings.fileUploadLimit}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, fileUploadLimit: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="maintenanceMode"
                          checked={systemSettings.maintenanceMode}
                          onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                        />
                        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableAuditLogs"
                          checked={systemSettings.enableAuditLogs}
                          onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableAuditLogs: checked }))}
                        />
                        <Label htmlFor="enableAuditLogs">Enable Audit Logs</Label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => handleSaveSettings("system")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => handleResetSettings("system")}>
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "integrations" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Settings</CardTitle>
                    <CardDescription>Configure third-party service integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Financial Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Banking API</h4>
                            <p className="text-sm text-gray-600">Connect with banking services</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="bankingAPI"
                              checked={integrationSettings.bankingAPI}
                              onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, bankingAPI: checked }))}
                            />
                            <Button variant="outline" size="sm" onClick={() => handleTestIntegration("Banking API")}>
                              Test
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Payment Gateway</h4>
                            <p className="text-sm text-gray-600">Process online payments</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="paymentGateway"
                              checked={integrationSettings.paymentGateway}
                              onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, paymentGateway: checked }))}
                            />
                            <Button variant="outline" size="sm" onClick={() => handleTestIntegration("Payment Gateway")}>
                              Test
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Communication Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">SMS Gateway</h4>
                            <p className="text-sm text-gray-600">Send SMS notifications</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="smsGateway"
                              checked={integrationSettings.smsGateway}
                              onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, smsGateway: checked }))}
                            />
                            <Button variant="outline" size="sm" onClick={() => handleTestIntegration("SMS Gateway")}>
                              Test
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Email Service</h4>
                            <p className="text-sm text-gray-600">Send email notifications</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="emailService"
                              checked={integrationSettings.emailService}
                              onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, emailService: checked }))}
                            />
                            <Button variant="outline" size="sm" onClick={() => handleTestIntegration("Email Service")}>
                              Test
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Verification Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Aadhaar Verification</h4>
                            <p className="text-sm text-gray-600">Verify Aadhaar details</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="aadhaarVerification"
                              checked={integrationSettings.aadhaarVerification}
                              onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, aadhaarVerification: checked }))}
                            />
                            <Button variant="outline" size="sm" onClick={() => handleTestIntegration("Aadhaar Verification")}>
                              Test
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">PAN Verification</h4>
                            <p className="text-sm text-gray-600">Verify PAN details</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="panVerification"
                              checked={integrationSettings.panVerification}
                              onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, panVerification: checked }))}
                            />
                            <Button variant="outline" size="sm" onClick={() => handleTestIntegration("PAN Verification")}>
                              Test
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Digital Signature</h4>
                            <p className="text-sm text-gray-600">Sign documents digitally</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="digitalSignature"
                              checked={integrationSettings.digitalSignature}
                              onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, digitalSignature: checked }))}
                            />
                            <Button variant="outline" size="sm" onClick={() => handleTestIntegration("Digital Signature")}>
                              Test
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => handleSaveSettings("integrations")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => handleResetSettings("integrations")}>
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "performance" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Settings</CardTitle>
                    <CardDescription>Optimize system performance and caching</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Caching Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Enable Caching</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="space-y-2">
                            <Label>Cache Duration (minutes)</Label>
                            <Input type="number" defaultValue="30" />
                          </div>
                          <div className="space-y-2">
                            <Label>Cache Size (MB)</Label>
                            <Input type="number" defaultValue="512" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Database Optimization</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Connection Pooling</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="space-y-2">
                            <Label>Max Connections</Label>
                            <Input type="number" defaultValue="100" />
                          </div>
                          <div className="space-y-2">
                            <Label>Query Timeout (seconds)</Label>
                            <Input type="number" defaultValue="30" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Content Delivery</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Enable CDN</Label>
                            <Switch />
                          </div>
                          <div className="space-y-2">
                            <Label>Image Compression</Label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Lazy Loading</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Monitoring</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Performance Monitoring</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="space-y-2">
                            <Label>Alert Threshold (ms)</Label>
                            <Input type="number" defaultValue="1000" />
                          </div>
                          <div className="space-y-2">
                            <Label>Error Rate Threshold (%)</Label>
                            <Input type="number" defaultValue="5" step="0.1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => handleSaveSettings("performance")} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => handleResetSettings("performance")}>
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
              </>
            )}
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

export default function SettingsPage() {
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
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}
