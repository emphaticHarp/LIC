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
import Navbar from "@/components/layout/navbar";
import ProfileSidebar from "@/components/layout/profile-sidebar";
import { BreadcrumbNav } from "@/components/features/breadcrumb-nav";

function HelpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Support Ticket Created", message: "Your ticket #12345 has been created", read: false, time: "1 hour ago" },
    { id: 2, title: "Help Article Updated", message: "New guide available for policy creation", read: false, time: "3 hours ago" },
    { id: 3, title: "FAQ Updated", message: "Common questions about payments updated", read: true, time: "1 day ago" },
    { id: 4, title: "System Maintenance", message: "Scheduled maintenance completed", read: true, time: "2 days ago" }
  ]);

  // Help & Support states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  
  // Pagination states
  const [faqCurrentPage, setFaqCurrentPage] = useState(1);
  const [articlesCurrentPage, setArticlesCurrentPage] = useState(1);
  const [ticketsCurrentPage, setTicketsCurrentPage] = useState(1);
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const itemsPerPage = 5;

  // Ticket form data
  const [ticketData, setTicketData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    attachments: []
  });

  // FAQ data
  const faqCategories = [
    { id: "general", name: "General", icon: "📋", count: 12 },
    { id: "policies", name: "Policies", icon: "📄", count: 18 },
    { id: "claims", name: "Claims", icon: "🏥", count: 15 },
    { id: "payments", name: "Payments", icon: "💳", count: 10 },
    { id: "customers", name: "Customers", icon: "👥", count: 8 },
    { id: "technical", name: "Technical", icon: "🔧", count: 14 }
  ];

  const faqData = [
    {
      id: 1,
      category: "general",
      question: "How do I reset my password?",
      answer: "To reset your password, click on 'Forgot Password' on the login page. Enter your registered email address and follow the instructions sent to your email.",
      helpful: 45,
      views: 1234
    },
    {
      id: 2,
      category: "policies",
      question: "How do I create a new insurance policy?",
      answer: "Navigate to the Policies page and click on 'Add Policy'. Fill in all required customer information, policy details, and upload necessary documents. Review the information and submit to create the policy.",
      helpful: 38,
      views: 987
    },
    {
      id: 3,
      category: "claims",
      question: "What documents are required for claim processing?",
      answer: "Required documents include: Claim form, Policy document, Medical reports (for health claims), Police report (for accident claims), Death certificate (for life claims), and Identity proof of the claimant.",
      helpful: 52,
      views: 1456
    },
    {
      id: 4,
      category: "payments",
      question: "What payment methods are accepted?",
      answer: "We accept multiple payment methods including: Credit/Debit cards, Net banking, UPI (GPay, PhonePe, Paytm), Cash, and Cheque. Online payments are processed instantly while other methods may take 1-2 business days.",
      helpful: 41,
      views: 1102
    },
    {
      id: 5,
      category: "customers",
      question: "How do I update customer information?",
      answer: "Go to the Customers page, search for the customer, and click on the 'Edit' button. Update the required information and save changes. For sensitive changes, additional verification may be required.",
      helpful: 35,
      views: 789
    },
    {
      id: 6,
      category: "technical",
      question: "Why am I experiencing slow performance?",
      answer: "Slow performance can be due to: Poor internet connection, Browser cache issues, Too many tabs open, Outdated browser version, or High server load. Try clearing your browser cache and restarting your browser.",
      helpful: 28,
      views: 654
    }
  ];

  const helpArticles = [
    {
      id: 1,
      title: "Getting Started with LIC Portal",
      category: "Getting Started",
      description: "Complete guide for new users to understand the portal functionality",
      readTime: "5 min",
      difficulty: "Beginner",
      lastUpdated: "2024-11-15"
    },
    {
      id: 2,
      title: "Policy Creation Workflow",
      category: "Policies",
      description: "Step-by-step process for creating and managing insurance policies",
      readTime: "8 min",
      difficulty: "Intermediate",
      lastUpdated: "2024-11-20"
    },
    {
      id: 3,
      title: "Claims Processing Guide",
      category: "Claims",
      description: "Comprehensive guide for processing insurance claims efficiently",
      readTime: "12 min",
      difficulty: "Advanced",
      lastUpdated: "2024-11-18"
    },
    {
      id: 4,
      title: "Payment Collection Best Practices",
      category: "Payments",
      description: "Tips and best practices for collecting premium payments",
      readTime: "6 min",
      difficulty: "Intermediate",
      lastUpdated: "2024-11-22"
    },
    {
      id: 5,
      title: "Customer Relationship Management",
      category: "Customers",
      description: "Building and maintaining strong customer relationships",
      readTime: "10 min",
      difficulty: "Intermediate",
      lastUpdated: "2024-11-19"
    },
    {
      id: 6,
      title: "Troubleshooting Common Issues",
      category: "Technical",
      description: "Solutions for frequently encountered technical problems",
      readTime: "7 min",
      difficulty: "Beginner",
      lastUpdated: "2024-11-21"
    }
  ];

  const supportTickets = [
    {
      id: "TKT-001",
      subject: "Unable to process claim payment",
      category: "Payments",
      priority: "High",
      status: "In Progress",
      created: "2024-11-30",
      lastUpdated: "2024-12-01",
      assignedTo: "Support Team"
    },
    {
      id: "TKT-002",
      subject: "Policy document not generating",
      category: "Technical",
      priority: "Medium",
      status: "Resolved",
      created: "2024-11-28",
      lastUpdated: "2024-11-30",
      assignedTo: "Tech Support"
    },
    {
      id: "TKT-003",
      subject: "Customer data not syncing",
      category: "Customers",
      priority: "Low",
      status: "Open",
      created: "2024-11-25",
      lastUpdated: "2024-11-25",
      assignedTo: "Unassigned"
    }
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    
    try {
      // Simulate ticket creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Support ticket created successfully! Ticket ID: TKT-004");
      setIsTicketDialogOpen(false);
      setTicketData({
        subject: "",
        category: "",
        priority: "",
        description: "",
        attachments: []
      });
    } catch (error) {
      alert("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleSearchFAQ = (query: string) => {
    setSearchQuery(query);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations for FAQs
  const faqTotalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const faqStartIndex = (faqCurrentPage - 1) * itemsPerPage;
  const faqEndIndex = faqStartIndex + itemsPerPage;
  const paginatedFAQs = filteredFAQs.slice(faqStartIndex, faqEndIndex);

  // Pagination calculations for Articles
  const articlesTotalPages = Math.ceil(helpArticles.length / itemsPerPage);
  const articlesStartIndex = (articlesCurrentPage - 1) * itemsPerPage;
  const articlesEndIndex = articlesStartIndex + itemsPerPage;
  const paginatedArticles = helpArticles.slice(articlesStartIndex, articlesEndIndex);

  // Pagination calculations for Tickets
  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(ticketSearchQuery.toLowerCase());
    const matchesStatus = ticketStatusFilter === "all" || ticket.status === ticketStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const ticketsTotalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const ticketsStartIndex = (ticketsCurrentPage - 1) * itemsPerPage;
  const ticketsEndIndex = ticketsStartIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(ticketsStartIndex, ticketsEndIndex);

  const handleViewArticle = (article: any) => {
    setSelectedArticle(article);
    setIsArticleDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Shared Navbar */}
      <Navbar
        email={email}
        currentPage="help"
        showProfileSidebar={showProfileSidebar}
        setShowProfileSidebar={setShowProfileSidebar}
        notifications={notifications}
        setNotifications={setNotifications}
        isClearingNotifications={isClearingNotifications}
        setIsClearingNotifications={setIsClearingNotifications}
      />

      {/* Help & Support Content */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showProfileSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
            {/* Breadcrumbs */}
            <BreadcrumbNav />
            
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
              <p className="text-gray-600">Find answers, create support tickets, and access resources</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">FAQs</h3>
                  <p className="text-sm text-gray-600 mt-1">67 articles</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Help Articles</h3>
                  <p className="text-sm text-gray-600 mt-1">24 guides</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Support Tickets</h3>
                  <p className="text-sm text-gray-600 mt-1">3 active</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Contact Support</h3>
                  <p className="text-sm text-gray-600 mt-1">24/7 available</p>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Input
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => handleSearchFAQ(e.target.value)}
                  className="pl-10"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Quick answers to common questions</CardDescription>
                  </div>
                  <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Create Support Ticket</DialogTitle>
                        <DialogDescription>
                          Describe your issue and we'll help you resolve it.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateTicket}>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="subject">Subject *</Label>
                              <Input
                                id="subject"
                                value={ticketData.subject}
                                onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Brief description of your issue"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="category">Category *</Label>
                              <Select value={ticketData.category} onValueChange={(value) => setTicketData(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="technical">Technical Issue</SelectItem>
                                  <SelectItem value="policies">Policy Related</SelectItem>
                                  <SelectItem value="claims">Claim Issue</SelectItem>
                                  <SelectItem value="payments">Payment Problem</SelectItem>
                                  <SelectItem value="customers">Customer Data</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priority">Priority *</Label>
                            <Select value={ticketData.priority} onValueChange={(value) => setTicketData(prev => ({ ...prev, priority: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low - Non-urgent</SelectItem>
                                <SelectItem value="medium">Medium - Normal priority</SelectItem>
                                <SelectItem value="high">High - Urgent</SelectItem>
                                <SelectItem value="critical">Critical - System down</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                              id="description"
                              value={ticketData.description}
                              onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Provide detailed information about your issue"
                              rows={4}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="attachments">Attachments</Label>
                            <Input
                              id="attachments"
                              type="file"
                              multiple
                              accept="image/*,.pdf,.doc,.docx"
                            />
                            <p className="text-xs text-gray-500">Upload screenshots or documents (max 5MB each)</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsTicketDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmittingTicket}>
                            {isSubmittingTicket ? "Creating..." : "Create Ticket"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Categories
                  </Button>
                  {faqCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.icon} {category.name} ({category.count})
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  {paginatedFAQs.map((faq) => (
                    <Card key={faq.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">{faq.question}</h4>
                            <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>👍 {faq.helpful} helpful</span>
                              <span>👁️ {faq.views} views</span>
                              <span>📁 {faq.category}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm">
                              👍 Helpful
                            </Button>
                            <Button variant="outline" size="sm">
                              📤 Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Pagination */}
                {faqTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {faqStartIndex + 1} to {Math.min(faqEndIndex, filteredFAQs.length)} of {filteredFAQs.length} FAQs
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFaqCurrentPage(Math.max(1, faqCurrentPage - 1))}
                        disabled={faqCurrentPage === 1}
                      >
                        ← Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: faqTotalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={faqCurrentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFaqCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFaqCurrentPage(Math.min(faqTotalPages, faqCurrentPage + 1))}
                        disabled={faqCurrentPage === faqTotalPages}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Articles */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Help Articles & Guides</CardTitle>
                <CardDescription>Comprehensive guides for using the LIC portal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewArticle(article)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">{article.category}</Badge>
                          <span className="text-xs text-gray-500">{article.readTime}</span>
                        </div>
                        <h4 className="font-medium mb-2">{article.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={article.difficulty === "Beginner" ? "default" : article.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                            {article.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500">Updated {article.lastUpdated}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Articles Pagination */}
                {articlesTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {articlesStartIndex + 1} to {Math.min(articlesEndIndex, helpArticles.length)} of {helpArticles.length} articles
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setArticlesCurrentPage(Math.max(1, articlesCurrentPage - 1))}
                        disabled={articlesCurrentPage === 1}
                      >
                        ← Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: articlesTotalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={articlesCurrentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setArticlesCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setArticlesCurrentPage(Math.min(articlesTotalPages, articlesCurrentPage + 1))}
                        disabled={articlesCurrentPage === articlesTotalPages}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Support Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>Track the status of your support requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ticket Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="Search by ticket ID or subject..."
                    value={ticketSearchQuery}
                    onChange={(e) => {
                      setTicketSearchQuery(e.target.value);
                      setTicketsCurrentPage(1);
                    }}
                    className="flex-1"
                  />
                  <Select value={ticketStatusFilter} onValueChange={(value) => {
                    setTicketStatusFilter(value);
                    setTicketsCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Ticket ID</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Subject</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Category</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Priority</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Assigned To</th>
                        <th className="text-left p-2 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTickets.map((ticket) => (
                        <tr key={ticket.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{ticket.id}</td>
                          <td className="p-2">{ticket.subject}</td>
                          <td className="p-2">{ticket.category}</td>
                          <td className="p-2">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm">{ticket.assignedTo}</td>
                          <td className="p-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tickets Pagination */}
                {ticketsTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {ticketsStartIndex + 1} to {Math.min(ticketsEndIndex, filteredTickets.length)} of {filteredTickets.length} tickets
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTicketsCurrentPage(Math.max(1, ticketsCurrentPage - 1))}
                        disabled={ticketsCurrentPage === 1}
                      >
                        ← Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: ticketsTotalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={ticketsCurrentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTicketsCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTicketsCurrentPage(Math.min(ticketsTotalPages, ticketsCurrentPage + 1))}
                        disabled={ticketsCurrentPage === ticketsTotalPages}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                )}
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

      {/* Article Dialog */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              {selectedArticle?.category} • {selectedArticle?.readTime} read
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="prose max-w-none">
              <p>{selectedArticle?.description}</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Article Content</h4>
                <p className="text-sm text-gray-600">
                  This is where the full article content would be displayed. 
                  The article would contain detailed step-by-step instructions, 
                  screenshots, examples, and best practices for the topic.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArticleDialogOpen(false)}>
              Close
            </Button>
            <Button>
              📤 Share Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading help center...</p>
        </div>
      </div>
    }>
      <HelpPageContent />
    </Suspense>
  );
}
